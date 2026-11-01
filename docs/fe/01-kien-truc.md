# FE-01 · Kiến trúc

## Tổng quan
SPA một trang, tĩnh. Không router (một trang, không có đường dẫn con). Dữ liệu nội dung nằm trong mã (`content.ts`); chỉ RSVP và lời chúc đi qua mạng tới Google Apps Script.

```
Trình duyệt ──► Nginx (dist/ tĩnh)
     │
     └──► Google Apps Script (/exec) ──► Google Sheet (RSVP, Wishes)
```

## Công nghệ
Vite + React 18 + TypeScript (strict) · Tailwind CSS · shadcn/ui (Radix) · react-hook-form + zod · Embla Carousel (qua shadcn `Carousel`) · Sonner · Vitest + Testing Library · Playwright (tối thiểu). Phiên bản cụ thể ghim trong `package.json` khi khởi tạo (E0-T1).

## Nguyên tắc
1. **Nội dung tách khỏi giao diện:** mọi chữ/giờ/địa chỉ/đường dẫn ảnh ở `src/config/content.ts`; component chỉ nhận dữ liệu qua props. Sửa nội dung một chỗ.
2. **Mỗi phần của trang là một feature** (`src/features/<ten>/`), tự chứa component + hook + test; không import chéo giữa các feature (chỉ qua `lib/`, `components/ui/`, `config/`).
3. **Logic thuần tách khỏi React** để test dễ: đếm ngược, tạo `.ics`/link lịch, kiểm tra form, giãn cách gửi.
4. **Một lớp API duy nhất** (`src/lib/api.ts`), có chế độ mock bằng env, là nơi duy nhất gọi `fetch` tới Apps Script.
5. **Không lưu bí mật** trong bundle; URL Apps Script lấy từ `import.meta.env.VITE_API_URL`.
6. **Hiệu năng mặc định:** tách mã (`React.lazy`) cho phần nặng không nằm trên màn hình đầu (Album/lightbox, Dialog QR); ảnh WebP có `width/height`, `loading="lazy"` (trừ ảnh hero).
7. **Render lời chúc dạng văn bản thuần** (React tự thoát ký tự); không dùng `dangerouslySetInnerHTML`.

## Biến môi trường
| Biến | Ý nghĩa | Ví dụ |
|---|---|---|
| `VITE_API_URL` | URL web app Apps Script (`.../exec`) | `https://script.google.com/macros/s/XXX/exec` |
| `VITE_USE_MOCK` | `true` dùng dữ liệu giả, không gọi mạng | `true` / `false` |
| `VITE_SITE_URL` | Domain thật, dùng cho OG image tuyệt đối | `https://thiep.example.com` |
| `VITE_BASE_PATH` | Đường dẫn gốc khi đặt ở thư mục con | `/` |
Có file `.env.example` (không chứa giá trị thật) và `.env.production` do chủ dự án điền khi build.

## Luồng dữ liệu
- **Wishes:** `useWishes()` gọi `fetchWishes()` khi mount; kết quả hợp nhất với danh sách "chờ duyệt" cục bộ (localStorage) → nếu id đã có trong danh sách duyệt thì bỏ nhãn chờ.
- **RSVP/Wish gửi:** form → zod kiểm tra → `canSubmit()` (giãn cách) → `submitRsvp/submitWish` → toast + cập nhật UI.

## Xử lý lỗi
- Lớp API ném `ApiError` (`kind: 'network' | 'server' | 'validation'`); UI hiện thông điệp tiếng Việt tương ứng, không mất nội dung form.
- Không dùng `catch` im lặng ngoài trường hợp có chủ đích (nhạc không phát).
