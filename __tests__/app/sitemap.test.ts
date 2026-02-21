import sitemap from '@/app/sitemap'

describe('sitemap', () => {
  it('returns an array of sitemap entries', () => {
    const result = sitemap()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('includes the home page', () => {
    const result = sitemap()
    const homeEntry = result.find((entry) =>
      entry.url === 'https://quizzly.lachsfilet.tech'
    )
    expect(homeEntry).toBeDefined()
    expect(homeEntry?.priority).toBe(1)
  })

  it('includes the discover page', () => {
    const result = sitemap()
    const discoverEntry = result.find((entry) =>
      entry.url === 'https://quizzly.lachsfilet.tech/discover'
    )
    expect(discoverEntry).toBeDefined()
    expect(discoverEntry?.priority).toBe(0.9)
  })

  it('includes auth pages', () => {
    const result = sitemap()
    const loginEntry = result.find((entry) =>
      entry.url.includes('/auth/login')
    )
    const registerEntry = result.find((entry) =>
      entry.url.includes('/auth/register')
    )
    expect(loginEntry).toBeDefined()
    expect(registerEntry).toBeDefined()
  })

  it('all entries have lastModified dates', () => {
    const result = sitemap()
    result.forEach((entry) => {
      expect(entry.lastModified).toBeInstanceOf(Date)
    })
  })

  it('all entries have valid URLs', () => {
    const result = sitemap()
    result.forEach((entry) => {
      expect(entry.url).toMatch(/^https:\/\//)
    })
  })

  it('all entries have valid priority values', () => {
    const result = sitemap()
    result.forEach((entry) => {
      expect(entry.priority).toBeGreaterThanOrEqual(0)
      expect(entry.priority).toBeLessThanOrEqual(1)
    })
  })
})
