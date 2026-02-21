jest.mock('@/data/user', () => ({
  getUserByEmail: jest.fn()
}))

jest.mock('@/lib/tokens', () => ({
  generatePasswordResetToken: jest.fn()
}))

jest.mock('@/lib/mail', () => ({
  sendPasswordResetEmail: jest.fn()
}))

import { reset } from '@/actions/auth/reset'
import { getUserByEmail } from '@/data/user'
import { generatePasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/mail'

const mockGetUserByEmail = getUserByEmail as jest.Mock
const mockGeneratePasswordResetToken = generatePasswordResetToken as jest.Mock
const mockSendPasswordResetEmail = sendPasswordResetEmail as jest.Mock

describe('reset action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns error for invalid email', async () => {
    const result = await reset({ email: 'not-valid' })
    expect(result).toEqual({ error: 'Invalid email!' })
  })

  it('returns error for empty email', async () => {
    const result = await reset({ email: '' })
    expect(result).toEqual({ error: 'Invalid email!' })
  })

  it('returns error when email does not exist', async () => {
    mockGetUserByEmail.mockResolvedValue(null)

    const result = await reset({ email: 'nobody@example.com' })
    expect(result).toEqual({ error: 'Email does not exist!' })
  })

  it('sends reset email on success', async () => {
    mockGetUserByEmail.mockResolvedValue({ id: '1', email: 'user@example.com' })
    mockGeneratePasswordResetToken.mockResolvedValue({
      email: 'user@example.com',
      token: 'reset-token-123'
    })

    const result = await reset({ email: 'user@example.com' })

    expect(mockGeneratePasswordResetToken).toHaveBeenCalledWith('user@example.com')
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('user@example.com', 'reset-token-123')
    expect(result).toEqual({ success: 'Reset email sent 📫' })
  })
})
