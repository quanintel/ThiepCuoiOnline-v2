import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ceremonies } from '@/config/content'
import { CeremonyCard } from './CeremonyCard'

describe('CeremonyCard Component', () => {
  const vuquy = ceremonies.find((c) => c.id === 'vuquy')!
  const thanhhon = ceremonies.find((c) => c.id === 'thanhhon')!

  it('thẻ Lễ Vu Quy hiển thị "Tại Tư Gia" và dòng địa chỉ cũ', () => {
    render(<CeremonyCard ceremony={vuquy} />)

    expect(screen.getByText('LỄ VU QUY')).toBeInTheDocument()
    expect(screen.getByText('Tại Tư Gia')).toBeInTheDocument()
    expect(screen.getByText(/Thôn Phú Cường, Ngọc Thiện, Bắc Ninh/)).toBeInTheDocument()
    expect(
      screen.getByText(/Địa chỉ cũ: Thôn An Lạc 1, Việt Ngọc, Tân Yên, Bắc Giang/)
    ).toBeInTheDocument()
  })

  it('thẻ Lễ Thành Hôn hiển thị "Minh Dương Palace" và không có dòng địa chỉ cũ', () => {
    const { container } = render(<CeremonyCard ceremony={thanhhon} />)

    expect(screen.getByText('LỄ THÀNH HÔN')).toBeInTheDocument()
    expect(screen.getByText('Minh Dương Palace')).toBeInTheDocument()
    expect(screen.getByText(/Số 98 Hồng Đô, Phú Đô, Từ Liêm, Hà Nội/)).toBeInTheDocument()
    expect(container.textContent).not.toContain('Địa chỉ cũ:')
  })

  it('nút Chỉ đường mở link Google Maps trong tab mới với rel="noopener noreferrer"', () => {
    render(<CeremonyCard ceremony={vuquy} />)

    const link = screen.getByRole('link', { name: /Chỉ đường/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', vuquy.mapUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
