# FE-05 · Build & triển khai bundle

DevOps do chủ dự án làm. Tài liệu này chỉ đảm bảo **bundle copy là chạy**.

## Build
```
npm ci
cp .env.example .env.production   # điền VITE_API_URL, VITE_SITE_URL, (VITE_BASE_PATH)
npm run build                      # ra thư mục dist/
npm run preview                    # kiểm tra nhanh bản build ở máy
```
`dist/` chứa: `index.html`, `assets/*` (có hash trong tên file), `audio/`, `qr/`, `images/`, `og-image.jpg`, `favicon.svg`. Chép **toàn bộ nội dung** `dist/` lên thư mục web của Nginx.

## Điều kiện bundle phải đạt
- Chạy khi đặt ở gốc domain (`base: '/'`); đặt ở thư mục con thì build với `VITE_BASE_PATH=/ten-thu-muc/` (Vite `base`).
- Không có yêu cầu gì ở server ngoài file tĩnh. Không cần chuyển hướng SPA vì chỉ có một trang; vẫn nên có `try_files $uri /index.html` phòng khi gõ sai đường dẫn.
- Thẻ OG dùng URL tuyệt đối từ `VITE_SITE_URL` (thay lúc build bằng plugin `transformIndexHtml` của Vite hoặc `%VITE_SITE_URL%` trong `index.html`).
- Không có bí mật nào trong `dist/` (kiểm tra bằng tìm kiếm chuỗi; xem E10-T2).

## Cấu hình Nginx mẫu (`deploy/nginx.conf.example`, chỉ để tham khảo)
```nginx
server {
  listen 443 ssl http2;
  server_name thiep.example.com;
  root /var/www/thiep/dist;
  index index.html;

  gzip on;
  gzip_types text/css application/javascript image/svg+xml application/json;

  # file có hash trong tên: cache lâu
  location ^~ /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  # ảnh/âm thanh/qr: cache vừa
  location ~* \.(webp|jpg|jpeg|png|svg|mp3|woff2)$ { add_header Cache-Control "public, max-age=2592000"; }
  # index.html: luôn kiểm tra lại
  location = /index.html { add_header Cache-Control "no-cache"; }

  location / { try_files $uri $uri/ /index.html; }
}
```
- Hỗ trợ `Range` cho `.mp3` (Nginx mặc định bật) để Safari iOS phát được âm thanh.
- Bật HTTPS (Let's Encrypt) là việc của chủ dự án; nhiều webview chặn nội dung không an toàn.

## Quy trình cập nhật
Sửa `src/config/content.ts` → build → chép đè `dist/`. Tên file trong `assets/` đổi theo hash nên không lo cache cũ; `index.html` không cache.
