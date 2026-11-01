import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'

describe('Hero Component', () => {
  it('hiển thị đúng dòng chữ "sắp về chung một nhà"', () => {
    render(<Hero />)
    expect(screen.getByText('sắp về chung một nhà')).toBeInTheDocument()
  })

  it('tuyệt đối không chứa chữ "Chúng tôi"', () => {
    const { container } = render(<Hero />)
    expect(container.textContent).not.toContain('Chúng tôi')
  })
})
