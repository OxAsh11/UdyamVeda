import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const filePath = path.join(root, 'docs', 'catalog-startup-playbook-gap-register.json')
const register = JSON.parse(fs.readFileSync(filePath, 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(`catalog playbook gap check failed: ${message}`)
}

const leads = register.leads ?? []
const resolvedDrafts = register.resolvedDrafts ?? []
const slugs = new Set()
assert(register.schemaVersion === 1, 'schema version must be 1')
assert(register.source === 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'the official Startup India Playbook must remain the discovery source')
assert(register.sourceAnchor === 'Page 11, What Do You Need? index', 'the discovery anchor must remain precise')
assert(['unresolved_leads', 'all_playbook_leads_resolved_to_review_gated_drafts'].includes(register.status), 'playbook status must reflect unresolved leads or a fully resolved review-gated register')
assert(register.publicationAllowed === false, 'playbook leads must never be publication-eligible')
assert(register.status === 'unresolved_leads' ? leads.length > 0 : leads.length === 0, 'lead count must match the playbook status')
assert(Array.isArray(resolvedDrafts), 'resolved drafts must be an array')

for (const lead of leads) {
  assert(typeof lead.slug === 'string' && lead.slug.length > 0, 'every lead needs a stable slug')
  assert(!slugs.has(lead.slug), `duplicate lead slug: ${lead.slug}`)
  slugs.add(lead.slug)
  assert(typeof lead.name === 'string' && lead.name.length > 0, `lead ${lead.slug} needs a name`)
  assert(typeof lead.playbookLabel === 'string' && lead.playbookLabel.length > 0, `lead ${lead.slug} needs its playbook label`)
  assert(lead.primaryOfficialSourceStatus === 'not_located', `lead ${lead.slug} must not claim a primary source`) 
  assert(typeof lead.nextAction === 'string' && lead.nextAction.length > 0, `lead ${lead.slug} needs a next action`)
  assert(!('eligibility' in lead) && !('benefit' in lead) && !('amount' in lead), `lead ${lead.slug} must not contain unverified entitlement details`)
}

for (const draft of resolvedDrafts) {
  assert(typeof draft.resolvedSlug === 'string' && draft.resolvedSlug.length > 0, 'every resolved draft needs a stable opportunity slug')
  assert(/^https:\/\//i.test(draft.primarySource ?? ''), `resolved draft ${draft.resolvedSlug} needs an HTTPS primary source`)
  assert(draft.recordStatus === 'in_review', `resolved draft ${draft.resolvedSlug} must remain in_review`)
  assert(draft.reviewStatus === 'pending_human_approval', `resolved draft ${draft.resolvedSlug} must remain pending human approval`)
  assert(draft.publicationAllowed === false, `resolved draft ${draft.resolvedSlug} must remain publication-blocked`)
}

console.log(`catalog playbook gap check passed: ${leads.length} unresolved leads plus ${resolvedDrafts.length} review-gated structured drafts remain publication-blocked`)
