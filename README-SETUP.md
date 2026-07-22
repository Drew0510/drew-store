# Drew Store – Giai đoạn 2

## Đã có
- Giữ nguyên giao diện giai đoạn 1.
- Nút đăng nhập Google và popup đặt nickname (hiện đang là demo frontend).
- Bấm “Tài khoản Game” sẽ cuộn tới danh sách Minecraft Premium.
- Danh sách sản phẩm riêng theo từng acc.
- Trạng thái Còn hàng / Đã bán.
- Khu vực “Đơn hàng của tôi”.
- Log giao dịch công khai bằng nickname.
- Popup thanh toán ZaloPay dạng chờ tích hợp.

## Chưa hoạt động thật
- Google Login thật.
- Kiểm tra nickname trùng.
- Tạo QR ZaloPay thật.
- Callback xác nhận thanh toán.
- Tự giao thông tin acc.
- Admin Panel.

Các phần trên cần Firebase + backend Node.js/Firebase Functions + ZaloPay Merchant.

## Bảo mật bắt buộc
Không đưa các dữ liệu sau vào index.html, JavaScript hoặc GitHub:
- Password
- Recovery Code
- Primary Email
- Security Email
- Secret Key
- ZaloPay key1 / key2
- Firebase Admin private key

## Bước tiếp theo
1. Tạo Firebase project.
2. Bật Authentication > Google.
3. Tạo Firestore.
4. Gửi Firebase Web Config (không phải Admin key).
5. Chuẩn bị ZaloPay Sandbox Merchant.


## Trang mới
- `accounts.html`: Trang riêng hiển thị toàn bộ tài khoản Minecraft Premium.
- Nút **Tài khoản Game** trên trang chủ chuyển thẳng sang trang này.
