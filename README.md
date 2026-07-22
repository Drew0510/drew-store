# Drew Store – đăng nhập Tài khoản/Mật khẩu

## File cần đưa lên GitHub

Đưa toàn bộ các file trong thư mục này vào thư mục gốc repository `drew-store`:

- `index.html`
- `accounts.html`
- `logo.png`
- `firebase-config.js`
- `firebase-auth.js`
- `firestore.rules`

Các file README chỉ là hướng dẫn, có thể đưa lên GitHub hoặc không.

## Bước bắt buộc trong Firebase

1. Mở **Authentication → Sign-in method**.
2. Chọn **Email/Password**.
3. Bật tùy chọn **Email/Password** đầu tiên; không cần bật Email link.
4. Bấm **Save**.
5. Vào **Authentication → Settings → Authorized domains** và thêm `drew0510.github.io` nếu chưa có.
6. Vào **Firestore Database → Rules**, dán nội dung file `firestore.rules`, rồi bấm **Publish**.

## Cách hoạt động

Người dùng chỉ thấy ô **Tài khoản** và **Mật khẩu**. Website tự tạo một địa chỉ kỹ thuật từ tên tài khoản để Firebase Authentication xử lý. Mật khẩu không được lưu trong HTML hoặc Firestore.

Quy tắc tên tài khoản: 3–20 ký tự, chỉ gồm chữ, số và dấu gạch dưới. Mật khẩu tối thiểu 6 ký tự.

Lưu ý: vì người dùng không nhập email thật nên hiện chưa có chức năng “Quên mật khẩu”. Sau này có thể thêm email khôi phục hoặc hệ thống hỗ trợ đặt lại mật khẩu qua admin/backend.
