// Test-only: the real catalog, exported by scripts/mvp-export-engine-snapshot.mjs.
import fs from 'node:fs'
import path from 'node:path'
import { benefitRateFromRow, type BenefitRateRow } from '../calculator'
import { applicationView } from '../../display'
import { catalogVersion, headlineOf, hydrateCatalog, type EngineCatalogData } from '../catalog'
import type { EngineRecord } from '../types'

type SnapshotRecord = Omit<EngineRecord, 'rates'> & { rateRows: BenefitRateRow[] }
type Snapshot = Omit<EngineCatalogData, 'records' | 'version'> & { records: SnapshotRecord[] }

const file = path.join(process.cwd(), 'src/lib/opportunities/engine/__tests__/catalog-snapshot.json')
const snapshot = JSON.parse(fs.readFileSync(file, 'utf8')) as Snapshot

export function snapshotData(): Omit<EngineCatalogData, 'version'> {
  return {
    ...snapshot,
    records: snapshot.records.map(({ rateRows, ...record }) => ({
      ...record,
      rates: rateRows.map(benefitRateFromRow),
      // The snapshot keeps the text as written; the filter that hides working notes is the one production uses.
      applyRoute: applicationView({ route: record.applyRoute }).route,
      benefitHeadline: headlineOf({ headline: record.benefitHeadline }),
    })),
  }
}

export function snapshotCatalog() {
  const data = snapshotData()
  return hydrateCatalog({ ...data, version: catalogVersion(data) })
}
