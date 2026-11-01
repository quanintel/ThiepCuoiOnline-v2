import { z } from 'zod'
import type { Wish } from '@/types'

const storageKey = 'thiep-cuoi:pending-wishes'
const pendingSchema = z.array(z.object({
  id: z.string().min(1), name: z.string(), message: z.string(), createdAt: z.iso.datetime({ offset: true }),
}))

export function getPending(): Wish[] {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw === null) return []
    const result = pendingSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : []
  } catch {
    return []
  }
}

function save(wishes: Wish[]): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(wishes))
  } catch {
    // Storage bị chặn/đầy không được làm hỏng luồng gửi lời chúc đã thành công.
  }
}

export function addPending(wish: Wish): void {
  save([...getPending(), wish])
}

export function reconcile(approved: Wish[]): Wish[] {
  const ids = new Set(approved.map((wish) => wish.id))
  const pending = getPending().filter((wish) => !ids.has(wish.id))
  save(pending)
  return pending
}
