const mockSend = jest.fn()
const mockContactsCreate = jest.fn()

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
    contacts: { create: mockContactsCreate }
  }))
}))

import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/mail'

describe('sendVerificationEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_APP_URL = 'https://quizzly.example.com'
    process.env.RESEND_EMAIL_DOMAIN = 'example.com'
    process.env.RESEND_API_KEY = 'test-key'
    delete process.env.RESEND_AUDIENCE_ID
  })

  it('sends email with correct recipient and subject', async () => {
    mockSend.mockResolvedValue({ id: 'email-id' })

    await sendVerificationEmail('user@test.com', 'abc123')

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@test.com',
        subject: 'Confirm your email'
      })
    )
  })

  it('builds the correct confirmation link using token', async () => {
    mockSend.mockResolvedValue({ id: 'email-id' })

    await sendVerificationEmail('user@test.com', 'my-token-123')

    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain(
      'https://quizzly.example.com/auth/new-verification?token=my-token-123'
    )
  })

  it('sends from the correct domain', async () => {
    mockSend.mockResolvedValue({ id: 'email-id' })

    await sendVerificationEmail('user@test.com', 'token')

    const call = mockSend.mock.calls[0][0]
    expect(call.from).toBe('quizzly@example.com')
  })

  it('does not add contact when RESEND_AUDIENCE_ID is not set', async () => {
    mockSend.mockResolvedValue({ id: 'email-id' })

    await sendVerificationEmail('user@test.com', 'token')

    expect(mockContactsCreate).not.toHaveBeenCalled()
  })

  it('adds contact when RESEND_AUDIENCE_ID is set', async () => {
    process.env.RESEND_AUDIENCE_ID = 'audience-123'
    mockSend.mockResolvedValue({ id: 'email-id' })

    await sendVerificationEmail('user@test.com', 'token')

    expect(mockContactsCreate).toHaveBeenCalledWith({
      email: 'user@test.com',
      audience_id: 'audience-123'
    })
  })
})

describe('sendPasswordResetEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_APP_URL = 'https://quizzly.example.com'
    process.env.RESEND_EMAIL_DOMAIN = 'example.com'
    process.env.RESEND_API_KEY = 'test-key'
  })

  it('sends email with correct recipient and subject', async () => {
    mockSend.mockResolvedValue({ id: 'email-id' })

    await sendPasswordResetEmail('user@test.com', 'reset-token')

    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@test.com',
        subject: 'Reset your password'
      })
    )
  })

  it('builds the correct reset link using token', async () => {
    mockSend.mockResolvedValue({ id: 'email-id' })

    await sendPasswordResetEmail('user@test.com', 'reset-xyz')

    const call = mockSend.mock.calls[0][0]
    expect(call.html).toContain(
      'https://quizzly.example.com/auth/new-password?token=reset-xyz'
    )
  })

  it('sends from the correct domain', async () => {
    mockSend.mockResolvedValue({ id: 'email-id' })

    await sendPasswordResetEmail('user@test.com', 'token')

    const call = mockSend.mock.calls[0][0]
    expect(call.from).toBe('quizzly@example.com')
  })
})
