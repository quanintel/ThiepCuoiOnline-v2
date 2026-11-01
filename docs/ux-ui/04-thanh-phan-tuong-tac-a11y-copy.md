# UX-04 · Thành phần, tương tác, a11y, nội dung chữ

## Quyết định UX
| ID | Quyết định | Lý do |
|---|---|---|
| UX-D1 | "Chỉ đường" nằm **trong thẻ lễ** (mục 3), không có khối bản đồ riêng (mục 6) | Khách thấy địa điểm và đường đi cùng chỗ, ít cuộn; bỏ nhúng bản đồ nặng |
| UX-D2 | Mỗi lễ có đếm ngược riêng, xếp dọc | Hai giờ khác nhau cùng ngày |
| UX-D3 | "Thêm vào lịch" là một menu hai lựa chọn (Google Calendar / Tải .ics) | Webview khác nhau xử lý khác nhau |
| UX-D4 | Hộp quà: chạm để mở hộp thoại hai QR | Giống mẫu, gọn |
| UX-D5 | Lời chúc của chính khách hiện đầu danh sách kèm nhãn "Đang chờ duyệt" | Khách thấy lời mình đã được nhận |

## Thành phần & trạng thái (ánh xạ shadcn/ui)
| Thành phần | shadcn/ui | Trạng thái chính |
|---|---|---|
| Nút | `Button` | mặc định, hover, focus, disabled, đang gửi |
| Thẻ lễ, thẻ lời chúc | `Card` | — |
| Ô nhập | `Input`, `Textarea`, `Label` | lỗi (viền + chữ lỗi), disabled |
| Chọn lễ tham dự | `RadioGroup` | — |
| Số người | `Input type=number` hoặc nút −/+ | giới hạn 1–10 |
| Form có kiểm tra | `Form` (react-hook-form + zod) | lỗi từng ô |
| Hộp thoại QR | `Dialog` | mở, đóng bằng Esc/✕ |
| Menu thêm lịch | `DropdownMenu` | — |
| Thông báo | `Sonner` (toast) | thành công, lỗi |
| Khung tải | `Skeleton` | — |
| Slide album | `Carousel` (Embla) | vuốt, mũi tên, chấm trang |
| Lightbox | `Dialog` + ảnh lớn | trước/sau, đóng |

## Tương tác chi tiết
- **Mở thiệp:** bấm nút → cover mờ dần 400 ms → khoá cuộn được mở → nhạc phát. Khoá cuộn khi cover đang hiện.
- **Đếm ngược:** cập nhật mỗi giây, `aria-live="off"` (không đọc từng giây); có nhãn đọc tĩnh "còn N ngày".
- **Form:** kiểm tra khi rời ô và khi gửi; focus nhảy vào ô lỗi đầu tiên; nút gửi chuyển "Đang gửi…"; thành công thì hiện cảm ơn và xoá form (RSVP) hoặc thêm lời chúc chờ duyệt (sổ lưu bút).
- **Album:** vuốt ngang có snap; phím ← → trong lightbox; Esc đóng; đóng trả focus về ảnh.
- **Nhạc:** nút nổi 44×44 px, `aria-pressed`, nhãn "Bật nhạc"/"Tắt nhạc".

## A11y (WCAG 2.2 AA mức cơ bản)
- Tương phản AA; không truyền đạt thông tin chỉ bằng màu.
- Vùng chạm tối thiểu 44×44 px.
- Mọi ảnh có `alt` có nghĩa (ảnh trang trí `alt=""`).
- Form: `Label` gắn với ô, lỗi liên kết bằng `aria-describedby`, `aria-invalid`.
- Dialog: bẫy focus, trả focus, đóng bằng Esc (shadcn/Radix lo phần lớn).
- Thứ tự focus theo thứ tự đọc; có `lang="vi"`.
- `prefers-reduced-motion` tắt chuyển động.

## Nội dung chữ (copy) đề xuất
| Vị trí | Chữ |
|---|---|
| Nút cover | Mở thiệp |
| Thân mời | Thân mời bạn |
| RSVP tiêu đề | Xác nhận tham dự |
| RSVP thành công | Cảm ơn bạn! Chúng mình đã nhận được xác nhận. |
| Lỗi gửi | Gửi chưa được, bạn thử lại giúp mình nhé. Nội dung của bạn vẫn còn đó. |
| Lời chúc rỗng | Hãy là người đầu tiên gửi lời chúc! |
| Chờ duyệt | Đang chờ duyệt |
| Lời kết | Sự hiện diện của bạn là niềm vinh hạnh của gia đình chúng tôi! |
| Lễ đã qua | Lễ đã diễn ra |
Chủ dự án duyệt và chỉnh giọng văn (xưng "chúng mình" hay "chúng tôi", trang trọng hay thân mật).
