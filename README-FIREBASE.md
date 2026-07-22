# Kích hoạt đăng nhập Google thật cho Drew Store

## 1. Tạo Firebase Project
1. Mở Firebase Console → Add project.
2. Project settings → Your apps → Web (`</>`).
3. Đăng ký app rồi sao chép `firebaseConfig` vào `firebase-config.js`.

## 2. Bật Google Login
1. Firebase Console → Authentication → Sign-in method.
2. Bật **Google** và chọn email hỗ trợ.
3. Authentication → Settings → Authorized domains → thêm:
   - `drew0510.github.io`
   - tên miền riêng của bạn (nếu có)

## 3. Tạo Firestore
1. Firebase Console → Firestore Database → Create database.
2. Chọn production mode.
3. Vào tab Rules, dán toàn bộ nội dung `firestore.rules`, rồi Publish.

## 4. Upload GitHub
Upload/ghi đè các file:
- `index.html`
- `accounts.html`
- `firebase-auth.js`
- `firebase-config.js`
- `firestore.rules` (không bắt buộc để Pages chạy, nhưng giữ để quản lý rules)
- `logo.png`

Sau 1–3 phút, mở website và bấm **Đăng nhập Google**. Lần đầu hệ thống yêu cầu nickname; các lần sau đăng nhập thẳng bằng tài khoản Google.

## Bảo mật
- Firebase Web Config có thể xuất hiện ở frontend; bảo mật nằm ở Authentication và Firestore Rules.
- Không đưa mật khẩu Minecraft, Recovery Code, Secret Key, ZaloPay key1/key2 hoặc Firebase Admin private key lên GitHub.
- Giao tài khoản và xác nhận ZaloPay phải chạy ở backend, không chạy trong GitHub Pages.
