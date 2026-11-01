# FE-03 · Thư viện & thành phần shadcn/ui

Nguyên tắc: **dùng thành phần đã có trước, không thêm thư viện cho việc vài dòng làm được**; mỗi thư viện thêm phải có lý do.

## Thành phần shadcn/ui cần thêm (`npx shadcn add …` ở E0)
`button` · `card` · `input` · `textarea` · `label` · `radio-group` · `form` · `dialog` · `dropdown-menu` · `carousel` · `skeleton` · `sonner` (toast)

## Thư viện ngoài
| Thư viện | Dùng cho | Ghi chú |
|---|---|---|
| `react-hook-form`, `zod`, `@hookform/resolvers` | form + kiểm tra | đi kèm shadcn `form` |
| `embla-carousel-react` | slide album | đi kèm shadcn `carousel` |
| `lucide-react` | biểu tượng (nhạc, gửi, đóng…) | đi kèm shadcn |
| `sonner` | thông báo | đi kèm shadcn |
| `vitest`, `@testing-library/react`, `jsdom` | test đơn vị/thành phần | |
| `@playwright/test` | E2E tối thiểu | chỉ dev |

## Việc tự viết (không thêm thư viện)
| Việc | Cách làm |
|---|---|
| Đếm ngược | `setInterval` 1 giây + hàm thuần `getRemaining` |
| Lịch tháng 11/2026 | lưới tự tính (ngày đầu tháng, số ngày), vài chục dòng |
| `.ics` | chuỗi văn bản chuẩn iCalendar, tải bằng `Blob` + thẻ `a download` |
| Link Google Calendar | `https://calendar.google.com/calendar/render?action=TEMPLATE&…` |
| Hiện khi cuộn | `IntersectionObserver` |
| Lightbox | shadcn `Dialog` + trạng thái chỉ số ảnh |
| Phát nhạc | phần tử `HTMLAudioElement`, vòng lặp, `visibilitychange` |

## Không dùng
Router (một trang), thư viện state toàn cục (state cục bộ + hook đủ), thư viện animation nặng (CSS + IntersectionObserver đủ; cân nhắc lại chỉ khi UI/UX thật sự cần).

## Phông chữ
`@fontsource-variable/*` hoặc file tự host; chỉ nạp phần chữ Latin + Vietnamese để nhẹ.
