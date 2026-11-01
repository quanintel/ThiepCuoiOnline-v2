# E3 · Album & lightbox

Mốc **M1**. Phụ thuộc E0. FR-06. UC-04. Album dạng **slide ngang**, không cuộn dài, không có lời kể khoảnh khắc.

## E3-T1 · Chuẩn bị ảnh (UX + Chủ)
- **Files:** `public/images/album/*.webp`, `src/config/content.ts` (`album: { src: string; alt: string; width: number; height: number }[]`).
- **Việc:** chủ dự án gửi 6–10 ảnh; chuyển WebP, 2 kích cỡ (khoảng 800 px cho slide, 1600 px cho lightbox); đặt `alt` mô tả ngắn.
- **Kiểm chứng:** mỗi ảnh slide dưới khoảng 120 KB; mọi mục có `alt`, `width`, `height`.
- [ ] Nhận ảnh · [ ] Chuyển đổi · [ ] Cập nhật content · [ ] Commit

## E3-T2 · Slide ngang (FE)
- **Files:** `src/features/album/Album.tsx`, test.
- **Giao diện:** `Album({ photos }: { photos: AlbumPhoto[] })` dùng shadcn `Carousel`; vuốt ngang có snap, mũi tên và chấm trang; ảnh `loading="lazy"`.
- **Test:** hiển thị đúng số ảnh; mỗi ảnh có `alt`; bấm ảnh gọi mở lightbox ở chỉ số đó.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E3-T3 · Lightbox (FE)
- **Files:** `src/features/album/Lightbox.tsx`, test; nạp bằng `React.lazy`.
- **Giao diện:** `Lightbox({ photos, index, onClose, onIndexChange })`.
- **Hành vi:** ảnh lớn, "3 / 8", nút ← →, phím ← → và Esc, trả focus về ảnh vừa chạm khi đóng; ảnh lỗi → khung dự phòng.
- **Test:** → ở ảnh cuối quay về ảnh đầu (hoặc dừng; chọn một và ghi trong test); Esc gọi `onClose`; chỉ số hiển thị đúng.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## DoD của epic
Vuốt và chạm hoạt động trên điện thoại thật; slide không kéo dài trang; ngân sách ảnh đạt.
