jest.mock('@/data/user', () => ({
  getUserByEmail: jest.fn()
}))

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      create: jest.fn()
    }
  }
}))

jest.mock('@/lib/tokens', () => ({
  generateVerificationToken: jest.fn()
}))

jest.mock('@/lib/mail', () => ({
  sendVerificationEmail: jest.fn()
}))

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password')
}))

import { register } from '@/actions/auth/register'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

const mockGetUserByEmail = getUserByEmail as jest.Mock
const mockDb = db as jest.Mocked<typeof db>
const mockGenerateVerificationToken = generateVerificationToken as jest.Mock
const mockSendVerificationEmail = sendVerificationEmail as jest.Mock

describe('register action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns error for invalid fields', async () => {
    const result = await register({ email: 'bad', password: 'short', name: '' })
    expect(result).toEqual({ error: 'Invalid fields 😞' })
  })

  it('returns error when email is already taken', async () => {
    mockGetUserByEmail.mockResolvedValue({ id: '1', email: 'taken@example.com' })

    const result = await register({
      email: 'taken@example.com',
      password: 'password123',
      name: 'John'
    })
    expect(result).toEqual({ error: 'Email already taken 😞' })
  })

  it('creates user and sends verification email on success', async () => {
    mockGetUserByEmail.mockResolvedValue(null)
    ;(mockDb.user.create as jest.Mock).mockResolvedValue({ id: 'new-user' })
    mockGenerateVerificationToken.mockResolvedValue({
      email: 'new@example.com',
      token: 'verify-token'
    })

    const result = await register({
      email: 'new@example.com',
      password: 'password123',
      name: 'John Doe'
    })

    expect(mockDb.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'new@example.com',
        password: 'hashed-password'
      }
    })
    expect(mockGenerateVerificationToken).toHaveBeenCalledWith('new@example.com')
    expect(mockSendVerificationEmail).toHaveBeenCalledWith('new@example.com', 'verify-token')
    expect(result).toEqual({ success: 'Confirmation email sent!' })
  })

  it('rejects password shorter than 8 characters', async () => {
    const result = await register({
      email: 'user@example.com',
      password: 'short',
      name: 'Test'
    })
    expect(result).toEqual({ error: 'Invalid fields 😞' })
  })

  it('rejects password with spaces', async () => {
    const result = await register({
      email: 'user@example.com',
      password: 'pass word 123',
      name: 'Test'
    })
    expect(result).toEqual({ error: 'Invalid fields 😞' })
  })

  it('rejects invalid email format', async () => {
    const result = await register({
      email: 'not-an-email',
      password: 'password123',
      name: 'Test'
    })
    expect(result).toEqual({ error: 'Invalid fields 😞' })
  })
})
