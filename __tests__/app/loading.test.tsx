import React from 'react'
import { render } from '@testing-library/react'
import Loading from '@/app/loading'

describe('Loading component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loading />)
    expect(container).toBeTruthy()
  })

  it('renders a spinner element', () => {
    const { container } = render(<Loading />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('centers the spinner', () => {
    const { container } = render(<Loading />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('flex')
    expect(wrapper.className).toContain('justify-center')
    expect(wrapper.className).toContain('items-center')
  })
})
