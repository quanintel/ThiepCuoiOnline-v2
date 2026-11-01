import { lazy, Suspense, useEffect, useState } from 'react'
import type { AlbumPhoto } from '@/types'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { content } from '@/config/content'

// Nạp Lightbox theo phương thức lazy load
const LazyLightbox = lazy(() => import('./Lightbox'))

interface AlbumProps {
  photos?: AlbumPhoto[]
}

export function Album({ photos = content.album }: AlbumProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (!photos || photos.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="font-script text-4xl font-normal text-primary">
          Album ảnh cưới
        </h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          Chạm vào ảnh để phóng to
        </p>
      </div>

      <div className="relative px-2">
        <Carousel
          opts={{
            align: 'center',
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {photos.map((photo, index) => (
              <CarouselItem key={`${photo.src}-${index}`} className="pl-3 basis-[72%] sm:basis-[60%]">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative block aspect-[2/3] w-full overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Xem ảnh lớn: ${photo.alt}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    width={photo.width}
                    height={photo.height}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="left-3 size-11 bg-background/80 backdrop-blur-sm border-border hover:bg-background"
            aria-label="Ảnh trước"
          />
          <CarouselNext
            className="right-3 size-11 bg-background/80 backdrop-blur-sm border-border hover:bg-background"
            aria-label="Ảnh sau"
          />
        </Carousel>

        {/* Chấm phân trang (dots) */}
        {count > 1 && (
          <div className="flex flex-wrap justify-center items-center pt-4" aria-label="Phân trang album">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Đến ảnh ${i + 1}`}
                className="flex h-11 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span aria-hidden="true" className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-accent' : 'w-2 bg-accent/30'
                }`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox hiển thị modal */}
      {lightboxIndex !== null && (
        <Suspense fallback={null}>
          <LazyLightbox
            photos={photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        </Suspense>
      )}
    </div>
  )
}
