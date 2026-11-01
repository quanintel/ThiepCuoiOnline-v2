import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Couple } from './Couple'

describe('Couple Component', () => {
  it('hiển thị đầy đủ tên Kiều Anh Quân, Tôn Mai Hương và hai vai trò', () => {
    render(<Couple />)

    expect(screen.getByText('Kiều Anh Quân')).toBeInTheDocument()
    expect(screen.getByText('Tôn Mai Hương')).toBeInTheDocument()
    expect(screen.getByText('Trưởng nam')).toBeInTheDocument()
    expect(screen.getByText('Trưởng nữ')).toBeInTheDocument()
  })

  it('mỗi ảnh đều có thuộc tính alt có nghĩa', () => {
    render(<Couple />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)

    images.forEach((img) => {
      expect(img).toHaveAttribute('alt')
      expect(img.getAttribute('alt')).not.toBe('')
      expect(img.getAttribute('alt')?.length).toBeGreaterThan(5)
    })

    expect(screen.getByAltText(/Kiều Anh Quân/)).toBeInTheDocument()
    expect(screen.getByAltText(/Tôn Mai Hương/)).toBeInTheDocument()
  })
})
