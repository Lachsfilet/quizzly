import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorPage from '@/app/error'

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

describe('Error page', () => {
  const mockReset = jest.fn()
  const testError = new globalThis.Error('Test error') as globalThis.Error & {
    digest?: string
  }

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockReset.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders 500 heading', () => {
    render(<ErrorPage error={testError} reset={mockReset} />)
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('renders something went wrong message', () => {
    render(<ErrorPage error={testError} reset={mockReset} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders try again button', () => {
    render(<ErrorPage error={testError} reset={mockReset} />)
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('renders return home link', () => {
    render(<ErrorPage error={testError} reset={mockReset} />)
    const link = screen.getByText('Return Home')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/')
  })

  it('calls reset when try again is clicked', () => {
    render(<ErrorPage error={testError} reset={mockReset} />)
    fireEvent.click(screen.getByText('Try Again'))
    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('logs the error to console', () => {
    render(<ErrorPage error={testError} reset={mockReset} />)
    expect(console.error).toHaveBeenCalledWith(testError)
  })
})
