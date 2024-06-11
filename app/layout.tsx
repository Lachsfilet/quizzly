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
import { ConfettiProvder } from '@/components/providers/confetti'
import CustomBackground from '@/components/designs/custom-bg'
const geist = GeistSans

export const metadata: Metadata = {
  metadataBase: new URL('https://quizzly.lachsfilet.tech'),
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
      <html lang="en" className="bg-background body-background overflow-hidden text-white">
        <body className={geist.className}>
          <CustomBackground />
          <Navbar />
          <Scroll />
          <ToastProvider />
          <ConfettiProvder />
          {/*<GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />*/}
          <div className="mt-5">{children}</div>
          <Analytics />
        </body>
      </html>
    </SessionProvider>
  )
}
