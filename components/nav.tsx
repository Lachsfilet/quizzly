'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import UserButton from './user-button'
import { MobileSidebar } from '@/components/mobile-sidebar'

export default function Navbar() {
  const [hasScrolled, setHasScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 25
      setHasScrolled(window.pageYOffset > scrollThreshold)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navbarChange = hasScrolled
    ? 'backdrop-blur border-b border-slate-100/20 bg-background/90'
    : 'bg-transparent border-b border-transparent'

  return (
    <nav
      className={`fixed top-0 w-full z-50 ${navbarChange} transition select-none`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          <MobileSidebar />

          <Link href="/" className="flex items-center">
            <h1>
              <Image src="/logo.svg" alt="logo.svg" width={150} height={150} />
            </h1>
          </Link>

          <div className="hidden md:flex h-[40px] items-center text-lg md:text-lg font-medium mr-2 gap-4 navbar transition-all">
            <div className="flex items-center lg:gap-4 h-full text-base lg:text-lg font-medium">
              <Link
                href="/discover"
                className="flex items-center hover:bg-white/5 h-full transition duration-300 px-4 rounded-lg"
              >
                Discover Quizzes
              </Link>
              <Link
                href="/create"
                className="flex items-center hover:bg-white/5 h-full transition duration-300 px-4 rounded-lg"
              >
                Create Quizzes
              </Link>
              <Link
                href="/"
                className="flex items-center hover:bg-white/5 h-full transition duration-300 px-4 rounded-lg"
              >
                Your Quizzes
              </Link>
            </div>
            <div className="flex h-full gap-6 lg:gap-7">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
