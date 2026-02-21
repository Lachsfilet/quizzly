import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('foo', 'bar')
    expect(result).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible')
    expect(result).toBe('base visible')
  })

  it('handles empty inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles undefined values', () => {
    const result = cn('a', undefined, 'b')
    expect(result).toBe('a b')
  })

  it('handles null values', () => {
    const result = cn('a', null, 'b')
    expect(result).toBe('a b')
  })

  it('merges tailwind classes correctly (last wins)', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('merges conflicting tailwind classes', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })

  it('preserves non-conflicting tailwind classes', () => {
    const result = cn('px-2', 'py-4', 'mt-2')
    expect(result).toBe('px-2 py-4 mt-2')
  })

  it('handles array inputs', () => {
    const result = cn(['a', 'b'], 'c')
    expect(result).toBe('a b c')
  })
})
