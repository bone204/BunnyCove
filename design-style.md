# QUY CHUẨN THIẾT KẾ GIAO DIỆN BUNNY COVE (MOBILE DESIGN STYLE GUIDE)

> **Phong cách cốt lõi**: **Vibrant Strawberry & Sakura Pop** 🍓🐰  
> **Định hướng thẩm mỹ**: Tươi tắn, trẻ trung, thiên về sắc **Hồng**, tràn đầy năng lượng nhưng **tuyệt đối không mờ nhạt**. Đảm bảo độ tương phản cao, chữ sắc nét, các nút bấm nổi bật và tối ưu hoàn hảo cho màn hình Retina/OLED của iOS.

---

## 1. TRIẾT LÝ THIẾT KẾ (DESIGN PHILOSOPHY)

1. **Hồng Trẻ Trung, Không Bệt / Không Mờ Nhạt (Vivid & Energetic, Not Washed Out)**:
   - Thay vì dùng toàn bộ màu pastel nhờ nhờ thiếu sức sống, Bunny Cove kết hợp giữa nền phấn kem dịu mắt (`#FFF5F7`) với các dải màu **Hồng dâu tây đậm đà (Vibrant Strawberry `#FF4B72`)** và **Hồng hoa anh đào rực rỡ (`#FF7597`)**.
2. **Độ Tương Phản Chuẩn Mực (High Contrast & Readability)**:
   - Màu chữ chính không dùng xám nhạt mà dùng **Mận Berry Đậm (`#3A1825`)**, tạo độ tương phản cực kỳ rõ nét trên nền trắng và hồng phấn, đạt chuẩn tiếp cận WCAG AAA.
3. **Hiệu Ứng Nổi Khối Ngọt Ngào (Cute Soft-Clay & Glassmorphism)**:
   - Thẻ (Card) bo góc lớn (`24px - 28px`), bóng đổ màu hồng phấn mềm mại (`box-shadow: 0 8px 24px rgba(255, 75, 114, 0.12)`).
   - Nút bấm chính (Call to Action) sử dụng dải màu Gradient chuyển từ Hồng Dâu sang Cam San Hô với độ nảy (Pop) cao khi bấm.

---

## 2. HỆ THỐNG MÀU SẮC CHI TIẾT (DESIGN TOKENS & COLOR PALETTE)

| Phân loại | Tên màu | Mã HEX | Vai trò hiển thị trên ứng dụng |
| :--- | :--- | :--- | :--- |
| **Primary** | **Strawberry Punch** | `#FF4B72` | Màu chủ đạo: Nút bấm chính, Header quan trọng, Icon hoạt động |
| **Primary Gradient** | **Sakura Sunset** | `linear-gradient(135deg, #FF4B72, #FF839D)` | Dải màu cho các nút Tạo phòng, Nút BINGO!, Banner nổi bật |
| **Secondary** | **Blossom Rose** | `#FF839D` | Màu phụ: Viền thẻ hoạt động, thanh tiến trình, Nơ thỏ |
| **Accent Gold** | **Honey Carrot** | `#FFA502` | Quân cờ Cà rốt (Caro), Ngôi sao thành tích, Điểm thưởng |
| **Accent Mint** | **Fresh Clover** | `#2ED573` | Trạng thái Online, Huy hiệu Sẵn sàng (Ready) |
| **Background** | **Milk Cream Blush**| `#FFF5F7` | Nền tổng thể của toàn bộ app (ấm áp, không chói mắt) |
| **Surface / Card** | **Pure Marshmallow**| `#FFFFFF` | Nền các khối thẻ chức năng, bàn cờ, khung danh sách |
| **Border Line** | **Soft Berry Border**| `#FFD6E0` | Đường viền các thẻ input, phân cách hàng (dày 1.5px) |
| **Text Primary** | **Deep Berry Plum** | `#3A1825` | Tiêu đề, chữ chính (đậm nét, tương phản tối đa) |
| **Text Secondary** | **Muted Rose Berry**| `#8E5B6D` | Chữ chú thích, thời gian, mô tả phụ |

---

## 3. THIẾT KẾ CHI TIẾT TỪNG MÀN HÌNH (SCREEN-BY-SCREEN SPECS)

### 3.1. Sảnh Chờ & Vào Phòng (Lobby Screen)
- **Header**: Logo chú thỏ 3D với đôi má ửng hồng và chiếc nơ hồng dâu tươi tắn. Tên app **"Bunny Cove"** dùng font bo tròn cao cấp với hiệu ứng đổ bóng nhẹ.
- **Card đại diện người dùng**: Nền trắng bo tròn 24px, viền hồng phấn `#FFD6E0`, cho phép chọn nhanh các avatar thỏ cute (Thỏ nơ hồng, Thỏ cà rốt, Thỏ đeo kính, Thỏ tai cụp).
- **Cụm hành động nổi bật**:
  - Nút **"Tạo phòng mới 🐰"**: Dùng Gradient Hồng dâu `#FF4B72` ➔ `#FF839D`, chữ trắng in đậm, bóng đổ phát sáng nhẹ màu hồng.
  - Khung **"Nhập mã phòng"**: Ô input nền kem blush, viền hồng sắc nét, font số to rõ nét (letter-spacing: 4px), nút "Vào phòng" viền hồng dâu nổi bật.

### 3.2. Phòng Chờ 2 Người (2-Player Waiting Room)
- **Khu vực đối đầu (Player Matchup)**:
  - 2 thẻ người chơi hình viên thuốc lớn đối xứng nhau.
  - Chủ phòng (Host): Viền hồng dâu đậm kèm icon vương miện nhỏ.
  - Khách (Guest): Viền hồng phấn kèm biểu tượng chào đón.
  - Huy hiệu **"READY"**: Khi bật sẵn sàng, nút chuyển sang màu Xanh Mint tươi `#2ED573` kèm hiệu ứng rung haptic nhẹ và icon cỏ 3 lá / cà rốt.
- **Thanh mã phòng**: Hộp mã phòng `BUNNY-93` nền hồng sữa ngọt ngào, nút "Copy mã" và "Mã QR" màu hồng dâu sắc sảo.
- **Carousel Chọn trò chơi**:
  - Thẻ game Caro: Hình quả cà rốt cam 3D nổi trên nền hồng phấn.
  - Thẻ game Bingo: Hình bảng số và chiếc tem dấu dập thỏ hồng rực rỡ.

### 3.3. Bàn Cờ Caro 15x15 (Cozy Gomoku)
- **Khung bàn cờ**: Khối chữ nhật bo tròn 20px, nền trắng kem marshmallow, các đường kẻ lưới màu hồng mận nhạt `#FFCCD7` rõ nét từng giao điểm.
- **Quân cờ đối kháng**:
  - **Người 1 (X)**: Biểu tượng Cà rốt cam mọng nước viền đen sắc nét hoặc Nơ hồng đậm.
  - **Người 2 (O)**: Biểu tượng Nơ hồng dâu hoặc Cỏ ba lá xanh mint.
  - Nước đi mới nhất: Vòng tròn phát sáng hồng neon lan tỏa (Pulse Glow animation).
  - Khi có 5 ô thẳng hàng thắng cuộc: Một đường gạch phát sáng màu vàng kim kết nối 5 ô kèm hiệu ứng mưa hoa hồng rơi (Sakura Confetti).

### 3.4. Bàn Chơi Bingo 5x5 (Cozy Bingo)
- **Dải chữ B-I-N-G-O**:
  - Nằm ở đỉnh màn hình, gồm 5 khối tròn tượng trưng cho 5 chữ cái.
  - Ban đầu có màu hồng phấn nhạt. Mỗi khi người chơi hoàn thành 1 hàng ngang, dọc hoặc chéo, chữ cái tương ứng sẽ **bật sáng rực rỡ màu Hồng Dâu ánh Kim**, kèm âm thanh pop vui nhộn.
- **Lưới 25 ô số**:
  - Mỗi ô là một khối bo tròn nhỏ (8px), số màu mận berry to rõ.
  - Ô đã được gọi: Đóng dấu tròn hình dấu chân thỏ màu **Hồng Tươi `#FF3366`** đè lên, tạo cảm giác vô cùng sinh động.
- **Nút "BINGO!"**:
  - Nút tròn nổi lớn ở góc dưới, khi người chơi đủ 5 đường, nút này sẽ rung nhẹ và phát sáng gradient hồng dâu, kích thích người chơi bấm thật nhanh để giành chiến thắng.

### 3.5. Khung Chat & Bộ Sticker Thỏ (In-Game Chat Overlay)
- Khung trượt dạng **Sliding Bottom Sheet** từ dưới lên, nền kính mờ hồng phấn (Blur effect).
- Bong bóng tin nhắn:
  - Của bạn: Nền Gradient Hồng Dâu (`#FF4B72` ➔ `#FF7597`), chữ màu trắng tinh.
  - Của đối phương: Nền Trắng tinh viền hồng `#FFD6E0`, chữ màu Mận Berry `#3A1825`.
- **Bộ Sticker Thỏ Biểu Cảm**:
  - Thỏ cười híp mắt thả tim hồng.
  - Thỏ phồng má giận dỗi đỏ mặt.
  - Thỏ nhảy múa cầm cà rốt cổ vũ.
  - Thỏ khóc nhè ngập nước mắt khi thua cờ.

---

## 4. PROMPTS MẪU ĐỂ DÁN VÀO CÔNG CỤ THIẾT KẾ (STITCH / FIGMA AI / MIDJOURNEY)

Dưới đây là các prompt chuẩn tiếng Anh được tinh chỉnh đặc biệt với phong cách **Vibrant Pink & High Contrast** để đưa vào Stitch hoặc các AI design tool:

### 🎯 Prompt 1: Master Style & UI Overview
```text
High-end mobile UI design for an iOS app called 'Bunny Cove', a youthful and vibrant 2-player game app for couples and close friends. Color theme: energetic and stylish pink palette, combining vibrant strawberry pink (#FF4B72), cherry blossom pink (#FF839D), sweet milk cream background (#FFF5F7), pure white cards, and deep berry plum text (#3A1825) for crisp, bold contrast. Clean Cupertino iOS typography, border radius 24px, glossy soft drop-shadows with subtle pink glows, adorable minimalist bunny mascot details. Bright, youthful, warm, not washed out, no dull grey tones, high visual clarity. Mobile screen UI only, no physical device frames.
```

### 🎯 Prompt 2: 2-Player Room Screen
```text
Mobile app UI design for Bunny Cove 2-player waiting room on iOS. Soft pink milk cream background (#FFF5F7). In the center, two rounded white cards facing each other for Player 1 (White bunny avatar with gold crown) and Player 2 (Pink bunny avatar with flower bow). Vivid pink ready badges, a stylish pill badge displaying room code 'BUNNY-93' with a copy button. Below, an interactive game selection carousel featuring 'Caro Gomoku 15x15' with a vibrant carrot icon and 'Bingo 5x5' with a glowing bunny stamp icon. High contrast deep berry text (#3A1825), playful micro-interactions, sleek modern aesthetic, vibrant and energetic pink accents.
```

### 🎯 Prompt 3: Caro (Gomoku) 15x15 Game Screen
```text
Mobile app game screen for Bunny Cove playing 15x15 Caro (Gomoku) on iOS. Top bar with two player cards, vibrant turn timer bar (24s countdown) in strawberry pink (#FF4B72). Center area features a clean 15x15 wooden-pastel board with delicate pink-tinted grid lines on crisp white. Pieces are cute 3D orange carrots and strawberry pink bows, with the latest placed move glowing with a neon pink ring. Bottom floating action bar with undo, resign, and a cute pink chat drawer button. High contrast, clean, readable, cheerful and lovely.
```

### 🎯 Prompt 4: Bingo 5x5 Screen
```text
Mobile app game screen for Bunny Cove playing 5x5 Bingo on iOS. Header features 5 large circular badges spelling 'B-I-N-G-O' glowing in vibrant hot pink and gold as lines are completed. Center shows a 5x5 grid of rounded white number tiles (1 to 25) with deep berry numbers. Selected tiles are stamped with energetic hot pink bunny paw prints (#FF3366). A pulsating gradient 'BINGO!' button at the bottom with sakura petal sparkles. High-energy, colorful, cute, crisp contrast, premium mobile UI.
```
