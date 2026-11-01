import { useEffect, useState } from 'react'
import { getRemaining, type Remaining } from '@/lib/countdown'

export function useCountdown(startsAt: string): Remaining {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const target = new Date(startsAt)
    const current = new Date()
    setNow(current)
    if (current >= target) return

    const interval = window.setInterval(() => {
      const current = new Date()
      setNow(current)
      if (current >= target) window.clearInterval(interval)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [startsAt])

  return getRemaining(new Date(startsAt), now)
}
