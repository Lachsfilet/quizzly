import { rateLimit } from '@/lib/rate-limit'

describe('Rate Limiter - Stress Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('handles 100 unique users simultaneously within limits', () => {
    for (let user = 0; user < 100; user++) {
      const result = rateLimit(`stress-user-${user}`)
      expect(result.success).toBe(true)
    }
  })

  it('enforces limit per-user with 100 concurrent users', () => {
    for (let user = 0; user < 100; user++) {
      for (let req = 0; req < 10; req++) {
        rateLimit(`concurrent-user-${user}`)
      }
      expect(rateLimit(`concurrent-user-${user}`).success).toBe(false)
    }
  })

  it('handles burst pattern: 10 quick, wait, 10 more', () => {
    const key = 'burst-pattern'
    for (let i = 0; i < 10; i++) {
      expect(rateLimit(key).success).toBe(true)
    }
    expect(rateLimit(key).success).toBe(false)

    jest.advanceTimersByTime(61_000)

    for (let i = 0; i < 10; i++) {
      expect(rateLimit(key).success).toBe(true)
    }
    expect(rateLimit(key).success).toBe(false)
  })

  it('handles interleaved requests from multiple users', () => {
    const users = ['alice', 'bob', 'charlie']
    const results: Record<string, boolean[]> = {}

    users.forEach((u) => (results[u] = []))

    for (let round = 0; round < 15; round++) {
      users.forEach((user) => {
        results[user].push(rateLimit(`interleave-${user}`).success)
      })
    }

    users.forEach((user) => {
      const successes = results[user].filter(Boolean).length
      const failures = results[user].filter((r) => !r).length
      expect(successes).toBe(10)
      expect(failures).toBe(5)
    })
  })

  it('correctly tracks window boundary edge case', () => {
    const key = 'edge-window'

    for (let i = 0; i < 5; i++) {
      rateLimit(key)
    }

    jest.advanceTimersByTime(30_000)

    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key).success).toBe(true)
    }

    expect(rateLimit(key).success).toBe(false)
  })

  it('handles empty string key', () => {
    const result = rateLimit('')
    expect(result.success).toBe(true)
  })

  it('handles very long key', () => {
    const longKey = 'a'.repeat(10000)
    const result = rateLimit(longKey)
    expect(result.success).toBe(true)
  })

  it('handles special characters in key', () => {
    const specialKey = 'user:id=123&action=create<script>'
    const result = rateLimit(specialKey)
    expect(result.success).toBe(true)
  })

  it('simulates rapid-fire quiz creation scenario', () => {
    const userId = 'rapid-quiz-creator'

    const rapidResults: boolean[] = []
    for (let i = 0; i < 20; i++) {
      rapidResults.push(rateLimit(`create-quiz:${userId}`).success)
    }

    expect(rapidResults.slice(0, 10).every(Boolean)).toBe(true)
    expect(rapidResults.slice(10).every((r) => !r)).toBe(true)
  })

  it('allows different actions for same user', () => {
    const userId = 'multi-action-user'

    for (let i = 0; i < 10; i++) {
      rateLimit(`create-quiz:${userId}`)
    }
    expect(rateLimit(`create-quiz:${userId}`).success).toBe(false)

    expect(rateLimit(`view-quiz:${userId}`).success).toBe(true)
  })

  it('simulates sustained load over multiple windows', () => {
    const key = 'sustained-load'

    for (let window = 0; window < 5; window++) {
      for (let req = 0; req < 10; req++) {
        expect(rateLimit(key).success).toBe(true)
      }
      expect(rateLimit(key).success).toBe(false)

      jest.advanceTimersByTime(61_000)
    }
  })
})
