import { useCallback, useEffect, useRef, useState } from 'react'
import type { AlbumPhoto } from '@/types'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export interface LightboxProps {
  photos: AlbumPhoto[]
  index: number
  onClose: () => void
  onIndexChange?: (newIndex: number) => void
}

export function Lightbox({ photos, index, onClose, onIndexChange }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(index)
  const [hasError, setHasError] = useState(false)
  const previousActiveElementRef = useRef(document.activeElement as HTMLElement | null)

  useEffect(() => {
    setCurrentIndex(index)
  }, [index])

  useEffect(() => {
    setHasError(false)
  }, [currentIndex])

  const handleNext = useCallback(() => {
    if (photos.length === 0) return
    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % photos.length
      onIndexChange?.(nextIndex)
      return nextIndex
    })
  }, [photos.length, onIndexChange])

  const handlePrev = useCallback(() => {
    if (photos.length === 0) return
    setCurrentIndex((prev) => {
      const prevIndex = (prev - 1 + photos.length) % photos.length
      onIndexChange?.(prevIndex)
      return prevIndex
    })
  }, [photos.length, onIndexChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, handleNext, handlePrev])

  if (!photos || photos.length === 0) {
    return null
  }

  const currentPhoto = photos[currentIndex] || photos[0]

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
    <DialogContent
      aria-describedby={undefined}
      onCloseAutoFocus={(event) => { event.preventDefault(); previousActiveElementRef.current?.focus() }}
      className="fixed inset-0 z-50 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col items-center justify-between rounded-none border-0 bg-black/95 p-4 text-white sm:rounded-none [&>button]:focus:ring-white"
    >
      <DialogTitle className="sr-only">Xem ảnh phóng to</DialogTitle>
      {/* Thanh công cụ trên cùng: Chỉ số & Nút đóng */}
      <div className="flex w-full items-center justify-between px-2 py-2">
        <span
          data-testid="lightbox-counter"
          className="font-sans text-sm font-medium tracking-widest text-white/80"
        >
          {currentIndex + 1} / {photos.length}
        </span>

      </div>

      {/* Vùng hiển thị ảnh chính */}
      <div className="relative flex flex-1 w-full max-w-4xl items-center justify-center p-2">
        {hasError ? (
          <div
            data-testid="lightbox-fallback"
            className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-white/20 bg-white/5 p-8 text-center text-white/70"
          >
            <ImageOff className="h-12 w-12 stroke-1" />
            <p className="text-sm">Không thể tải được hình ảnh này</p>
          </div>
        ) : (
          <img
            key={currentPhoto.src}
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            width={currentPhoto.width}
            height={currentPhoto.height}
            loading="lazy"
            onError={() => setHasError(true)}
            className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-2xl transition-all duration-300"
          />
        )}

        {/* Nút lùi (←) */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Ảnh trước"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white/90 backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Nút tiến (→) */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Ảnh sau"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white/90 backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Mô tả ảnh dưới cùng */}
      <div className="w-full max-w-md py-2 text-center">
        <p className="truncate text-xs font-light text-white/70">
          {currentPhoto.alt}
        </p>
      </div>
    </DialogContent>
    </Dialog>
  )
}

export default Lightbox
