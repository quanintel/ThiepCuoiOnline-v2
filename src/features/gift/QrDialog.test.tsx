import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { GiftInfo } from '@/types'
import { QrDialog } from './QrDialog'

const openZalo = vi.hoisted(() => vi.fn())
const toast = vi.hoisted(() => vi.fn())
vi.mock('@/lib/zalo', () => ({ openZalo }))
vi.mock('sonner', () => ({ toast }))

const gift: GiftInfo = {
  id: 'groom',
  side: 'groom',
  label: 'Mừng cưới chú rể',
  accountName: 'KIEU ANH QUAN',
  bank: 'MB',
  qrSrc: '/qr/qr-groom.png',
}

describe('QrDialog · nút Quét bằng Zalo', () => {
  beforeEach(() => {
    openZalo.mockReset()
    toast.mockReset()
  })

  it('bấm nút thì mở Zalo; mở được thì không hiện thông báo lỗi', async () => {
    openZalo.mockResolvedValue(true)
    render(<QrDialog gift={gift} open onOpenChange={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /Quét bằng Zalo/ }))
    await vi.waitFor(() => expect(openZalo).toHaveBeenCalledTimes(1))
    expect(toast).not.toHaveBeenCalled()
  })

  it('không mở được Zalo thì hiện hướng dẫn thủ công', async () => {
    openZalo.mockResolvedValue(false)
    render(<QrDialog gift={gift} open onOpenChange={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /Quét bằng Zalo/ }))
    await vi.waitFor(() => expect(toast).toHaveBeenCalledTimes(1))
    expect(toast.mock.calls[0][0]).toMatch(/Chưa mở được Zalo/)
  })
})
