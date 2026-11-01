# PM-02 · Backlog (chỉ mục)

Vai trò: **BA**, **UX** (UI/UX), **FE**, **PM**, **Chủ** (chủ dự án). Chi tiết từng task nằm trong file epic.

| Epic | Tên | File | Số task | Phụ thuộc |
|---|---|---|---|---|
| E0 | Khởi tạo & nền tảng | [E0](tasks/E0-khoi-tao.md) | 5 | — |
| E1 | Bìa, cặp đôi (hero: đã bỏ) | [E1](tasks/E1-bia-hero-cap-doi.md) | 3 | E0 |
| E2 | Lễ, gia đình, bản đồ (lịch trình: đã bỏ) | [E2](tasks/E2-le-gia-dinh-ban-do-lich-trinh.md) | 4 | E0 |
| E3 | Album & lightbox | [E3](tasks/E3-album.md) | 3 | E0 |
| E4 | Đếm ngược & lịch | [E4](tasks/E4-dem-nguoc-lich.md) | 4 | E2 (dữ liệu lễ) |
| E5 | Apps Script & lớp API | [E5](tasks/E5-apps-script-du-lieu.md) | 4 | E0 |
| E6 | RSVP | [E6](tasks/E6-rsvp.md) | 3 | E5 |
| E7 | Sổ lưu bút | [E7](tasks/E7-so-luu-but.md) | 4 | E5 |
| E8 | Quà mừng (QR) & nhạc | [E8](tasks/E8-qua-mung-nhac.md) | 3 | E1 (nút Mở thiệp) |
| E9 | Chất lượng: hiệu năng, a11y, webview | [E9](tasks/E9-chat-luong-hieu-nang-a11y.md) | 4 | E1–E8 |
| E10 | Đóng gói & phát hành | [E10](tasks/E10-dong-goi-phat-hanh.md) | 3 | E9 |

## Việc tài liệu song song (đã làm trong giai đoạn lập kế hoạch)
- BA: [yêu cầu](../ba/01-yeu-cau.md), [user story](../ba/02-user-stories.md), [use case](../ba/03-use-cases.md), [quy tắc](../ba/04-quy-tac-nghiep-vu.md), [nội dung](../ba/05-noi-dung-thiep.md).
- UI/UX: [sitemap & luồng](../ux-ui/01-sitemap-user-flow.md), [wireframe](../ux-ui/02-wireframes.md), [hướng thiết kế & token](../ux-ui/03-huong-thiet-ke-tokens.md), [thành phần & a11y](../ux-ui/04-thanh-phan-tuong-tac-a11y-copy.md).
- FE: [kiến trúc](../fe/01-kien-truc.md), [thư mục](../fe/02-cau-truc-thu-muc.md), [thư viện](../fe/03-thu-vien-shadcn.md), [API](../fe/04-api-contract-apps-script.md), [build/deploy](../fe/05-build-deploy-nginx.md), [kiểm thử](../fe/06-kiem-thu.md).

## Bản đồ FR → epic
FR-01,16 → E1,E8 · FR-03 → E1 (FR-02 đã bỏ) · FR-04,05,10,17 → E2 (FR-11 đã bỏ) · FR-06 → E3 · FR-07,08,09 → E4 · FR-12 → E5,E6 · FR-13,14 → E5,E7 · FR-15 → E8 · FR-18 → E0,E10.
