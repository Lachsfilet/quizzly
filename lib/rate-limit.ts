const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

export function rateLimit(key: string): { success: boolean } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now - entry.lastReset > WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, lastReset: now })
    return { success: true }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false }
  }

  entry.count++
  return { success: true }
}
