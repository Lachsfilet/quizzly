import { LoginSchema, RegisterSchema, ResetSchema, NewPasswordSchema } from '@/schemas'

describe('LoginSchema', () => {
  it('accepts valid email and password', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123'
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = LoginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: ''
    })
    expect(result.success).toBe(false)
  })

  it('rejects password with spaces', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: 'pass word'
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing email', () => {
    const result = LoginSchema.safeParse({
      password: 'password123'
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing password', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty object', () => {
    const result = LoginSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('RegisterSchema', () => {
  it('accepts valid registration data', () => {
    const result = RegisterSchema.safeParse({
      email: 'user@example.com',
      password: 'securepassword',
      name: 'John Doe'
    })
    expect(result.success).toBe(true)
  })

  it('rejects password shorter than 8 characters', () => {
    const result = RegisterSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
      name: 'John Doe'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Minimum 8 characters')
    }
  })

  it('rejects password with spaces', () => {
    const result = RegisterSchema.safeParse({
      email: 'user@example.com',
      password: 'pass word 123',
      name: 'John Doe'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = RegisterSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      name: ''
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = RegisterSchema.safeParse({
      email: 'invalid',
      password: 'password123',
      name: 'John'
    })
    expect(result.success).toBe(false)
  })

  it('accepts password with exactly 8 characters', () => {
    const result = RegisterSchema.safeParse({
      email: 'user@example.com',
      password: '12345678',
      name: 'John'
    })
    expect(result.success).toBe(true)
  })

  it('accepts long password', () => {
    const result = RegisterSchema.safeParse({
      email: 'user@example.com',
      password: 'a'.repeat(100),
      name: 'John'
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing fields', () => {
    expect(RegisterSchema.safeParse({}).success).toBe(false)
    expect(
      RegisterSchema.safeParse({ email: 'a@b.com' }).success
    ).toBe(false)
    expect(
      RegisterSchema.safeParse({ email: 'a@b.com', password: '12345678' })
        .success
    ).toBe(false)
  })
})

describe('ResetSchema', () => {
  it('accepts valid email', () => {
    const result = ResetSchema.safeParse({
      email: 'user@example.com'
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = ResetSchema.safeParse({
      email: 'not-valid'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty email', () => {
    const result = ResetSchema.safeParse({
      email: ''
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email is required')
    }
  })

  it('rejects missing email', () => {
    const result = ResetSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('NewPasswordSchema', () => {
  it('accepts valid password', () => {
    const result = NewPasswordSchema.safeParse({
      password: 'newpassword123'
    })
    expect(result.success).toBe(true)
  })

  it('rejects password shorter than 8 characters', () => {
    const result = NewPasswordSchema.safeParse({
      password: 'short'
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Minimum 8 characters')
    }
  })

  it('rejects password with spaces', () => {
    const result = NewPasswordSchema.safeParse({
      password: 'new pass word'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = NewPasswordSchema.safeParse({
      password: ''
    })
    expect(result.success).toBe(false)
  })

  it('accepts exactly 8 character password', () => {
    const result = NewPasswordSchema.safeParse({
      password: 'abcdefgh'
    })
    expect(result.success).toBe(true)
  })
})
