import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { WishList } from '@/features/guestbook/WishList'
import type { Wish } from '@/types'

const first: Wish = { id: 'w_1', name: 'Khách 1', message: 'Chúc mừng!', createdAt: '2026-11-01T10:00:00Z' }
const base = { approved: [] as Wish[], pending: [] as Wish[], status: 'ready' as const, reload: vi.fn() }

it('lời chúc và tên chứa HTML hiện nguyên chữ, không tạo ảnh/script', () => {
  const payload = '<img src=x onerror=alert(1)>'
  const { container } = render(<WishList {...base} approved={[{ ...first, name: '<script>alert(1)</script>', message: payload }]} />)
  expect(screen.getByText(payload)).toBeInTheDocument()
  expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument()
  expect(container.querySelector('img, script')).toBeNull()
})

it('25 lời hiển thị 10 → 20 → 25, mới nhất trước và không sửa mảng đầu vào', () => {
  const approved = Array.from({ length: 25 }, (_, index) => ({
    ...first, id: `w_${index + 1}`, name: `Khách ${index + 1}`,
    createdAt: new Date(Date.UTC(2026, 10, 1, 0, index)).toISOString(),
  }))
  render(<WishList {...base} approved={approved} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(10)
  expect(within(screen.getAllByRole('listitem')[0]).getByText('Khách 25')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Xem thêm' }))
  expect(screen.getAllByRole('listitem')).toHaveLength(20)
  fireEvent.click(screen.getByRole('button', { name: 'Xem thêm' }))
  expect(screen.getAllByRole('listitem')).toHaveLength(25)
  expect(screen.queryByRole('button', { name: 'Xem thêm' })).not.toBeInTheDocument()
  expect(approved[0].name).toBe('Khách 1')
})

it('pending đứng đầu, có nhãn riêng; approved không có nhãn chờ', () => {
  const pending = { ...first, id: 'w_pending', name: 'Người gửi' }
  render(<WishList {...base} approved={[first]} pending={[pending]} />)
  const items = screen.getAllByRole('listitem')
  expect(within(items[0]).getByText('Người gửi')).toBeInTheDocument()
  expect(within(items[0]).getByText('Đang chờ duyệt')).toBeInTheDocument()
  expect(within(items[1]).queryByText('Đang chờ duyệt')).not.toBeInTheDocument()
})

it('trạng thái rỗng dùng đúng copy tiếng Việt', () => {
  render(<WishList {...base} />)
  expect(screen.getByText('Hãy là người đầu tiên gửi lời chúc!')).toBeInTheDocument()
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})

it('đang tải có skeleton và nhãn truy cập được, không hiện thông báo rỗng', () => {
  const { container } = render(<WishList {...base} status="loading" />)
  expect(screen.getByRole('status', { name: 'Đang tải lời chúc' })).toBeInTheDocument()
  expect(container.querySelector('[data-testid="wishes-skeleton"]')).toBeInTheDocument()
  expect(screen.queryByText('Hãy là người đầu tiên gửi lời chúc!')).not.toBeInTheDocument()
})

it('lỗi có thông báo và nút tải lại gọi callback', () => {
  const reload = vi.fn()
  render(<WishList {...base} status="error" reload={reload} />)
  expect(screen.getByRole('alert')).toHaveTextContent('Chưa tải được lời chúc. Bạn thử lại giúp mình nhé.')
  fireEvent.click(screen.getByRole('button', { name: 'Tải lại' }))
  expect(reload).toHaveBeenCalledTimes(1)
  expect(screen.queryByText('Hãy là người đầu tiên gửi lời chúc!')).not.toBeInTheDocument()
})

it.each(['loading', 'error'] as const)('giữ lời chờ duyệt hiện khi trạng thái %s', (status) => {
  render(<WishList {...base} status={status} pending={[first]} />)
  expect(screen.getByText('Đang chờ duyệt')).toBeInTheDocument()
  expect(screen.getByText('Chúc mừng!')).toBeInTheDocument()
})
