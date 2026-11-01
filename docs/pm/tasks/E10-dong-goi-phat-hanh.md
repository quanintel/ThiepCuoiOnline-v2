# E10 · Đóng gói & phát hành

Mốc **M6**. Phụ thuộc E9. NFR-06, FR-18. Tham chiếu: [FE-05](../../fe/05-build-deploy-nginx.md), [PM-04](../04-checklist-truoc-phat-hanh.md).

## E10-T1 · Bản build production (FE)
- **Việc:** điền `.env.production` (`VITE_API_URL`, `VITE_SITE_URL`, `VITE_USE_MOCK=false`, `VITE_BASE_PATH`); `npm ci && npm run build`; `npm run preview` kiểm tra.
- **Kiểm chứng:** `dist/index.html` có thẻ OG với URL tuyệt đối đúng domain; mở bản preview thấy mọi phần, RSVP gọi Apps Script thật.
- [ ] Điền env · [ ] Build · [ ] Preview

## E10-T2 · Rà soát bí mật & chất lượng bundle (FE)
- **Việc:** tìm trong `dist/` các chuỗi nhạy cảm (khoá, token, email, số tài khoản nằm ngoài ảnh QR chủ ý); xác nhận không còn nội dung giữ chỗ (lorem, ảnh tạm, `localhost`); kiểm kích thước tổng `dist/`.
- **Kiểm chứng:** lệnh tìm kiếm không có kết quả không mong muốn; ghi vào PM-04.
- [ ] Tìm bí mật · [ ] Tìm giữ chỗ · [ ] Ghi kết quả

## E10-T3 · Bàn giao (PM + FE)
- **Files:** `README.md` (gốc), `deploy/nginx.conf.example`, `apps-script/README.md`.
- **Việc:** README ghi cách chạy, build, cập nhật nội dung; kiểm tra thẻ OG bằng Facebook Sharing Debugger và dán link vào Zalo; giao `dist/` (hoặc hướng dẫn tự build) cùng checklist PM-04 đã tick; xác nhận chủ dự án đã deploy thử và nhận được RSVP thật.
- **Kiểm chứng:** mọi mục PM-04 được tick, kể cả "Họ nhà gái đã xác nhận".
- [ ] README · [ ] Kiểm OG · [ ] Giao bundle · [ ] Chủ dự án xác nhận

## DoD của epic / dự án
Checklist PM-04 xanh hoàn toàn; chủ dự án chép `dist/` lên Nginx và thiệp chạy đủ.
