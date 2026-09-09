export type LineDiffKind = 'same' | 'added' | 'removed'

export type LineDiffRow = {
  kind: LineDiffKind
  text: string
}

export type LineDiffResult = {
  rows: LineDiffRow[]
  added: number
  removed: number
  truncated: boolean
}

const MAX_LINES = 4000

export function buildLineDiff(previousText: string, currentText: string): LineDiffResult {
  const previous = previousText.split(/\r?\n/)
  const current = currentText.split(/\r?\n/)
  const truncated = previous.length > MAX_LINES || current.length > MAX_LINES
  const before = previous.slice(0, MAX_LINES)
  const after = current.slice(0, MAX_LINES)
  const positions = new Map<string, number[]>()
  before.forEach((line, index) => {
    const values = positions.get(line) ?? []
    values.push(index)
    positions.set(line, values)
  })

  const rows: LineDiffRow[] = []
  let previousIndex = 0
  let added = 0
  let removed = 0

  for (const line of after) {
    const candidates = positions.get(line) ?? []
    const matchingIndex = candidates.find(index => index >= previousIndex)
    if (matchingIndex === undefined) {
      rows.push({ kind: 'added', text: line })
      added += 1
      continue
    }
    while (previousIndex < matchingIndex) {
      rows.push({ kind: 'removed', text: before[previousIndex] })
      removed += 1
      previousIndex += 1
    }
    rows.push({ kind: 'same', text: line })
    previousIndex = matchingIndex + 1
  }

  while (previousIndex < before.length) {
    rows.push({ kind: 'removed', text: before[previousIndex] })
    removed += 1
    previousIndex += 1
  }

  if (truncated) rows.push({ kind: 'same', text: '[Diff truncated to the first 4,000 lines.]' })
  return { rows, added, removed, truncated }
}
