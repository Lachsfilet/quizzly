jest.mock('@/lib/db', () => ({
  db: {
    verificationToken: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    },
    passwordResetToken: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    }
  }
}))

jest.mock('@/data/verification-token', () => ({
  getVerificationTokenByEmail: jest.fn()
}))

jest.mock('@/data/password-reset-token', () => ({
  getPasswordResetTokenByEmail: jest.fn()
}))

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-token')
}))

import { generateVerificationToken, generatePasswordResetToken } from '@/lib/tokens'
import { db } from '@/lib/db'
import { getVerificationTokenByEmail } from '@/data/verification-token'
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token'

const mockDb = db as jest.Mocked<typeof db>
const mockGetVerificationTokenByEmail = getVerificationTokenByEmail as jest.Mock
const mockGetPasswordResetTokenByEmail = getPasswordResetTokenByEmail as jest.Mock

describe('generateVerificationToken', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a new verification token with correct email and expiry', async () => {
    mockGetVerificationTokenByEmail.mockResolvedValue(null)
    const mockToken = {
      id: 'token-id',
      email: 'user@example.com',
      token: 'mock-uuid-token',
      expires: expect.any(Date)
    }
    ;(mockDb.verificationToken.create as jest.Mock).mockResolvedValue(mockToken)

    const result = await generateVerificationToken('user@example.com')

    expect(mockDb.verificationToken.create).toHaveBeenCalledWith({
      data: {
        email: 'user@example.com',
        token: 'mock-uuid-token',
        expires: expect.any(Date)
      }
    })
    expect(result).toEqual(mockToken)
  })

  it('deletes existing token before creating a new one', async () => {
    const existingToken = { id: 'old-token-id', email: 'user@example.com', token: 'old-token', expires: new Date() }
    mockGetVerificationTokenByEmail.mockResolvedValue(existingToken)
    ;(mockDb.verificationToken.create as jest.Mock).mockResolvedValue({
      id: 'new-id',
      email: 'user@example.com',
      token: 'mock-uuid-token',
      expires: new Date()
    })

    await generateVerificationToken('user@example.com')

    expect(mockDb.verificationToken.delete).toHaveBeenCalledWith({
      where: { id: 'old-token-id' }
    })
    expect(mockDb.verificationToken.create).toHaveBeenCalled()
  })

  it('does not delete when no existing token', async () => {
    mockGetVerificationTokenByEmail.mockResolvedValue(null)
    ;(mockDb.verificationToken.create as jest.Mock).mockResolvedValue({
      id: 'new-id',
      email: 'user@example.com',
      token: 'mock-uuid-token',
      expires: new Date()
    })

    await generateVerificationToken('user@example.com')

    expect(mockDb.verificationToken.delete).not.toHaveBeenCalled()
  })

  it('sets expiry to approximately 1 hour in the future', async () => {
    mockGetVerificationTokenByEmail.mockResolvedValue(null)
    ;(mockDb.verificationToken.create as jest.Mock).mockImplementation(({ data }) => {
      return Promise.resolve({ id: 'id', ...data })
    })

    const before = Date.now()
    await generateVerificationToken('user@example.com')
    const after = Date.now()

    const createCall = (mockDb.verificationToken.create as jest.Mock).mock.calls[0][0]
    const expiry = createCall.data.expires.getTime()
    const oneHourMs = 3600 * 1000

    expect(expiry).toBeGreaterThanOrEqual(before + oneHourMs - 100)
    expect(expiry).toBeLessThanOrEqual(after + oneHourMs + 100)
  })
})

describe('generatePasswordResetToken', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a new password reset token with correct email', async () => {
    mockGetPasswordResetTokenByEmail.mockResolvedValue(null)
    const mockToken = {
      id: 'token-id',
      email: 'user@example.com',
      token: 'mock-uuid-token',
      expires: expect.any(Date)
    }
    ;(mockDb.passwordResetToken.create as jest.Mock).mockResolvedValue(mockToken)

    const result = await generatePasswordResetToken('user@example.com')

    expect(mockDb.passwordResetToken.create).toHaveBeenCalledWith({
      data: {
        email: 'user@example.com',
        token: 'mock-uuid-token',
        expires: expect.any(Date)
      }
    })
    expect(result).toEqual(mockToken)
  })

  it('deletes existing token before creating a new one', async () => {
    const existingToken = { id: 'old-id', email: 'user@example.com', token: 'old', expires: new Date() }
    mockGetPasswordResetTokenByEmail.mockResolvedValue(existingToken)
    ;(mockDb.passwordResetToken.create as jest.Mock).mockResolvedValue({
      id: 'new-id',
      email: 'user@example.com',
      token: 'mock-uuid-token',
      expires: new Date()
    })

    await generatePasswordResetToken('user@example.com')

    expect(mockDb.passwordResetToken.delete).toHaveBeenCalledWith({
      where: { id: 'old-id' }
    })
  })

  it('does not delete when no existing token', async () => {
    mockGetPasswordResetTokenByEmail.mockResolvedValue(null)
    ;(mockDb.passwordResetToken.create as jest.Mock).mockResolvedValue({
      id: 'new-id',
      email: 'user@example.com',
      token: 'mock-uuid-token',
      expires: new Date()
    })

    await generatePasswordResetToken('user@example.com')

    expect(mockDb.passwordResetToken.delete).not.toHaveBeenCalled()
  })

  it('sets expiry to approximately 1 hour in the future', async () => {
    mockGetPasswordResetTokenByEmail.mockResolvedValue(null)
    ;(mockDb.passwordResetToken.create as jest.Mock).mockImplementation(({ data }) => {
      return Promise.resolve({ id: 'id', ...data })
    })

    const before = Date.now()
    await generatePasswordResetToken('user@example.com')
    const after = Date.now()

    const createCall = (mockDb.passwordResetToken.create as jest.Mock).mock.calls[0][0]
    const expiry = createCall.data.expires.getTime()
    const oneHourMs = 3600 * 1000

    expect(expiry).toBeGreaterThanOrEqual(before + oneHourMs - 100)
    expect(expiry).toBeLessThanOrEqual(after + oneHourMs + 100)
  })
})
