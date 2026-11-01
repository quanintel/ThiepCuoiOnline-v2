# Thiệp cưới online – Kiều Anh Quân & Tôn Mai Hương – Thiết kế

Ngày: 2026-11-01 · Trạng thái: chờ duyệt

## 1. Mục đích
Một landing page thiệp cưới online (chỉ front-end) cho **Kiều Anh Quân** và **Tôn Mai Hương**, gửi khách qua link (Zalo/Facebook/tin nhắn), chủ yếu xem trên điện thoại. Khách xem thông tin hai lễ, xác nhận tham dự, gửi lời chúc công khai, xem album, mở QR mừng cưới. Cặp đôi nhận dữ liệu thật qua Google Sheets.

Dự án được làm như một dự án phần mềm: tài liệu theo vai trò BA, PM, UI/UX, FE (use case, task, cấu trúc thư mục) trước, code sau.

## 2. Mục tiêu / Không phải mục tiêu / Phản mục tiêu
**Mục tiêu**
- Bố cục tham khảo https://chungdoi.com/vi/mau-thiep/hoa-moc-xanh/demo (cover "Mở thiệp" + một cột cuộn dọc, mobile-first).
- RSVP và lời chúc ghi được vào Google Sheets; lời chúc đã duyệt hiện công khai trên thiệp.
- Build ra thư mục tĩnh `dist/` để copy lên Nginx của VPS riêng.
- Đẹp, nhanh trên 4G, truy cập được (a11y cơ bản).

**Không phải mục tiêu**
- Không có backend tự viết, không CMS, không đăng nhập, không nhiều cặp đôi/nhiều mẫu thiệp.
- DevOps/triển khai do chủ dự án làm; chỉ cung cấp bundle + cấu hình Nginx mẫu.
- Không sao chép phối màu của trang mẫu.

**Phản mục tiêu (coi như thất bại dù chạy được)**
- Lời chúc chưa duyệt/spam/độc hại hiện công khai.
- Nhạc tự phát gây giật mình hoặc không phát được trên iOS.
- Sai thông tin lễ (giờ, địa chỉ, tên) in trên thiệp.

## 3. Ràng buộc
- Stack: **Vite + React + TypeScript + Tailwind + shadcn/ui**, SPA một trang.
- Dữ liệu: **Google Apps Script web app** làm API JSON trên Google Sheet. URL cấu hình qua biến môi trường lúc build (`VITE_*`), không ghi cứng.
- Triển khai: Nginx tĩnh trên VPS; chạy được ở thư mục gốc domain, hỗ trợ base path (`base` của Vite cấu hình được). Thẻ Open Graph viết tĩnh trong `index.html`.
- Nhạc chỉ phát sau thao tác "Mở thiệp" (chính sách autoplay của trình duyệt).
- Không có server nên Apps Script phải xử lý CORS/redirect của Google (gửi form dạng `text/plain` hoặc `application/x-www-form-urlencoded`, đọc bằng GET).

## 4. Nội dung (do chủ dự án cung cấp)
**Header:** chỉ giữ dòng "sắp về chung một nhà" (bỏ chữ "Chúng tôi").

**Thông tin lễ cưới:** "Trưởng nam Kiều Anh Quân & Trưởng nữ Tôn Mai Hương"
- **Lễ Vu Quy** – 13:00 thứ Ba, 24.11.2026 (tức 16.10 năm Bính Ngọ). Tại Tư Gia, Thôn Phú Cường, Ngọc Thiện, Bắc Ninh. Địa chỉ cũ: Thôn An Lạc 1, Việt Ngọc, Tân Yên, Bắc Giang. Nút "Chỉ đường".
- **Lễ Thành Hôn** – 17:00 thứ Ba, 24.11.2026 (tức 16.10 năm Bính Ngọ). Minh Dương Palace, Số 98 Hồng Đô, Phú Đô, Từ Liêm, Hà Nội. Nút "Chỉ đường".

**Gia đình:** Nhà trai: ông Kiều Văn Nghĩa, bà Nguyễn Thị Phương Lan. Nhà gái: ông Đào Duy Hồng, bà Dương Thị Hải.
> ⚠ Cần xác nhận trước khi đưa ra thật: bố nhà gái họ "Đào", cô dâu họ "Tôn". Dùng đúng như chủ dự án gửi; ghi vào danh mục kiểm tra trước khi phát hành.

**Bỏ:** lời cảm tạ, "thông tin cần biết", chia sẻ thiệp, phần "kể lại khoảnh khắc" trong album.

## 5. Các phần của trang (từ trên xuống)
1. **Cover:** tên hai người, ngày, nút "Mở thiệp" (cũng là thao tác bật nhạc).
2. **Header/Hero:** "sắp về chung một nhà".
3. **Giới thiệu cô dâu chú rể** (ảnh + vai trò Trưởng nam/Trưởng nữ).
4. **Thông tin lễ cưới:** hai thẻ Vu Quy / Thành Hôn, thông tin bố mẹ hai bên.
5. **Album ảnh:** slide ngang (swipe), lightbox khi chạm.
6. **Đếm ngược + lịch tháng 11/2026 + "Thêm vào lịch"** – riêng cho từng lễ (đề xuất; hai lễ cùng ngày giờ khác).
7. **Bản đồ/Chỉ đường** cho từng địa điểm (link Google Maps, không nhúng bản đồ nặng).
8. **Lịch trình ngày cưới:** Đã bỏ theo quyết định của chủ dự án (01.11.2026).
9. **RSVP:** họ tên, tham dự lễ nào (Vu Quy / Thành Hôn / cả hai / không), số người, lời nhắn.
10. **Sổ lưu bút:** gửi lời chúc + danh sách lời chúc đã duyệt (công khai).
11. **Hộp quà mừng + QR ngân hàng** (chú rể/cô dâu), nút lưu QR.
12. **Lời kết + footer.**
- **Nhạc nền:** nút bật/tắt nổi, phát sau "Mở thiệp".

## 6. Dữ liệu & kiểm duyệt (Google Sheets)
- Sheet có tab `RSVP` và `Wishes`. `Wishes` có cột `Duyệt`; API chỉ trả các dòng đã duyệt.
- Apps Script: `GET ?action=wishes` (đã duyệt), `POST` ghi RSVP và lời chúc.
- Chống spam: giới hạn độ dài, ô ẩn honeypot, giãn cách gửi phía client; lời chúc vừa gửi hiện cho chính người gửi kèm "Đang chờ duyệt" (lưu local).
- Xử lý lỗi/offline: thông báo rõ, không mất nội dung đã nhập.

## 7. Phương án đã cân nhắc
- **A. Vite + React + TS + Tailwind + shadcn/ui, SPA tĩnh – ĐƯỢC CHỌN.** Đơn giản nhất cho thiệp một trang một cặp đôi; OG tĩnh đủ cho chia sẻ link; nút "Mở thiệp" giải quyết autoplay nhạc.
- B. Next.js `output: export` – bị loại: nặng hơn, thừa tính năng.
- C. Astro + React islands – bị loại: thêm công cụ mới, thiệp lại nhiều tương tác.
- Dữ liệu: Apps Script JSON API thay vì Google Form nhúng (Form không đọc ngược để hiện công khai được).

## 8. Bộ tài liệu sẽ tạo ở bước lập kế hoạch (chưa code)
Thư mục `docs/` theo vai trò: `ba/` (yêu cầu, user story, use case, luật nghiệp vụ, nội dung), `pm/` (roadmap, milestone, backlog task, rủi ro, definition of done), `ux-ui/` (sitemap, wireframe từng section, design tokens, component list, a11y, copywriting), `fe/` (kiến trúc, cấu trúc thư mục, danh sách component shadcn, task, API contract Apps Script, build & deploy bundle, Nginx mẫu, kiểm thử).

## 8b. Các quyết định bổ sung (lựa chọn của tôi sau bước kiểm tra, chủ dự án có thể đổi)
- **Duyệt lời chúc:** thủ công, cặp đôi tự đánh dấu cột `Duyệt` trong Sheet. Không tự động hoá, không lọc từ khoá. Phía người gửi, lời chúc "Đang chờ duyệt" tự chuyển sang hiển thị chung khi đã được duyệt (client lưu id cục bộ và tra lại danh sách).
- **Google Sheet + Apps Script:** FE xây dựng với mock trước. Bộ tài liệu có file `.gs` và hướng dẫn tạo/deploy để chủ dự án (chủ tài khoản Google) deploy; tích hợp thật là bước kiểm thử riêng.
- **Hai lễ:** đếm ngược và "Thêm vào lịch" riêng từng lễ. "Thêm vào lịch" dùng link Google Calendar và tệp `.ics`. "Chỉ đường" dùng link Google Maps; chủ dự án cung cấp link chia sẻ Maps (đặc biệt cho tư gia ở thôn, tìm theo chữ dễ sai), tạm dùng link tìm kiếm theo địa chỉ.
- **Địa chỉ Vu Quy:** hiển thị cả địa chỉ hiện tại và dòng "Địa chỉ cũ" (đúng như chủ dự án yêu cầu).
- **QR:** dùng ảnh tĩnh do chủ dự án gửi, hai QR (chú rể, cô dâu), có nút lưu ảnh. Không tự sinh VietQR.
- **Thiết bị/hiệu năng:** webview Zalo và Facebook thuộc phạm vi kiểm thử (nhạc, lưu QR, `.ics`, lightbox). Mục tiêu: LCP dưới 2,5 giây trên 4G, JS ban đầu khoảng 200 KB gzip trở xuống, ảnh album WebP lazy-load.
- **OG và domain:** domain là biến cấu hình lúc build (`VITE_SITE_URL`); người xây dựng soạn tiêu đề/mô tả OG, chủ dự án cung cấp ảnh chia sẻ.
- **RSVP:** cho gửi lại, không khử trùng lặp (cặp đôi gộp tay trong Sheet). Trường: họ tên, tham dự lễ nào, số người, lời nhắn. Không thu số điện thoại.
- **Ngôn ngữ:** chỉ tiếng Việt, không có lớp i18n.

## 9. Để lại cho người xây dựng (quyết định của tôi, chủ dự án có thể đổi)
- Bảng màu/phông chữ/phong cách minh hoạ: UI/UX tự đề xuất (chủ dự án chỉ yêu cầu lấy bố cục, không lấy màu).
- Số tài khoản/QR, nhạc, ảnh album, ảnh cô dâu chú rể: chủ dự án cung cấp sau; dùng nội dung giữ chỗ khi dựng (lịch trình ngày cưới đã bỏ).
- Gói thư viện slide/lightbox/countdown (ưu tiên nhẹ, ưu tiên thành phần shadcn có sẵn).
- Hiệu ứng cuộn, kiểm thử (Vitest + Playwright mức tối thiểu), tối ưu ảnh (WebP, lazy-load).
