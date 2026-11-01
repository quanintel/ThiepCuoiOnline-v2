import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { defaultGifts } from '@/config/content'
import { GiftBoxes } from './GiftBoxes'

describe('GiftBoxes & QrDialog Component', () => {
  it('hiển thị hai hộp quà mừng với nút "Nhấn để mở"', () => {
    render(<GiftBoxes gifts={defaultGifts} />)

    expect(screen.getByText('Hộp quà mừng cưới')).toBeInTheDocument()
    expect(screen.getByText('Mừng cưới chú rể')).toBeInTheDocument()
    expect(screen.getByText('Mừng cưới cô dâu')).toBeInTheDocument()
    expect(screen.getAllByText('Nhấn để mở')).toHaveLength(2)
  })

  it('chạm hộp quà chú rể mở đúng hộp thoại có QR chú rể và nút tải', async () => {
    render(<GiftBoxes gifts={defaultGifts} />)

    // Chạm hộp quà chú rể
    const groomBox = screen.getByRole('button', { name: /Mừng cưới chú rể/ })
    fireEvent.click(groomBox)

    // Mở hộp thoại
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Mừng cưới chú rể' })).toBeInTheDocument()

    // QR có alt đúng
    const groomQr = screen.getByAltText('Mã QR mừng cưới chú rể')
    expect(groomQr).toBeInTheDocument()
    expect(groomQr).toHaveAttribute('src', '/qr/qr-groom.png')

    // Nút Lưu QR có thuộc tính download
    const downloadLink = screen.getByRole('link', { name: /Lưu QR/ })
    expect(downloadLink).toBeInTheDocument()
    expect(downloadLink).toHaveAttribute('download')
    expect(downloadLink.getAttribute('download')).toContain('groom')
    expect(downloadLink.getAttribute('download')).toMatch(/\.png$/)
  })

  it('chạm hộp quà cô dâu mở đúng hộp thoại có QR cô dâu', async () => {
    render(<GiftBoxes gifts={defaultGifts} />)

    // Chạm hộp quà cô dâu
    const brideBox = screen.getByRole('button', { name: /Mừng cưới cô dâu/ })
    fireEvent.click(brideBox)

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Mừng cưới cô dâu' })).toBeInTheDocument()

    const brideQr = screen.getByAltText('Mã QR mừng cưới cô dâu')
    expect(brideQr).toBeInTheDocument()
    expect(brideQr).toHaveAttribute('src', '/qr/qr-bride.png')
  })

  it('nhấn phím Esc đóng hộp thoại QR', async () => {
    render(<GiftBoxes gifts={defaultGifts} />)

    const groomBox = screen.getByRole('button', { name: /Mừng cưới chú rể/ })
    fireEvent.click(groomBox)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    // Bấm Esc
    fireEvent.keyDown(document, { key: 'Escape' })

    // Hộp thoại đóng lại
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('nếu danh sách quà rỗng thì không render gì', () => {
    const { container } = render(<GiftBoxes gifts={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
