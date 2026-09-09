import fs from 'node:fs'
import path from 'node:path'

const route = fs.readFileSync(path.join(process.cwd(), 'src/app/api/admin/catalog/discoveries/route.ts'), 'utf8')
const page = fs.readFileSync(path.join(process.cwd(), 'src/app/admin/catalog/discoveries/page.tsx'), 'utf8')
const gate = fs.readFileSync(path.join(process.cwd(), 'src/app/api/admin/catalog/gate/route.ts'), 'utf8')
const migration = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260906370000_catalog_discovery_status.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

assert(route.includes("body.businessRelevance === 'relevant' && !body.linkedOpportunityId"), 'relevant discoveries must require a linked opportunity')
assert(route.includes("version?.review_status !== 'approved'"), 'linked discoveries must require an approved version')
assert(route.includes("body.businessRelevance === 'unclear' ? 'in_progress' : 'assessed'"), 'unclear discoveries must remain unresolved')
assert(page.includes('approvedOpportunities') && page.includes('Select approved record'), 'discovery UI must select from approved records')
assert(gate.includes("discovery.assessment_status !== 'assessed'"), 'beta gate must block unresolved discovery assessments')
assert(gate.includes('approvedLinkedOpportunityIds'), 'beta gate must validate approved linked opportunities')
assert(migration.includes("'in_progress'"), 'database must allow unresolved in-progress discovery assessments')

console.log('catalog discovery check passed: approved linking, unresolved unclear state, and beta-gate enforcement')
