import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

// The scheme card is shown on /start/results, which must stay light for cheap phones.
// It words the rules engine's answer; it must never pull the engine itself into the browser.
const ENTRY_FILES = [
  'src/lib/founder/card.ts',
  'src/lib/founder/verdict.ts',
  'src/components/founder/VerdictCard.tsx',
]

// The engine that decides, and what only it needs.
const FORBIDDEN_FILES = [
  'src/lib/opportunities/engine/classify.ts',
  'src/lib/opportunities/fact-mapping.ts',
  'src/lib/opportunities/rules.ts',
]

const ROOT = process.cwd()
const EXTENSIONS = ['.ts', '.tsx', '/index.ts', '/index.tsx']

// A module that exists only as types is gone from the browser, so it does not count.
function isRuntimeImport(node: ts.ImportDeclaration | ts.ExportDeclaration): boolean {
  if (ts.isExportDeclaration(node)) return !!node.moduleSpecifier && !node.isTypeOnly
  const clause = node.importClause
  if (!clause) return true // import 'x' runs the module
  if (clause.isTypeOnly) return false
  const named = clause.namedBindings
  const onlyTypeNames = !clause.name && !!named && ts.isNamedImports(named) && named.elements.length > 0
    && named.elements.every(element => element.isTypeOnly)
  return !onlyTypeNames
}

function runtimeImportsOf(source: string, file: string): string[] {
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind)
  const found: string[] = []
  sourceFile.forEachChild(node => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && isRuntimeImport(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      found.push(node.moduleSpecifier.text)
    }
  })
  return found
}

// Only our own files are followed; packages are not ours to judge.
function resolve(specifier: string, from: string): string | null {
  const base = specifier.startsWith('@/') ? path.join(ROOT, 'src', specifier.slice(2))
    : specifier.startsWith('.') ? path.resolve(ROOT, path.dirname(from), specifier)
      : null
  if (!base) return null
  const hit = EXTENSIONS.map(extension => base + extension).find(candidate => fs.existsSync(candidate))
  if (!hit) throw new Error(`${from} imports ${specifier}, which is not a file here`)
  return path.relative(ROOT, hit).split(path.sep).join('/')
}

/** Every file of ours that reaches the browser along with these ones, by runtime imports only. */
function browserFilesFrom(entries: string[]): Map<string, string> {
  const reachedBy = new Map<string, string>()
  const queue = entries.map(entry => ({ file: entry, via: 'entry' }))
  for (let next = queue.shift(); next; next = queue.shift()) {
    if (reachedBy.has(next.file)) continue
    reachedBy.set(next.file, next.via)
    for (const specifier of runtimeImportsOf(fs.readFileSync(path.join(ROOT, next.file), 'utf8'), next.file)) {
      const target = resolve(specifier, next.file)
      if (target) queue.push({ file: target, via: next.file })
    }
  }
  return reachedBy
}

describe('what the scheme card brings into the browser', () => {
  it('follows runtime imports only, and reads type-only imports as nothing', () => {
    const sample = [
      "import type { A } from './a'",
      "import { type B, type C } from './b'",
      "import { D, type E } from './d'",
      "import F from './f'",
      "import './g'",
      "export { H } from './h'",
      "export type { I } from './i'",
    ].join('\n')
    expect(runtimeImportsOf(sample, 'sample.ts')).toEqual(['./d', './f', './g', './h'])
  })

  const reached = browserFilesFrom(ENTRY_FILES)

  it('reaches the engine only through its types, and the small window helpers', () => {
    expect([...reached.keys()].filter(file => file.includes('/engine/'))).toEqual(['src/lib/opportunities/engine/windows.ts'])
  })

  it.each(FORBIDDEN_FILES)('never reaches %s', forbidden => {
    const route = [forbidden]
    for (let via = reached.get(forbidden); via && via !== 'entry'; via = reached.get(via)) route.unshift(via)
    expect(reached.has(forbidden), `reached by ${route.join(' -> ')}`).toBe(false)
  })
})
