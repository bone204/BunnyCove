# QUY CHUẨN THIẾT KẾ GIAO DIỆN BUNNY COVE (UNIFIED MOBILE & WEB DESIGN STYLE GUIDE)

> **Phong cách cốt lõi hợp nhất**: **Honey Oak & Sweet Cream** (Gỗ Sồi Mật Ong & Kem Sữa Ấm Áp) 🪵🍯🐰  
> **Định hướng thẩm mỹ**: Ấm cúng, mộc mạc cao cấp (Nordic Cozy Wood & Artisan Cream). Kết hợp chất liệu gỗ sồi mật ong, nền kem sữa dịu mắt cùng các điểm nhấn linh vật thỏ ngọt ngào (Cà rốt cam, Nơ hồng dâu, Cỏ ba lá xanh).  
> **Đồng bộ toàn diện 1:1**: Cả **Mobile (Flutter)** và **Web (Next.js)** đều triển khai đầy đủ **Light Theme** và **Dark Theme**, đồng bộ 100% từ **bảng mã màu**, **kích thước bo góc (Border Radius)**, **cấu trúc nút bấm**, **thẻ (Cards)**, **hộp thoại (Dialogs)**, **thanh thông báo (Snackbars/Toasts)**, **ô nhập liệu (Inputs)** cho đến **hiệu ứng tương tác xúc giác**.

---

## 1. TRIẾT LÝ THIẾT KẾ ĐỒNG BỘ (UNIFIED DESIGN PHILOSOPHY)

1. **Ấm Cúng & Thân Thuộc (Cozy, Warm & Inviting)**:
   - Giao diện mang lại cảm giác thư thái như một quán cà phê board game gỗ sồi Bắc Âu. Tránh hoàn toàn màu trắng tinh chói mắt trên nền tổng thể và không dùng màu đen tuyền (#000000) lạnh lẽo trong Dark mode.
2. **Độ Tương Phản Chuẩn Mực (WCAG AAA Contrast & Readability)**:
   - Light Mode: Chữ Nâu Mộc Sẫm (`#2C221E`) trên nền Kem Sữa (`#FAF7F2`).
   - Dark Mode: Chữ Trắng Kem Dịu (`#F5EFE6`) trên nền Gỗ Mun Ấm (`#1F1A17`).
3. **Hình Khối Xúc Giác & Bo Góc Mềm Mại (Tactile Softness & Shared Geometry)**:
   - Quy chuẩn bo góc thống nhất tuyệt đối: Nút bấm & Input (`14px - 16px`), Thẻ chức năng (`20px`), Hộp thoại Modal (`24px`), Huy hiệu Pill (`999px`).
   - Viền gỗ thanh thoát (`1px border`), bóng đổ ấm áp nhẹ nhàng (`soft warm drop-shadow`).

---

## 2. HỆ THỐNG DESIGN TOKENS & COLOR PALETTE ĐỒNG BỘ 1:1

Mọi thành phần giao diện trên Mobile (`AppColors` / `Theme.of(context)`) và Web (CSS variables trong `globals.css`) phải sử dụng đúng các mã màu sau:

| Token / Biến CSS | Light Mode (Kem & Gỗ Sồi) | Dark Mode (Gỗ Mun & Hổ Phách) | Vai trò hiển thị trên Mobile & Web |
| :--- | :--- | :--- | :--- |
| `primary` / `var(--primary)` | Gỗ sồi mật ong (`#C68B59`) | Hổ phách mật ong sáng (`#D99B66`) | Nút chính, viền nổi bật, điểm nhấn thương hiệu |
| `background` / `var(--background)` | Kem sữa ngọt ngào (`#FAF7F2`) | Gỗ sẫm ấm áp (`#1F1A17`) | Nền tổng thể toàn bộ trang / màn hình |
| `surface` / `var(--surface)` | Trắng Marshmallow (`#FFFFFF`) | Hạt dẻ nướng sẫm (`#2B2420`) | Nền các khối thẻ chức năng, bàn cờ, khung danh sách |
| `foreground` / `var(--foreground)` | Nâu mộc sẫm (`#2C221E`) | Trắng kem dịu mắt (`#F5EFE6`) | Tiêu đề, chữ chính (độ tương phản cao) |
| `textSecondary` / `muted` | Nâu hạt dẻ mờ (`#8C7A6B`) | Hạt dẻ nhạt dịu (`#B3A598`) | Chữ chú thích, thời gian, mô tả phụ |
| `border` / `var(--border)` | Viền gỗ nhạt mềm (`#E6DCCF`) | Viền thớ gỗ trầm (`#382E27`) | Đường viền thẻ, khung phân cách (dày 1px) |
| `success` / `var(--success)` | Xanh cỏ ba lá (`#4E8752`) | Xanh ngọc mộc (`#62A867`) | Trạng thái Online, sẵn sàng (Ready), chiến thắng |
| `warning` / `var(--warning)` | Mật ong hổ phách (`#E08E00`) | Hổ phách sáng (`#F39C12`) | Cảnh báo, đếm ngược thời gian sắp hết |
| `error` / `var(--error)` | Đỏ thẫm dâu rừng (`#D90429`) | Đỏ san hô dịu (`#FF5C7A`) | Báo lỗi, hủy phòng, đầu hàng |

### Điểm Nhấn Trò Chơi Dùng Chung (Game & Mascot Accents):
- **Cà Rốt Cam (`#FFA502`)**: Quân cờ Caro người chơi 1, ngôi sao thành tích, điểm thưởng.
- **Nơ Hồng Dâu (`#FF7597`)**: Quân cờ Caro người chơi 2, nơ thỏ, tag bạn bè.
- **Dấu Chân Thỏ (`#FF3366`)**: Dấu dập tròn ô Bingo khi gọi số.
- **Phông chữ chủ đạo**:
  - **Mobile**: `Sniglet` (Bo tròn, dễ thương, thân thiện).
  - **Web**: `Merriweather` (Serif cổ điển, sang trọng, ấm cúng) kết hợp qua biến `var(--font-merriweather)`.

---

## 3. QUY CHUẨN THIẾT KẾ LINH KIỆN DÙNG CHUNG (SHARED COMPONENT SPECS 1:1)

Toàn bộ linh kiện giao diện (Buttons, Cards, Inputs, Dialogs, Snackbars, Badges, Avatars) phải tuân thủ chuẩn hình học và cấu trúc sau:

### 3.1. Nút Bấm (Button System - `CustomButton` / Web Button)
- **Hình học chuẩn**:
  - Bo góc: **`16px`** (`BorderRadius.circular(16.r)` trên Mobile, `rounded-2xl` trên Web).
  - Chiều cao chuẩn: **`50px - 52px`** (`52.h` trên Mobile, `h-13` / `py-3.5 px-6` trên Web).
  - Phông chữ: Semi-bold (`FontWeight.w600` / `font-semibold`), chữ sắc nét, căn giữa.
- **Các phân loại nút (Variants)**:
  1. **Primary Button (Nút Chính / CTA)**:
     - Nền: `primary` (`#C68B59` trong Light, `#D99B66` trong Dark).
     - Chữ & Icon: Trắng tinh (`#FFFFFF`) trong Light; Nền gỗ sẫm (`#1F1A17`) trong Dark để đạt tương phản tối đa.
     - Bóng đổ: Nhẹ nhàng ấm áp (`box-shadow: 0 4px 14px rgba(198, 139, 89, 0.25)`).
  2. **Secondary Button (Nút Gỗ Phụ / Outline)**:
     - Nền: Trong suốt hoặc `surface` (`#FFFFFF` / Dark `#2B2420`).
     - Viền: `1.5px solid var(--border)`.
     - Chữ: `textPrimary` hoặc `primary`.
  3. **Ghost Button (Nút Tàng Hình)**:
     - Nền: Trong suốt.
     - Chữ: `primary` hoặc `textSecondary`. Không có viền.
  4. **Danger Button (Nút Nguy Hiểm / Đầu Hàng / Rời Phòng)**:
     - Nền: `error` (`#D90429` / Dark `#FF5C7A`).
     - Chữ: Trắng tinh.
- **Hiệu ứng tương tác**:
  - **Mobile**: Kích hoạt rung xúc giác nhẹ (`HapticFeedback.lightImpact()`) khi bấm; hiển thị spinner tròn khi `isLoading: true`.
  - **Web**: Có lớp `cursor-pointer`, `select-none`, hiệu ứng `transition-all duration-150 active:scale-98 hover:brightness-105`.

### 3.2. Thẻ Khối (Card & Container - `CustomCard` / Web Card)
- **Hình học chuẩn**:
  - Bo góc: **`20px`** (`BorderRadius.circular(20.r)` / `rounded-3xl`).
  - Viền: **`1px solid var(--border)`** (`#E6DCCF` trong Light, `#382E27` trong Dark).
  - Nền: `surface` (`#FFFFFF` trong Light, `#2B2420` trong Dark).
  - Bóng đổ: Mềm mại mờ ấm (`0 8px 24px -4px rgba(44, 34, 30, 0.06)` trong Light; `0 8px 24px -4px rgba(0, 0, 0, 0.35)` trong Dark).
  - Lề trong (Padding): Chuẩn `16px` đến `24px` (`p-4` đến `p-6`).

### 3.3. Ô Nhập Liệu (Input Field - `CustomTextField` / Web Input)
- **Hình học chuẩn**:
  - Bo góc: **`14px`** (`BorderRadius.circular(14.r)` / `rounded-xl`).
  - Chiều cao ô: **`50px`** (`50.h` / `h-12`).
  - Nền: `surface` hoặc biến thể nhạt (`fillColor: Theme.of(context).colorScheme.surface`).
  - Viền nhàn rỗi (Idle Border): `1px solid var(--border)`.
  - Viền khi gõ (Focus Border): **`2px solid var(--primary)`** kèm hiệu ứng viền phát sáng nhẹ (`focus:ring-2 focus:ring-[var(--primary)]/20`).
  - Chữ gợi ý (Placeholder/Hint): Màu `textSecondary` (`#8C7A6B` / Dark `#B3A598`).
  - Chữ người dùng gõ: Màu `textPrimary` (`#2C221E` / Dark `#F5EFE6`).
  - Hỗ trợ Icon đầu (prefix) và nút xóa/ẩn hiện mật khẩu (suffix).

### 3.4. Hộp Thoại (Modal Dialog - `CustomDialog` / Web Dialog)
- **Hình học chuẩn**:
  - Bo góc: **`24px`** (`BorderRadius.circular(24.r)` / `rounded-3xl`).
  - Nền hộp thoại: `surface` viền gỗ mộc `1px`.
  - Nền làm mờ phía sau (Backdrop): Hiệu ứng kính mờ ấm (`backdrop-blur-sm bg-black/40`).
  - Cụm tiêu đề: Có icon cảm xúc/linh vật đại diện theo từng loại (info, warning, error, confirm).
  - Các nút hành động: Căn lề rõ ràng, nút Huỷ dạng Ghost/Secondary, nút Đồng ý dạng Primary Button.

### 3.5. Thông Báo Nổi (Toast / Snackbar - `CustomSnackBar` / Web Toast)
- **Hình học chuẩn**:
  - Bo góc: **`16px`** hoặc dạng viên thuốc Floating Pill (`rounded-2xl`).
  - Kiểu hiển thị: Floating (nổi lơ lửng, cách lề dưới `16px - 24px`, không dính sát đáy màn hình).
  - Cấu trúc: Icon biểu thị trạng thái (Check tròn, Lỗi tròn, Cảnh báo tam giác) + Nội dung tin nhắn ngắn gọn.
  - Màu nền: Chuẩn theo trạng thái (`success` #4E8752, `error` #D90429, `warning` #E08E00, `info` Primary #C68B59).

### 3.6. Huy Hiệu & Thẻ Nhãn (Badge & Pill - `CustomBadge` / Web Badge)
- **Hình học chuẩn**:
  - Bo góc: **Viên thuốc hoàn toàn (`999px` / `rounded-full`)**.
  - Lề trong: `horizontal: 12px, vertical: 4px` (`px-3 py-1`).
  - **Phân loại**:
    - **Room Code Pill**: Nền kem sữa dịu viền `primary`, mã phòng in hoa to rõ (`letter-spacing: 2px`), kèm nút copy nhanh.
    - **Ready Badge**: Nền `success` chữ trắng hoặc viền `success` kèm icon cỏ ba lá.
    - **Rank ELO Chip**: Nền màu hổ phách vàng ấm (`#FFA502`), icon cúp/ngôi sao, số điểm rank to đậm.

### 3.7. Đại Diện Người Chơi (Avatar & Player Node)
- **Hình học chuẩn**:
  - Avatar tròn hoàn hảo (`CircleAvatar` / `rounded-full`) hoặc bo góc squircle (`rounded-2xl`).
  - Viền người chơi:
    - Chủ phòng (Host): Viền Primary Honey Oak kèm icon vương miện nhỏ mạ vàng.
    - Thành viên (Guest): Viền gỗ mộc thanh lịch.
  - Chấm trạng thái Online: Tròn nhỏ `10px`, màu `success` (`#4E8752`) ở góc dưới bên phải.

---

## 4. CHI TIẾT TỪNG MÀN HÌNH CHƠI GAME & SẢNH CHỜ

### 4.1. Sảnh Chờ & Vào Phòng (Lobby Screen)
- **Header**: Logo chú thỏ với chiếc nơ xinh xắn. Tên app **"Bunny Cove"** với tông Gỗ Sồi mật ong ấm áp.
- **Nút chuyển đổi Theme (ThemeToggle)**: Đặt ở góc phải Header trên cả Mobile và Web, cho phép chuyển đổi nhanh Light ☀️ / Dark 🌙.
- **Cụm hành động nổi bật**:
  - Nút **"Tạo phòng mới 🐰"**: Dùng Primary Button (`height: 52px`, bo góc 16px, bóng đổ ấm).
  - Khung **"Nhập mã phòng"**: Dùng CustomTextField viền sắc nét, font số to rõ nét (letter-spacing: 4px).

### 4.2. Phòng Chờ Game Thời Gian Thực (Multiplayer Waiting Room)
- **Khu vực thành viên phòng (Player Lobby / Matchup)**:
  - Thẻ người chơi nền `surface` bo góc 20px, viền mộc tinh tế.
  - Huy hiệu **"READY"**: Bật sẵn sàng chuyển sang màu Xanh Cỏ Ba Lá (`#4E8752` / Dark `#62A867`).
- **Carousel Chọn trò chơi**: Trượt mượt mà giữa Cờ Caro 15x15, Cozy Bingo 5x5, và các mini-game tiếp theo.

### 4.3. Bàn Cờ Caro 15x15 (Cozy Gomoku)
- **Khung bàn cờ**: Khối chữ nhật bo tròn 20px, nền bàn cờ marshmallow (Light) hoặc gỗ mun mộc (Dark), các đường kẻ lưới màu viền gỗ mộc rõ nét từng giao điểm.
- **Quân cờ đối kháng**:
  - **Người 1 (X)**: Biểu tượng Cà rốt cam mọng nước (`#FFA502`).
  - **Người 2 (O)**: Biểu tượng Nơ hồng dâu (`#FF7597`).
  - Nước đi mới nhất: Vòng tròn phát sáng hổ phách lan tỏa (Amber Glow).
  - Khi có 5 ô thẳng hàng thắng cuộc: Đường gạch phát sáng màu vàng kim kết nối 5 ô kèm hiệu ứng mưa hoa sao rơi.

### 4.4. Bàn Chơi Bingo 5x5 (Cozy Bingo)
- **Dải chữ B-I-N-G-O**: Gồm 5 khối tròn đại diện cho 5 chữ cái. Khi hoàn thành 1 hàng, chữ cái tương ứng bật sáng rực rỡ màu Hổ Phách Ánh Kim.
- **Lưới 25 ô số**: Mỗi ô là một khối bo tròn nhỏ (8px), số màu tương phản cao. Ô đã được gọi đóng dấu chân thỏ màu Hồng Tươi (`#FF3366`).
- **Nút "BINGO!"**: Nút tròn nổi lớn ở góc dưới, rung nhẹ và phát sáng khi đủ 5 đường hoàn thành.

### 4.5. Khung Chat & Bộ Sticker Thỏ (In-Game Chat Overlay)
- Khung trượt dạng **Sliding Bottom Sheet** (Mobile) hoặc Drawer bên phải (Web).
- Bong bóng tin nhắn:
  - Của bạn: Nền Gỗ Sồi Primary, chữ trắng tinh hoặc nâu đậm tương phản cao, bo góc 16px.
  - Của đối phương: Nền Surface viền gỗ nhẹ, chữ chính rõ nét.
- **Bộ Sticker Thỏ Biểu Cảm**: 8 biểu cảm thỏ độc quyền kèm tính năng Sửa (Edit) và Thu hồi (Recall) tức thì.

---

## 5. QUY CHUẨN TƯƠNG TÁC & TIẾP CẬN ĐA NỀN TẢNG (INTERACTION STANDARDS)

1. **Web Specific Standards**:
   - Mọi nút bấm, tab, ô cờ, icon phải có lớp `cursor-pointer`.
   - Toàn bộ layout và linh kiện chơi game sử dụng `select-none` để chống bôi đen văn bản khi thao tác nhanh.
   - Bố cục responsive 3 tầng: Mobile (<640px), Tablet (640px-1024px), Desktop (>1024px).
2. **Mobile Specific Standards**:
   - Sử dụng `flutter_screenutil` cho kích thước co giãn theo tỉ lệ màn hình.
   - Luôn sử dụng `Theme.of(context).colorScheme` để tự động đổi màu khi chuyển theme Light / Dark.
   - Rung phản hồi nhẹ (`HapticFeedback.lightImpact()`) cho mọi nút bấm và nước đi.
