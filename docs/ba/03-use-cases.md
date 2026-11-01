# BA-03 · Use case

Tác nhân: **Khách (K)**, **Chủ thiệp (C)**, **Apps Script (AS)** là hệ thống ngoài.

## UC-01 Mở thiệp
- **Tiền điều kiện:** khách mở link.
- **Luồng chính:** 1) Hiện bìa (tên, ngày). 2) K bấm "Mở thiệp". 3) Bìa trượt/mờ đi, trang cuộn tới Hero. 4) Nhạc bắt đầu phát. 5) Nút nhạc nổi hiện.
- **Ngoại lệ:** E1 nhạc không phát được (chặn/ lỗi tải): bỏ qua im lặng, nút nhạc hiện trạng thái tắt. E2 `prefers-reduced-motion`: không chuyển động, chỉ ẩn bìa.
- **Hậu điều kiện:** nội dung hiển thị; bìa không chặn cuộn.

## UC-02 Xem thông tin lễ & chỉ đường
- **Luồng chính:** K cuộn tới hai thẻ lễ, đọc giờ/địa điểm, bấm "Chỉ đường" → mở Google Maps tab mới.
- **Ngoại lệ:** link Maps chưa có → dùng link tìm kiếm theo địa chỉ.
- **Quy tắc:** BR-01, BR-02, BR-03.

## UC-03 Đếm ngược & thêm vào lịch
- **Luồng chính:** hiển thị đếm ngược từng lễ cập nhật mỗi giây. K bấm "Thêm vào lịch" → chọn Google Calendar (mở URL) hoặc tải `.ics`.
- **Ngoại lệ:** E1 đã qua giờ lễ → hiện "Lễ đã diễn ra". E2 webview không tải được `.ics` → gợi ý mở bằng trình duyệt hoặc dùng Google Calendar.
- **Quy tắc:** BR-04.

## UC-04 Xem album
- **Luồng chính:** vuốt/bấm mũi tên đổi ảnh; chạm ảnh mở lightbox; trước/sau; đóng bằng nút hoặc phím Esc.
- **Ngoại lệ:** ảnh lỗi tải → khung giữ chỗ, không vỡ bố cục.

## UC-05 Gửi RSVP
- **Tiền điều kiện:** có kết nối.
- **Luồng chính:** 1) K nhập họ tên, chọn tham dự (Vu Quy / Thành Hôn / cả hai / không), số người, lời nhắn (tuỳ chọn). 2) Bấm Gửi. 3) Client kiểm tra hợp lệ. 4) POST tới AS. 5) AS ghi dòng vào tab `RSVP`. 6) Hiện lời cảm ơn.
- **Ngoại lệ:** E1 dữ liệu sai → báo lỗi từng ô, không gửi. E2 mạng/AS lỗi → báo "Gửi chưa được, thử lại", giữ nội dung đã nhập. E3 honeypot có giá trị → coi là bot, giả vờ thành công, không ghi. E4 gửi quá nhanh (dưới 30 giây giữa 2 lần) → nhắc chờ.
- **Quy tắc:** BR-05, BR-06.

## UC-06 Gửi lời chúc
- **Luồng chính:** K nhập tên và lời chúc → gửi → AS ghi tab `Wishes` với `Duyệt` = trống → client lưu `clientId`/id lời chúc vào localStorage và hiện lời chúc của K kèm nhãn "Đang chờ duyệt".
- **Ngoại lệ:** như UC-05 (E1–E4). Lời chúc quá dài → cắt/báo theo giới hạn.
- **Quy tắc:** BR-05, BR-06, BR-07.

## UC-07 Xem lời chúc công khai
- **Luồng chính:** khi trang tải, GET `?action=wishes` → hiện danh sách đã duyệt, mới nhất trước, 10 lời đầu và nút "Xem thêm".
- **Ngoại lệ:** lỗi mạng → khung thông báo + nút "Tải lại"; không có lời chúc → lời mời "Hãy là người đầu tiên chúc mừng".
- **Hậu điều kiện:** lời chúc chờ duyệt của chính K tự chuyển sang bình thường khi id xuất hiện trong danh sách đã duyệt.

## UC-08 Duyệt lời chúc (Chủ thiệp)
- C mở Sheet, đọc tab `Wishes`, đánh dấu cột `Duyệt` (TRUE) cho lời phù hợp. Lần tải kế tiếp của khách thấy lời đó. Gỡ dấu = ẩn.

## UC-09 Mừng cưới qua QR
- K chạm hộp quà → mở hộp thoại hai QR (chú rể, cô dâu) kèm tên chủ tài khoản. Bấm "Lưu QR" → tải ảnh.
- **Ngoại lệ:** webview chặn tải → mở ảnh ở tab mới và hướng dẫn "nhấn giữ ảnh để lưu".

## UC-10 Điều khiển nhạc
- K bấm nút nổi để tắt/bật; trạng thái nhớ trong phiên; trang ẩn (chuyển tab) thì tạm dừng nhạc, quay lại thì tiếp tục nếu đang bật.
