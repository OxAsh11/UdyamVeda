const HOUR_MS = 60 * 60 * 1000
// The suggestion route calls a paid AI for anonymous visitors, so both limits
// are low. They are per server instance, which is enough to stop a runaway bill.
const LIMIT_PER_ADDRESS = 10
const LIMIT_PER_INSTANCE = 200

let windowStart = Date.now()
let totalCalls = 0
let callsByAddress = new Map<string, number>()

export function resetSuggestLimits() {
  windowStart = Date.now()
  totalCalls = 0
  callsByAddress = new Map()
}

export function allowSuggestCall(address: string) {
  if (Date.now() - windowStart > HOUR_MS) resetSuggestLimits()
  const calls = callsByAddress.get(address) ?? 0
  if (calls >= LIMIT_PER_ADDRESS || totalCalls >= LIMIT_PER_INSTANCE) return false
  callsByAddress.set(address, calls + 1)
  totalCalls += 1
  return true
}
