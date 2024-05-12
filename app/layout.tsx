import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { ToastProvider } from '@/components/providers/toaster-provider'
import Scroll from '@/components/Scroll'
import { GeistSans } from 'geist/font/sans'
import Navbar from '@/components/nav'
import { Banner } from '@/components/banner'
const geist = GeistSans

export const metadata: Metadata = {
  metadataBase: new URL('https://nizzyabi.com'),
  title: {
    default: 'Quizzly',
    template: `%s | Quizzly`
  },
  openGraph: {
    description: 'Learn something && have fun doing it.'
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
      <html lang="en" className="bg-background text-white">
        <body className={geist.className}>
          <Navbar />
          <Banner label="Currently under Construction" />
          <Scroll />
          <ToastProvider />
          {/*<GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />*/}
          {children}
          <Analytics />
        </body>
      </html>
    </SessionProvider>
  )
}
