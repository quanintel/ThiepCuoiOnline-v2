# FE-04 · Hợp đồng API (Google Apps Script)

Web app của Apps Script, triển khai "Execute as: Me", "Who has access: Anyone". URL dạng `https://script.google.com/macros/s/<ID>/exec`.

## Vì sao thiết kế như vậy (CORS)
Apps Script không trả header CORS tuỳ chỉnh cho preflight. Nên:
- **Đọc:** `GET` đơn giản (không header tuỳ chỉnh) → không có preflight.
- **Ghi:** `POST` với `Content-Type: text/plain;charset=utf-8` và thân là chuỗi JSON → là "simple request", không có preflight. Apps Script `JSON.parse(e.postData.contents)`.
- Phản hồi luôn là JSON dạng `ContentService.createTextOutput(...).setMimeType(JSON)`. Trình duyệt theo chuyển hướng 302 của Google; dùng `fetch` mặc định (`redirect: 'follow'`).

## Phản hồi chung
```json
{ "ok": true,  "data": { } }
{ "ok": false, "error": "validation" | "rate" | "server", "message": "văn bản ngắn" }
```

## `GET ?action=wishes`
Trả các lời chúc có `approved = TRUE`, mới nhất trước, tối đa 200 dòng.
```json
{ "ok": true, "data": [
  { "id": "w_8f3k2", "name": "Nguyễn A", "message": "Chúc mừng!", "createdAt": "2026-11-05T09:30:00+07:00" }
] }
```

## `POST` — ghi RSVP
```json
{ "action": "rsvp", "name": "Nguyễn A", "attendance": "both", "guests": 2, "note": "", "hp": "" }
```
- `attendance` ∈ `vuquy | thanhhon | both | none`.
- Trả `{ "ok": true, "data": { "id": "r_..." } }`.

## `POST` — ghi lời chúc
```json
{ "action": "wish", "name": "Nguyễn A", "message": "Chúc mừng!", "hp": "" }
```
- Trả `{ "ok": true, "data": { "id": "w_..." } }`. Dòng mới có `approved` trống/FALSE.

## Kiểm tra phía Apps Script (không tin client)
| Trường | Quy tắc |
|---|---|
| `name` | 1–60 ký tự sau khi cắt khoảng trắng |
| `message`, `note` | `message` 1–300; `note` 0–300 |
| `guests` | số nguyên 1–10 |
| `attendance` | một trong 4 giá trị |
| `hp` | phải rỗng; nếu có giá trị → trả `ok: true` giả nhưng **không ghi** |
| Ký tự đầu `=`,`+`,`-`,`@` | thêm dấu `'` phía trước để chống chèn công thức vào Sheet |
| Tần suất | `LockService` + chặn lặp nội dung giống hệt trong 60 giây |
- Gán `id` và `createdAt` (ISO 8601 múi `+07:00`) phía Apps Script.
- `GET wishes` cache bằng `CacheService` 30–60 giây; xoá cache khi có lời chúc mới được ghi (vẫn chờ duyệt thì không cần).

## Cấu trúc Sheet
| Tab | Cột (hàng 1 là tiêu đề) |
|---|---|
| `RSVP` | `id`, `createdAt`, `name`, `attendance`, `guests`, `note` |
| `Wishes` | `id`, `createdAt`, `name`, `message`, `Duyệt` (checkbox) |

## Lớp FE (`src/lib/api.ts`)
```ts
fetchWishes(): Promise<Wish[]>
submitRsvp(input: RsvpInput): Promise<{ id: string }>
submitWish(input: WishInput): Promise<{ id: string }>
class ApiError extends Error { kind: 'network' | 'server' | 'validation' }
```
Khi `VITE_USE_MOCK=true`: trả dữ liệu giả có độ trễ nhỏ, `submit*` luôn thành công.

## `GET ?action=status&ids=w_1,w_2` (thêm 01.11.2026)
Dùng để web gỡ các lời "Đang chờ duyệt" đã bị xoá khỏi Sheet (lời chờ duyệt chỉ lưu ở trình duyệt người gửi).
- `ids`: tối đa 50 id dạng `w_xxxxxxxx`, ngăn cách bằng dấu phẩy; id sai định dạng bị bỏ qua.
- Trả `{ "ok": true, "data": { "pending": ["w_2"] } }`: chỉ gồm id **còn trong Sheet và chưa duyệt**. Id đã duyệt (có trong `action=wishes`) hoặc đã bị xoá thì không có.
- Không dùng cache. API cũ chưa có action này trả `error: "validation"`; web khi đó giữ nguyên danh sách chờ duyệt.
- Cache `action=wishes` giảm từ 60 xuống 20 giây; dòng thiếu `id` hoặc nội dung (xoá dở) bị bỏ qua.
