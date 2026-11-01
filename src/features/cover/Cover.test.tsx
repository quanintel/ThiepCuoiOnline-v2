import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Cover } from './Cover'

describe('Cover Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('hiển thị đầy đủ tên, ngày, lời mời và nút Mở thiệp khi chưa mở', () => {
    render(<Cover isOpen={false} onOpen={vi.fn()} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Anh Quân & Mai Hương')
    expect(screen.getByText(/24 · 11 · 2026/)).toBeInTheDocument()
    expect(screen.getByText('Thân mời bạn')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mở thiệp' })).toBeInTheDocument()
  })

  it('bấm nút gọi hàm onOpen', () => {
    const onOpen = vi.fn()
    render(<Cover isOpen={false} onOpen={onOpen} />)

    const openBtn = screen.getByRole('button', { name: 'Mở thiệp' })
    fireEvent.click(openBtn)

    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('sau khi isOpen thì gỡ khỏi cây DOM sau hiệu ứng mờ dần', () => {
    const { rerender } = render(<Cover isOpen={false} onOpen={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Mở thiệp' })).toBeInTheDocument()

    // Chuyển sang isOpen = true
    rerender(<Cover isOpen={true} onOpen={vi.fn()} />)

    // Lúc này đang fading nhưng vẫn còn trong DOM
    expect(screen.queryByRole('button', { name: 'Mở thiệp' })).toBeInTheDocument()

    // Sau 400ms hiệu ứng hoàn tất, unmount khỏi DOM
    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(screen.queryByRole('button', { name: 'Mở thiệp' })).not.toBeInTheDocument()
  })

  it('khi đã isOpen từ đầu thì không hiển thị trong tài liệu', () => {
    render(<Cover isOpen={true} onOpen={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Mở thiệp' })).not.toBeInTheDocument()
  })
})
