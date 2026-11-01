import { lazy, Suspense, useState } from 'react'
import type { GiftInfo } from '@/types'
import { content } from '@/config/content'
import { Gift } from 'lucide-react'
const QrDialog = lazy(() => import('./QrDialog').then((module) => ({ default: module.QrDialog })))

interface GiftBoxesProps {
  gifts?: GiftInfo[]
}

export function GiftBoxes({ gifts = content.gifts as GiftInfo[] }: GiftBoxesProps) {
  const [selectedGift, setSelectedGift] = useState<GiftInfo | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenGift = (gift: GiftInfo) => {
    setSelectedGift(gift)
    setIsDialogOpen(true)
  }

  if (!gifts || gifts.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="font-script text-4xl font-normal text-primary">
          Hộp quà mừng cưới
        </h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          Gửi gắm lời chúc &amp; tình cảm đến tân lang, tân nương
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {gifts.map((gift) => (
          <button
            key={gift.id}
            type="button"
            onClick={() => handleOpenGift(gift)}
            aria-label={`${gift.label} - Nhấn để mở`}
            className="group relative flex flex-col items-center justify-center space-y-3 rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-accent hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {/* Biểu tượng hộp quà */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-muted/80 text-primary transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              <Gift className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-base sm:text-lg font-medium text-foreground">
                {gift.label}
              </h3>
              <span className="inline-block rounded-full bg-accent/15 px-3 py-0.5 text-[11px] font-medium text-accent-foreground">
                Nhấn để mở
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Hộp thoại quét QR */}
      {isDialogOpen && <Suspense fallback={<p role="status">Đang tải QR…</p>}><QrDialog
        gift={selectedGift}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      /></Suspense>}
    </div>
  )
}
