# FE-02 · Cấu trúc thư mục

Đây là **cấu trúc mục tiêu** của mã nguồn (chưa tạo). Mỗi mục ghi trách nhiệm.

```
ThiepCuoiOnline-v2/
├─ docs/                          # tài liệu dự án (BA/PM/UX/FE) – đã có
├─ apps-script/
│  ├─ Code.gs                     # doGet/doPost: ghi RSVP, Wishes; đọc lời chúc đã duyệt
│  ├─ appsscript.json             # manifest (múi giờ Asia/Ho_Chi_Minh, quyền truy cập)
│  └─ README.md                   # hướng dẫn tạo Sheet + deploy web app
├─ public/
│  ├─ og-image.jpg                # ảnh chia sẻ 1200×630
│  ├─ favicon.svg
│  ├─ audio/nhac-nen.mp3          # nhạc nền (chủ dự án cung cấp)
│  ├─ qr/qr-chu-re.webp  qr-co-dau.webp
│  └─ images/…                    # album, ảnh cặp đôi (WebP, nhiều kích cỡ)
├─ deploy/
│  └─ nginx.conf.example          # cấu hình Nginx mẫu (tham khảo)
├─ src/
│  ├─ main.tsx                    # điểm vào
│  ├─ App.tsx                     # ghép các feature theo thứ tự trang
│  ├─ index.css                   # Tailwind + biến token (UX-03)
│  ├─ types.ts                    # Ceremony, Wish, RsvpInput, WishInput…
│  ├─ config/
│  │  ├─ content.ts               # TOÀN BỘ nội dung thiệp (BA-05)
│  │  └─ env.ts                   # đọc và kiểm tra VITE_*
│  ├─ components/
│  │  ├─ ui/                      # shadcn/ui sinh ra (button, card, dialog…)
│  │  └─ Section.tsx              # khung phần + hiệu ứng hiện khi cuộn
│  ├─ features/
│  │  ├─ cover/                   # Cover.tsx, useOpenInvitation
│  │  ├─ hero/                    # Hero.tsx
│  │  ├─ couple/                  # Couple.tsx
│  │  ├─ ceremonies/              # CeremonyCard.tsx, Families.tsx
│  │  ├─ album/                   # Album.tsx, Lightbox.tsx
│  │  ├─ countdown/               # CountdownBlock.tsx, MonthCalendar.tsx, AddToCalendar.tsx
│  │  ├─ schedule/                # Schedule.tsx
│  │  ├─ rsvp/                    # RsvpForm.tsx
│  │  ├─ guestbook/               # WishForm.tsx, WishList.tsx, useWishes.ts
│  │  ├─ gift/                    # GiftBoxes.tsx, QrDialog.tsx
│  │  ├─ music/                   # MusicButton.tsx, useMusic.ts
│  │  └─ footer/                  # Closing.tsx
│  ├─ hooks/
│  │  ├─ useCountdown.ts
│  │  └─ useReveal.ts             # IntersectionObserver
│  ├─ lib/
│  │  ├─ api.ts                   # fetchWishes, submitRsvp, submitWish (+ mock)
│  │  ├─ countdown.ts             # getRemaining (thuần)
│  │  ├─ calendar.ts              # googleCalendarUrl, buildIcs (thuần)
│  │  ├─ validation.ts            # rsvpSchema, wishSchema (zod)
│  │  ├─ throttle.ts              # canSubmit, markSubmitted (localStorage)
│  │  ├─ pendingWishes.ts         # lưu/đọc lời chúc chờ duyệt cục bộ
│  │  └─ utils.ts                 # cn() của shadcn
│  └─ test/                       # setup Vitest
├─ tests/
│  └─ e2e/                        # Playwright: luồng chính
├─ index.html                     # lang="vi", meta OG tĩnh
├─ vite.config.ts  tailwind.config.ts  tsconfig*.json  components.json
├─ .env.example
├─ package.json
└─ README.md                      # cách chạy, build, deploy ngắn gọn
```

## Quy ước
- Tên file component: `PascalCase.tsx`; hook: `useXxx.ts`; thư mục feature: chữ thường.
- Mỗi file một trách nhiệm; file nào quá khoảng 200 dòng thì tách.
- Test đặt cạnh mã (`*.test.ts(x)`) cho logic; E2E ở `tests/e2e`.
- Đường dẫn import dùng alias `@/` trỏ tới `src/`.
