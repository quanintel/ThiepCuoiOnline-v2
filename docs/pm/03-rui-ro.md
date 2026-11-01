# PM-03 · Rủi ro & phụ thuộc ngoài

## Rủi ro
| ID | Rủi ro | Khả năng | Tác động | Giảm thiểu | Chủ |
|---|---|---|---|---|---|
| R-01 | Thời gian ngắn (còn khoảng 23 ngày đến lễ) | Cao | Cao | Cắt phạm vi theo ưu tiên Must/Should; phát hành M5 trước 10.11 | PM |
| R-02 | Chủ dự án chưa deploy Apps Script kịp, FE chỉ chạy với mock | Trung bình | Cao | Viết `.gs` + hướng dẫn trong E5 sớm; FE có chế độ mock bật bằng env | PM/Chủ |
| R-03 | Apps Script bị lỗi CORS/redirect từ trình duyệt | Trung bình | Cao | Gửi POST dạng `text/plain`, đọc bằng GET; thử sớm trên webview thật (E5-T3) | FE |
| R-04 | Nhạc không phát trên iOS/webview | Cao | Trung bình | Chỉ phát sau thao tác "Mở thiệp"; nút bật/tắt; không phụ thuộc nhạc để hiểu nội dung | FE |
| R-05 | Spam/lời chúc không phù hợp | Trung bình | Trung bình | Duyệt thủ công, honeypot, giãn cách, kiểm tra ở Apps Script | FE/Chủ |
| R-06 | Nội dung sai/thiếu (họ nhà gái, link Maps, lịch trình) | Trung bình | Cao | Checklist PM-04; nội dung nằm một chỗ `content.ts` | BA |
| R-07 | Ảnh nặng làm chậm 4G | Trung bình | Trung bình | WebP, kích thước theo màn hình, lazy-load, ngân sách ở E9 | FE |
| R-08 | Webview Zalo/Facebook hành xử khác (tải `.ics`, lưu QR, phát nhạc) | Cao | Trung bình | Phương án dự phòng cho từng chức năng (BA-03); kiểm tra tay trên máy thật | FE |
| R-09 | Quota/độ trễ của Apps Script khi nhiều khách cùng mở | Thấp | Trung bình | Cache phản hồi lời chúc ngắn hạn phía Apps Script (CacheService) | FE |

## Phụ thuộc ngoài (chủ dự án cung cấp)
| Mục | Cần cho | Hạn mong muốn | Trạng thái |
|---|---|---|---|
| Ảnh cô dâu chú rể + ảnh album (6–10) | E1, E3 | 05.11 | ✅ đã giao (chọn 10 ảnh từ 45) |
| Nhạc nền (mp3, được dùng hợp pháp) | E8 | 07.11 | ✅ đã giao (nên nén nhỏ hơn) |
| 2 ảnh QR + tên chủ tài khoản | E8 | 07.11 | ✅ đã giao |
| Link chia sẻ Google Maps 2 địa điểm | E2 | 05.11 | ✅ đã giao |
| Lịch trình chi tiết ngày cưới | E2 | 05.11 | Đã bỏ (chủ dự án quyết định 01.11.2026) |
| Ảnh OG 1200×630 + domain thật | E0, E10 | 08.11 | ✅ domain thiepcuoi.quanka.pro; ảnh OG tạo từ ảnh album |
| Tài khoản Google tạo Sheet + deploy Apps Script | E5 | 06.11 | ✅ đã deploy (GET đã thử) |
| Xác nhận họ nhà gái (Đào/Tôn) | BA-05 | — | ✅ đã xác nhận |
