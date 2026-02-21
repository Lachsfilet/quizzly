jest.mock('@/data/verification-token', () => ({
  getVerificationTokenByToken: jest.fn()
}))

jest.mock('@/data/user', () => ({
  getUserByEmail: jest.fn()
}))

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      update: jest.fn()
    },
    verificationToken: {
      delete: jest.fn()
    }
  }
}))

import { newVerification } from '@/actions/auth/new-verification'
import { getVerificationTokenByToken } from '@/data/verification-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'

const mockGetTokenByToken = getVerificationTokenByToken as jest.Mock
const mockGetUserByEmail = getUserByEmail as jest.Mock
const mockDb = db as jest.Mocked<typeof db>

describe('newVerification action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns error when token does not exist', async () => {
    mockGetTokenByToken.mockResolvedValue(null)

    const result = await newVerification('bad-token')
    expect(result).toEqual({ error: 'Token does not exisit 😣' })
  })

  it('returns error when token has expired', async () => {
    mockGetTokenByToken.mockResolvedValue({
      id: 'token-id',
      email: 'user@example.com',
      token: 'expired-token',
      expires: new Date(Date.now() - 10000) // expired
    })

    const result = await newVerification('expired-token')
    expect(result).toEqual({ error: 'Token has expired 😣' })
  })

  it('returns error when user does not exist', async () => {
    mockGetTokenByToken.mockResolvedValue({
      id: 'token-id',
      email: 'ghost@example.com',
      token: 'valid-token',
      expires: new Date(Date.now() + 3600000)
    })
    mockGetUserByEmail.mockResolvedValue(null)

    const result = await newVerification('valid-token')
    expect(result).toEqual({ error: 'User does not exisit 😬' })
  })

  it('verifies email and deletes token on success', async () => {
    mockGetTokenByToken.mockResolvedValue({
      id: 'token-id',
      email: 'user@example.com',
      token: 'valid-token',
      expires: new Date(Date.now() + 3600000)
    })
    mockGetUserByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com'
    })

    const result = await newVerification('valid-token')

    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      data: {
        emailVerified: expect.any(Date),
        email: 'user@example.com'
      }
    })
    expect(mockDb.verificationToken.delete).toHaveBeenCalledWith({
      where: { id: 'token-id' }
    })
    expect(result).toEqual({ success: 'Email verified 🎉. Go to login to continue' })
  })

  it('handles valid non-expired token correctly', async () => {
    const futureDate = new Date(Date.now() + 3600000)
    mockGetTokenByToken.mockResolvedValue({
      id: 'token-id',
      email: 'user@example.com',
      token: 'fresh-token',
      expires: futureDate
    })
    mockGetUserByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com'
    })

    const result = await newVerification('fresh-token')
    expect(result?.success).toBeDefined()
  })
})
