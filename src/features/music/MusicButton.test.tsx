import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MusicButton } from './MusicButton'

describe('MusicButton Component', () => {
  it('hiển thị nhãn "Bật nhạc" và aria-pressed="false" khi chưa phát', () => {
    render(<MusicButton playing={false} available={true} onToggle={vi.fn()} />)

    const button = screen.getByRole('button', { name: 'Bật nhạc' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('hiển thị nhãn "Tắt nhạc" và aria-pressed="true" khi đang phát', () => {
    render(<MusicButton playing={true} available={true} onToggle={vi.fn()} />)

    const button = screen.getByRole('button', { name: 'Tắt nhạc' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('bấm vào nút gọi onToggle', () => {
    const onToggle = vi.fn()
    render(<MusicButton playing={false} available={true} onToggle={onToggle} />)

    const button = screen.getByRole('button', { name: 'Bật nhạc' })
    fireEvent.click(button)

    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('nếu available = false thì không render nút', () => {
    const { container } = render(
      <MusicButton playing={false} available={false} onToggle={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })
})
