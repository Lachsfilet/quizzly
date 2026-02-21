jest.mock('@/data/user', () => ({
  getUserByEmail: jest.fn()
}))

jest.mock('@/lib/tokens', () => ({
  generateVerificationToken: jest.fn()
}))

jest.mock('@/lib/mail', () => ({
  sendVerificationEmail: jest.fn()
}))

jest.mock('@/auth', () => ({
  signIn: jest.fn()
}))

class MockAuthError extends Error {
  type: string
  constructor(type = 'UnknownError') {
    super(type)
    this.type = type
    this.name = 'AuthError'
  }
}

jest.mock('next-auth', () => ({
  AuthError: MockAuthError
}))

import { login } from '@/actions/auth/login'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import { signIn } from '@/auth'

const mockGetUserByEmail = getUserByEmail as jest.Mock
const mockGenerateVerificationToken = generateVerificationToken as jest.Mock
const mockSendVerificationEmail = sendVerificationEmail as jest.Mock
const mockSignIn = signIn as jest.Mock

describe('login action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns error for invalid fields', async () => {
    const result = await login({ email: 'bad', password: '' })
    expect(result).toEqual({ error: 'Invalid fields' })
  })

  it('returns error when email does not exist', async () => {
    mockGetUserByEmail.mockResolvedValue(null)

    const result = await login({ email: 'nope@example.com', password: 'password123' })
    expect(result).toEqual({ error: 'Email does not exisit' })
  })

  it('returns error when user has no password (OAuth user)', async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      password: null,
      emailVerified: new Date()
    })

    const result = await login({ email: 'user@example.com', password: 'password123' })
    expect(result).toEqual({ error: 'Email does not exisit' })
  })

  it('sends verification email when user email not verified', async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      password: 'hashed',
      emailVerified: null
    })
    mockGenerateVerificationToken.mockResolvedValue({
      email: 'user@example.com',
      token: 'verify-token'
    })

    const result = await login({ email: 'user@example.com', password: 'password123' })

    expect(mockGenerateVerificationToken).toHaveBeenCalledWith('user@example.com')
    expect(mockSendVerificationEmail).toHaveBeenCalledWith('user@example.com', 'verify-token')
    expect(result).toEqual({ success: 'Confirmation email sent!' })
  })

  it('calls signIn for verified user', async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      password: 'hashed',
      emailVerified: new Date()
    })
    mockSignIn.mockResolvedValue(undefined)

    await login({ email: 'user@example.com', password: 'password123' })

    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'user@example.com',
      password: 'password123',
      redirectTo: '/discover'
    })
  })

  it('returns error on CredentialsSignin', async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      password: 'hashed',
      emailVerified: new Date()
    })
    const authError = new MockAuthError('CredentialsSignin')
    mockSignIn.mockRejectedValue(authError)

    const result = await login({ email: 'user@example.com', password: 'wrongpass1' })
    expect(result).toEqual({ error: 'Invalid credentials' })
  })

  it('returns generic error on other AuthError types', async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      password: 'hashed',
      emailVerified: new Date()
    })
    const authError = new MockAuthError('OAuthSignInError')
    mockSignIn.mockRejectedValue(authError)

    const result = await login({ email: 'user@example.com', password: 'password123' })
    expect(result).toEqual({ error: 'Something went wrong' })
  })

  it('re-throws non-AuthError errors', async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      password: 'hashed',
      emailVerified: new Date()
    })
    mockSignIn.mockRejectedValue(new Error('NEXT_REDIRECT'))

    await expect(
      login({ email: 'user@example.com', password: 'password123' })
    ).rejects.toThrow('NEXT_REDIRECT')
  })
})
