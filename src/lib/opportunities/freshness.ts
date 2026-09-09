export type VerificationCadence = 'deadline_sensitive' | 'rolling' | 'static'

const MAX_AGE_DAYS: Record<VerificationCadence, number> = {
  deadline_sensitive: 30,
  rolling: 90,
  static: 90,
}

export function isStale(lastVerifiedAt: string | null | undefined, cadence: VerificationCadence, now = new Date()) {
  if (!lastVerifiedAt) return true
  const verifiedAt = new Date(lastVerifiedAt)
  if (Number.isNaN(verifiedAt.getTime())) return true
  const ageDays = (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24)
  return ageDays > MAX_AGE_DAYS[cadence]
}

export function verificationStatusFor(
  reviewStatus: string,
  lastVerifiedAt: string | null | undefined,
  cadence: VerificationCadence,
  now = new Date(),
) {
  if (reviewStatus !== 'approved') return 'in_review' as const
  return isStale(lastVerifiedAt, cadence, now) ? 'stale' as const : 'verified' as const
}
