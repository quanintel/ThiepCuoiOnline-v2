import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { AlbumPhoto } from '@/types'
import { Lightbox } from './Lightbox'

const mockPhotos: AlbumPhoto[] = [
  { src: '/images/album/photo-1.svg', alt: 'Ảnh cưới số 1', width: 800, height: 600 },
  { src: '/images/album/photo-2.svg', alt: 'Ảnh cưới số 2', width: 800, height: 600 },
  { src: '/images/album/photo-3.svg', alt: 'Ảnh cưới số 3', width: 800, height: 600 },
]

describe('Lightbox Component', () => {
  it('hiển thị đúng chỉ số ban đầu và ảnh lớn', () => {
    render(<Lightbox photos={mockPhotos} index={0} onClose={vi.fn()} />)

    expect(screen.getByTestId('lightbox-counter')).toHaveTextContent('1 / 3')
    expect(screen.getByAltText('Ảnh cưới số 1')).toBeInTheDocument()
  })

  it('nhấn nút Sau (→) ở ảnh cuối quay về ảnh đầu tiên (loop)', () => {
    render(<Lightbox photos={mockPhotos} index={2} onClose={vi.fn()} />)

    expect(screen.getByTestId('lightbox-counter')).toHaveTextContent('3 / 3')

    const nextBtn = screen.getByRole('button', { name: 'Ảnh sau' })
    fireEvent.click(nextBtn)

    // Quay về ảnh đầu tiên (chỉ số 1 / 3)
    expect(screen.getByTestId('lightbox-counter')).toHaveTextContent('1 / 3')
    expect(screen.getByAltText('Ảnh cưới số 1')).toBeInTheDocument()
  })

  it('nhấn nút Trước (←) ở ảnh đầu tiên quay về ảnh cuối cùng (loop)', () => {
    render(<Lightbox photos={mockPhotos} index={0} onClose={vi.fn()} />)

    expect(screen.getByTestId('lightbox-counter')).toHaveTextContent('1 / 3')

    const prevBtn = screen.getByRole('button', { name: 'Ảnh trước' })
    fireEvent.click(prevBtn)

    expect(screen.getByTestId('lightbox-counter')).toHaveTextContent('3 / 3')
    expect(screen.getByAltText('Ảnh cưới số 3')).toBeInTheDocument()
  })

  it('phím Esc gọi hàm onClose', () => {
    const onClose = vi.fn()
    render(<Lightbox photos={mockPhotos} index={0} onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('phím ArrowRight và ArrowLeft chuyển ảnh tiếp theo và trước đó', () => {
    render(<Lightbox photos={mockPhotos} index={0} onClose={vi.fn()} />)

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByTestId('lightbox-counter')).toHaveTextContent('2 / 3')

    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByTestId('lightbox-counter')).toHaveTextContent('1 / 3')
  })

  it('bấm nút Đóng gọi hàm onClose', () => {
    const onClose = vi.fn()
    render(<Lightbox photos={mockPhotos} index={0} onClose={onClose} />)

    const closeBtn = screen.getByRole('button', { name: 'Đóng' })
    fireEvent.click(closeBtn)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('khi ảnh bị lỗi tải, hiển thị khung dự phòng (fallback)', () => {
    render(<Lightbox photos={mockPhotos} index={0} onClose={vi.fn()} />)

    const img = screen.getByAltText('Ảnh cưới số 1')
    fireEvent.error(img)

    expect(screen.getByTestId('lightbox-fallback')).toBeInTheDocument()
    expect(screen.getByText('Không thể tải được hình ảnh này')).toBeInTheDocument()
  })
})
