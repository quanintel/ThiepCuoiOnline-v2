import { useWishes } from '@/features/guestbook/useWishes'
import { WishForm } from '@/features/guestbook/WishForm'
import { WishList } from '@/features/guestbook/WishList'

export function Guestbook() {
  const wishes = useWishes()
  return (
    <div className="space-y-8">
      <WishForm addPending={wishes.addPending} />
      <WishList {...wishes} />
    </div>
  )
}
