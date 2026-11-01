# E7 · Sổ lưu bút (lời chúc công khai, có duyệt)

Mốc **M3**. Phụ thuộc E5 (và `validation.ts`, `throttle.ts` từ E6-T1). FR-13, 14. UC-06, 07, 08. Quy tắc BR-05, 06, 07.

## E7-T1 · Lời chúc chờ duyệt cục bộ (FE)
- **Files:** `src/lib/pendingWishes.ts`, `pendingWishes.test.ts`.
- **Giao diện:** `addPending(w: Wish): void`; `getPending(): Wish[]`; `reconcile(approved: Wish[]): Wish[]` trả danh sách chờ còn lại (bỏ các id đã xuất hiện trong `approved`) và cập nhật `localStorage`.
- **Test:** thêm rồi đọc được; `reconcile` loại đúng id đã duyệt và giữ phần còn lại; dữ liệu `localStorage` hỏng (không phải JSON) → trả danh sách rỗng, không ném lỗi.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E7-T2 · Hook `useWishes` (FE)
- **Files:** `src/features/guestbook/useWishes.ts`, test.
- **Giao diện:** `useWishes(): { approved: Wish[]; pending: Wish[]; status: 'loading' | 'ready' | 'error'; reload: () => void; addPending: (w: Wish) => void }`.
- **Hành vi:** gọi `fetchWishes()` khi mount; xong thì `reconcile`; lỗi → `status: 'error'`; `reload` gọi lại.
- **Test:** `loading → ready` có dữ liệu; lỗi API → `error`; `reload` thử lại thành công; lời chờ duyệt biến mất khi id có trong `approved`.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E7-T3 · Form lời chúc (UX + FE)
- **Files:** `src/features/guestbook/WishForm.tsx`, test.
- **Hiển thị:** tên, lời chúc có bộ đếm "n/300", honeypot, nút "Gửi lời chúc".
- **Hành vi:** như RSVP; thành công → `submitWish` trả `{ id }` → gọi `addPending({ id, name, message, createdAt: now })` → toast "Đã nhận lời chúc, đang chờ duyệt".
- **Test:** lời chúc 301 ký tự bị chặn; hợp lệ gọi `submitWish` đúng dữ liệu và thêm vào danh sách chờ; API lỗi giữ nội dung; honeypot không ghi.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E7-T4 · Danh sách lời chúc (UX + FE)
- **Files:** `src/features/guestbook/WishList.tsx`, test.
- **Hiển thị:** `pending` trước kèm nhãn "Đang chờ duyệt", rồi `approved` mới nhất trước; 10 lời đầu và nút "Xem thêm" (mỗi lần 10); skeleton khi tải; rỗng → "Hãy là người đầu tiên gửi lời chúc!"; lỗi → thông báo và nút "Tải lại".
- **Bảo mật:** render văn bản thuần; không `dangerouslySetInnerHTML`.
- **Test:** một lời chúc có `<img src=x onerror=alert(1)>` hiện nguyên chữ, không tạo phần tử `img`; 25 lời → ban đầu 10, "Xem thêm" thành 20 rồi 25; trạng thái rỗng và lỗi hiển thị đúng; nhãn chờ duyệt xuất hiện cho `pending`.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## DoD của epic
Luồng gửi → chờ duyệt → duyệt trong Sheet → hiện chung chạy đủ (E5-T4); không có HTML nào từ lời chúc được hiểu như mã.
