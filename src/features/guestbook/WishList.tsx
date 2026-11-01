import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Wish } from '@/types'

interface WishListProps {
  approved: Wish[]
  pending: Wish[]
  status: 'loading' | 'ready' | 'error'
  reload: () => void
}

export function WishList({ approved, pending, status, reload }: WishListProps) {
  const [limit, setLimit] = useState(10)
  const newestFirst = (a: Wish, b: Wish) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  const wishes = [
    ...[...pending].sort(newestFirst).map((wish) => ({ ...wish, pending: true })),
    ...[...approved].sort(newestFirst).map((wish) => ({ ...wish, pending: false })),
  ]

  return (
    <div className="space-y-6">
      {status === 'loading' && (
        <div role="status" aria-label="Đang tải lời chúc" className="space-y-4">
          <span className="sr-only">Đang tải lời chúc…</span>
          <div aria-hidden="true" data-testid="wishes-skeleton" className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="space-y-3 text-center">
          <p>Chưa tải được lời chúc. Bạn thử lại giúp mình nhé.</p>
          <Button type="button" variant="outline" onClick={reload} className="min-h-11">Tải lại</Button>
        </div>
      )}
      {status === 'ready' && wishes.length === 0 && <p className="text-center">Hãy là người đầu tiên gửi lời chúc!</p>}
      {wishes.length > 0 && (
        <ul aria-label="Lời chúc" className="space-y-4">
          {wishes.slice(0, limit).map((wish) => (
            <li key={wish.id}>
              <Card className="shadow-sm">
                <CardHeader className="space-y-2 pb-3">
                  <p className="font-medium [overflow-wrap:anywhere]">{wish.name}</p>
                  {wish.pending && <p className="text-sm text-muted-foreground">Đang chờ duyệt</p>}
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{wish.message}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
      {limit < wishes.length && (
        <Button type="button" variant="outline" onClick={() => setLimit((count) => count + 10)} className="min-h-11 w-full">
          Xem thêm
        </Button>
      )}
    </div>
  )
}
