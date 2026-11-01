import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { AlbumPhoto } from '@/types'
import { Album } from './Album'

const mockPhotos: AlbumPhoto[] = [
  { src: '/images/album/photo-1.svg', alt: 'Khoảnh khắc ngọt ngào 1', width: 800, height: 600 },
  { src: '/images/album/photo-2.svg', alt: 'Ngày chung đôi 2', width: 800, height: 600 },
  { src: '/images/album/photo-3.svg', alt: 'Hạnh phúc bình yên 3', width: 800, height: 600 },
]

describe('Album Component', () => {
  it('hiển thị đúng số lượng ảnh trong slide', () => {
    render(<Album photos={mockPhotos} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(mockPhotos.length)
  })

  it('mỗi ảnh đều có thuộc tính alt và loading="lazy"', () => {
    render(<Album photos={mockPhotos} />)

    mockPhotos.forEach((photo) => {
      const img = screen.getByAltText(photo.alt)
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('loading', 'lazy')
    })
  })

  it('bấm vào ảnh sẽ mở Lightbox ở đúng chỉ số tương ứng', async () => {
    render(<Album photos={mockPhotos} />)

    // Bấm vào ảnh thứ 2 (index 1)
    const secondPhotoBtn = screen.getByRole('button', {
      name: `Xem ảnh lớn: ${mockPhotos[1].alt}`,
    })
    fireEvent.click(secondPhotoBtn)

    // Chờ lazy lightbox hiển thị
    const dialog = await screen.findByRole('dialog', { name: 'Xem ảnh phóng to' })
    expect(dialog).toBeInTheDocument()

    // Chỉ số hiển thị đúng ảnh số 2: "2 / 3"
    const counter = await screen.findByTestId('lightbox-counter')
    expect(counter).toHaveTextContent('2 / 3')
  })

  it('nếu danh sách ảnh rỗng thì không hiển thị gì (return null)', () => {
    const { container } = render(<Album photos={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
