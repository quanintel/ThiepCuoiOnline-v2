# E5 · Apps Script & lớp API

Mốc **M3**. Phụ thuộc E0. FR-12, 13, 14. Hợp đồng: [FE-04](../../fe/04-api-contract-apps-script.md).

## E5-T1 · Mã Apps Script + hướng dẫn (FE)
- **Files:** `apps-script/Code.gs`, `apps-script/appsscript.json`, `apps-script/README.md`.
- **Hàm:** `doGet(e)` (action `wishes`), `doPost(e)` (action `rsvp` | `wish`), `validate_(payload)`, `appendRow_(sheetName, row)`, `json_(obj)`.
- **Việc:** kiểm tra đầu vào theo bảng ở FE-04; honeypot; chống công thức Sheet (`'` đầu chuỗi nếu bắt đầu bằng `= + - @`); `LockService`; `CacheService` cho GET; múi giờ `Asia/Ho_Chi_Minh`; tạo tab và tiêu đề nếu chưa có.
- **README:** các bước tạo Sheet, dán mã, deploy web app (Execute as Me, Anyone), sao URL `/exec`, cách duyệt (đánh dấu cột "Duyệt"), cách deploy lại khi sửa mã.
- **Kiểm chứng (kiểm tay trong trình soạn Apps Script):** hàm `selfTest_()` gọi `validate_` với các ca đúng/sai và ghi log kết quả.
- [ ] Viết mã · [ ] `selfTest_` · [ ] README · [ ] Commit

## E5-T2 · Lớp API phía FE (FE)
- **Files:** `src/lib/api.ts`, `src/lib/api.test.ts`.
- **Giao diện:** `fetchWishes(): Promise<Wish[]>`; `submitRsvp(i: RsvpInput): Promise<{ id: string }>`; `submitWish(i: WishInput): Promise<{ id: string }>`; `class ApiError extends Error { kind: 'network' | 'server' | 'validation' }`.
- **Hành vi:** GET `?action=wishes`; POST `Content-Type: text/plain;charset=utf-8` thân JSON; `ok:false` → `ApiError` theo `error`; lỗi `fetch` → `kind: 'network'`; `useMock` → dữ liệu giả, độ trễ nhỏ.
- **Test (mock `fetch`):** thành công trả dữ liệu; `ok:false, error:'validation'` → `kind: 'validation'`; `fetch` ném lỗi → `kind: 'network'`; POST gửi đúng header và JSON; chế độ mock không gọi `fetch`.
- [ ] Test · [ ] Chạy thấy lỗi · [ ] Cài đặt · [ ] Chạy thấy qua · [ ] Commit

## E5-T3 · Thử CORS/redirect sớm (FE)
- **Việc:** ngay khi chủ dự án có URL `/exec`, thử từ trình duyệt thật (Chrome, Safari iOS) và webview Zalo/Facebook: GET lời chúc, POST RSVP.
- **Kiểm chứng:** ghi kết quả vào PM-03 (R-03); nếu lỗi, đổi cách gửi (ví dụ form `application/x-www-form-urlencoded`) và cập nhật FE-04.
- [ ] Thử Chrome · [ ] Thử iOS · [ ] Thử webview · [ ] Ghi kết quả

## E5-T4 · Tích hợp thật đầu cuối (FE + Chủ)
- **Việc:** gửi một RSVP và một lời chúc thật → thấy trong Sheet đủ cột → đánh dấu "Duyệt" → thấy trên thiệp trong vòng khoảng 1 phút (cache).
- **Kiểm chứng:** tick checklist PM-04 phần Chức năng.
- [ ] RSVP vào Sheet · [ ] Lời chúc vào Sheet · [ ] Duyệt hiện lên

## DoD của epic
`api.ts` qua test; Apps Script deploy thử thành công; có tài liệu cho chủ dự án.
