import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { env } from '@/config/env'
import { ApiError, fetchPendingStatus, fetchWishes, submitRsvp, submitWish } from '@/lib/api'

const wish = { id: 'w_1', name: 'Khách mời', message: 'Chúc mừng!', createdAt: '2026-11-01T10:00:00+07:00' }
const fetchMock = vi.fn()
const original = { ...env }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
  Object.assign(env, { apiUrl: 'https://script.google.com/macros/s/example/exec?source=invitation', useMock: false })
})
afterEach(() => { Object.assign(env, original); vi.unstubAllGlobals(); vi.useRealTimers() })

it('GET action=wishes giữ query có sẵn và trả danh sách', async () => {
  fetchMock.mockResolvedValue(reply({ ok: true, data: [wish] }))
  expect(await fetchWishes()).toEqual([wish])
  const url = new URL(fetchMock.mock.calls[0][0])
  expect(url.searchParams.get('action')).toBe('wishes')
  expect(url.searchParams.get('source')).toBe('invitation')
})

it.each([
  ['validation', 'validation'], ['rate', 'server'], ['server', 'server'],
])('phân loại envelope lỗi %s thành %s', async (error, kind) => {
  fetchMock.mockResolvedValue(reply({ ok: false, error, message: 'Không thể nhận dữ liệu' }))
  const result = fetchWishes()
  await expect(result).rejects.toBeInstanceOf(ApiError)
  await expect(result).rejects.toMatchObject({ kind, message: 'Không thể nhận dữ liệu' })
})

it('fetch ném lỗi được phân loại network', async () => {
  fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
  await expect(fetchWishes()).rejects.toMatchObject({ kind: 'network' })
})

it('HTTP lỗi được phân loại server', async () => {
  fetchMock.mockResolvedValue(new Response('Bad Gateway', { status: 502 }))
  await expect(fetchWishes()).rejects.toMatchObject({ kind: 'server' })
})

it('JSON hỏng được phân loại server, không nhầm với mất mạng', async () => {
  fetchMock.mockResolvedValue(new Response('<html>Google error</html>'))
  await expect(fetchWishes()).rejects.toMatchObject({ kind: 'server' })
})

it.each([null, { ok: true, data: {} }, { ok: true, data: [{ ...wish, createdAt: 42 }] }, { data: [] }])(
  'từ chối dữ liệu sai hợp đồng %j', async (body) => {
    fetchMock.mockResolvedValue(reply(body))
    await expect(fetchWishes()).rejects.toMatchObject({ kind: 'server' })
  },
)

it('POST RSVP gửi text/plain và đúng JSON', async () => {
  const input = { name: 'Nguyễn A', attendance: 'both', guests: 2, note: '', hp: '' } as const
  fetchMock.mockResolvedValue(reply({ ok: true, data: { id: 'r_1' } }))
  expect(await submitRsvp(input)).toEqual({ id: 'r_1' })
  expect(fetchMock).toHaveBeenCalledWith(env.apiUrl, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'rsvp', ...input }),
  })
})

it('POST lời chúc dùng action wish', async () => {
  const input = { name: 'Nguyễn A', message: 'Chúc mừng!', hp: '' }
  fetchMock.mockResolvedValue(reply({ ok: true, data: { id: 'w_2' } }))
  expect(await submitWish(input)).toEqual({ id: 'w_2' })
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ action: 'wish', ...input })
  expect(fetchMock.mock.calls[0][1].headers).toEqual({ 'Content-Type': 'text/plain;charset=utf-8' })
})

it('từ chối POST thành công nhưng thiếu id', async () => {
  fetchMock.mockResolvedValue(reply({ ok: true, data: {} }))
  await expect(submitWish({ name: 'A', message: 'Chúc mừng!' })).rejects.toMatchObject({ kind: 'server' })
})

it('mock có độ trễ, không fetch, không tự đưa lời mới vào danh sách công khai', async () => {
  env.useMock = true
  vi.useFakeTimers()
  const initial = fetchWishes()
  expect(vi.getTimerCount()).toBe(1)
  await vi.runAllTimersAsync()
  const approved = await initial
  expect(approved.length).toBeGreaterThan(0)
  const wishResult = submitWish({ name: 'A', message: 'Đang chờ duyệt' })
  const rsvpResult = submitRsvp({ name: 'A', attendance: 'both', guests: 1 })
  await vi.runAllTimersAsync()
  expect(await wishResult).toEqual({ id: expect.any(String) })
  expect(await rsvpResult).toEqual({ id: expect.any(String) })
  expect((await wishResult).id).not.toBe((await rsvpResult).id)
  const next = fetchWishes()
  await vi.runAllTimersAsync()
  expect(await next).toEqual(approved)
  expect(fetchMock).not.toHaveBeenCalled()
})

it('fetchPendingStatus gọi action=status kèm ids và trả các id còn chờ duyệt trong Sheet', async () => {
  fetchMock.mockResolvedValue(reply({ ok: true, data: { pending: ['w_2'] } }))
  expect(await fetchPendingStatus(['w_1', 'w_2'])).toEqual(['w_2'])
  const url = new URL(fetchMock.mock.calls[0][0])
  expect(url.searchParams.get('action')).toBe('status')
  expect(url.searchParams.get('ids')).toBe('w_1,w_2')
  expect(url.searchParams.get('source')).toBe('invitation')
})

it('fetchPendingStatus không gọi mạng khi không có id', async () => {
  expect(await fetchPendingStatus([])).toEqual([])
  expect(fetchMock).not.toHaveBeenCalled()
})

it('fetchPendingStatus ở chế độ mock coi mọi id còn tồn tại, không gọi mạng', async () => {
  Object.assign(env, { useMock: true })
  expect(await fetchPendingStatus(['w_1'])).toEqual(['w_1'])
  expect(fetchMock).not.toHaveBeenCalled()
})

it('fetchPendingStatus báo lỗi khi API cũ chưa hỗ trợ action=status', async () => {
  fetchMock.mockResolvedValue(reply({ ok: false, error: 'validation', message: 'Hành động không hợp lệ' }))
  await expect(fetchPendingStatus(['w_1'])).rejects.toMatchObject({ kind: 'validation' })
})
