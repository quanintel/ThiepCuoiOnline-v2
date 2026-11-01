# E0 · Khởi tạo & nền tảng

Mục tiêu: dự án chạy được, build ra `dist/`, có token, kiểu dữ liệu và nội dung nền. Mốc **M0**.
Tham chiếu: [FE-01](../../fe/01-kien-truc.md), [FE-02](../../fe/02-cau-truc-thu-muc.md), [UX-03](../../ux-ui/03-huong-thiet-ke-tokens.md).

## E0-T1 · Dựng dự án Vite + React + TS + Tailwind (FE)
- **Files:** `package.json`, `vite.config.ts`, `tsconfig*.json`, `tailwind.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `.env.example`, `.gitignore`.
- **Việc:** khởi tạo Vite template React-TS; bật `strict`; alias `@/` → `src/`; `base` đọc từ `VITE_BASE_PATH`; thêm Vitest + Testing Library + jsdom.
- **Kiểm chứng:** `npm run build` thành công; `npm test` chạy được 1 test mẫu.
- [ ] Dựng · [ ] Alias và base · [ ] Vitest chạy · [ ] Commit

## E0-T2 · Cài shadcn/ui và token (UX + FE)
- **Files:** `components.json`, `src/components/ui/*`, `src/index.css`, `src/lib/utils.ts`.
- **Việc:** `shadcn init`; thêm thành phần theo [FE-03](../../fe/03-thu-vien-shadcn.md); đặt biến màu/`--radius` theo UX-03; nạp phông tự host (Cormorant/Playfair + Be Vietnam Pro, subset Vietnamese).
- **Kiểm chứng:** trang thử hiển thị đúng tiếng Việt có dấu ở tiêu đề và nội dung; tương phản chữ chính/nền đo được trên AA.
- [ ] shadcn init · [ ] Thêm thành phần · [ ] Token · [ ] Phông · [ ] Commit

## E0-T3 · Kiểu dữ liệu & nội dung (BA + FE)
- **Files:** `src/types.ts`, `src/config/content.ts`, `src/config/env.ts`, test `src/config/content.test.ts`.
- **Giao diện (chốt tên để các epic khác dùng):**
  - `type CeremonyId = 'vuquy' | 'thanhhon'`
  - `interface Ceremony { id: CeremonyId; title: string; startsAt: string /* ISO có +07:00 */; weekdayLabel: string; dateLabel: string; lunarLabel: string; timeLabel: string; placeLabel: string; address: string; oldAddress?: string; mapUrl: string }`
  - `interface Family { side: 'groom' | 'bride'; father: string; mother: string }`
  - `interface Wish { id: string; name: string; message: string; createdAt: string }`
  - `interface RsvpInput { name: string; attendance: 'vuquy' | 'thanhhon' | 'both' | 'none'; guests: number; note?: string; hp?: string }`
  - `interface WishInput { name: string; message: string; hp?: string }`
  - `env.ts` xuất `env: { apiUrl: string; useMock: boolean; siteUrl: string }`, báo lỗi rõ khi `useMock=false` mà thiếu `apiUrl`.
- **Test:** (1) Vu Quy `startsAt` = `2026-11-24T13:00:00+07:00`, Thành Hôn = `2026-11-24T17:00:00+07:00`. (2) Vu Quy có `oldAddress`, Thành Hôn không. (3) không có chuỗi "Sân bóng" trong nội dung. (4) hero không chứa "Chúng tôi".
- [ ] Viết test · [ ] Chạy thấy lỗi · [ ] Viết `types.ts`, `content.ts` theo BA-05 · [ ] Chạy thấy qua · [ ] Commit

## E0-T4 · `index.html` & OG (FE)
- **Files:** `index.html`, `public/favicon.svg`, `public/og-image.jpg` (giữ chỗ).
- **Việc:** `lang="vi"`, `meta viewport` (có `viewport-fit=cover`), `title`, `description`, thẻ `og:*` và `twitter:card` với URL tuyệt đối từ `VITE_SITE_URL`.
- **Kiểm chứng:** `dist/index.html` chứa URL đầy đủ; Facebook Sharing Debugger/Zalo hiển thị thẻ (kiểm lại ở E10).
- [ ] Thẻ meta · [ ] Thay biến lúc build · [ ] Commit

## E0-T5 · Khung trang & `Section` (UX + FE)
- **Files:** `src/components/Section.tsx`, `src/hooks/useReveal.ts`, `src/App.tsx`.
- **Giao diện:** `Section({ id, title?, children })`; `useReveal(): { ref, visible }` (một lần).
- **Việc:** khung desktop (cột tối đa khoảng 480 px căn giữa); `App` ghép các feature theo [UX-01](../../ux-ui/01-sitemap-user-flow.md) (chỗ trống ban đầu).
- **Test:** `useReveal` đặt `visible=true` sau khi phần tử giao viewport (mock IntersectionObserver); tắt hiệu ứng khi `prefers-reduced-motion`.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## DoD của epic
Build xanh; test xanh; trang trống hiển thị khung đúng ở 390 px và desktop.
