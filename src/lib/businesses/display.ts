// Answers are saved as codes ("uttar_pradesh"). Older screens show the workspace
// values directly, so they read them through these.
const STATE_NAMES: Record<string, string> = {
  jammu_kashmir: 'Jammu and Kashmir',
  andaman_nicobar: 'Andaman and Nicobar Islands',
  dadra_nagar_haveli_daman_diu: 'Dadra and Nagar Haveli and Daman and Diu',
}

const STAGE_NAMES: Record<string, string> = {
  idea: 'Just an idea',
  setting_up: 'Setting it up now',
  running: 'Already running',
}

export function stateLabel(value: string | null | undefined) {
  if (!value) return ''
  if (STATE_NAMES[value]) return STATE_NAMES[value]
  if (!/^[a-z_]+$/.test(value)) return value
  return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function stageLabel(value: string | null | undefined) {
  if (!value) return ''
  return STAGE_NAMES[value] ?? value
}
