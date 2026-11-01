import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { fetchWishes } from '@/lib/api'
import { addPending, getPending } from '@/lib/pendingWishes'
import { useWishes } from '@/features/guestbook/useWishes'
import type { Wish } from '@/types'

vi.mock('@/lib/api', () => ({ fetchWishes: vi.fn() }))
const first: Wish = { id: 'w_1', name: 'A', message: 'Chúc mừng!', createdAt: '2026-11-01T10:00:00Z' }
const second: Wish = { ...first, id: 'w_2', name: 'B' }
beforeEach(() => { localStorage.clear(); vi.mocked(fetchWishes).mockReset() })
afterEach(() => vi.restoreAllMocks())

it('loading → ready khi API trả lời chúc', async () => {
  let resolve!: (wishes: Wish[]) => void
  vi.mocked(fetchWishes).mockReturnValue(new Promise((done) => { resolve = done }))
  const { result } = renderHook(useWishes)
  expect(result.current.status).toBe('loading')
  expect(result.current.approved).toEqual([])
  await act(async () => resolve([first]))
  expect(result.current.status).toBe('ready')
  expect(result.current.approved).toEqual([first])
})

it('lỗi → error, reload thử lại thành công', async () => {
  vi.mocked(fetchWishes).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([first])
  const { result } = renderHook(useWishes)
  await waitFor(() => expect(result.current.status).toBe('error'))
  act(() => result.current.reload())
  await waitFor(() => expect(result.current.status).toBe('ready'))
  expect(result.current.approved).toEqual([first])
  expect(fetchWishes).toHaveBeenCalledTimes(2)
})

it('lời chờ duyệt có id trong danh sách duyệt bị bỏ cả khỏi state và storage', async () => {
  addPending(first); addPending(second)
  vi.mocked(fetchWishes).mockResolvedValue([first])
  const { result } = renderHook(useWishes)
  await waitFor(() => expect(result.current.status).toBe('ready'))
  expect(result.current.pending).toEqual([second])
  expect(getPending()).toEqual([second])
})

it('thêm lời chờ ngay khi GET đang chờ mà không mất sau khi GET xong', async () => {
  let resolve!: (wishes: Wish[]) => void
  vi.mocked(fetchWishes).mockReturnValue(new Promise((done) => { resolve = done }))
  const { result } = renderHook(useWishes)
  act(() => result.current.addPending(second))
  expect(result.current.pending).toEqual([second])
  expect(getPending()).toEqual([second])
  await act(async () => resolve([first]))
  expect(result.current.pending).toEqual([second])
})

it('giữ dữ liệu đã có nếu reload lỗi', async () => {
  vi.mocked(fetchWishes).mockResolvedValueOnce([first]).mockRejectedValueOnce(new Error('offline'))
  const { result } = renderHook(useWishes)
  await waitFor(() => expect(result.current.status).toBe('ready'))
  act(() => result.current.reload())
  await waitFor(() => expect(result.current.status).toBe('error'))
  expect(result.current.approved).toEqual([first])
})

it('phản hồi cũ đến sau không ghi đè lần reload mới hơn', async () => {
  let old!: (wishes: Wish[]) => void
  vi.mocked(fetchWishes).mockReturnValueOnce(new Promise((done) => { old = done })).mockResolvedValueOnce([second])
  const { result } = renderHook(useWishes)
  act(() => result.current.reload())
  await waitFor(() => expect(result.current.approved).toEqual([second]))
  await act(async () => old([first]))
  expect(result.current.approved).toEqual([second])
})

it('phản hồi sau unmount không reconcile storage', async () => {
  addPending(first)
  let resolve!: (wishes: Wish[]) => void
  vi.mocked(fetchWishes).mockReturnValue(new Promise((done) => { resolve = done }))
  const { unmount } = renderHook(useWishes)
  unmount()
  await act(async () => resolve([first]))
  expect(getPending()).toEqual([first])
})

it('storage bị chặn vẫn giữ lời vừa gửi trong bộ nhớ cho đến khi được duyệt', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
  vi.mocked(fetchWishes).mockResolvedValueOnce([]).mockResolvedValueOnce([]).mockResolvedValueOnce([first])
  const { result } = renderHook(useWishes)
  await waitFor(() => expect(result.current.status).toBe('ready'))
  act(() => result.current.addPending(first))
  expect(result.current.pending).toEqual([first])
  act(() => result.current.reload())
  await waitFor(() => expect(result.current.status).toBe('ready'))
  expect(result.current.pending).toEqual([first])
  act(() => result.current.reload())
  await waitFor(() => expect(result.current.approved).toEqual([first]))
  expect(result.current.pending).toEqual([])
})
