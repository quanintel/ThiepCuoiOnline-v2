import { useCountdown } from '@/hooks/useCountdown'
import type { Ceremony } from '@/types'

export function CountdownBlock({ ceremony }: { ceremony: Ceremony }) {
  const remaining = useCountdown(ceremony.startsAt)
  const units = [
    ['Ngày', remaining.days], ['Giờ', remaining.hours],
    ['Phút', remaining.minutes], ['Giây', remaining.seconds],
  ] as const

  return (
    <div className="space-y-4 text-center">
      <h3 className="text-2xl text-primary">{ceremony.title}</h3>
      <div role="timer" aria-live="off" aria-label={remaining.done ? 'Lễ đã diễn ra' : `Còn ${remaining.days} ngày`}>
        {remaining.done ? <p>Lễ đã diễn ra</p> : (
          <dl className="grid grid-cols-4 gap-2">
            {units.map(([label, value]) => (
              <div key={label} className="flex flex-col rounded-lg bg-muted p-2">
                <dt className="order-2 text-sm text-muted-foreground">{label}</dt>
                <dd className="font-serif text-3xl tabular-nums text-primary">{String(value).padStart(2, '0')}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}
