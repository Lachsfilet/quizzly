import { RegisterForm } from '@/components/auth/Register-Form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register',
  description:
    'Create a free Quizzly account to start making and sharing quizzes.'
}

function RegisterPage() {
  return <RegisterForm />
}

export default RegisterPage
