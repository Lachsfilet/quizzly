import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { ToastProvider } from '@/components/providers/toaster-provider'
import Scroll from '@/components/Scroll'
import { GeistSans } from 'geist/font/sans'
import Navbar from '@/components/nav'
import { ConfettiProvder } from '@/components/providers/confetti'
import CustomBackground from '@/components/designs/custom-bg'
const geist = GeistSans

export const metadata: Metadata = {
  metadataBase: new URL('https://quizzly.lachsfilet.tech'),
  title: {
    default: 'Quizzly',
    template: `%s | Quizzly`
  },
  description: 'Learn something && have fun doing it.',
  openGraph: {
    title: 'Quizzly',
    description: 'Learn something && have fun doing it.',
    siteName: 'Quizzly',
    type: 'website'
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="en" className="bg-background body-background text-white">
        <body className={geist.className}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded"
          >
            Skip to main content
          </a>
          <CustomBackground />
          <Navbar />
          <Scroll />
          <ToastProvider />
          <ConfettiProvder />
          <main id="main-content" className="mt-5">{children}</main>
          <Analytics />
        </body>
      </html>
    </SessionProvider>
  )
}
