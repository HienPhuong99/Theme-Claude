# Theme-Claude: giao diện xanh kiểu app nhắn tin

Đổi màu claude.ai sang tông xanh dương, nền chat xanh xám nhạt, tin nhắn của bạn nằm trong bong bóng xanh nhạt, chữ không chân. Có cả chế độ sáng và tối. Tab trình duyệt dùng icon **HP**.

Bấm **Ctrl + Alt + H** để bật/tắt theme bất cứ lúc nào.

## Cài trên trình duyệt (Chrome, Edge, Firefox)

1. Cài extension [Tampermonkey](https://www.tampermonkey.net/).
2. Mở [link cài script](https://raw.githubusercontent.com/HienPhuong99/Theme-Claude/main/claude-zalo-theme.user.js) rồi bấm **Install**.
3. Mở hoặc tải lại claude.ai.

Muốn có cửa sổ riêng như app: trong Chrome bấm **⋮ → Truyền, lưu và chia sẻ → Cài đặt trang dưới dạng ứng dụng**. Theme vẫn áp vào cửa sổ đó.

## Cài trên app Claude Desktop

App không cho cài extension, nên chạy script qua **Developer Mode** (tính năng gỡ lỗi chính thức của app). Theme mất khi tắt app, mỗi lần mở lại phải chạy lại.

### Làm 1 lần

1. Bật Developer Mode. Trên Windows: bấm **☰** góc trên bên trái → **Help → Troubleshooting → Enable Developer Mode**. App có thể tự khởi động lại.
2. Bấm vào cửa sổ app Claude rồi mở DevTools bằng `Ctrl + Alt + I`. Nếu không mở được, thử `Ctrl + Shift + I`, hoặc vào menu **☰ → Developer**.
3. Nếu hiện 2 cửa sổ DevTools: ở tab **Console** gõ `location.href` rồi Enter. Cửa sổ nào ra địa chỉ có `claude.ai` là cửa sổ đúng.
4. Lưu script thành snippet: tab **Sources** → `»` → **Snippets** → **+ New snippet**, đặt tên `hp`. Dán toàn bộ nội dung file [`claude-zalo-theme.user.js`](claude-zalo-theme.user.js) vào rồi bấm `Ctrl + S`.

### Mỗi lần mở app

Mở DevTools, bấm `Ctrl + P`, gõ `!hp` rồi Enter, sau đó đóng DevTools.

### Nếu DevTools không cho dán

Tắt bộ gõ tiếng Việt (chuyển sang chế độ E), **gõ tay** `allow pasting` vào dòng `>` của Console, bấm Enter, rồi dán lại.

## Đổi màu

Sửa hai bảng `LIGHT` và `DARK` ở đầu file script. Mỗi dòng có chú thích cho biết màu đó dùng ở đâu.

## Gỡ

- Trình duyệt: xóa script trong Tampermonkey.
- App Desktop: bấm Ctrl + Alt + H, hoặc tắt rồi mở lại app.

Khi claude.ai đổi giao diện, có thể vài chỗ không còn ăn màu. Lúc đó cần cập nhật lại tên biến màu trong script.

## Nguồn icon

Các icon trên cột xanh lấy từ [Tabler Icons](https://tabler.io/icons) v3.50.0, giấy phép MIT. Xem [LICENSE-tabler-icons.txt](LICENSE-tabler-icons.txt).
