'use client'
import { LandingPage } from '@/components/landing-page'

import { useCurrentUser } from '@/hooks/user-current-user'

export default function Home() {
  const session = useCurrentUser()

  return (
    <div>
      <LandingPage />
    </div>
  )
}
