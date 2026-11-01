import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { content } from '@/config/content'

interface CoverProps {
  isOpen: boolean
  onOpen: () => void
}

export function Cover({ isOpen, onOpen }: CoverProps) {
  const [mounted, setMounted] = useState(!isOpen)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

      if (prefersReducedMotion) {
        setMounted(false)
        return
      }

      setIsFading(true)
      const timer = setTimeout(() => {
        setMounted(false)
      }, 400)

      return () => clearTimeout(timer)
    } else {
      setMounted(true)
      setIsFading(false)
    }
  }, [isOpen])

  if (!mounted) {
    return null
  }

  return (
    <aside
      id="cover-overlay"
      aria-label="Bìa thiệp cưới"
      className={`fixed inset-0 z-50 flex min-h-[100dvh] h-[100dvh] w-full flex-col items-center justify-between bg-background px-6 py-16 text-center transition-opacity duration-400 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Hoạ tiết đỉnh */}
      <div className="flex flex-col items-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-primary">Wedding Invitation</span>
        <div className="h-px w-16 bg-accent/40" />
      </div>

      {/* Thông tin chính */}
      <div className="flex flex-col items-center space-y-6">
        <div className="space-y-2">
          <h1 className="font-script text-6xl sm:text-7xl font-normal leading-tight text-primary">
            {content.cover.names}
          </h1>
        </div>

        <div className="space-y-1">
          <p className="font-sans text-sm tracking-widest text-muted-foreground uppercase">
            24 · 11 · 2026
          </p>
          <p className="font-sans text-sm font-medium text-foreground/80">
            Thân mời bạn
          </p>
        </div>
      </div>

      {/* Nút Mở thiệp */}
      <div className="flex flex-col items-center space-y-4">
        <Button
          size="lg"
          onClick={onOpen}
          className="rounded-full px-8 py-6 font-sans text-base shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          {content.cover.openLabel || 'Mở thiệp'}
        </Button>
        <span className="text-xs tracking-wider text-muted-foreground">
          Chạm để mở thiệp &amp; phát nhạc
        </span>
      </div>
    </aside>
  )
}
