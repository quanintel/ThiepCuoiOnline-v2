import { useEffect, useRef, useState } from 'react'

export function useReveal() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (media?.matches || !window.IntersectionObserver) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.1 })

    if (ref.current) observer.observe(ref.current)
    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setVisible(true)
        observer.disconnect()
      }
    }
    media?.addEventListener('change', onMotionChange)

    return () => {
      observer.disconnect()
      media?.removeEventListener('change', onMotionChange)
    }
  }, [])

  return { ref, visible }
}
