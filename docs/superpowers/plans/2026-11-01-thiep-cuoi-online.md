# Thiệp cưới online Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng thiệp cưới online một trang cho Kiều Anh Quân & Tôn Mai Hương, build ra `dist/` tĩnh, nhận RSVP và lời chúc thật qua Google Sheets.

**Architecture:** SPA Vite + React, một trang cuộn dọc mobile-first; nội dung ở `src/config/content.ts`; mỗi phần của trang là một feature độc lập; một lớp API duy nhất (`src/lib/api.ts`) gọi Google Apps Script (GET đọc lời chúc đã duyệt, POST `text/plain` ghi RSVP/lời chúc).

**Tech Stack:** Vite, React 18, TypeScript strict, Tailwind, shadcn/ui, react-hook-form + zod, Embla (shadcn Carousel), Sonner, Vitest + Testing Library, Playwright (tối thiểu), Google Apps Script.

**Spec:** [docs/superpowers/specs/2026-11-01-thiep-cuoi-online-design.md](../specs/2026-11-01-thiep-cuoi-online-design.md)

Kế hoạch này là **chỉ mục**. Task chi tiết (file, giao diện, test, kiểm chứng) nằm trong `docs/pm/tasks/E*.md`; ngữ cảnh BA/UX/FE nằm trong `docs/ba`, `docs/ux-ui`, `docs/fe`. Người thực thi đọc cả spec và file epic của task đang làm.

## Global Constraints
- Stack cố định: Vite + React + TypeScript + Tailwind + shadcn/ui, SPA một trang, không router.
- Dữ liệu qua Google Apps Script web app; URL lấy từ `VITE_API_URL`, không ghi cứng.
- Build tĩnh `dist/` copy lên Nginx; chạy ở gốc domain, hỗ trợ `base` qua `VITE_BASE_PATH`; thẻ OG tĩnh trong `index.html` với URL tuyệt đối từ `VITE_SITE_URL`.
- Nhạc chỉ phát sau thao tác "Mở thiệp".
- Chỉ tiếng Việt; không i18n.
- Lễ Vu Quy: 13:00 Thứ 3, 24.11.2026 (tức 16.10 năm Bính Ngọ), "Tại Tư Gia", Thôn Phú Cường, Ngọc Thiện, Bắc Ninh; địa chỉ cũ Thôn An Lạc 1, Việt Ngọc, Tân Yên, Bắc Giang. **Không** hiển thị "Sân bóng An Lạc".
- Lễ Thành Hôn: 17:00 Thứ 3, 24.11.2026 (tức 16.10 năm Bính Ngọ), Minh Dương Palace, Số 98 Hồng Đô, Phú Đô, Từ Liêm, Hà Nội.
- Hero chỉ có "sắp về chung một nhà" (không có chữ "Chúng tôi"). Bỏ: lời cảm tạ, thông tin cần biết, chia sẻ thiệp, kể lại khoảnh khắc trong album, lịch trình ngày cưới.
- Giới hạn: tên 1–60 ký tự; lời chúc 1–300; lời nhắn RSVP 0–300; số người 1–10; giãn cách gửi 30 giây.
- Chỉ lời chúc có `Duyệt` = TRUE được trả ra; lời chúc hiển thị là văn bản thuần.
- Ngân sách: JS ban đầu khoảng 200 KB gzip trở xuống; LCP dưới 2,5 giây trên 4G; ảnh WebP lazy-load.
- Không có bí mật trong `dist/`. DevOps (Nginx, HTTPS) do chủ dự án làm.
- Giá trị màu/chữ trong UX-03 là đề xuất của UI/UX, có thể đổi.

## Review Focus
Các tình huống spec không nói nhưng dễ làm hỏng người dùng thật, kèm nơi có test:
1. **Lời chúc chứa HTML/script** → phải hiện nguyên chữ, không thực thi (E7-T4).
2. **Tên/lời chúc bắt đầu bằng `=`, `+`, `-`, `@`** → Apps Script thêm `'` phía trước, không chèn công thức vào Sheet (E5-T1 `selfTest_`).
3. **Khách đặt múi giờ máy khác Việt Nam** → đếm ngược và lịch vẫn theo giờ VN (E4-T1, E4-T4).
4. **`localStorage` bị chặn/hỏng (Safari chế độ riêng tư, webview)** → giãn cách và lời chờ duyệt không làm trang lỗi (E6-T1, E7-T1).
5. **Bấm gửi hai lần liên tiếp / mạng chậm** → chỉ một yêu cầu, nội dung không mất khi lỗi (E6-T2, E7-T3).

## Task (theo thứ tự thực hiện)
Phụ thuộc: E0 → (E1, E2, E3 song song) → E4 (cần dữ liệu lễ của E2) → E5 → (E6, E7) → E8 → E9 → E10. Mốc và ngày xem [PM-01](../../pm/01-roadmap-milestones.md).

| Epic | Nội dung | Task | File chi tiết |
|---|---|---|---|
| E0 | Khởi tạo, shadcn, token, kiểu dữ liệu, nội dung, OG, khung trang | T1–T5 | [E0](../../pm/tasks/E0-khoi-tao.md) |
| E1 | Hook mở thiệp, Cover, Hero, Cô dâu chú rể | T1–T4 | [E1](../../pm/tasks/E1-bia-hero-cap-doi.md) |
| E2 | Thẻ lễ, khối lễ + gia đình, link Maps, lời kết (lịch trình: đã bỏ) | T1–T5 | [E2](../../pm/tasks/E2-le-gia-dinh-ban-do-lich-trinh.md) |
| E3 | Ảnh album, slide ngang, lightbox | T1–T3 | [E3](../../pm/tasks/E3-album.md) |
| E4 | Đếm ngược, hook + khối, lịch tháng, thêm vào lịch | T1–T4 | [E4](../../pm/tasks/E4-dem-nguoc-lich.md) |
| E5 | Apps Script, lớp API, thử CORS, tích hợp thật | T1–T4 | [E5](../../pm/tasks/E5-apps-script-du-lieu.md) |
| E6 | Kiểm tra dữ liệu + giãn cách, form RSVP, gắn trang | T1–T3 | [E6](../../pm/tasks/E6-rsvp.md) |
| E7 | Lời chờ duyệt, `useWishes`, form lời chúc, danh sách | T1–T4 | [E7](../../pm/tasks/E7-so-luu-but.md) |
| E8 | Hộp quà + QR, nhạc nền, nối Mở thiệp | T1–T3 | [E8](../../pm/tasks/E8-qua-mung-nhac.md) |
| E9 | Hiệu năng, a11y, webview thật, E2E | T1–T4 | [E9](../../pm/tasks/E9-chat-luong-hieu-nang-a11y.md) |
| E10 | Build production, rà soát bí mật, bàn giao | T1–T3 | [E10](../../pm/tasks/E10-dong-goi-phat-hanh.md) |

## Tên giao diện dùng chung (chốt tại E0-T3, E4, E5, E6, E7, E8)
`Ceremony`, `Wish`, `RsvpInput`, `WishInput` (`src/types.ts`) · `getRemaining` (`lib/countdown.ts`) · `buildMonth` (`lib/month.ts`) · `googleCalendarUrl`, `buildIcs` (`lib/calendar.ts`) · `fetchWishes`, `submitRsvp`, `submitWish`, `ApiError` (`lib/api.ts`) · `rsvpSchema`, `wishSchema` (`lib/validation.ts`) · `canSubmit`, `markSubmitted` (`lib/throttle.ts`) · `addPending`, `getPending`, `reconcile` (`lib/pendingWishes.ts`) · `useWishes`, `useMusic`, `useCountdown`, `useOpenInvitation`, `useReveal`.

## Việc chủ dự án cần cung cấp (chặn một số task)
Ảnh cặp đôi + album, nhạc, 2 ảnh QR, link Maps, ảnh OG, domain, deploy Apps Script, xác nhận họ nhà gái. Bảng và hạn: [PM-03](../../pm/03-rui-ro.md).
