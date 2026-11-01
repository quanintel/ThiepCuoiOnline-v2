# PM-04 · Checklist trước phát hành (Definition of Done toàn dự án)

## Nội dung (người duyệt: chủ dự án)
- [ ] Tên: Kiều Anh Quân, Tôn Mai Hương; thứ tự đúng ý
- [x] Họ nhà gái đã xác nhận (Đào/Tôn)
- [ ] Lễ Vu Quy: 13:00 Thứ 3, 24.11.2026 (16.10 Bính Ngọ), Tại Tư Gia, Thôn Phú Cường, Ngọc Thiện, Bắc Ninh; có dòng Địa chỉ cũ
- [ ] Lễ Thành Hôn: 17:00 Thứ 3, 24.11.2026 (16.10 Bính Ngọ), Minh Dương Palace, Số 98 Hồng Đô, Phú Đô, Từ Liêm, Hà Nội
- [ ] Tên bố mẹ hai bên đúng chính tả
- [ ] Không còn chữ "Chúng tôi" ở hero, không còn Lời cảm tạ, Thông tin cần biết, Chia sẻ thiệp, lời kể khoảnh khắc
- [ ] Link "Chỉ đường" mở đúng nơi
- [ ] QR đúng chủ tài khoản, quét thử được
- [ ] Không còn nội dung giữ chỗ (lorem, ảnh tạm)

## Chức năng
- [ ] RSVP thật ghi vào Sheet đủ cột; lỗi mạng giữ nội dung
- [ ] Lời chúc: gửi → chờ duyệt → duyệt trong Sheet → hiện công khai
- [ ] Honeypot và giãn cách hoạt động; Apps Script từ chối đầu vào sai
- [ ] Đếm ngược đúng giờ VN trên máy đặt múi giờ khác
- [ ] Thêm vào lịch (Google/`.ics`) đúng giờ
- [ ] Nhạc phát sau Mở thiệp; tắt/bật được

## Chất lượng
- [ ] LCP dưới 2,5 giây trên 4G giả lập; JS ban đầu khoảng 200 KB gzip trở xuống
- [ ] Kiểm tay trên: Safari iOS, Chrome Android, webview Zalo, webview Facebook
- [ ] A11y: tương phản AA, dùng được bằng bàn phím, nhãn form, reduced-motion
- [ ] Không có lỗi console; không có bí mật trong `dist/`
- [ ] Thẻ OG hiển thị đúng khi dán link vào Zalo/Facebook

## Phát hành
- [ ] `dist/` build từ `main` sạch; biến `VITE_*` production đúng
- [ ] Hướng dẫn deploy + cấu hình Nginx mẫu giao cho chủ dự án
- [ ] Hướng dẫn Apps Script giao cho chủ dự án; chủ dự án đã deploy và thử
