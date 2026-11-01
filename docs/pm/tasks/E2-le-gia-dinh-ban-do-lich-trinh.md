# E2 · Thông tin lễ, gia đình, chỉ đường, lịch trình

Mốc **M1**. Phụ thuộc E0. FR-04, 05, 10, 11, 17. UC-02. Wireframe: [UX-02 §3, 6, 7, 11](../../ux-ui/02-wireframes.md). Theo UX-D1: "Chỉ đường" nằm trong thẻ lễ.

## E2-T1 · Thẻ lễ (UX + FE)
- **Files:** `src/features/ceremonies/CeremonyCard.tsx`, test.
- **Giao diện:** `CeremonyCard({ ceremony }: { ceremony: Ceremony })`.
- **Hiển thị:** tiêu đề (LỄ VU QUY / LỄ THÀNH HÔN), `timeLabel` + `weekdayLabel`, `dateLabel`, `lunarLabel`, `placeLabel`, `address`; chỉ Vu Quy hiện dòng "Địa chỉ cũ: …"; nút "Chỉ đường" là `<a href={mapUrl} target="_blank" rel="noopener noreferrer">`.
- **Test:** Vu Quy có "Tại Tư Gia" và dòng địa chỉ cũ; Thành Hôn có "Minh Dương Palace" và không có dòng địa chỉ cũ; nút có `rel="noopener noreferrer"`.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E2-T2 · Khối thông tin lễ + gia đình (FE)
- **Files:** `src/features/ceremonies/Ceremonies.tsx`, `Families.tsx`, test.
- **Hiển thị:** tiêu đề "THÔNG TIN LỄ CƯỚI", dòng "Trưởng nam Kiều Anh Quân & Trưởng nữ Tôn Mai Hương", hai thẻ lễ, hai cột Nhà trai/Nhà gái.
- **Test:** thấy đủ bốn tên bố mẹ đúng chính tả; **không** có "Lời cảm tạ".
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E2-T3 · Link Maps (BA + Chủ)
- **Files:** `src/config/content.ts` (trường `mapUrl`).
- **Việc:** nhận link chia sẻ Maps của tư gia và Minh Dương Palace từ chủ dự án; trước đó dùng `https://www.google.com/maps/search/?api=1&query=<địa chỉ đã mã hoá URL>`.
- **Test:** `mapUrl` của cả hai lễ là URL `https` hợp lệ, mở được tab mới (kiểm tay).
- [ ] Nhận link · [ ] Cập nhật · [ ] Commit

## E2-T4 · Lịch trình ngày cưới (UX + FE) · ĐÃ BỎ (Chủ dự án quyết định 01.11.2026)
- Đã bỏ khỏi phạm vi dự án.

## E2-T5 · Lời kết & footer (FE)
- **Files:** `src/features/footer/Closing.tsx`, test.
- **Hiển thị:** "Sự hiện diện của bạn là niềm vinh hạnh của gia đình chúng tôi!", "Anh Quân & Mai Hương · 24.11.2026". Không có chia sẻ thiệp, không có "thông tin cần biết".
- **Test:** thấy câu kết; không có chữ "Chia sẻ".
- [ ] Test · [ ] Cài đặt · [ ] Commit

## DoD của epic
Nội dung khớp BA-05; `CeremonyCard` đạt test; nút Chỉ đường mở đúng nơi (kiểm tay).
