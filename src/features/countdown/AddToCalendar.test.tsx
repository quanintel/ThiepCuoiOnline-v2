import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { ceremonies } from '@/config/content'
import { googleCalendarUrl } from '@/lib/calendar'
import { AddToCalendar } from '@/features/countdown/AddToCalendar'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers() })

function openMenu() {
  fireEvent.keyDown(screen.getByRole('button', { name: 'Thêm vào lịch' }), { key: 'ArrowDown' })
}

it('mở menu có link Google Calendar đúng lễ, an toàn khi mở tab mới', () => {
  render(<AddToCalendar ceremony={ceremonies[0]} />)
  openMenu()
  const link = screen.getByRole('menuitem', { name: 'Google Calendar' })
  expect(link).toHaveAttribute('href', googleCalendarUrl(ceremonies[0]))
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
})

it('tải ICS bằng Blob, dọn URL và hiện hướng dẫn cho webview tải âm thầm thất bại', () => {
  vi.useFakeTimers()
  const create = vi.fn(() => 'blob:calendar')
  const revoke = vi.fn()
  vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke }))
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  render(<AddToCalendar ceremony={ceremonies[0]} />)
  openMenu()
  fireEvent.click(screen.getByRole('menuitem', { name: 'Tải .ics' }))
  expect(create).toHaveBeenCalledWith(expect.any(Blob))
  expect(click.mock.instances[0]).toHaveProperty('download', 'vuquy.ics')
  expect(click.mock.instances[0]).toHaveProperty('href', 'blob:calendar')
  expect(screen.getByText('Hãy mở thiệp bằng trình duyệt hoặc dùng Google Calendar')).toBeInTheDocument()
  vi.runOnlyPendingTimers()
  expect(revoke).toHaveBeenCalledWith('blob:calendar')
})

it('lỗi tạo tệp hiện thông báo dự phòng, không làm component lỗi', () => {
  vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: vi.fn(() => { throw new Error('blocked') }) }))
  render(<AddToCalendar ceremony={ceremonies[0]} />)
  openMenu()
  fireEvent.click(screen.getByRole('menuitem', { name: 'Tải .ics' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Hãy mở thiệp bằng trình duyệt hoặc dùng Google Calendar')
})
