import { content } from '@/config/content'

export function Couple() {
  const [groom, bride] = content.couple

  const groomImage = groom?.image || '/images/groom-avatar.svg'
  const brideImage = bride?.image || '/images/bride-avatar.svg'

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center">
      {/* Chú rể */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border/80 bg-muted/40 shadow-sm transition-transform duration-300 hover:scale-[1.02]">
          <img
            src={groomImage}
            alt={`Ảnh chú rể ${groom?.name || 'Kiều Anh Quân'}`}
            loading="lazy"
            width={480}
            height={640}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
            {groom?.role || 'Trưởng nam'}
          </p>
          <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground">
            {groom?.name || 'Kiều Anh Quân'}
          </h3>
        </div>
      </div>

      {/* Cô dâu */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border/80 bg-muted/40 shadow-sm transition-transform duration-300 hover:scale-[1.02]">
          <img
            src={brideImage}
            alt={`Ảnh cô dâu ${bride?.name || 'Tôn Mai Hương'}`}
            loading="lazy"
            width={480}
            height={640}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
            {bride?.role || 'Trưởng nữ'}
          </p>
          <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground">
            {bride?.name || 'Tôn Mai Hương'}
          </h3>
        </div>
      </div>
    </div>
  )
}
