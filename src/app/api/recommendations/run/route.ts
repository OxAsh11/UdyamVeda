import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessFacts, getBusinessForUser } from '@/lib/businesses/dal'
import { recommendPublishedOpportunities } from '@/lib/opportunities/published-recommendations'
import { profileCompleteness, profileFromBusinessFacts } from '@/lib/businesses/profile'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => ({})) as { businessId?: string }
  const { business, error: businessError } = await getBusinessForUser(supabase, user.id, body.businessId)

  if (businessError) return NextResponse.json({ error: 'Unable to load the selected business.', detail: businessError.message }, { status: 500 })
  if (!business) return NextResponse.json({ error: 'Create or select a business before running recommendations.', code: 'business_required' }, { status: 422 })

  const { data: facts, error: factsError } = await getBusinessFacts(supabase, business.id)
  if (factsError) return NextResponse.json({ error: 'Unable to load business facts.', detail: factsError.message }, { status: 500 })

  const profile = profileFromBusinessFacts(business, facts ?? [])

  const results = await recommendPublishedOpportunities(profile)
  const { data: run, error: runError } = await supabase
    .from('recommendation_runs')
    .insert({
      business_id: business.id,
      engine_version: 'approved-catalog-rules-1.0',
      business_facts_snapshot: profile,
    })
    .select('id')
    .single()

  if (runError || !run) {
    return NextResponse.json({ error: 'Recommendation storage is not initialized yet. Apply the UdyamVeda migration first.', detail: runError?.message }, { status: 503 })
  }

  if (results.items.length) {
    const { data: opportunities, error: opportunitiesError } = await supabase
      .from('opportunities')
      .select('id, slug, current_version_id')
      .in('slug', results.items.map(item => item.id))
    if (opportunitiesError) {
      await supabase.from('recommendation_runs').delete().eq('id', run.id)
      return NextResponse.json({ error: 'Unable to persist recommendation references.', detail: opportunitiesError.message }, { status: 500 })
    }

    const opportunityBySlug = new Map((opportunities ?? []).map(opportunity => [opportunity.slug, opportunity]))
    const recommendationRows = results.items.flatMap((item, index) => {
      const opportunity = opportunityBySlug.get(item.id)
      if (!opportunity?.current_version_id) return []
      return [{
        recommendation_run_id: run.id,
        opportunity_id: opportunity.id,
        opportunity_version_id: opportunity.current_version_id,
        status: item.recommendationStatus,
        rank: index + 1,
        match_score: Math.max(0, Math.min(1, item.matchScore / 100)),
        reason: {
          reasons: item.reasons,
          facts_used: item.factsUsed,
          verification_status: item.verificationStatus,
          source_revision: item.sourceRevision,
          last_verified_at: item.lastVerifiedAt ?? null,
          urgency: item.urgency,
          ranking_signals: item.rankingSignals,
        },
        missing_facts: item.missingFacts,
        blocking_conditions: item.blockers,
        benefit_to_effort: {
          effort: item.effort,
          estimate: item.effortEstimate,
          benefit_estimates: item.benefitEstimates,
        },
      }]
    })

    if (recommendationRows.length) {
      const { error: resultError } = await supabase.from('recommendation_results').insert(recommendationRows)
      if (resultError) {
        await supabase.from('recommendation_runs').delete().eq('id', run.id)
        return NextResponse.json({ error: 'Unable to persist recommendation results.', detail: resultError.message }, { status: 500 })
      }
    }
  }

  return NextResponse.json({
    data: results.items,
    meta: {
      generatedAt: new Date().toISOString(),
      source: results.source,
      ruleVersion: 'approved-catalog-rules-1.0',
      profileCompleteness: profileCompleteness(profile),
      businessId: business.id,
      recommendationRunId: run.id,
    },
  })
}
