# UX-03 · Hướng thiết kế & design tokens

> Đây là **đề xuất của UI/UX**, chủ dự án chỉ yêu cầu lấy bố cục, không lấy phối màu của mẫu. Chủ dự án có thể đổi bất kỳ giá trị nào; token đổi một chỗ, cả trang đổi theo.

## Tinh thần
Ấm áp, trang trọng nhưng gần gũi; hợp với "sắp về chung một nhà". Nền kem ấm, điểm nhấn đỏ rượu và vàng đồng nhạt, chữ tiêu đề có chân thanh lịch.

## Màu (token CSS, định dạng shadcn: biến HSL trong `:root`)
| Token | Giá trị đề xuất | Dùng cho |
|---|---|---|
| `--background` | `#FBF7F0` | nền trang |
| `--foreground` | `#2B2623` | chữ chính (tương phản trên nền khoảng 13:1) |
| `--primary` | `#8C3B4A` | nút chính, nhấn mạnh |
| `--primary-foreground` | `#FFFFFF` | chữ trên nút chính (khoảng 7:1) |
| `--accent` | `#B8975A` | đường kẻ, hoạ tiết, biểu tượng |
| `--muted` | `#F1E9DC` | khối nền phụ, thẻ |
| `--muted-foreground` | `#6B5F57` | chữ phụ (đạt AA trên nền) |
| `--border` | `#E4D8C6` | viền |
| `--destructive` | `#B3261E` | lỗi form |
Kiểm tra lại tương phản thực tế khi dựng (mục tiêu AA: 4.5:1 chữ thường, 3:1 chữ lớn và thành phần giao diện).

## Chữ
- Tiêu đề: **Cormorant Garamond** hoặc **Playfair Display** (có tiếng Việt đầy đủ dấu).
- Nội dung/form: **Be Vietnam Pro** (thiết kế cho tiếng Việt).
- Chữ thư pháp tên cô dâu chú rể (cover): tuỳ chọn, chỉ dùng cho tên, kiểm tra hiển thị dấu tiếng Việt.
- Tự host phông (file trong `public/fonts` hoặc `@fontsource`), `font-display: swap`, chỉ nạp các trọng lượng cần thiết.

| Cấp | Cỡ (mobile) | Ghi chú |
|---|---|---|
| Tên ở cover | 40–48 px | tiêu đề |
| H2 phần | 24–28 px | HOA hoặc chữ thường, giãn chữ nhẹ |
| Nội dung | 16 px | dòng cao 1,6 |
| Chữ phụ | 14 px | không nhỏ hơn 14 px |

## Khoảng cách, bo góc, bóng
- Lưới 4 px; khoảng cách phần theo bội 8 (phần trên/dưới 64–80 px).
- Bo góc thẻ `--radius: 0.75rem`; nút bo tròn đầy đủ.
- Bóng nhẹ cho thẻ; không dùng bóng nặng.

## Chuyển động
- Hiện dần + trượt nhẹ khi cuộn tới (`IntersectionObserver`, chỉ chạy một lần mỗi phần).
- Cover: mờ dần + trượt lên khi mở.
- Mọi chuyển động tắt khi `prefers-reduced-motion: reduce`.
- Không dùng hoạt hình nền nặng (ảnh hưởng 4G và pin).

## Hoạ tiết
- Hoa/lá dạng SVG hoặc WebP nhỏ làm góc/đường phân cách; số lượng ít để giữ tốc độ. Nguồn: do chủ dự án cung cấp hoặc tài nguyên có giấy phép dùng thương mại (ghi nguồn trong `docs/ux-ui`).
