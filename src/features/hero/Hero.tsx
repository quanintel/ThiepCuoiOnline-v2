import { content } from '@/config/content'

export function Hero() {
  return (
    <div
      className="relative flex aspect-[4/5] flex-col items-center justify-end overflow-hidden rounded-2xl border border-border/50 bg-muted/50 text-center shadow-inner"
      data-testid="hero-container"
    >
      {content.heroImage && (
        <img
          src={content.heroImage}
          alt="Anh Quân và Mai Hương trong ngày chụp ảnh cưới"
          width={960}
          height={1440}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}
      {/* Lớp phủ để chữ luôn đọc được trên ảnh */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xs space-y-3 px-6 pb-10">
        <h1 className="font-script text-4xl font-normal leading-snug text-white drop-shadow sm:text-5xl">
          {content.hero}
        </h1>
        <div className="mx-auto h-0.5 w-12 bg-white/70" />
      </div>
    </div>
  )
}
