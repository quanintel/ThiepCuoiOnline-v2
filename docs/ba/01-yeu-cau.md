# BA-01 · Yêu cầu nghiệp vụ

Nguồn: [thiết kế đã duyệt](../superpowers/specs/2026-11-01-thiep-cuoi-online-design.md).

## 1. Bối cảnh & mục tiêu kinh doanh
Cặp đôi Kiều Anh Quân – Tôn Mai Hương cần một thiệp cưới online để gửi khách mời, thay/bổ sung thiệp giấy, thu xác nhận tham dự và lời chúc.

| Mục tiêu | Thước đo thành công |
|---|---|
| Khách nắm đúng thông tin 2 lễ | 0 sai sót nội dung (checklist PM-04) |
| Biết số khách tham dự từng lễ | RSVP vào Sheet, đọc được theo lễ |
| Tạo cảm xúc, lưu kỷ niệm | Lời chúc công khai hiển thị đẹp, có duyệt |
| Tiện mừng cưới | Mở được QR, lưu được ảnh QR |

## 2. Các bên liên quan (stakeholder)
| Vai trò | Người | Quan tâm |
|---|---|---|
| Chủ sản phẩm / người duyệt | Quân (và Hương) | Nội dung đúng, đẹp, nhận dữ liệu, tự deploy VPS |
| Người dùng cuối | Khách mời (họ hàng, bạn bè) | Xem nhanh trên điện thoại, gửi RSVP/lời chúc dễ |
| Người xây dựng | BA/PM/UI-UX/FE (cùng một đội) | Yêu cầu rõ để làm |

## 3. Phạm vi
**Trong phạm vi:** 12 phần của trang (xem thiết kế §5), nhạc nền, RSVP, sổ lưu bút công khai có duyệt, QR mừng cưới, bundle tĩnh, mã Apps Script + hướng dẫn.

**Ngoài phạm vi:** backend tự viết, CMS, đăng nhập, nhiều cặp đôi/mẫu, đa ngôn ngữ, tự động duyệt lời chúc, thu số điện thoại, trang quản trị, DevOps (chủ dự án tự làm).

## 4. Yêu cầu chức năng (FR)
| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-01 | Màn bìa với tên, ngày và nút "Mở thiệp"; bấm mở vào thiệp và bật nhạc | Must |
| FR-02 | Hero: dòng "sắp về chung một nhà" | Đã bỏ (chủ dự án quyết định 01.11.2026) |
| FR-03 | Giới thiệu cô dâu chú rể (ảnh, vai trò Trưởng nam/Trưởng nữ) | Must |
| FR-04 | Hai thẻ lễ (Vu Quy, Thành Hôn) đủ giờ, ngày dương + âm, địa điểm; Vu Quy có thêm "Địa chỉ cũ" | Must |
| FR-05 | Thông tin bố mẹ hai bên | Must |
| FR-06 | Album slide ngang, vuốt/mũi tên, chạm mở lightbox | Must |
| FR-07 | Đếm ngược riêng từng lễ | Must |
| FR-08 | Lịch tháng 11/2026 đánh dấu ngày 24 | Should |
| FR-09 | "Thêm vào lịch" từng lễ (Google Calendar + `.ics`) | Should |
| FR-10 | "Chỉ đường" từng địa điểm (link Google Maps) | Must |
| FR-11 | Lịch trình ngày cưới | Đã bỏ (chủ dự án quyết định 01.11.2026) |
| FR-12 | RSVP ghi vào Google Sheet | Must |
| FR-13 | Gửi lời chúc, ghi Sheet, chờ duyệt | Must |
| FR-14 | Hiển thị công khai lời chúc đã duyệt | Must |
| FR-15 | Hộp quà + 2 QR (chú rể, cô dâu) + lưu ảnh QR | Must |
| FR-16 | Nhạc nền, nút bật/tắt nổi | Must |
| FR-17 | Lời kết + footer | Must |
| FR-18 | Thẻ Open Graph để chia sẻ link đẹp | Must |

## 5. Yêu cầu phi chức năng (NFR)
| ID | Yêu cầu |
|---|---|
| NFR-01 | Mobile-first (360–430 px chính), desktop hiển thị khung điện thoại căn giữa |
| NFR-02 | LCP dưới 2,5 giây trên 4G; JS ban đầu khoảng 200 KB gzip trở xuống; ảnh WebP lazy-load |
| NFR-03 | Chạy tốt trên Safari iOS, Chrome Android, webview Zalo và Facebook |
| NFR-04 | A11y cơ bản: tương phản đạt WCAG AA, điều khiển bằng bàn phím, nhãn form, `prefers-reduced-motion` |
| NFR-05 | Bảo mật: không có bí mật trong bundle; URL Apps Script là công khai nên Apps Script tự kiểm tra đầu vào; chống XSS (render lời chúc dạng text) |
| NFR-06 | Build tĩnh `dist/`, cấu hình qua biến môi trường (`VITE_*`) |
| NFR-07 | Chỉ tiếng Việt |

## 6. Giả định & phụ thuộc
- Chủ dự án gửi: ảnh album/cặp đôi, nhạc, QR, lịch trình, link Google Maps, ảnh OG, domain.
- Chủ dự án tạo Google Sheet và deploy Apps Script bằng hướng dẫn.
- Họ "Đào/Tôn" của nhà gái: chủ dự án đã xác nhận đúng như ghi (01.11.2026).
