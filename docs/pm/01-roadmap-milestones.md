# PM-01 · Roadmap & mốc

Ngày cưới: **24.11.2026**. Hôm nay: 01.11.2026, còn khoảng 23 ngày. Cần phát hành và gửi thiệp sớm, mục tiêu **link thiệp sẵn sàng gửi khách trước 10.11.2026**.

## Mốc (milestone)
| Mốc | Nội dung | Epic | Hạn đề xuất | Cổng chấp nhận |
|---|---|---|---|---|
| M0 | Khởi tạo dự án, khung trang, design tokens | E0 | 03.11 | `npm run build` ra `dist/`, trang trống chạy được |
| M1 | Phần tĩnh hoàn chỉnh: bìa, hero, cặp đôi, hai lễ, gia đình, lịch trình, album | E1 E2 E3 | 06.11 | Nội dung khớp BA-05; duyệt giao diện bởi chủ dự án |
| M2 | Đếm ngược, lịch, bản đồ | E4 | 07.11 | Đúng giờ VN; thêm lịch đúng |
| M3 | Dữ liệu: Apps Script + RSVP + lời chúc | E5 E6 E7 | 09.11 | RSVP/lời chúc ghi Sheet thật, duyệt hiện đúng |
| M4 | QR + nhạc | E8 | 09.11 | QR lưu được; nhạc phát sau "Mở thiệp" |
| M5 | Chất lượng: hiệu năng, a11y, kiểm thử webview | E9 | 10.11 | Đạt NFR-02..04 |
| M6 | Đóng gói & phát hành | E10 | 10.11 | Checklist PM-04 xanh, chủ dự án deploy được |

Ngày là đề xuất, chủ dự án điều chỉnh. Mốc M3 phụ thuộc việc chủ dự án deploy Apps Script (xem rủi ro R-02).

## Thứ tự phụ thuộc
E0 → (E1, E2, E3, E4 song song) → E5 → (E6, E7) → E8 → E9 → E10. Nội dung từ chủ dự án (ảnh, QR, nhạc…) là phụ thuộc ngoài, theo dõi tại PM-03.

## Quy trình làm việc
- Một nhánh git mỗi epic, commit nhỏ theo task, merge vào `main` khi qua cổng mốc.
- Mỗi task có Definition of Done riêng trong file epic; PR/commit ghi mã task (vd `E4-T2`).
