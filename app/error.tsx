'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">500</h1>
      <h2 className="text-2xl font-semibold mb-2 text-slate-100/60">
        Something went wrong
      </h2>
      <p className="text-slate-100/40 mb-8 max-w-md">
        An unexpected error occurred. Please try again or return home.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg border border-border text-white font-medium hover:bg-white/5 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
