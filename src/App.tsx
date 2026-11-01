import { lazy, Suspense } from 'react'
import { DeferredContent } from '@/components/DeferredContent'
import { Section } from '@/components/Section'
import { ceremonies, content } from '@/config/content'
import '@/config/env'
import { Ceremonies } from '@/features/ceremonies/Ceremonies'
import { Couple } from '@/features/couple/Couple'
import { AddToCalendar } from '@/features/countdown/AddToCalendar'
import { CountdownBlock } from '@/features/countdown/CountdownBlock'
import { MonthCalendar } from '@/features/countdown/MonthCalendar'
import { Cover } from '@/features/cover/Cover'
import { useOpenInvitation } from '@/features/cover/useOpenInvitation'
import { Closing } from '@/features/footer/Closing'
import { GiftBoxes } from '@/features/gift/GiftBoxes'
import { MusicButton } from '@/features/music/MusicButton'
import { useMusic } from '@/features/music/useMusic'

const Album = lazy(() => import('@/features/album/Album').then((module) => ({ default: module.Album })))
const RsvpForm = lazy(() => import('@/features/rsvp/RsvpForm').then((module) => ({ default: module.RsvpForm })))
const Guestbook = lazy(() => import('@/features/guestbook/Guestbook').then((module) => ({ default: module.Guestbook })))
const Toaster = lazy(() => import('@/components/ui/sonner').then((module) => ({ default: module.Toaster })))

export default function App() {
  const music = useMusic(content.music)

  const { isOpen, open } = useOpenInvitation(() => {
    void music.play()
  })

  return (
    <>
      {/* [0] Cover overlay toàn màn hình */}
      <Cover isOpen={isOpen} onOpen={open} />

      <main
        tabIndex={-1}
        aria-hidden={!isOpen}
        ref={(element) => {
          if (!element) return
          element.inert = !isOpen
          if (isOpen && document.activeElement?.closest('#cover-overlay')) element.focus({ preventScroll: true })
        }}
        className="mx-auto min-h-dvh w-full max-w-[480px] bg-floral shadow-sm"
      >
        {/* [2] Cô dâu chú rể */}
        <Section id="couple" title="Cô dâu & chú rể">
          <Couple />
        </Section>

        {/* [3] Thông tin lễ cưới & Gia đình (Chỉ đường đã tích hợp trong thẻ lễ theo UX-D1) */}
        <Section id="ceremonies">
          <Ceremonies />
        </Section>

        {/* [4] Album ảnh cưới */}
        <Section id="album">
          <DeferredContent minHeight={560}><Album /></DeferredContent>
        </Section>

        {/* [5] Đếm ngược + lịch tháng + thêm vào lịch (riêng từng lễ) */}
        <Section id="countdown" title="Đếm ngược ngày chung đôi">
          <div className="space-y-8">
            {ceremonies.map((ceremony) => (
              <div key={ceremony.id} className="space-y-3">
                <CountdownBlock ceremony={ceremony} />
                <div className="flex justify-center">
                  <AddToCalendar ceremony={ceremony} />
                </div>
              </div>
            ))}
            <MonthCalendar year={2026} month={11} highlight={24} />
          </div>
        </Section>

        {/* [8] Xác nhận tham dự - RSVP */}
        <Section id="rsvp" title="Xác nhận tham dự">
          <DeferredContent minHeight={650}><RsvpForm /></DeferredContent>
        </Section>

        {/* [9] Sổ lưu bút: form + danh sách lời chúc đã duyệt */}
        <Section id="guestbook" title="Sổ lưu bút">
          <DeferredContent minHeight={720}><Guestbook /></DeferredContent>
        </Section>

        {/* [10] Hộp quà mừng */}
        <Section id="gift">
          <GiftBoxes />
        </Section>

        {/* [11] Lời kết & footer */}
        <Closing />
      </main>

      {isOpen && <Suspense fallback={null}><Toaster /></Suspense>}

      {/* Nút nhạc nổi (chỉ hiện sau khi đã mở thiệp) */}
      {isOpen && (
        <MusicButton
          playing={music.playing}
          available={music.available}
          onToggle={music.toggle}
        />
      )}
    </>
  )
}
