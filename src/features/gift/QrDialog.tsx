import { useRef } from 'react'
import type { GiftInfo } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Download } from 'lucide-react'

interface QrDialogProps {
  gift: GiftInfo | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QrDialog({ gift, open, onOpenChange }: QrDialogProps) {
  const opener = useRef(document.activeElement as HTMLElement | null)
  if (!gift) return null

  const altText =
    gift.id === 'groom'
      ? 'Mã QR mừng cưới chú rể'
      : 'Mã QR mừng cưới cô dâu'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus() }}
        className="max-w-xs sm:max-w-sm rounded-2xl bg-card border-border/80 p-6 text-center shadow-xl"
      >
        <DialogHeader className="space-y-1.5 text-center sm:text-center">
          <DialogTitle className="font-serif text-2xl font-normal text-primary">
            {gift.label}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Khung ảnh QR */}
          <div className="mx-auto aspect-square w-52 overflow-hidden rounded-xl border border-border/60 bg-white p-3 shadow-inner">
            <img
              src={gift.qrSrc}
              alt={altText}
              width={208}
              height={208}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Chi tiết tài khoản */}
          <div className="space-y-1 rounded-lg bg-muted/50 p-3 text-sm border border-border/40">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {gift.bank}
            </p>
            <p className="font-medium text-foreground">
              {gift.accountName}
            </p>
          </div>

          {/* Nút lưu ảnh & Hướng dẫn webview */}
          <div className="space-y-2 pt-2">
            <Button asChild className="min-h-11 w-full rounded-full py-5 text-sm font-sans shadow-sm">
              <a
                href={gift.qrSrc}
                download={new URL(gift.qrSrc, window.location.href).pathname.split('/').pop()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Lưu QR</span>
              </a>
            </Button>
            <p className="text-sm text-muted-foreground leading-normal">
              Nhấn giữ ảnh để lưu nếu trình duyệt webview không hỗ trợ tải trực tiếp.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
