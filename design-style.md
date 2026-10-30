# QUY CHUẨN THIẾT KẾ GIAO DIỆN BUNNY COVE (UNIFIED MOBILE & WEB DESIGN STYLE GUIDE)

> **Phong cách cốt lõi hợp nhất**: **Honey Oak & Sweet Cream** (Gỗ Sồi Mật Ong & Kem Sữa Ấm Áp) 🪵🍯🐰  
> **Định hướng thẩm mỹ**: Ấm cúng, mộc mạc cao cấp (Nordic Cozy Wood & Artisan Cream). Kết hợp chất liệu gỗ sồi mật ong, nền kem sữa dịu mắt cùng các điểm nhấn linh vật thỏ ngọt ngào (Cà rốt cam, Nơ hồng dâu, Cỏ ba lá xanh).  
> **Hỗ trợ 2 Theme chuẩn mực**: Cả **Mobile (Flutter)** và **Web (Next.js)** đều triển khai đầy đủ **Light Theme** và **Dark Theme**, đồng bộ 1:1 qua hệ thống Design Tokens và biến toàn cục.

---

## 1. TRIẾT LÝ THIẾT KẾ ĐỒNG BỘ (UNIFIED DESIGN PHILOSOPHY)

1. **Ấm Cúng & Thân Thuộc (Cozy, Warm & Inviting)**:
   - Giao diện mang lại cảm giác thư thái như một quán cà phê board game gỗ sồi Bắc Âu. Tránh hoàn toàn màu trắng tinh chói mắt trên nền tổng thể và không dùng màu đen tuyền (#000000) lạnh lẽo trong Dark mode.
2. **Độ Tương Phản Chuẩn Mực (WCAG AAA Contrast & Readability)**:
   - Light Mode: Chữ Nâu Mộc Sẫm (`#2C221E`) trên nền Kem Sữa (`#FAF7F2`).
   - Dark Mode: Chữ Trắng Kem Dịu (`#F5EFE6`) trên nền Gỗ Mun Ấm (`#1F1A17`).
3. **Hiệu Ứng Nổi Khối & Bo Góc Mềm Mại (Rounded Soft-Clay & Tactile Depth)**:
   - Thẻ (Card) bo góc lớn (`16px - 24px`), viền gỗ thanh thoát (`1px`), bóng đổ nhẹ nhàng tông gỗ ấm.
   - Nút bấm và các khối tương tác có độ nảy xúc giác (Haptic Feedback trên iOS / Hover Transition trên Web).

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

## 3. THIẾT KẾ CHI TIẾT TỪNG MÀN HÌNH (SCREEN-BY-SCREEN SPECS)

### 3.1. Sảnh Chờ & Vào Phòng (Lobby Screen)
- **Header**: Logo chú thỏ 3D với chiếc nơ xinh xắn. Tên app **"Bunny Cove"** với tông Gỗ Sồi mật ong ấm áp.
- **Nút chuyển đổi Theme (ThemeToggle)**: Đặt ở góc phải Header trên cả Mobile và Web, cho phép chuyển đổi nhanh Light ☀️ / Dark 🌙.
- **Card đại diện người dùng**: Nền surface bo tròn 20px, viền gỗ mộc, hiển thị avatar thỏ dễ thương và điểm rank ELO.
- **Cụm hành động nổi bật**:
  - Nút **"Tạo phòng mới 🐰"**: Màu Primary Gỗ Sồi (`#C68B59` / Dark `#D99B66`), chữ tương phản cao, đổ bóng nhẹ.
  - Khung **"Nhập mã phòng"**: Ô input nền kem sữa / gỗ mun, viền sắc nét, font số to rõ nét (letter-spacing: 4px).

### 3.2. Phòng Chờ Game Thời Gian Thực (Multiplayer Waiting Room)
- **Khu vực thành viên phòng (Player Lobby / Matchup)**:
  - Thẻ người chơi nền surface bo góc 16px, viền mộc tinh tế.
  - Chủ phòng (Host): Viền Primary kèm icon vương miện nhỏ.
  - Huy hiệu **"READY"**: Bật sẵn sàng chuyển sang màu Xanh Cỏ Ba Lá (`#4E8752` / Dark `#62A867`).
- **Thanh mã phòng**: Hộp mã phòng `COVE-89` nền kem dịu mắt, nút "Sao chép" và "Mã QR" tiện lợi.
- **Carousel Chọn trò chơi**: Trượt mượt mà giữa Cờ Caro 15x15, Cozy Bingo 5x5, và các mini-game tiếp theo.

### 3.3. Bàn Cờ Caro 15x15 (Cozy Gomoku)
- **Khung bàn cờ**: Khối chữ nhật bo tròn 16px, nền bàn cờ marshmallow (Light) hoặc gỗ mun mộc (Dark), các đường kẻ lưới màu viền gỗ mộc rõ nét từng giao điểm.
- **Quân cờ đối kháng**:
  - **Người 1 (X)**: Biểu tượng Cà rốt cam mọng nước (`#FFA502`).
  - **Người 2 (O)**: Biểu tượng Nơ hồng dâu (`#FF7597`).
  - Nước đi mới nhất: Vòng tròn phát sáng hổ phách lan tỏa (Amber Glow).
  - Khi có 5 ô thẳng hàng thắng cuộc: Đường gạch phát sáng màu vàng kim kết nối 5 ô kèm hiệu ứng mưa hoa sao rơi.

### 3.4. Bàn Chơi Bingo 5x5 (Cozy Bingo)
- **Dải chữ B-I-N-G-O**:
  - Nằm ở đỉnh màn hình, gồm 5 khối tròn đại diện cho 5 chữ cái.
  - Khi người chơi hoàn thành 1 hàng ngang, dọc hoặc chéo, chữ cái tương ứng bật sáng rực rỡ màu Hổ Phách Ánh Kim.
- **Lưới 25 ô số**:
  - Mỗi ô là một khối bo tròn nhỏ (8px), số màu tương phản cao.
  - Ô đã được gọi: Đóng dấu tròn hình chân thỏ màu Hồng Tươi (`#FF3366`) đè lên sinh động.
- **Nút "BINGO!"**:
  - Nút tròn nổi lớn ở góc dưới, rung nhẹ và phát sáng khi đủ 5 đường hoàn thành.

### 3.5. Khung Chat & Bộ Sticker Thỏ (In-Game Chat Overlay)
- Khung trượt dạng **Sliding Bottom Sheet** (Mobile) hoặc Drawer bên phải (Web).
- Bong bóng tin nhắn:
  - Của bạn: Nền Gỗ Sồi Primary, chữ trắng tinh hoặc nâu đậm tương phản cao.
  - Của đối phương: Nền Surface viền gỗ nhẹ, chữ chính rõ nét.
- **Bộ Sticker Thỏ Biểu Cảm**:
  - 8 biểu cảm thỏ độc quyền (Vui vẻ, Giận dỗi, Thả tim, Tinh nghịch, Khóc nhè, Cổ vũ, Buồn ngủ, Bất ngờ).
  - Hỗ trợ sửa tin nhắn (Edit) và thu hồi tin nhắn (Recall) tức thì.

---

## 4. QUY CHUẨN TƯƠNG TÁC & TIẾP CẬN ĐA NỀN TẢNG (INTERACTION STANDARDS)

1. **Light / Dark Theme Tự Động & Thủ Công**:
   - Mặc định tôn trọng cài đặt hệ thống của thiết bị (`ThemeMode.system`), đồng thời cho phép người chơi ghi đè lưu trữ qua SharedPreferences / LocalStorage.
2. **Web Specific Standards**:
   - Mọi phần tử có thể click phải có lớp `cursor-pointer`.
   - Toàn bộ layout và linh kiện chơi game sử dụng `select-none` để chống bôi đen văn bản khi thao tác nhanh.
   - Bố cục responsive 3 tầng: Mobile (<640px), Tablet (640px-1024px), Desktop (>1024px).
3. **Mobile Specific Standards**:
   - Sử dụng `flutter_screenutil` cho kích thước co giãn theo tỉ lệ màn hình.
   - Luôn sử dụng `Theme.of(context).colorScheme` để tự động đổi màu khi chuyển theme Light / Dark.
