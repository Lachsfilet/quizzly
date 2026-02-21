import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT
} from '@/routes'

describe('Routes configuration', () => {
  describe('publicRoutes', () => {
    it('includes the home page', () => {
      expect(publicRoutes).toContain('/')
    })

    it('includes the discover page', () => {
      expect(publicRoutes).toContain('/discover')
    })

    it('includes the email verification page', () => {
      expect(publicRoutes).toContain('/auth/new-verification')
    })

    it('includes quiz detail pattern', () => {
      expect(publicRoutes).toContain('/quiz/:quizId')
    })

    it('does not include settings', () => {
      expect(publicRoutes).not.toContain('/settings')
    })

    it('does not include auth login', () => {
      expect(publicRoutes).not.toContain('/auth/login')
    })
  })

  describe('authRoutes', () => {
    it('includes login page', () => {
      expect(authRoutes).toContain('/auth/login')
    })

    it('includes register page', () => {
      expect(authRoutes).toContain('/auth/register')
    })

    it('includes error page', () => {
      expect(authRoutes).toContain('/auth/error')
    })

    it('includes reset page', () => {
      expect(authRoutes).toContain('/auth/reset')
    })

    it('includes new-password page', () => {
      expect(authRoutes).toContain('/auth/new-password')
    })

    it('has exactly 5 auth routes', () => {
      expect(authRoutes).toHaveLength(5)
    })
  })

  describe('apiAuthPrefix', () => {
    it('is set to /api/auth', () => {
      expect(apiAuthPrefix).toBe('/api/auth')
    })
  })

  describe('DEFAULT_LOGIN_REDIRECT', () => {
    it('redirects to /discover', () => {
      expect(DEFAULT_LOGIN_REDIRECT).toBe('/discover')
    })
  })
})
