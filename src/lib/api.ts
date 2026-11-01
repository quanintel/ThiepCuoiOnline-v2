import { z } from 'zod'
import { env } from '@/config/env'
import type { RsvpInput, Wish, WishInput } from '@/types'

export class ApiError extends Error {
  readonly kind: 'network' | 'server' | 'validation'

  constructor(kind: ApiError['kind'], message: string) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
  }
}

const wishesSchema = z.array(z.object({
  id: z.string().min(1), name: z.string(), message: z.string(), createdAt: z.iso.datetime({ offset: true }),
}))
const idSchema = z.object({ id: z.string().min(1) })
const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 150))

async function request<T>(url: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch {
    throw new ApiError('network', 'Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.')
  }
  if (!response.ok) throw new ApiError('server', 'Máy chủ chưa thể xử lý yêu cầu. Vui lòng thử lại.')

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new ApiError('server', 'Phản hồi máy chủ không hợp lệ. Vui lòng thử lại.')
  }
  const result = z.discriminatedUnion('ok', [
    z.object({ ok: z.literal(true), data: schema }),
    z.object({ ok: z.literal(false), error: z.string(), message: z.string().optional() }),
  ]).safeParse(body)
  if (!result.success) throw new ApiError('server', 'Phản hồi máy chủ không đúng định dạng.')
  if (!result.data.ok) {
    throw new ApiError(result.data.error === 'validation' ? 'validation' : 'server',
      result.data.message || 'Chưa thể nhận dữ liệu. Vui lòng thử lại.')
  }
  return result.data.data
}

export async function fetchWishes(): Promise<Wish[]> {
  if (env.useMock) {
    await delay()
    return [{ id: 'w_demo', name: 'Khách mời (dữ liệu mẫu)', message: 'Chúc hai bạn trăm năm hạnh phúc!', createdAt: '2026-11-01T10:00:00+07:00' }]
  }
  const url = new URL(env.apiUrl)
  url.searchParams.set('action', 'wishes')
  return request(url.href, wishesSchema)
}

async function submit(action: 'rsvp' | 'wish', input: RsvpInput | WishInput): Promise<{ id: string }> {
  if (env.useMock) {
    await delay()
    return { id: `${action === 'rsvp' ? 'r' : 'w'}_${crypto.randomUUID()}` }
  }
  return request(env.apiUrl, idSchema, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...input }),
  })
}

export function submitRsvp(input: RsvpInput): Promise<{ id: string }> {
  return submit('rsvp', input)
}

export function submitWish(input: WishInput): Promise<{ id: string }> {
  return submit('wish', input)
}
