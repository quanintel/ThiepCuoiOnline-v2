import { content } from '@/config/content'

export function Closing() {
  const closingText = content.closing || 'Sự hiện diện của bạn là niềm vinh hạnh của gia đình chúng tôi!'
  const footerText = content.footer || 'Anh Quân & Mai Hương · 24.11.2026'

  return (
    <footer className="space-y-8 px-6 py-12 text-center border-t border-border/40">
      <div className="max-w-sm mx-auto space-y-3">
        <p className="font-serif text-lg sm:text-xl font-normal leading-relaxed text-foreground italic">
          &ldquo;{closingText}&rdquo;
        </p>
        <div className="mx-auto h-0.5 w-10 bg-accent/60" />
      </div>

      <div className="space-y-1">
        <p className="font-script text-3xl font-normal text-primary">
          {footerText}
        </p>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          Trân trọng cảm ơn
        </p>
      </div>
    </footer>
  )
}
