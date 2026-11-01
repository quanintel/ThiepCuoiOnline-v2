# E1 · Bìa, hero, cô dâu chú rể

Mốc **M1**. Phụ thuộc E0. FR-01, 02, 03. UC-01. Wireframe: [UX-02 §0–2](../../ux-ui/02-wireframes.md).

## E1-T1 · Hook mở thiệp (FE)
- **Files:** `src/features/cover/useOpenInvitation.ts`, test cùng thư mục.
- **Giao diện:** `useOpenInvitation(onOpen?: () => void): { isOpen: boolean; open: () => void }`.
- **Hành vi:** khi chưa mở, khoá cuộn trang (`overflow: hidden` trên `body`); `open()` mở khoá, đặt `isOpen=true`, gọi `onOpen` đúng một lần.
- **Test:** `open()` hai lần chỉ gọi `onOpen` một lần; cuộn bị khoá trước, mở sau.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E1-T2 · Cover (UX + FE)
- **Files:** `src/features/cover/Cover.tsx`, `Cover.test.tsx`.
- **Giao diện:** `Cover({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void })`.
- **Hiển thị:** tên "Anh Quân & Mai Hương", "24 · 11 · 2026", "Thân mời bạn", nút "Mở thiệp"; cao `100dvh`; mờ dần 400 ms khi `isOpen` rồi gỡ khỏi cây DOM; tôn trọng `prefers-reduced-motion`.
- **Test:** thấy tên, ngày, nút; bấm nút gọi `onOpen`; sau khi `isOpen` thì không còn trong tài liệu.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E1-T3 · Hero (FE)
- **Files:** `src/features/hero/Hero.tsx`, `Hero.test.tsx`.
- **Hiển thị:** ảnh nền cặp đôi (giữ chỗ nếu chưa có), chữ duy nhất "sắp về chung một nhà" từ `content`.
- **Test:** có đúng chữ; **không** có "Chúng tôi".
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E1-T4 · Cô dâu chú rể (UX + FE)
- **Files:** `src/features/couple/Couple.tsx`, `Couple.test.tsx`.
- **Hiển thị:** hai ảnh (alt có nghĩa), "Trưởng nam" / "Trưởng nữ" và tên đầy đủ.
- **Test:** thấy "Kiều Anh Quân", "Tôn Mai Hương" và hai vai trò; mỗi ảnh có `alt`.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## DoD của epic
Bấm "Mở thiệp" vào được thiệp; hero và cặp đôi khớp BA-05; chủ dự án duyệt giao diện bước đầu.
