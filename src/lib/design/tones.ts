// Each tone is one colour with one meaning. Colour never carries the meaning alone:
// every use also shows words and an icon.
//   go     green  - you can do this, or it is done
//   step   amber  - there is something for you to do first
//   wait   grey   - nothing to do now, or not confirmed
//   urgent red    - a deadline or a problem that needs you soon
export type Tone = 'go' | 'step' | 'wait' | 'urgent'

export interface ToneClasses {
  band: string // full-width verdict strip
  chip: string // small status label
  line: string // border colour for a tinted card
  soft: string // pale background
  ink: string // readable text colour
}

// Class names are written out in full so Tailwind can find them.
const TONE_CLASSES: Record<Tone, ToneClasses> = {
  go: {
    band: 'uv-band-go',
    chip: 'bg-go-soft text-go-ink',
    line: 'border-go-line',
    soft: 'bg-go-soft',
    ink: 'text-go-ink',
  },
  step: {
    band: 'uv-band-step',
    chip: 'bg-step-soft text-step-ink',
    line: 'border-step-line',
    soft: 'bg-step-soft',
    ink: 'text-step-ink',
  },
  wait: {
    band: 'uv-band-wait',
    chip: 'bg-wait-soft text-wait-ink',
    line: 'border-wait',
    soft: 'bg-wait-soft',
    ink: 'text-wait-ink',
  },
  urgent: {
    band: 'bg-urgent text-on-urgent',
    chip: 'bg-urgent-soft text-urgent-ink',
    line: 'border-urgent',
    soft: 'bg-urgent-soft',
    ink: 'text-urgent-ink',
  },
}

export function toneClasses(tone: Tone): ToneClasses {
  return TONE_CLASSES[tone]
}
