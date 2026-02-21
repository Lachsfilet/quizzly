jest.mock('@/data/password-reset-token', () => ({
  getPasswordResetTokenByToken: jest.fn()
}))

jest.mock('@/data/user', () => ({
  getUserByEmail: jest.fn()
}))

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      update: jest.fn()
    },
    passwordResetToken: {
      delete: jest.fn()
    }
  }
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('new-hashed-password')
}))

import { newPassword } from '@/actions/auth/new-password'
import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'

const mockGetTokenByToken = getPasswordResetTokenByToken as jest.Mock
const mockGetUserByEmail = getUserByEmail as jest.Mock
const mockDb = db as jest.Mocked<typeof db>

describe('newPassword action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns error when no token provided', async () => {
    const result = await newPassword({ password: 'newpassword1' })
    expect(result).toEqual({ error: 'Token is required' })
  })

  it('returns error when token is null', async () => {
    const result = await newPassword({ password: 'newpassword1' }, null)
    expect(result).toEqual({ error: 'Token is required' })
  })

  it('returns error for invalid password', async () => {
    const result = await newPassword({ password: 'short' }, 'valid-token')
    expect(result).toEqual({ error: 'Invalid Fields' })
  })

  it('returns error when token not found in DB', async () => {
    mockGetTokenByToken.mockResolvedValue(null)

    const result = await newPassword({ password: 'newpassword1' }, 'invalid-token')
    expect(result).toEqual({ error: 'Invalid Token' })
  })

  it('returns error when token has expired', async () => {
    mockGetTokenByToken.mockResolvedValue({
      id: 'token-id',
      email: 'user@example.com',
      token: 'expired-token',
      expires: new Date(Date.now() - 10000) // expired 10s ago
    })

    const result = await newPassword({ password: 'newpassword1' }, 'expired-token')
    expect(result).toEqual({ error: 'Token has expired' })
  })

  it('returns error when user not found', async () => {
    mockGetTokenByToken.mockResolvedValue({
      id: 'token-id',
      email: 'ghost@example.com',
      token: 'valid-token',
      expires: new Date(Date.now() + 3600000)
    })
    mockGetUserByEmail.mockResolvedValue(null)

    const result = await newPassword({ password: 'newpassword1' }, 'valid-token')
    expect(result).toEqual({ error: 'Email not found' })
  })

  it('updates password and deletes token on success', async () => {
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

    const result = await newPassword({ password: 'newpassword1' }, 'valid-token')

    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      data: { password: 'new-hashed-password' }
    })
    expect(mockDb.passwordResetToken.delete).toHaveBeenCalledWith({
      where: { id: 'token-id' }
    })
    expect(result).toEqual({ success: 'Password updated successfully' })
  })
})
