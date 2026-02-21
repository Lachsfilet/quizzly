import { rateLimit } from '@/lib/rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('allows the first request', () => {
    const result = rateLimit('test-key-1')
    expect(result.success).toBe(true)
  })

  it('allows up to 10 requests within the window', () => {
    for (let i = 0; i < 10; i++) {
      const result = rateLimit('test-key-2')
      expect(result.success).toBe(true)
    }
  })

  it('blocks the 11th request within the window', () => {
    for (let i = 0; i < 10; i++) {
      rateLimit('test-key-3')
    }
    const result = rateLimit('test-key-3')
    expect(result.success).toBe(false)
  })

  it('resets after the time window passes', () => {
    for (let i = 0; i < 10; i++) {
      rateLimit('test-key-4')
    }
    expect(rateLimit('test-key-4').success).toBe(false)

    jest.advanceTimersByTime(61_000)

    expect(rateLimit('test-key-4').success).toBe(true)
  })

  it('tracks different keys independently', () => {
    for (let i = 0; i < 10; i++) {
      rateLimit('user-a')
    }
    expect(rateLimit('user-a').success).toBe(false)
    expect(rateLimit('user-b').success).toBe(true)
  })

  it('handles rapid sequential calls correctly', () => {
    const results: boolean[] = []
    for (let i = 0; i < 15; i++) {
      results.push(rateLimit('rapid-key').success)
    }
    expect(results.filter(Boolean).length).toBe(10)
    expect(results.filter((r) => !r).length).toBe(5)
  })

  it('allows requests again after window resets mid-burst', () => {
    for (let i = 0; i < 10; i++) {
      rateLimit('burst-key')
    }
    expect(rateLimit('burst-key').success).toBe(false)

    jest.advanceTimersByTime(61_000)

    for (let i = 0; i < 5; i++) {
      expect(rateLimit('burst-key').success).toBe(true)
    }
  })
})
