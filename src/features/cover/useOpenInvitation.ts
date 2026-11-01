import { useCallback, useEffect, useRef, useState } from 'react'

export function useOpenInvitation(onOpen?: () => void): { isOpen: boolean; open: () => void } {
  const [isOpen, setIsOpen] = useState(false)
  const onOpenRef = useRef(onOpen)
  const hasTriggeredRef = useRef(false)

  onOpenRef.current = onOpen

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    if (!isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow || ''
    }

    return () => {
      document.body.style.overflow = originalOverflow || ''
    }
  }, [isOpen])

  const open = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) return prev
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = true
        onOpenRef.current?.()
      }
      return true
    })
  }, [])

  return { isOpen, open }
}
