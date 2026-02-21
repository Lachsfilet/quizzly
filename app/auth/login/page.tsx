import { LoginForm } from '@/components/auth/Login-Form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Quizzly account to create and take quizzes.'
}

function LoginPage() {
  return (
    <div>
      <LoginForm/>
    </div>
  )
}

export default LoginPage