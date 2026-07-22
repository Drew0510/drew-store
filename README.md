# Drew Store Full

## Có sẵn

- Trang chủ
- Đăng ký / đăng nhập bằng tài khoản + mật khẩu
- Danh sách sản phẩm
- Tạo đơn hàng
- Hồ sơ và lịch sử đơn hàng
- Trang admin
- Firebase Authentication
- Firestore
- Firestore Rules

## Bước 1: Bật Email/Password

Firebase Console → Authentication → Sign-in method → Email/Password → Enable → Save.

## Bước 2: Authorized domains

Authentication → Settings → Authorized domains → thêm:

drew0510.github.io

## Bước 3: Firestore Rules

Firestore Database → Rules → dán nội dung file `firestore.rules` → Publish.

## Bước 4: Tạo admin

1. Đăng ký một tài khoản trên website.
2. Vào Firestore Database → collection `users`.
3. Mở document của tài khoản đó.
4. Đổi field `role` từ `user` thành `admin`.
5. Đăng xuất rồi đăng nhập lại.

## Bước 5: Upload GitHub

Upload toàn bộ file và thư mục trong project lên repository `drew-store`.

Trang web:
https://drew0510.github.io/drew-store/

## Lưu ý

- Đây là nền tảng shop hoạt động cơ bản.
- Chưa tích hợp thanh toán ZaloPay thật.
- Chưa tự giao credential account sau thanh toán.
- Không lưu mật khẩu người dùng trong Firestore.
