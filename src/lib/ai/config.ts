export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-5.6-luna'
export const OPENAI_REASONING_EFFORT = process.env.OPENAI_REASONING_EFFORT ?? 'high'

export function aiModelConfig() {
  return {
    model: OPENAI_MODEL,
    reasoning_effort: OPENAI_REASONING_EFFORT as 'none' | 'low' | 'medium' | 'high' | 'xhigh',
  }
}
