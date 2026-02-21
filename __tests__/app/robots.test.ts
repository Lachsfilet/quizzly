import robot from '@/app/robot'

describe('robots.txt configuration', () => {
  it('returns a valid robots config', () => {
    const result = robot()
    expect(result).toBeDefined()
  })

  it('has rules defined', () => {
    const result = robot()
    expect(result.rules).toBeDefined()
  })

  it('allows all user agents', () => {
    const result = robot()
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules
    expect(rules.userAgent).toBe('*')
  })

  it('allows root path', () => {
    const result = robot()
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules
    expect(rules.allow).toContain('/')
  })

  it('has a sitemap URL with https protocol', () => {
    const result = robot()
    expect(result.sitemap).toMatch(/^https:\/\//)
  })

  it('sitemap points to correct domain', () => {
    const result = robot()
    expect(result.sitemap).toContain('quizzly.lachsfilet.tech')
  })

  it('sitemap ends with /sitemap.xml', () => {
    const result = robot()
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/)
  })
})
