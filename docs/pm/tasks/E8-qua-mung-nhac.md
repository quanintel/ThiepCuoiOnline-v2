# E8 · Quà mừng (QR) & nhạc nền

Mốc **M4**. Phụ thuộc E1 (nút "Mở thiệp"). FR-15, 16. UC-09, 10.

## E8-T1 · Hộp quà & hộp thoại QR (UX + FE)
- **Files:** `src/features/gift/GiftBoxes.tsx`, `QrDialog.tsx`, test; `content.ts` thêm `gifts: { id: 'groom' | 'bride'; label: string; accountName: string; bank: string; qrSrc: string }[]`; `public/qr/*.webp`.
- **Hành vi:** hai hộp quà "Nhấn để mở"; mở `Dialog` hiện QR, tên chủ tài khoản, ngân hàng; nút "Lưu QR" tải ảnh (`<a download>`); nếu tải bị chặn (webview) → mở ảnh ở tab mới kèm dòng "Nhấn giữ ảnh để lưu".
- **Test:** chạm hộp quà mở hộp thoại đúng người; Esc đóng; mỗi QR có `alt` ("Mã QR mừng cưới chú rể"/"cô dâu"); nút lưu có thuộc tính `download`.
- **Kiểm tay:** quét thử QR bằng app ngân hàng; thử lưu trên iOS Safari, Android Chrome, webview Zalo/Facebook.
- [ ] Nhận QR từ chủ dự án · [ ] Test · [ ] Cài đặt · [ ] Commit

## E8-T2 · Nhạc nền (FE)
- **Files:** `src/features/music/useMusic.ts`, `MusicButton.tsx`, test.
- **Giao diện:** `useMusic(src: string): { playing: boolean; available: boolean; play: () => Promise<void>; toggle: () => void }`.
- **Hành vi:** `HTMLAudioElement` lặp vòng; `play()` được gọi trong sự kiện bấm "Mở thiệp" (thoả chính sách autoplay); lỗi phát → `available` hạ xuống, không ném lỗi lên UI; `visibilitychange`: tạm dừng khi ẩn, tiếp tục khi hiện nếu `playing`; nhớ trạng thái trong phiên.
- **`MusicButton`:** nút nổi 44×44 px, `aria-pressed`, nhãn "Bật nhạc"/"Tắt nhạc"; hiện sau khi mở thiệp.
- **Test (mock `Audio`):** `play()` thành công → `playing: true`; `play()` bị từ chối → `playing: false`, `available: false`, không ném; `toggle` đổi trạng thái; trang ẩn thì `pause` được gọi.
- [ ] Nhận nhạc từ chủ dự án (đảm bảo quyền sử dụng) · [ ] Test · [ ] Cài đặt · [ ] Commit

## E8-T3 · Nối "Mở thiệp" với nhạc (FE)
- **Files:** `src/App.tsx`.
- **Việc:** `useOpenInvitation(() => { void music.play() })`; nút nhạc chỉ hiện sau khi mở.
- **Kiểm tay:** iOS Safari và Chrome Android phát được sau khi bấm; webview Zalo/Facebook (nếu không phát, nút hiện trạng thái tắt, không báo lỗi).
- [ ] Nối · [ ] Kiểm tay

## DoD của epic
QR quét được và lưu được; nhạc không tự phát trước khi bấm Mở thiệp; mọi thất bại âm thanh đều êm.
