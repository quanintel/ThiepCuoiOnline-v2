import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPendingStatus, fetchWishes } from '@/lib/api'
import { addPending as persistPending, getPending, reconcile } from '@/lib/pendingWishes'
import type { Wish } from '@/types'

export function useWishes() {
  const [approved, setApproved] = useState<Wish[]>([])
  const [pending, setPending] = useState<Wish[]>(getPending)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const request = useRef(0)

  const reload = useCallback(() => {
    const current = ++request.current
    setStatus('loading')
    void (async () => {
      const wishes = await fetchWishes()
      // Hỏi máy chủ lời chờ duyệt nào còn trong Sheet; lỗi hoặc API cũ thì giữ nguyên danh sách.
      const queried = new Set(getPending().map((wish) => wish.id))
      let existing: string[] | undefined
      if (queried.size > 0) {
        try { existing = await fetchPendingStatus([...queried]) } catch { existing = undefined }
      }
      if (current !== request.current) return
      // Lời gửi thêm trong lúc đang tải không nằm trong danh sách đã hỏi nên phải được giữ lại.
      const alive = existing && [...existing, ...getPending().map((wish) => wish.id).filter((id) => !queried.has(id))]
      const stored = reconcile(wishes, alive)
      const approvedIds = new Set(wishes.map((wish) => wish.id))
      const gone = (id: string) => queried.has(id) && existing !== undefined && !existing.includes(id)
      setApproved(wishes)
      // Giữ lời vừa gửi trong bộ nhớ nếu storage bị chặn trong phiên hiện tại.
      setPending((previous) => [...new Map([...stored, ...previous]
        .filter((wish) => !approvedIds.has(wish.id) && !gone(wish.id)).map((wish) => [wish.id, wish])).values()])
      setStatus('ready')
    })().catch(() => {
      if (current === request.current) setStatus('error')
    })
  }, [])

  useEffect(() => {
    reload()
    return () => { request.current++ }
  }, [reload])

  const addPending = useCallback((wish: Wish) => {
    persistPending(wish)
    setPending((previous) => [...previous, wish])
  }, [])

  return { approved, pending, status, reload, addPending }
}
