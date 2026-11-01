# Thiệp Cưới Trực Tuyến - Anh Quân & Mai Hương

Dự án website thiệp cưới trực tuyến một trang (Single Page Application) dành cho cặp đôi **Kiều Anh Quân & Tôn Mai Hương**. Xây dựng trên nền tảng React 18, Vite, TypeScript strict, Tailwind CSS và các thành phần giao diện shadcn/ui.

---

## 1. Chạy thử (Local Development)

Cài đặt các gói phụ thuộc và khởi chạy máy chủ phát triển cục bộ:

```sh
# Cài đặt thư viện đúng theo package-lock.json
npm ci

# Khởi chạy môi trường phát triển (mặc định tại http://localhost:5173)
npm run dev

# Chạy kiểm thử tự động với Vitest
npm test

# Kiểm tra bản build xem trước tại máy cục bộ
npm run build
npm run preview
```

---

## 2. Cấu hình `.env`

Sao chép tệp mẫu `.env.example` thành `.env.local` (phát triển) hoặc `.env.production` (khi phát hành):

```sh
cp .env.example .env.local
```

Các biến môi trường chính:
- `VITE_API_URL`: Đường dẫn URL Web App Google Apps Script kết thúc bằng `/exec` (ví dụ: `https://script.google.com/macros/s/<ID>/exec`).
- `VITE_USE_MOCK`: Đặt `true` để sử dụng dữ liệu giả lập (chạy thử nghiệm không cần backend), đặt `false` khi kết nối thật với Google Sheet.
- `VITE_SITE_URL`: Địa chỉ tên miền chính thức của website thiệp (ví dụ: `https://thiep.example.com`) để sinh thẻ Open Graph (OG) chia sẻ mạng xã hội.
- `VITE_BASE_PATH`: Đường dẫn gốc (mặc định `/` nếu đặt tại gốc domain, hoặc `/ten-thu-muc/` nếu đặt trong thư mục con).

> [!WARNING]
> Mọi biến bắt đầu bằng `VITE_*` đều được đóng gói công khai vào mã nguồn frontend. Tuyệt đối không đặt mật mã, token riêng tư vào các biến này.

---

## 3. Build và Deploy lên Nginx (Chép `dist/`)

Sau khi hoàn tất cấu hình, tiến hành đóng gói phiên bản tĩnh:

```sh
npm run build
```

Thư mục `dist/` sau khi build sẽ chứa toàn bộ sản phẩm tĩnh (`index.html`, thư mục `assets/`, `images/`, `qr/`, `og-image.jpg`, `favicon.svg`).

**Cách triển khai lên Nginx:**
1. Sao chép toàn bộ nội dung trong thư mục `dist/` vào thư mục phục vụ web của Nginx (ví dụ `/var/www/thiep/dist/`).
2. Cấu hình Nginx theo tệp mẫu tại [`deploy/nginx.conf.example`](file:///deploy/nginx.conf.example):
   - **Gzip:** Bật nén để tối ưu tốc độ tải mạng di động.
   - **Cache assets:** Các file có hash trong tên (`/assets/`) cache lâu dài (`immutable`, 1 năm).
   - **Cache hình ảnh/âm thanh:** Cache vừa phải (30 ngày).
   - **File index.html:** Thiết lập `no-cache` để người dùng luôn nhận được cập nhật mới nhất.
   - **Hỗ trợ Range Requests:** Đảm bảo Nginx hỗ trợ byte-range để Safari trên iOS và webview phát được file âm thanh `.mp3`.
   - **Bật HTTPS:** Cài đặt chứng chỉ SSL/TLS (Let's Encrypt / Certbot) vì các trình duyệt di động và webview (Zalo, Facebook) yêu cầu kết nối an toàn để phát nhạc nền.

---

## 4. Cập nhật nội dung (`src/config/content.ts`)

Toàn bộ văn bản, thông tin hai lễ cưới, thông tin gia đình và tài nguyên media được quản lý tập trung tại [`src/config/content.ts`](file:///src/config/content.ts):
- **Thông tin lễ:** Thời gian, địa chỉ lễ Vu Quy (kèm địa chỉ cũ) và lễ Thành Hôn, liên kết Google Maps.
- **Cô dâu & chú rể:** Họ tên đầy đủ, vai trò trong gia đình.
- **Gia đình hai bên:** Tên thân phụ và thân mẫu nhà trai, nhà gái.
- **Album ảnh cưới:** Danh sách ảnh, kích thước và mô tả hỗ trợ tiếp cận (a11y).
- **Hộp quà mừng:** Tên ngân hàng, số tài khoản/chủ tài khoản và ảnh QR tương ứng.

Sau khi chỉnh sửa `content.ts`, chỉ cần chạy lại `npm run build` và chép đè thư mục `dist/` lên máy chủ.

---

## 5. Google Apps Script Backend

Hệ thống lưu trữ RSVP và Lời chúc sử dụng Google Apps Script liên kết trực tiếp với Google Sheets.
Hướng dẫn chi tiết về cách tạo bảng tính, dán mã `Code.gs`, triển khai Web App và cách duyệt lời chúc được ghi nhận đầy đủ tại:
👉 **[Hướng dẫn triển khai Apps Script](file:///apps-script/README.md)**

---

## 6. Danh sách việc chủ dự án cần cung cấp

Các hạng mục tài nguyên và xác nhận đang chờ chủ dự án cung cấp được theo dõi chi tiết tại bảng rủi ro và checklist của dự án:
👉 **[Theo dõi hạng mục chờ cung cấp (docs/pm/03-rui-ro.md)](file:///docs/pm/03-rui-ro.md)**

Các mục trọng yếu bao gồm:
1. **Ảnh chụp:** Ảnh đại diện cô dâu chú rể, bộ ảnh album cưới (6–10 ảnh chất lượng cao).
2. **File âm thanh:** File nhạc nền hôn lễ (`.mp3` có bản quyền/được phép sử dụng).
3. **Mã thanh toán QR:** Ảnh QR ngân hàng thật của chú rể và cô dâu kèm số tài khoản/tên ngân hàng.
4. **Vị trí bản đồ:** Link Google Maps chính xác của Tư gia (Vu Quy) và Minh Dương Palace (Thành Hôn).
5. **Xác nhận thông tin:** Họ tên thân phụ cô dâu ("Đào" / "Tôn") theo quy tắc BR-10.
