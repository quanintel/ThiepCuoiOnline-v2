# Hướng Dẫn Cài Đặt và Quản Trị Google Apps Script

Tài liệu này hướng dẫn chi tiết cách thiết lập Google Spreadsheet, triển khai mã nguồn Google Apps Script (Web App) để lưu trữ RSVP và lời chúc từ website thiệp cưới trực tuyến của **Kiều Anh Quân & Tôn Mai Hương**.

---

## 1. Tổng Quan Kiến Trúc & Hợp Đồng Dữ Liệu

- **Môi trường:** Google Apps Script Web App (V8 runtime).
- **Múi giờ:** `Asia/Ho_Chi_Minh` (GMT+7), thời gian định dạng chuẩn ISO 8601 kèm offset `+07:00` (ví dụ: `2026-11-05T09:30:00+07:00`).
- **Phân quyền chạy (Execution):** Chạy dưới danh nghĩa chủ sở hữu (`Execute as: Me / USER_DEPLOYING`).
- **Quyền truy cập (Access):** Bất kỳ ai (`Who has access: Anyone / ANYONE_ANONYMOUS`).
- **An toàn & Bảo mật:**
  - **Chống Formula Injection:** Tự động chèn dấu `'` phía trước chuỗi bắt đầu bằng các ký tự `=`, `+`, `-`, `@`.
  - **Honeypot (`hp`):** Phát hiện bot spam; trả về kết quả thành công giả lập (`ok: true`) nhưng không ghi vào bảng tính.
  - **Chống spam / Rate limit:** Chặn gửi lặp nội dung giống hệt nhau trong vòng 60 giây.
  - **Đồng thời (Concurrency):** Sử dụng `LockService` (tối đa 10 giây) để tránh ghi đè dữ liệu khi nhiều khách gửi cùng lúc.
  - **Bộ nhớ đệm (CacheService):** `GET ?action=wishes` được lưu đệm 60 giây để tăng tốc độ tải trang và giảm hạn mức (quota) đọc bảng tính.

---

## 2. Bước 1: Tạo Google Spreadsheet Mới

1. Mở trình duyệt và truy cập [Google Sheets](https://sheets.new).
2. Đổi tên bảng tính (ví dụ: `Thiệp Cưới - Anh Quân & Mai Hương`).
3. *(Tùy chọn)* Bạn **không cần** tự tạo các tab và tiêu đề thủ công. Mã nguồn `Code.gs` đã được lập trình để **tự động khởi tạo** 2 tab và hàng tiêu đề ngay trong lần gọi đầu tiên:
   - Tab **`RSVP`**: `id`, `createdAt`, `name`, `attendance`, `guests`, `note`
   - Tab **`Wishes`**: `id`, `createdAt`, `name`, `message`, `Duyệt` (kèm định dạng Checkbox)

---

## 3. Bước 2: Dán Mã Nguồn Vào Apps Script

1. Trên thanh công cụ của Google Sheet, chọn **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Đổi tên dự án Apps Script ở góc trên bên trái (ví dụ: `ThiepCuoi-Backend`).
3. **Dán mã `Code.gs`:**
   - Chọn tệp `Code.gs` ở thanh bên trái.
   - Xóa toàn bộ nội dung mặc định và dán toàn bộ nội dung từ file [`Code.gs`](file:///apps-script/Code.gs).
4. **Cập nhật manifest `appsscript.json`:**
   - Chọn biểu tượng **Cài đặt dự án (Project Settings)** (hình bánh răng ⚙️ ở menu bên trái).
   - Tích chọn ô: **"Hiển thị tệp kê khai 'appsscript.json' trong trình chỉnh sửa" (Show "appsscript.json" manifest file in editor)**.
   - Quay lại phần **Trình chỉnh sửa (Editor)** (biểu tượng `< >`).
   - Mở tệp `appsscript.json` vừa xuất hiện.
   - Thay thế toàn bộ nội dung bằng cấu hình từ [`appsscript.json`](file:///apps-script/appsscript.json):
     ```json
     {
       "timeZone": "Asia/Ho_Chi_Minh",
       "dependencies": {},
       "exceptionLogging": "STACKDRIVER",
       "runtimeVersion": "V8",
       "webapp": {
         "executeAs": "USER_DEPLOYING",
         "access": "ANYONE_ANONYMOUS"
       }
     }
     ```
5. Nhấn biểu tượng **Lưu (Save)** (hình đĩa mềm) hoặc bấm tổ hợp phím `Ctrl + S` (hoặc `Cmd + S` trên macOS).

---

## 4. Bước 3: Chạy Kiểm Thử Thủ Công (`selfTest_`)

Trước khi triển khai, hãy chạy hàm kiểm tra để đảm bảo toàn bộ quy tắc nghiệp vụ và logic kiểm tra dữ liệu hoạt động chính xác:

1. Tại thanh công cụ trên cùng của trình soạn thảo Apps Script, tìm ô chọn hàm (Select function) và chọn **`selfTest_`**.
2. Bấm nút **Chạy (Run)**.
3. Khi chạy lần đầu, Google sẽ hiển thị hộp thoại yêu cầu cấp quyền truy cập:
   - Bấm **Xem xét quyền (Review permissions)**.
   - Chọn tài khoản Google của bạn.
   - Bấm **Nâng cao (Advanced)** > chọn **Đi tới ThiepCuoi-Backend (không an toàn)**.
   - Bấm **Cho phép (Allow)**.
4. Xem bảng điều khiển **Nhật ký thực thi (Execution log)** ở dưới cùng:
   - Toàn bộ các ca kiểm tra sẽ hiển thị `[PASS]`.
   - Dòng tổng kết sẽ thông báo: `TỔNG KẾT: ĐẠT 32 / 32 CA KIỂM TRA (LỖI: 0)`.

---

## 5. Bước 4: Triển Khai Ứng Dụng Web (Deploy as Web App)

1. Ở góc trên cùng bên phải màn hình Apps Script, bấm nút **Triển khai (Deploy)** > chọn **Tùy chọn triển khai mới (New deployment)**.
2. Bấm vào biểu tượng bánh răng bên cạnh mục *Chọn loại (Select type)*, chọn **Ứng dụng web (Web app)**.
3. Điền cấu hình như sau:
   - **Mô tả (Description):** `v1.0.0 - API Thiep Cuoi`
   - **Thực thi dưới dạng (Execute as):** **Tôi (Me)** (`USER_DEPLOYING`)
   - **Người có quyền truy cập (Who has access):** **Bất kỳ ai (Anyone)** (`ANYONE_ANONYMOUS`)
4. Bấm **Triển khai (Deploy)**.
5. Sao chép chuỗi **URL ứng dụng web (Web app URL)**.
   - URL có định dạng: `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`
   - **Lưu ý:** Phải là đường dẫn kết thúc bằng `/exec` (không dùng URL `/dev`).

---

## 6. Bước 5: Cấu Hình URL Vào Dự Án Frontend

Mở file môi trường trong dự án website frontend (ví dụ `.env.local` hoặc cấu hình trên nền tảng CI/CD):

```env
VITE_API_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

Khởi động lại frontend hoặc build lại bản tĩnh để website gửi dữ liệu trực tiếp về Google Sheet của bạn.

---

## 7. Bước 6: Hướng Dẫn Duyệt Lời Chúc (Cột "Duyệt")

Để tránh các nội dung khiếm nhã hoặc không mong muốn hiển thị công khai trên thiệp cưới, tất cả lời chúc gửi lên đều ở trạng thái **Chờ duyệt**:

1. Mở Google Sheet, chuyển sang tab **`Wishes`**.
2. Các cột dữ liệu gồm có:
   - Cột A: `id` (Mã định danh duy nhất, ví dụ: `w_a1b2c3d4`)
   - Cột B: `createdAt` (Thời gian gửi, chuẩn ISO 8601 múi giờ Việt Nam)
   - Cột C: `name` (Tên người gửi)
   - Cột D: `message` (Nội dung lời chúc)
   - Cột E: **`Duyệt`** (Hộp kiểm Checkbox)
3. **Cách duyệt lời chúc:**
   - Tích chọn vào ô Checkbox ở cột **`Duyệt`** (giá trị sẽ chuyển thành `TRUE`).
   - Nếu không muốn hiển thị hoặc từ chối lời chúc, hãy bỏ tích (giá trị là `FALSE`) hoặc xóa hàng đó.
4. **Thời gian cập nhật lên website:**
   - Do có cơ chế bộ nhớ đệm `CacheService` tối ưu hiệu năng, sau khi bạn tích chọn ô "Duyệt", lời chúc sẽ hiển thị lên sổ lưu bút của website trong vòng **tối đa 60 giây**.

---

## 8. Bước 7: Cập Nhật & Triển Khai Lại Khi Sửa Mã (Deploy New Version)

Nếu bạn thực hiện bất kỳ chỉnh sửa nào trong file `Code.gs` hoặc `appsscript.json`:

1. Bấm **Lưu (Save)** file `Code.gs`.
2. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải > chọn **Quản lý bản triển khai (Manage deployments)**.
3. Chọn bản triển khai đang hoạt động (Active deployment) ở danh sách bên trái.
4. Bấm vào biểu tượng **Chỉnh sửa (Edit)** (hình cây bút ✏️).
5. Tại mục **Phiên bản (Version)**, chọn **Phiên bản mới (New version)**.
6. Ghi chú nội dung thay đổi vào ô mô tả.
7. Bấm **Triển khai (Deploy)**.
8. URL ứng dụng web `/exec` sẽ **giữ nguyên không đổi**, frontend không cần cấu hình lại.

> [!IMPORTANT]
> Nếu bạn chỉ bấm Lưu trong trình soạn thảo mà không tạo "Phiên bản mới (New version)" trong "Quản lý bản triển khai", Google Apps Script vẫn sẽ tiếp tục chạy mã nguồn cũ trước đó!

## Cập nhật 01.11.2026: sổ lưu bút hiện đúng sau khi xoá dòng
Mã mới thêm `action=status` và giảm cache lời chúc xuống 20 giây. Sau khi dán `Code.gs` mới, nhớ **Triển khai > Quản lý bản triển khai > Sửa > Phiên bản mới > Triển khai** (URL giữ nguyên). Chưa triển khai lại thì web vẫn chạy nhưng lời "Đang chờ duyệt" đã xoá khỏi Sheet sẽ chưa tự mất.
