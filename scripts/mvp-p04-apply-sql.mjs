// Validates supabase/seed/mvp/p04-catalog.json and writes a SQL script that
// publishes it as the registered catalog reviewer, in one transaction:
//   new records  → publish_catalog_record()
//   corrections  → publish_catalog_correction()
//   relationships → scheme_relationships rows
//
//   node scripts/mvp-p04-apply-sql.mjs <out.sql> [--dry-run]
//
// --dry-run ends with ROLLBACK (nothing persists); otherwise COMMIT.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const catalog = read('supabase/seed/mvp/p04-catalog.json')
const factKeys = new Set(read('supabase/seed/mvp/facts.json').facts.map(f => f.key))
const mappedFields = new Set(read('supabase/seed/mvp/rule-field-map.json').map(m => m.legacy_field))
const activityIds = new Set(read('supabase/seed/mvp/activities.json').map(a => a.id))

const shopActRecords = catalog.shop_act.map(s => ({
  slug: `shop-establishment-${s.state.replace(/_/g, '-')}`,
  name: `Shop and Establishment registration, ${s.state_name}`,
  opportunity_type: 'registration',
  status: 'active',
  coverage: 'state',
  locations: [s.state],
  canonical_url: s.portal,
  authority: { name: s.authority, level: 'state', official_url: s.portal },
  version: {
    title: `Shop and Establishment registration (${s.state_name})`,
    summary: `${s.rule_text}`,
    objective: `Tell the state labour department that your shop, office or business premises has started, as required under ${s.law}.`,
    legal_basis: s.law,
    eligibility: { conditions: [`Shops, offices and commercial establishments in ${s.state_name}`, s.rule_text], exclusions: [] },
    application: { route: `Apply or give intimation online on the Labour Department portal: ${s.portal}.`, fees: 'Government fee as shown on the portal; registration is free of agent charges if you file it yourself.', portal: s.portal },
    fine_print: { review_note: `Threshold from ${s.source.title}. Confirm the current form and fee on ${s.portal} before filing.` },
    benefit_summary: { summary: 'Legal registration or intimation for your premises; banks and many schemes ask for it.', headline: s.headline, types: ['registration'] },
    completeness: 0.95,
  },
  benefits: [{ benefit_type: 'registration', label: 'Shop and Establishment registration or intimation certificate' }],
  requirements: [
    { requirement_type: 'identity', name: 'Aadhaar and PAN of the owner', required: true },
    { requirement_type: 'document', name: 'Proof of premises (ownership, rent agreement or owner consent)', required: true },
  ],
  steps: [
    { step_number: 1, title: 'Count your workers', description: s.rule_text },
    { step_number: 2, title: 'File on the Labour Department portal', official_url: s.portal },
    { step_number: 3, title: 'Keep the certificate or acknowledgement at the premises' },
  ],
  windows: [{ window_type: 'rolling', label: 'File within the period required after opening.' }],
  sources: [
    { url: s.portal, kind: 'agency', title: s.authority, anchor: `${s.law}: registration and intimation service`, is_primary: true },
    s.source,
  ],
  rules: { all: [{ field: 'state', operator: 'equals', value: s.state }], unknown_handling: 'needs_information' },
}))

const records = [...catalog.new_records, ...shopActRecords]
const errors = []
const PRIMARY_KINDS = new Set(['gazette', 'guideline', 'ministry', 'agency'])
const STATUSES = new Set(['active', 'upcoming', 'paused', 'pending_renewal', 'closed'])

function checkRules(node, label) {
  if (!node || typeof node !== 'object') return errors.push(`${label}: malformed rule`)
  for (const key of ['all', 'any']) if (Array.isArray(node[key])) node[key].forEach(child => checkRules(child, label))
  if (typeof node.field === 'string') {
    if (!factKeys.has(node.field) && !mappedFields.has(node.field)) errors.push(`${label}: rule field "${node.field}" is neither a fact nor a mapped rule field`)
    if (node.field === 'activity_codes' && typeof node.value === 'string' && !activityIds.has(node.value)) errors.push(`${label}: unknown activity "${node.value}"`)
  }
}

const slugs = new Set()
for (const r of records) {
  const label = `record ${r.slug}`
  if (!/^[a-z0-9][a-z0-9-]*$/.test(r.slug)) errors.push(`${label}: bad slug`)
  if (slugs.has(r.slug)) errors.push(`${label}: duplicate`)
  slugs.add(r.slug)
  if (!STATUSES.has(r.status)) errors.push(`${label}: bad status`)
  for (const key of ['title', 'summary', 'objective']) if (!r.version?.[key]?.trim()) errors.push(`${label}: missing version.${key}`)
  for (const key of ['eligibility', 'application', 'fine_print', 'benefit_summary']) if (!r.version?.[key] || !Object.keys(r.version[key]).length) errors.push(`${label}: empty version.${key}`)
  if (!(r.version?.completeness >= 0.95)) errors.push(`${label}: completeness below 0.95`)
  for (const key of ['benefits', 'requirements', 'steps', 'windows', 'sources']) if (!r[key]?.length) errors.push(`${label}: no ${key}`)
  const primary = r.sources.filter(s => s.is_primary)
  if (primary.length !== 1) errors.push(`${label}: needs exactly one primary source`)
  for (const s of primary) {
    if (!PRIMARY_KINDS.has(s.kind)) errors.push(`${label}: primary source kind ${s.kind} not accepted`)
    if (!/^https:\/\//.test(s.url) || !s.anchor?.trim()) errors.push(`${label}: primary source needs https and an anchor`)
  }
  checkRules(r.rules, label)
}
for (const c of catalog.corrections) if (c.changes.rules) checkRules(c.changes.rules, `correction ${c.slug}`)

if (errors.length) {
  console.error(`P0.4 catalog has ${errors.length} problem(s):\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

const dryRun = process.argv.includes('--dry-run')
const out = process.argv.slice(2).find(arg => !arg.startsWith('--'))
const q = s => { const text = typeof s === 'string' ? s : JSON.stringify(s); if (text.includes('$p4$')) throw new Error('quote clash'); return `$p4$${text}$p4$` }
const reason = catalog.reason
const sql = [
  'begin;',
  "select set_config('request.jwt.claims', json_build_object('sub', (select user_id from public.catalog_reviewers where active limit 1), 'role', 'authenticated')::text, true);",
  ...records.map(r => `select public.publish_catalog_record(${q(r)}::jsonb, ${q(reason)});`),
  ...catalog.corrections.map(c => `select public.publish_catalog_correction(${q(c.slug)}, ${q(c.changes)}::jsonb, ${q(c.reason)});`),
  ...catalog.relationships.map(r => `insert into public.scheme_relationships (opportunity_a, opportunity_b, relation, note_en, source_url, quote) select a.id, b.id, ${q(r.relation)}, ${q(r.note_en)}, ${q(r.source_url)}, ${q(r.quote)} from public.opportunities a, public.opportunities b where a.slug = ${q(r.a)} and b.slug = ${q(r.b)};`),
  `select
  (select count(*) from public.opportunities where slug in (${records.map(r => q(r.slug)).join(', ')})) as new_records,
  (select count(*) from public.opportunities o join public.opportunity_versions v on v.id = o.current_version_id where o.slug in (${records.map(r => q(r.slug)).join(', ')}) and v.review_status = 'approved') as new_records_approved,
  (select count(*) from public.scheme_relationships) as relationships,
  (select string_agg(slug || '=' || status, ' ' order by slug) from public.opportunities where slug in (${catalog.corrections.map(c => q(c.slug)).join(', ')})) as corrected_statuses,
  (select count(*) from public.audit_logs where action in ('catalog_new_record', 'catalog_correction')) as audit_rows,
  (select count(*) from public.opportunities where status in ('active','upcoming','paused','pending_renewal','closed')) as public_records;`,
  dryRun ? 'rollback;' : 'commit;',
  '',
].join('\n')

if (out) {
  fs.writeFileSync(path.resolve(out), sql)
  console.log(`Wrote ${out} (${dryRun ? 'dry run' : 'COMMIT'}): ${records.length} new records, ${catalog.corrections.length} corrections, ${catalog.relationships.length} relationships.`)
} else {
  console.log(`Valid: ${records.length} new records, ${catalog.corrections.length} corrections, ${catalog.relationships.length} relationships.`)
}
