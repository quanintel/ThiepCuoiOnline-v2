# E6 · RSVP

Mốc **M3**. Phụ thuộc E5. FR-12. UC-05. Quy tắc BR-05, BR-06, BR-08.

## E6-T1 · Kiểm tra dữ liệu & giãn cách (FE)
- **Files:** `src/lib/validation.ts`, `validation.test.ts`, `src/lib/throttle.ts`, `throttle.test.ts`.
- **Giao diện:** `rsvpSchema` (zod) và `wishSchema`; `canSubmit(key: string, now?: number): boolean`; `markSubmitted(key: string, now?: number): void` (lưu `localStorage`, khoảng cách 30 giây).
- **Test:** `name` rỗng, `"   "`, 61 ký tự → lỗi; 60 ký tự → hợp lệ; `guests` 0, 11, 1.5 → lỗi; 1 và 10 → hợp lệ; `attendance` ngoài 4 giá trị → lỗi; `note` 301 ký tự → lỗi; `trim` được áp dụng; `canSubmit` trả `false` trong 30 giây sau `markSubmitted`, `true` sau đó; khi `localStorage` ném lỗi (Safari chế độ riêng tư, bị chặn) `canSubmit` trả `true` và `markSubmitted` không ném.
- [ ] Test · [ ] Chạy thấy lỗi · [ ] Cài đặt · [ ] Chạy thấy qua · [ ] Commit

## E6-T2 · Form RSVP (UX + FE)
- **Files:** `src/features/rsvp/RsvpForm.tsx`, `RsvpForm.test.tsx`.
- **Hiển thị:** họ tên, `RadioGroup` 4 lựa chọn, số người (1–10, mặc định 1), lời nhắn, ô honeypot ẩn (không `display:none` đơn giản: ẩn khỏi người dùng và trình đọc màn hình, `tabIndex=-1`, `autocomplete=off`), nút "Gửi xác nhận".
- **Hành vi:** không hợp lệ → lỗi từng ô, focus ô đầu tiên lỗi, không gọi API; hợp lệ → `canSubmit`→`submitRsvp`→ toast thành công và hiện lời cảm ơn; `ApiError` → toast lỗi, giữ nội dung; nếu chọn `none` thì số người bị bỏ qua (gửi 1).
- **Test:** (1) không điền, bấm gửi → thấy lỗi, `submitRsvp` không được gọi; (2) điền hợp lệ → `submitRsvp` gọi với đúng dữ liệu; (3) API ném lỗi → nội dung vẫn còn, thấy thông báo lỗi; (4) honeypot có giá trị → giả vờ thành công, không gọi API; (5) bấm "Gửi xác nhận" hai lần liên tiếp khi lần đầu đang chờ → `submitRsvp` chỉ được gọi một lần (nút bị vô hiệu khi đang gửi).
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E6-T3 · Gắn vào trang & kiểm tay (FE)
- **Files:** `src/App.tsx`.
- **Việc:** đặt `RsvpForm` đúng thứ tự sitemap; kiểm tay trên iPhone, Android, webview (bàn phím ảo không che nút gửi).
- [ ] Gắn · [ ] Kiểm tay

## DoD của epic
Gửi RSVP thật ghi vào Sheet (cùng E5-T4); lỗi mạng không mất nội dung.
