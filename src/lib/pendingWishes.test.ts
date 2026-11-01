import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { addPending, getPending, reconcile } from '@/lib/pendingWishes'
import type { Wish } from '@/types'

const first: Wish = { id: 'w_1', name: 'Nguyễn A', message: 'Chúc mừng!', createdAt: '2026-11-01T10:00:00+07:00' }
const second: Wish = { ...first, id: 'w_2', message: 'Trăm năm hạnh phúc!' }

beforeEach(() => localStorage.clear())
afterEach(() => { vi.restoreAllMocks(); vi.resetModules() })

it('thêm rồi đọc lại từ storage, kể cả sau khi module được nạp lại', async () => {
  expect(getPending()).toEqual([])
  addPending(first)
  addPending(second)
  expect(getPending()).toEqual([first, second])
  vi.resetModules()
  expect((await import('@/lib/pendingWishes')).getPending()).toEqual([first, second])
})

it('reconcile loại đúng id đã duyệt, giữ lời khác dù trùng tên/nội dung và lưu lại', () => {
  const sameText = { ...first, id: 'w_3' }
  addPending(first); addPending(second); addPending(sameText)
  expect(reconcile([first])).toEqual([second, sameText])
  expect(getPending()).toEqual([second, sameText])
  expect(reconcile([first])).toEqual([second, sameText])
})

it('không có lời đã duyệt thì giữ nguyên danh sách chờ', () => {
  addPending(first)
  expect(reconcile([])).toEqual([first])
})

it.each(['not JSON', 'null', '{}', '42', '[{}]', JSON.stringify([{ ...first, createdAt: 3 }])])(
  'dữ liệu storage hỏng %s trả rỗng, không ném', (raw) => {
    addPending(first)
    localStorage.setItem(localStorage.key(0)!, raw)
    expect(getPending()).toEqual([])
    expect(() => reconcile([])).not.toThrow()
  },
)

it('storage hỏng không ngăn thêm một lời chúc hợp lệ mới', () => {
  addPending(first)
  localStorage.setItem(localStorage.key(0)!, 'broken')
  addPending(second)
  expect(getPending()).toEqual([second])
})

it('giữ nguyên HTML như văn bản dữ liệu', () => {
  const wish = { ...first, message: '<img src=x onerror=alert(1)>' }
  addPending(wish)
  expect(getPending()).toEqual([wish])
})

it('getItem/setItem ném lỗi không làm đọc, thêm, reconcile lỗi', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
  expect(getPending()).toEqual([])
  expect(() => addPending(first)).not.toThrow()
  expect(reconcile([first])).toEqual([])
})

it('không lỗi khi chính getter localStorage bị chặn', () => {
  vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new DOMException('blocked', 'SecurityError') })
  expect(getPending()).toEqual([])
  expect(() => addPending(first)).not.toThrow()
  expect(reconcile([])).toEqual([])
})
