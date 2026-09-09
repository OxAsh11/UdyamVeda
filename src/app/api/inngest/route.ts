import { serve } from 'inngest/next'
import { inngest } from '@/lib/ingest/inngest'
import {
  refreshOpportunitySource,
  scheduleApplicationReminders,
  scheduleDailyCatalogSources,
  scheduleMonthlyCatalogSources,
  scheduleWeeklyCatalogSources,
} from '@/lib/ingest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [refreshOpportunitySource, scheduleApplicationReminders, scheduleDailyCatalogSources, scheduleWeeklyCatalogSources, scheduleMonthlyCatalogSources],
})
