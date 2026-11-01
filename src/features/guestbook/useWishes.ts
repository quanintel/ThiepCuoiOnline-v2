import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchWishes } from '@/lib/api'
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
    void fetchWishes().then((wishes) => {
      if (current !== request.current) return
      const stored = reconcile(wishes)
      const ids = new Set(wishes.map((wish) => wish.id))
      setApproved(wishes)
      // Giữ lời vừa gửi trong bộ nhớ nếu storage bị chặn trong phiên hiện tại.
      setPending((previous) => [...new Map([...stored, ...previous]
        .filter((wish) => !ids.has(wish.id)).map((wish) => [wish.id, wish])).values()])
      setStatus('ready')
    }).catch(() => {
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
