import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Send a verification email to the user
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: 'quizzly@lachsfilet.tech',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  })

  resend.contacts.create({
    email: email,
    audience_id: 'ed288a7a-23ef-4f32-a2f1-3dc887da7a1c'
  })
}
// Send password reset token to user
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: 'quizzly@lachsfilet.tech',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  })
}
