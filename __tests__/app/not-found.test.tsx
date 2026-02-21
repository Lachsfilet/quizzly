import React from 'react'
import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href
  }: {
    children: React.ReactNode
    href: string
  }) {
    return <a href={href}>{children}</a>
  }
})

describe('NotFound page', () => {
  it('renders 404 heading', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders page not found message', () => {
    render(<NotFound />)
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  it('renders descriptive text', () => {
    render(<NotFound />)
    expect(
      screen.getByText(/the page you are looking for does not exist/i)
    ).toBeInTheDocument()
  })

  it('renders a return home link', () => {
    render(<NotFound />)
    const link = screen.getByText('Return Home')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/')
  })
})
