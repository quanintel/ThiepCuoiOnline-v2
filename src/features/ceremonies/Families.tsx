import { families } from '@/config/content'

export function Families() {
  const groomFamily = families.find((f) => f.side === 'groom')
  const brideFamily = families.find((f) => f.side === 'bride')

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm text-center">
      <h3 className="font-serif text-lg font-medium text-primary uppercase tracking-wider mb-6">
        GIA ĐÌNH HAI BÊN
      </h3>

      <div className="grid grid-cols-2 gap-4 divide-x divide-border/60">
        {/* Nhà trai */}
        <div className="space-y-2 px-2">
          <p className="font-serif text-base font-semibold text-primary">
            NHÀ TRAI
          </p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Ông: <span className="font-medium text-foreground">{groomFamily?.father}</span></p>
            <p>Bà: <span className="font-medium text-foreground">{groomFamily?.mother}</span></p>
          </div>
        </div>

        {/* Nhà gái */}
        <div className="space-y-2 px-2">
          <p className="font-serif text-base font-semibold text-primary">
            NHÀ GÁI
          </p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Ông: <span className="font-medium text-foreground">{brideFamily?.father}</span></p>
            <p>Bà: <span className="font-medium text-foreground">{brideFamily?.mother}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
