import type { Ceremony } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

interface CeremonyCardProps {
  ceremony: Ceremony
}

export function CeremonyCard({ ceremony }: CeremonyCardProps) {
  return (
    <Card className="w-full border-border/80 bg-card shadow-sm text-center overflow-hidden">
      <CardHeader className="space-y-1 pb-3">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          {ceremony.weekdayLabel}
        </span>
        <h3 className="font-serif text-2xl font-normal text-primary tracking-wide">
          {ceremony.title.toUpperCase()}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Thời gian */}
        <div className="space-y-1 rounded-lg bg-muted/50 py-3 px-4 border border-border/40">
          <p className="font-serif text-2xl font-semibold text-foreground tracking-tight">
            {ceremony.timeLabel}
          </p>
          <p className="font-sans font-medium text-foreground/90">
            {ceremony.dateLabel}
          </p>
          <p className="font-sans text-xs italic text-muted-foreground">
            ({ceremony.lunarLabel})
          </p>
        </div>

        {/* Địa điểm */}
        <div className="space-y-1 px-2">
          <p className="font-serif text-lg font-medium text-primary">
            {ceremony.placeLabel}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {ceremony.address}
          </p>
          {ceremony.oldAddress && (
            <p className="text-xs italic text-muted-foreground pt-1">
              Địa chỉ cũ: {ceremony.oldAddress}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-6 justify-center">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="min-h-11 rounded-full px-6 font-sans text-xs border-accent/60 text-foreground hover:bg-accent/10"
        >
          <a
            href={ceremony.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5"
          >
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span>Chỉ đường</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
