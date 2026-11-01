import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Closing } from './Closing'

describe('Closing Component', () => {
  it('hiển thị câu kết và footer', () => {
    render(<Closing />)

    expect(
      screen.getByText(/Sự hiện diện của bạn là niềm vinh hạnh của gia đình chúng tôi!/)
    ).toBeInTheDocument()
    expect(screen.getByText('Anh Quân & Mai Hương · 24.11.2026')).toBeInTheDocument()
  })

  it('không có chữ "Chia sẻ" và không có "thông tin cần biết"', () => {
    const { container } = render(<Closing />)
    expect(container.textContent).not.toContain('Chia sẻ')
    expect(container.textContent).not.toContain('thông tin cần biết')
  })
})
