import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const source = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

describe('reading on a phone (PRD §13)', () => {
  it('lets people zoom, which the PRD requires up to 200%', () => {
    const layout = source('src/app/layout.tsx')
    expect(layout).not.toMatch(/userScalable:\s*false/)
    expect(layout).not.toMatch(/maximumScale:\s*1\b/)
  })
})

describe('the website', () => {
  it('no longer quotes the old count of schemes', () => {
    expect(source('src/app/page.tsx')).not.toMatch(/\b174\b/)
  })
})
