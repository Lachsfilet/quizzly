const nextConfig = require('@/next.config.js')

describe('next.config.js', () => {
  it('exports a config object', () => {
    expect(nextConfig).toBeDefined()
    expect(typeof nextConfig).toBe('object')
  })

  describe('security headers', () => {
    let headers: Array<{ key: string; value: string }>

    beforeAll(async () => {
      const headerConfig = await nextConfig.headers()
      headers = headerConfig[0].headers
    })

    it('defines headers function', () => {
      expect(typeof nextConfig.headers).toBe('function')
    })

    it('applies headers to all routes', async () => {
      const headerConfig = await nextConfig.headers()
      expect(headerConfig[0].source).toBe('/(.*)')
    })

    it('sets X-Frame-Options to DENY', () => {
      const header = headers.find(
        (h: { key: string }) => h.key === 'X-Frame-Options'
      )
      expect(header).toBeDefined()
      expect(header?.value).toBe('DENY')
    })

    it('sets X-Content-Type-Options to nosniff', () => {
      const header = headers.find(
        (h: { key: string }) => h.key === 'X-Content-Type-Options'
      )
      expect(header).toBeDefined()
      expect(header?.value).toBe('nosniff')
    })

    it('sets Referrer-Policy', () => {
      const header = headers.find(
        (h: { key: string }) => h.key === 'Referrer-Policy'
      )
      expect(header).toBeDefined()
      expect(header?.value).toBe('strict-origin-when-cross-origin')
    })

    it('sets Permissions-Policy', () => {
      const header = headers.find(
        (h: { key: string }) => h.key === 'Permissions-Policy'
      )
      expect(header).toBeDefined()
      expect(header?.value).toContain('camera=()')
      expect(header?.value).toContain('microphone=()')
      expect(header?.value).toContain('geolocation=()')
    })

    it('sets Strict-Transport-Security (HSTS)', () => {
      const header = headers.find(
        (h: { key: string }) => h.key === 'Strict-Transport-Security'
      )
      expect(header).toBeDefined()
      expect(header?.value).toContain('max-age=')
      expect(header?.value).toContain('includeSubDomains')
      expect(header?.value).toContain('preload')
    })

    it('has at least 5 security headers', () => {
      expect(headers.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('image configuration', () => {
    it('has remote patterns configured', () => {
      expect(nextConfig.images).toBeDefined()
      expect(nextConfig.images.remotePatterns).toBeDefined()
      expect(nextConfig.images.remotePatterns.length).toBeGreaterThan(0)
    })

    it('allows utfs.io hostname', () => {
      const hasUtfs = nextConfig.images.remotePatterns.some(
        (p: { hostname: string }) => p.hostname === 'utfs.io'
      )
      expect(hasUtfs).toBe(true)
    })
  })
})
