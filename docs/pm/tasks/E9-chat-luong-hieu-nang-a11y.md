# E9 · Chất lượng: hiệu năng, a11y, webview

Mốc **M5**. Phụ thuộc E1–E8. NFR-02, 03, 04, 05.

## E9-T1 · Hiệu năng (FE)
- **Việc:** tách mã `Lightbox`, `QrDialog` bằng `React.lazy`; ảnh hero có `fetchpriority="high"` và kích thước cố định; ảnh khác `loading="lazy"`; phông chỉ nạp subset cần; kiểm tra `dist/` bằng `vite build --report` hoặc `rollup-plugin-visualizer`.
- **Ngân sách:** JS ban đầu khoảng 200 KB gzip trở xuống; LCP dưới 2,5 giây (Lighthouse, mô phỏng 4G chậm); CLS dưới 0,1.
- **Kiểm chứng:** báo cáo Lighthouse mobile lưu vào `docs/` hoặc ghi số vào PM-04.
- [ ] Tách mã · [ ] Tối ưu ảnh/phông · [ ] Đo · [ ] Điều chỉnh tới khi đạt

## E9-T2 · Truy cập được (UX + FE)
- **Việc:** chạy axe (qua Playwright hoặc tiện ích) và duyệt tay theo [UX-04](../../ux-ui/04-thanh-phan-tuong-tac-a11y-copy.md): tương phản AA, thứ tự focus, nhãn form, `aria-describedby` cho lỗi, vùng chạm 44 px, `lang="vi"`, `prefers-reduced-motion`.
- **Kiểm chứng:** không còn vi phạm mức nghiêm trọng/cao từ axe; điều hướng bằng bàn phím hết luồng RSVP và đóng/mở hộp thoại.
- [ ] Axe · [ ] Duyệt tay · [ ] Sửa lỗi

## E9-T3 · Webview & thiết bị thật (FE)
- **Việc:** chạy checklist PM-04 phần Chất lượng trên Safari iOS, Chrome Android, Zalo, Facebook; ghi lại phát hiện và phương án dự phòng đã áp dụng.
- **Kiểm chứng:** bảng kết quả (thiết bị × tính năng) điền đủ.
- [ ] Thử · [ ] Sửa · [ ] Điền bảng

## E9-T4 · Test E2E tối thiểu (FE)
- **Files:** `tests/e2e/*.spec.ts`, `playwright.config.ts`.
- **Việc:** 5 kịch bản ở [FE-06](../../fe/06-kiem-thu.md) với API mock; viewport iPhone 13, Pixel 5 và desktop.
- **Kiểm chứng:** `npx playwright test` xanh.
- [ ] Viết · [ ] Chạy xanh · [ ] Commit

## DoD của epic
NFR-02..04 đạt; bảng thiết bị thật đầy đủ; không lỗi console.
