# E4 · Đếm ngược & lịch

Mốc **M2**. Phụ thuộc E2 (dữ liệu lễ). FR-07, 08, 09. UC-03. Quy tắc BR-04.

## E4-T1 · Logic đếm ngược (FE)
- **Files:** `src/lib/countdown.ts`, `src/lib/countdown.test.ts`.
- **Giao diện:** `getRemaining(target: Date, now: Date): { days: number; hours: number; minutes: number; seconds: number; done: boolean }`.
- **Test:** (1) 1 ngày 2 giờ 3 phút 4 giây trước → `{1,2,3,4,false}`; (2) đúng giờ → `done: true`, tất cả 0; (3) sau giờ → `done: true`; (4) cùng kết quả khi đổi `TZ` của tiến trình (mốc là ISO có `+07:00`).
- [ ] Test · [ ] Chạy thấy lỗi · [ ] Cài đặt · [ ] Chạy thấy qua · [ ] Commit

## E4-T2 · Hook & khối đếm ngược (FE)
- **Files:** `src/hooks/useCountdown.ts`, `src/features/countdown/CountdownBlock.tsx`, test.
- **Giao diện:** `useCountdown(startsAt: string): Remaining`; `CountdownBlock({ ceremony })` hiện tên lễ và 4 ô số; `done` → "Lễ đã diễn ra".
- **Hành vi:** `setInterval` 1 giây, dọn khi unmount; nhãn đọc tĩnh `aria-label="Còn N ngày"`; `aria-live="off"`.
- **Test:** (giả lập đồng hồ) số giây giảm mỗi tick; chuyển sang "Lễ đã diễn ra" khi qua giờ; interval được dọn.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E4-T3 · Lịch tháng 11/2026 (FE)
- **Files:** `src/features/countdown/MonthCalendar.tsx`, `src/lib/month.ts` (+ test).
- **Giao diện:** `buildMonth(year: number, month: number): (number | null)[][]` (tuần bắt đầu Chủ nhật, null là ô trống); `MonthCalendar({ year, month, highlight })`.
- **Test:** `buildMonth(2026, 11)`: ngày 1 ở cột Chủ nhật; có đúng 30 ngày; ngày 24 rơi vào cột Thứ Ba; ngày 24 được đánh dấu.
- [ ] Test · [ ] Cài đặt · [ ] Commit

## E4-T4 · Thêm vào lịch (FE)
- **Files:** `src/lib/calendar.ts`, `calendar.test.ts`, `src/features/countdown/AddToCalendar.tsx`.
- **Giao diện:** `googleCalendarUrl(c: Ceremony): string`; `buildIcs(c: Ceremony): string`; `AddToCalendar({ ceremony })` là `DropdownMenu` có "Google Calendar" và "Tải .ics".
- **Quy tắc:** thời lượng giả định 3 giờ cho mỗi lễ (đề xuất, ghi trong mã); `.ics` dùng `DTSTART;TZID=Asia/Ho_Chi_Minh`, kết thúc dòng bằng CRLF, escape `,` `;` `\`.
- **Test:** URL chứa `text=` tên lễ, `location=` địa chỉ, `dates=20261124T130000/20261124T160000` (Vu Quy, giờ địa phương kèm `ctz=Asia/Ho_Chi_Minh`); `.ics` bắt đầu `BEGIN:VCALENDAR` và có `SUMMARY`, `LOCATION`, `DTSTART`.
- **Phương án dự phòng:** webview không tải được `.ics` → thông báo "Hãy mở thiệp bằng trình duyệt hoặc dùng Google Calendar" (BA-03 UC-03 E2).
- [ ] Test · [ ] Cài đặt · [ ] Commit

## DoD của epic
Hai bộ đếm đúng giờ VN trên máy đặt múi giờ khác (kiểm tay); lịch thêm đúng giờ trên iPhone và Android.
