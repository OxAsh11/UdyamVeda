import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const conciergeRoute = fs.readFileSync(path.join(root, 'src/app/api/concierge/route.ts'), 'utf8')
const conciergeForm = fs.readFileSync(path.join(root, 'src/components/applications/ConciergeRequestForm.tsx'), 'utf8')
const applicationPage = fs.readFileSync(path.join(root, 'src/app/(dashboard)/dashboard/applications/[id]/page.tsx'), 'utf8')
const applicationRoute = fs.readFileSync(path.join(root, 'src/app/api/applications/[id]/route.ts'), 'utf8')
const taskRoute = fs.readFileSync(path.join(root, 'src/app/api/applications/[id]/tasks/[taskId]/route.ts'), 'utf8')
const taskMigration = fs.readFileSync(path.join(root, 'supabase/migrations/20260907200000_application_task_controls.sql'), 'utf8')
const reminderMigration = fs.readFileSync(path.join(root, 'supabase/migrations/20260907210000_application_reminders.sql'), 'utf8')
const notificationRoute = fs.readFileSync(path.join(root, 'src/app/api/notifications/route.ts'), 'utf8')
const ingestionFunctions = fs.readFileSync(path.join(root, 'src/lib/ingest/functions.ts'), 'utf8')
const checklist = fs.readFileSync(path.join(root, 'docs/udyamveda-implementation-checklist.md'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`application workspace check failed: ${message}`)
}

assert(conciergeRoute.includes('consentGiven !== true'), 'concierge intake must require explicit consent')
assert(conciergeRoute.includes(".eq('business_id', business.id)"), 'concierge application verification must be business-scoped')
assert(conciergeRoute.includes("requester_id: user.id"), 'concierge request must identify the requesting user')
assert(conciergeRoute.includes("concierge_request_submitted"), 'concierge intake must write an audit event')
assert(conciergeForm.includes('Do not include passwords, OTPs'), 'concierge UI must warn against sensitive credentials')
assert(conciergeForm.includes('does not make UdyamVeda a government filing portal'), 'concierge UI must preserve the official-handoff boundary')
assert(applicationPage.includes('Open official portal'), 'application workspace must expose the official portal handoff')
assert(applicationPage.includes('ConciergeRequestForm'), 'application detail must expose concierge intake')
assert(applicationRoute.includes(".eq('business_id', business.id)"), 'application detail authorization must remain business-scoped')
assert(taskRoute.includes('ownerId'), 'task endpoint must support task ownership')
assert(taskRoute.includes('application_task_status_events'), 'task endpoint must record task status history')
assert(taskMigration.includes('depends_on_task_ids'), 'task migration must persist dependencies')
assert(taskMigration.includes('members can create application task status events'), 'task history must have a tenant-scoped insert policy')
assert(reminderMigration.includes('notifications_user_dedupe_idx'), 'reminders must have an idempotency index')
assert(notificationRoute.includes('markAllRead'), 'notification route must support marking all notifications read')
assert(ingestionFunctions.includes('schedule-application-deadline-reminders'), 'scheduled application reminders must be registered')
assert(checklist.includes('Concierge intake and taxonomy'), 'implementation checklist must track concierge work')

console.log('application workspace check passed: business-scoped application controls, official handoff, consented concierge intake, and audit boundary')
