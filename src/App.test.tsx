import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'

describe('App Integration', () => {
  beforeEach(() => {
    class MockAudio {
      play = vi.fn().mockResolvedValue(undefined)
      pause = vi.fn()
      addEventListener = vi.fn()
      removeEventListener = vi.fn()
      loop = false
      preload = ''
      src = ''
    }
    vi.stubGlobal('Audio', MockAudio)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('hiển thị tiếng Việt trên khung thiệp', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Anh Quân & Mai Hương')
  })

  it('nút nhạc nổi chỉ hiển thị sau khi đã bấm Mở thiệp', () => {
    render(<App />)

    // Trước khi mở thiệp: chưa có MusicButton
    expect(screen.queryByRole('button', { name: /Bật nhạc|Tắt nhạc/ })).not.toBeInTheDocument()

    // Bấm Mở thiệp
    const openBtn = screen.getByRole('button', { name: 'Mở thiệp' })
    fireEvent.click(openBtn)

    // Sau khi mở: MusicButton xuất hiện
    expect(screen.getByRole('button', { name: /Bật nhạc|Tắt nhạc/ })).toBeInTheDocument()
  })

  it('chứa section hộp quà mừng cưới (#gift)', () => {
    render(<App />)
    expect(screen.getByText('Hộp quà mừng cưới')).toBeInTheDocument()
  })
})
