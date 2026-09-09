import report from '../../../docs/catalog-current-source-gaps.json'

type AlternateSource = {
  url: string
  title: string
  role: string
  captureRequired: boolean
  sourceAnchor?: string
}

type AlternateCapture = {
  sourceUrl: string
  contentHash: string | null
  snapshotPath: string | null
  captureMethod: string | null
}

type SourceGap = {
  slug: string
  name: string
  sourceUrl: string
  sourceAnchor: string | null
  sourceRegistered: boolean
  status: string
  captureError: string | null
  captureFailureKind: string | null
  captureRetryable: boolean | null
  captureMethod: string | null
  snapshotPath: string | null
  contentHash: string | null
  integrityStatus: string
  alternateOfficialSources: AlternateSource[]
  alternateCaptures: AlternateCapture[]
  nextAction: string
  publicationStatus: string
}

type CurrentSourceGapReport = {
  summary: {
    totalRecords: number
    currentSourceGaps: number
    primarySnapshotMissing: number
    primaryCaptureFailed: number
    retryableFailures: number
    manualReviewRequired: number
    integrityReviewRequired: number
    alternateCapturesAvailable: number
    publicationReady: number
  }
  gaps: SourceGap[]
}

const currentSourceGapReport = report as CurrentSourceGapReport

export function getCurrentSourceGapSummary() {
  return {
    summary: currentSourceGapReport.summary,
    gaps: currentSourceGapReport.gaps,
  }
}
