# FE-06 · Chiến lược kiểm thử

Tinh thần: **kiểm thử vừa đủ, tập trung vào logic dễ sai**. Không đặt mục tiêu phủ 80% mã giao diện.

## Tầng 1 · Đơn vị (Vitest) – bắt buộc cho logic thuần
| Mô-đun | Hành vi cần chứng minh |
|---|---|
| `lib/countdown.ts` | `getRemaining` đúng ngày/giờ/phút/giây; trả `done: true` khi đã qua; không phụ thuộc múi giờ máy (dùng mốc ISO có `+07:00`) |
| `lib/calendar.ts` | `.ics` có `DTSTART/DTEND` đúng giờ VN, xuống dòng CRLF, escape dấu phẩy/chấm phẩy; URL Google Calendar có `dates` đúng định dạng |
| `lib/validation.ts` | tên rỗng/quá 60 ký tự, lời chúc quá 300, số người ngoài 1–10, `attendance` lạ → lỗi; trim khoảng trắng |
| `lib/throttle.ts` | `canSubmit` chặn lần gửi thứ hai trong 30 giây, cho phép sau đó |
| `lib/pendingWishes.ts` | thêm/đọc/xoá; hợp nhất với danh sách duyệt đúng |
| `lib/api.ts` | ánh xạ phản hồi/lỗi thành `ApiError.kind` đúng; chế độ mock |
| Lịch tháng | ngày đầu tháng 11/2026 là Chủ nhật; có 30 ngày; ngày 24 là Thứ Ba |

## Tầng 2 · Thành phần (Testing Library)
- `RsvpForm`, `WishForm`: hiện lỗi từng ô; không gọi API khi không hợp lệ; giữ nội dung khi API lỗi; honeypot không hiển thị cho người dùng.
- `WishList`: render văn bản thuần (một lời chúc chứa `<script>`/HTML hiện nguyên chữ); rỗng, lỗi, "Xem thêm".
- `CeremonyCard`: hiện đủ giờ/địa điểm; Vu Quy có "Địa chỉ cũ", Thành Hôn không.
- `Cover`: bấm "Mở thiệp" gọi callback mở và bật nhạc.

## Tầng 3 · E2E (Playwright, mức tối thiểu, API chạy mock)
1. Cover → Mở thiệp → thấy Hero, không có chữ "Chúng tôi".
2. Hai thẻ lễ hiển thị đúng thông tin.
3. Gửi RSVP hợp lệ → thấy lời cảm ơn.
4. Gửi lời chúc → thấy "Đang chờ duyệt".
5. Mở hộp quà → thấy 2 QR.
Chạy ở 2 viewport: iPhone 13 và Pixel 5, cộng một lượt desktop.

## Tầng 4 · Kiểm tay trước phát hành (không tự động hoá được)
Safari iOS, Chrome Android, webview Zalo, webview Facebook: nhạc, lưu QR, `.ics`, lightbox, form, Chỉ đường. Ghi kết quả vào PM-04.

## Kiểm thử tích hợp thật
Sau khi chủ dự án deploy Apps Script: một lượt thử thật RSVP + lời chúc + duyệt + hiển thị (E5-T4), không đưa vào CI.

## Nguyên tắc
- Viết test trước cho logic thuần (TDD); giao diện thì test sau khi đã dựng.
- Test không gọi mạng thật; dùng mock `fetch`.
