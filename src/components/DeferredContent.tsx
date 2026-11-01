import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function DeferredContent({ children, minHeight }: { children: ReactNode; minHeight: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (ready) return
    if (!window.IntersectionObserver) { setReady(true); return }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setReady(true)
        observer.disconnect()
      }
    }, { rootMargin: '300px' })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ready])
  const placeholder = (
    <div role="status" aria-label="Đang tải nội dung" style={{ minHeight }}>
      <Skeleton aria-hidden="true" className="h-48 w-full rounded-lg" />
    </div>
  )
  return (
    <div ref={ref} style={{ minHeight }} tabIndex={ready ? undefined : 0} onFocus={() => setReady(true)}>
      <Suspense fallback={placeholder}>{ready ? children : placeholder}</Suspense>
    </div>
  )
}
