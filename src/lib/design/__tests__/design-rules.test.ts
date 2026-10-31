import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { toneClasses, type Tone } from '@/lib/design/tones'
import { FOUNDER_TEXT_EN } from '@/lib/founder/text'
import { TEXT } from '@/lib/start/i18n'

// Files that follow the colour rules. Later tasks add each page they migrate.
const MIGRATED_FILES: string[] = [
  'src/components/ui/founder.tsx',
  'src/components/founder/VerdictCard.tsx',
  'src/lib/design/tones.ts',
  'src/app/(dashboard)/dashboard/schemes/page.tsx',
  'src/components/founder/SchemesForYou.tsx',
  'src/components/founder/BrowseAll.tsx',
  'src/lib/founder/browse.ts',
  'src/lib/founder/text.ts',
]

// Words a first-time founder should never see. Matched case-insensitively.
const BANNED_WORDS: string[] = [
  'evidence',
  'provenance',
  'handoff',
  'review-gated',
  'review required',
  'source-linked',
  'research beta',
  'preparation workspace',
  'versioned',
  'seeded',
  'catalog',
]

const RAW_COLOUR_CLASS =
  /\b(bg|text|border|from|to|via|ring|fill|stroke|divide|shadow)-(slate|neutral|gray|zinc|stone|indigo|violet|purple|blue|sky|cyan|teal|emerald|green|lime|yellow|amber|orange|red|rose|pink|fuchsia)-\d{2,3}\b/g
const HEX_VALUE = /#[0-9a-fA-F]{3,8}\b/g

// Props that never show as words. Every other string prop is read as text a person sees, so a
// new shared-part prop (text, sub, label, note, value, ...) is covered with no list to update.
const HIDDEN_ATTRIBUTES = new Set([
  'className', 'class', 'style', 'href', 'src', 'id', 'key', 'ref', 'type', 'name', 'role', 'tone',
  'htmlFor', 'target', 'rel',
])
const isHiddenAttribute = (name: string) =>
  HIDDEN_ATTRIBUTES.has(name) || name.startsWith('data-') || (name.startsWith('aria-') && name !== 'aria-label')

const TONES: Tone[] = ['go', 'step', 'wait', 'urgent']

// Every colour token the theme maps, so Tailwind has bg-<name>, text-<name> and border-<name>.
// (card is left out: shadcn already maps bg-card, and it is white either way.)
const THEME_TOKENS: string[] = [
  'go', 'on-go', 'go-soft', 'go-ink', 'go-line', 'go-fade', 'go-fade-end', 'go-deep',
  'step', 'step-soft', 'step-ink', 'step-line', 'step-fade', 'step-fade-end', 'step-deep',
  'wait', 'wait-soft', 'wait-ink',
  'urgent', 'on-urgent', 'urgent-soft', 'urgent-ink',
  'act', 'on-act', 'act-soft', 'act-ink',
  'paper', 'line', 'ink', 'ink-2',
]

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')
const globals = read('src/app/globals.css')

// ---- colour maths -------------------------------------------------------

function token(name: string): string {
  const found = globals.match(new RegExp(`--uv-${name}\\s*:\\s*(#[0-9a-fA-F]{6})\\b`))
  if (!found) throw new Error(`--uv-${name} is not defined in globals.css`)
  return found[1]
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

// CIE lightness, 0 (black) to 100 (white).
function lightness(hex: string): number {
  const y = luminance(hex)
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y
}

// ---- source scanning ----------------------------------------------------

function parse(source: string, file: string): ts.SourceFile {
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind)
}

// String literals an expression can show: itself, a template's text, either branch of ?:,
// the shown side of && || ??, and both sides of +. A condition such as a === 'x' shows nothing.
function literalsIn(node: ts.Expression | undefined): string[] {
  if (!node) return []
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return [node.text]
  if (ts.isTemplateExpression(node)) {
    return [node.head.text, ...node.templateSpans.flatMap((span) => [...literalsIn(span.expression), span.literal.text])]
  }
  if (ts.isParenthesizedExpression(node)) return literalsIn(node.expression)
  if (ts.isConditionalExpression(node)) return [...literalsIn(node.whenTrue), ...literalsIn(node.whenFalse)]
  if (ts.isBinaryExpression(node)) {
    const op = node.operatorToken.kind
    if (op === ts.SyntaxKind.AmpersandAmpersandToken) return literalsIn(node.right)
    if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken || op === ts.SyntaxKind.PlusToken) {
      return [...literalsIn(node.left), ...literalsIn(node.right)]
    }
  }
  return []
}

// Text a person reads: between tags, and the value of every prop that is not on the hidden list.
function visibleText(source: string, file: string): string[] {
  const found: string[] = []
  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) {
      found.push(node.text)
    } else if (ts.isJsxExpression(node) && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) {
      found.push(...literalsIn(node.expression))
    } else if (ts.isJsxAttribute(node) && !isHiddenAttribute(node.name.getText())) {
      const value = node.initializer
      if (value && ts.isStringLiteral(value)) found.push(value.text)
      else if (value && ts.isJsxExpression(value)) found.push(...literalsIn(value.expression))
    }
    ts.forEachChild(node, visit)
  }
  visit(parse(source, file))
  return found
}

function stringLiterals(source: string, file: string): string[] {
  const found: string[] = []
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) found.push(node.text)
    else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) found.push(node.text)
    ts.forEachChild(node, visit)
  }
  visit(parse(source, file))
  return found
}

function bannedIn(text: string): string[] {
  const flat = text.replace(/\s+/g, ' ')
  return BANNED_WORDS.filter((word) => {
    const pattern = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')
    return new RegExp(`\\b${pattern}`, 'i').test(flat)
  })
}

const rawColourClasses = (source: string) => source.match(RAW_COLOUR_CLASS) ?? []
const hexInStrings = (source: string, file: string) =>
  stringLiterals(source, file).flatMap((text) => text.match(HEX_VALUE) ?? [])

// ---- tokens -------------------------------------------------------------

describe('colour tokens', () => {
  it.each([
    ['go-ink', 'go-soft'], ['go-deep', 'go-fade'], ['go-deep', 'go-fade-end'], ['on-go', 'go'],
    ['step-ink', 'step-soft'], ['step-deep', 'step-fade'], ['step-deep', 'step-fade-end'],
    ['wait-ink', 'wait-soft'], ['urgent-ink', 'urgent-soft'], ['on-urgent', 'urgent'],
    ['act-ink', 'act-soft'], ['on-act', 'act'],
    ['ink', 'paper'], ['ink-2', 'paper'], ['ink-2', 'card'],
  ])('%s on %s has at least 4.5:1 contrast', (text, background) => {
    expect(contrast(token(text), token(background))).toBeGreaterThanOrEqual(4.5)
  })

  it('green and amber differ in lightness, not hue alone', () => {
    expect(Math.abs(lightness(token('go')) - lightness(token('step')))).toBeGreaterThanOrEqual(25)
  })

  it('maps every token into the theme so classes like bg-go-soft and text-go-ink work', () => {
    for (const name of THEME_TOKENS) {
      const mapped = new RegExp(`--color-${name}\\s*:\\s*var\\(--uv-${name}\\)`).test(globals)
      expect(mapped, `--color-${name} is mapped`).toBe(true)
    }
  })

  it('defines the band classes and the Home hero', () => {
    for (const cls of ['.uv-band-go', '.uv-band-step', '.uv-band-wait', '.uv-hero']) {
      expect(globals.includes(cls), `${cls} is defined`).toBe(true)
    }
  })
})

// ---- the colour and word rules -------------------------------------------

describe('the rule checks themselves', () => {
  it('spot raw colour classes and hex values, and let token classes through', () => {
    expect(rawColourClasses('p-4 bg-red-500 hover:text-slate-700 border-indigo-600')).toEqual([
      'bg-red-500', 'text-slate-700', 'border-indigo-600',
    ])
    expect(rawColourClasses('bg-go-soft text-ink border-line')).toEqual([])
    expect(hexInStrings('const c = "bg-[#fff] text-[#3F46E8]"', 'a.ts')).toEqual(['#fff', '#3F46E8'])
    expect(hexInStrings('// #abc in a comment\nconst href = "/page"', 'a.ts')).toEqual([])
  })

  it('read the words between tags and in placeholder, aria-label and title, not identifiers', () => {
    const sample = [
      "import { catalogVersion } from '@/lib/catalog/seed'",
      'export const x = (v: boolean) => (',
      '  <div title="Evidence list" aria-label={v ? "Seeded" : ""} data-x="provenance">',
      '    <input placeholder="Handoff" />',
      '    Versioned text {catalogVersion} {v && "Review required"}',
      '  </div>',
      ')',
    ].join('\n')
    const found = visibleText(sample, 'sample.tsx').join(' | ')
    expect(found).toContain('Evidence list')
    expect(found).toContain('Seeded')
    expect(found).toContain('Handoff')
    expect(found).toContain('Versioned text')
    expect(found).toContain('Review required')
    expect(found).not.toContain('provenance')
    expect(found).not.toContain('catalog')
  })

  it('read the props of the shared parts, and skip class names, links, ids and data attributes', () => {
    const sample = [
      'export const page = (amount: string, later: boolean) => (',
      '  <>',
      '    {amount === "catalog" && <i>Done</i>}',
      '    <VerdictBand tone="go" text="Your evidence pack is ready" aside={<StatusChip tone="wait" text="Seeded" />} />',
      '    <MoneyTile label="Handoff" value={`Up to ${amount} catalog`} note={later ? "Versioned" : ""} />',
      '    <PageHeader title="Research beta" sub={`Preparation workspace ${later ? "now" : ""}`}',
      '      action={<a href="/catalog/start" className="bg-go-soft" id="evidence" key="seeded" role="catalog"',
      '        data-note="provenance" aria-describedby="provenance">Open</a>} />',
      '  </>',
      ')',
    ].join('\n')
    const found = visibleText(sample, 'sample.tsx')
    expect(found).toEqual(expect.arrayContaining([
      'Your evidence pack is ready', 'Seeded', 'Handoff', 'Up to ', ' catalog', 'Versioned',
      'Research beta', 'Preparation workspace ', 'now', 'Open', 'Done',
    ]))
    for (const skipped of ['go', 'wait', '/catalog/start', 'bg-go-soft', 'evidence', 'seeded', 'catalog', 'provenance']) {
      expect(found, skipped).not.toContain(skipped)
    }
    expect(bannedIn(found.join('\n'))).toEqual([
      'evidence', 'handoff', 'research beta', 'preparation workspace', 'versioned', 'seeded', 'catalog',
    ])
  })

  it('match banned words in any case, across a line break, and not a word that merely contains none', () => {
    expect(bannedIn('See the EVIDENCE here')).toEqual(['evidence'])
    expect(bannedIn('Review\n   required')).toEqual(['review required'])
    expect(bannedIn('Your catalog is ready')).toEqual(['catalog'])
    expect(bannedIn('Eligible now, and one step away')).toEqual([])
  })
})

describe('migrated files', () => {
  it.each(MIGRATED_FILES)('%s uses no raw colour classes or hex values', (file) => {
    const source = read(file)
    expect(rawColourClasses(source)).toEqual([])
    expect(hexInStrings(source, file)).toEqual([])
  })

  it.each(MIGRATED_FILES)('%s shows founders none of the banned words', (file) => {
    const text = visibleText(read(file), file).join('\n')
    expect(bannedIn(text)).toEqual([])
  })
})

describe('founder text', () => {
  it('uses none of the banned words in the English start text', () => {
    const values = Object.values(TEXT.en)
    expect(values.length).toBeGreaterThan(0)
    for (const value of values) expect(bannedIn(value), value).toEqual([])
  })

  // The page scanner reads JSX, not ft('...') calls, so the dashboard's own words are read here.
  it('uses none of the banned words in the English dashboard text', () => {
    const values = Object.values(FOUNDER_TEXT_EN)
    expect(values.length).toBeGreaterThan(0)
    for (const value of values) expect(bannedIn(value), value).toEqual([])
  })
})

// ---- tone classes -------------------------------------------------------

describe('toneClasses', () => {
  const classesOf = (tone: Tone) => Object.values(toneClasses(tone)).flatMap((value) => value.split(/\s+/))
  const toneOf = (cls: string) => cls.match(/(?<![a-z])(go|step|wait|urgent)(?![a-z])/)?.[1]

  it('gives every tone a band, chip, line, soft and ink class', () => {
    for (const tone of TONES) {
      const classes = toneClasses(tone)
      expect(Object.keys(classes).sort()).toEqual(['band', 'chip', 'ink', 'line', 'soft'])
      for (const value of Object.values(classes)) expect(value.trim()).not.toBe('')
    }
  })

  it('keeps each tone to its own colour, so a colour never means two things', () => {
    for (const tone of TONES) {
      expect([...new Set(classesOf(tone).map(toneOf))], tone).toEqual([tone])
    }
    expect(new Set(TONES.map((tone) => JSON.stringify(toneClasses(tone)))).size).toBe(TONES.length)
  })

  it('uses only classes that name a colour the theme defines', () => {
    const known = new Set([...THEME_TOKENS, 'card'])
    for (const tone of TONES) {
      for (const cls of classesOf(tone)) {
        const prefixed = cls.match(/^(?:bg|text|border)-(.+)$/)
        const ok = /^uv-band-(go|step|wait)$/.test(cls) || (prefixed !== null && known.has(prefixed[1]))
        expect(ok, `${tone}: ${cls}`).toBe(true)
      }
    }
  })
})
