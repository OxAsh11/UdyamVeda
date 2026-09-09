import queue from '../../../docs/catalog-source-failure-queue.json'

type QueueFailure = {
  slug: string
  name: string
  sourceUrl: string
  sourceAnchor: string
  failureKind: string
  retryable: boolean
  attempts: number | null
  error: string
  status: string
  publicationStatus: string
  nextAction: string
  manualPath: string
  alternateOfficialSources: Array<{ url: string; title: string; role: string; captureRequired: boolean }>
  alternateCaptures?: Array<{ sourceUrl: string; snapshotPath: string | null; contentHash: string | null; captureRole: string }>
}

type Queue = {
  summary: {
    totalOpen: number
    retryable: number
    manualReviewRequired: number
    alternateCapturedPendingReview?: number
    publicationReady: number
  }
  failures: QueueFailure[]
}

const sourceFailureQueue = queue as Queue

export function getSourceFailureSummary() {
  return {
    summary: {
      totalOpen: sourceFailureQueue.summary.totalOpen,
      retryable: sourceFailureQueue.summary.retryable,
      manualReviewRequired: sourceFailureQueue.summary.manualReviewRequired,
      alternateCapturedPendingReview: sourceFailureQueue.summary.alternateCapturedPendingReview ?? 0,
      publicationReady: sourceFailureQueue.summary.publicationReady,
    },
    failures: sourceFailureQueue.failures.map(failure => ({
      slug: failure.slug,
      name: failure.name,
      sourceUrl: failure.sourceUrl,
      failureKind: failure.failureKind,
      retryable: failure.retryable,
      attempts: failure.attempts,
      error: failure.error,
      status: failure.status,
      publicationStatus: failure.publicationStatus,
      nextAction: failure.nextAction,
      manualPath: failure.manualPath,
      alternateOfficialSources: failure.alternateOfficialSources,
      alternateCaptures: failure.alternateCaptures ?? [],
    })),
  }
}
