# BA-04 · Quy tắc nghiệp vụ & dữ liệu

| ID | Quy tắc |
|---|---|
| BR-01 | Cả hai lễ diễn ra **Thứ Ba, 24.11.2026** (tức 16.10 năm Bính Ngọ). Vu Quy 13:00, Thành Hôn 17:00, múi giờ Asia/Ho_Chi_Minh (UTC+7). |
| BR-02 | Vu Quy ghi "Tại Tư Gia", Thôn Phú Cường, Ngọc Thiện, Bắc Ninh, kèm dòng "Địa chỉ cũ: Thôn An Lạc 1, Việt Ngọc, Tân Yên, Bắc Giang". "Sân bóng An Lạc" **không** xuất hiện. |
| BR-03 | Thành Hôn tại Minh Dương Palace, Số 98 Hồng Đô, Phú Đô, Từ Liêm, Hà Nội. |
| BR-04 | Đếm ngược tính theo múi giờ VN, không theo múi giờ máy khách; sau giờ lễ chuyển sang trạng thái "đã diễn ra". |
| BR-05 | Họ tên 1–60 ký tự; lời chúc 1–300 ký tự; số người 1–10; lời nhắn RSVP tối đa 300 ký tự; cắt khoảng trắng đầu/cuối. |
| BR-06 | Chống spam: honeypot, giãn cách 30 giây giữa 2 lần gửi cùng thiết bị. Apps Script phải kiểm tra lại mọi giới hạn (không tin client). |
| BR-07 | Chỉ lời chúc có `Duyệt` = TRUE được API trả ra. Nội dung hiển thị là văn bản thuần (không HTML/đường link kích hoạt). |
| BR-08 | RSVP cho gửi lại, không khử trùng lặp; chủ thiệp gộp tay trong Sheet. Không thu số điện thoại. |
| BR-09 | Tiêu đề thiệp: "Anh Quân & Mai Hương" (thứ tự theo chủ dự án: Quân trước). Tên đầy đủ khi cần: Kiều Anh Quân, Tôn Mai Hương. |
| BR-10 | Họ nhà gái ("Đào"/"Tôn"): chủ dự án đã xác nhận đúng, giữ nguyên như nội dung đã chốt. |

## Mô hình dữ liệu Google Sheet
**Tab `RSVP`:** `id`, `createdAt` (ISO 8601, +07:00), `name`, `attendance` (`vuquy` / `thanhhon` / `both` / `none`), `guests` (số), `note`.

**Tab `Wishes`:** `id`, `createdAt` (ISO 8601), `name`, `message`, `approved` (TRUE/FALSE, đặt tiêu đề cột hiển thị là "Duyệt").

## Dữ liệu nội dung tĩnh (trong mã, không qua API)
Tệp `src/config/content.ts`: tên, hai lễ (id, tên, thời gian ISO, địa điểm, địa chỉ, link Maps), gia đình, album, QR, nhạc (lịch trình đã bỏ). Chi tiết xem [BA-05](05-noi-dung-thiep.md).
