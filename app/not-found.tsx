import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2 text-slate-100/60">
        Page Not Found
      </h2>
      <p className="text-slate-100/40 mb-8 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition"
      >
        Return Home
      </Link>
    </div>
  )
}
