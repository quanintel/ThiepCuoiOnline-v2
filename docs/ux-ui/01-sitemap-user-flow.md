# UX-01 · Sitemap & luồng người dùng

Bố cục lấy cảm hứng từ trang mẫu (chỉ bố cục, không lấy phối màu): **một trang, một cột, cuộn dọc, mobile-first**, mở đầu bằng màn bìa có nút "Mở thiệp".

## Sitemap (thứ tự cuộn)
```
[0] Cover (overlay toàn màn hình)  → "Mở thiệp"
[1] Hero            "sắp về chung một nhà"
[2] Cô dâu chú rể   (ảnh + vai trò)
[3] Thông tin lễ    Thẻ Vu Quy · Thẻ Thành Hôn · Bố mẹ hai bên
[4] Album           slide ngang + lightbox
[5] Đếm ngược       2 bộ đếm + lịch tháng 11/2026 + Thêm vào lịch
[6] Chỉ đường       2 nút/khối bản đồ
[8] RSVP            form
[9] Sổ lưu bút      form + danh sách
[10] Hộp quà mừng   hộp quà → QR
[11] Lời kết + footer
(+) Nút nhạc nổi (góc dưới)
```
Không có menu điều hướng trên cùng (giống mẫu). Cân nhắc nút nhỏ "lên đầu trang" nếu trang dài (đề xuất, mức Could).

## Luồng chính
```
Mở link → Cover → [Mở thiệp] → (nhạc bật) → cuộn xem 1→11
                                   ├─ Chỉ đường → Google Maps (tab mới)
                                   ├─ Thêm vào lịch → Google Calendar / .ics
                                   ├─ Album → Lightbox
                                   ├─ RSVP → Gửi → Cảm ơn
                                   ├─ Lời chúc → Gửi → "Đang chờ duyệt" → (duyệt) → hiện chung
                                   └─ Hộp quà → QR → Lưu QR
```

## Trạng thái chung
| Thành phần | Trạng thái cần thiết kế |
|---|---|
| Form (RSVP/Lời chúc) | trống · đang nhập · lỗi từng ô · đang gửi · thành công · lỗi mạng |
| Danh sách lời chúc | đang tải (skeleton) · có dữ liệu · rỗng · lỗi + Tải lại · "Xem thêm" |
| Đếm ngược | đang đếm · đã diễn ra |
| Nhạc | chưa bật · đang phát · tắt · không phát được |
| Ảnh | đang tải (giữ chỗ) · lỗi (khung dự phòng) |

## Responsive
- Chính: 360–430 px. Desktop: khung điện thoại căn giữa, rộng tối đa khoảng 480 px, nền hai bên là tông phụ.
- Chiều cao bìa dùng `100dvh` (tránh thanh địa chỉ mobile).
