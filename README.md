# EZone — Anonymous Chat (Mobile)

Ứng dụng chat ẩn danh dành riêng cho sinh viên EIU (bắt buộc email `@eiu.edu.vn`). Người dùng được ghép ngẫu nhiên với một người lạ để trò chuyện dưới nickname ẩn danh, có thể dần "mở khoá" danh tính cho nhau khi đủ mức độ tương tác, hoặc report nếu gặp hành vi vi phạm.

## Tính năng chính

- **Đăng ký / kích hoạt tài khoản** bằng email trường, mã kích hoạt xác thực.
- **Ghép cặp ẩn danh ngẫu nhiên** (matchmaking hàng đợi) — không ai biết mình đang chat với ai.
- **Chat real-time** qua SignalR: gửi/nhận tin nhắn, typing indicator, thông báo khi đối phương rời phòng.
- **Kiểm duyệt nội dung tự động**: chặn số điện thoại, email, link, tên mạng xã hội... gửi lên sẽ bị khoá tài khoản ngay.
- **Reveal danh tính theo affinity score**: cả 2 người cùng đồng ý mới lộ diện (fullname, avatar, ngành học, social link).
- **Report / kiểm duyệt**: người dùng report đối phương, admin xem, xử lý ban hoặc xoá report.
- **Quản trị (Admin)**: xem danh sách report, ban tài khoản vi phạm.

## Tech stack

**Backend** — `Backend/`
- ASP.NET Core Web API (.NET)
- Entity Framework Core + SQL Server
- SignalR (real-time chat)
- JWT Authentication + BCrypt (hash mật khẩu)
- Swagger (API docs)

**Mobile** — `Mobile_Frontend/`
- React Native (khởi tạo bằng **React Native CLI thuần**, không dùng Expo Go)
- React Navigation (điều hướng)
- `@microsoft/signalr` (client kết nối ChatHub)
- AsyncStorage (lưu token/session)

## Cấu trúc thư mục

```
EZone---Anonymous-Chat/
├── Backend/
│   └── WebChatEIU/          # ASP.NET Core Web API + SignalR Hub
├── Mobile_Frontend/
│   ├── README.md            # kế hoạch task chi tiết (backend bổ sung + danh sách screen mobile)
│   └── Mobile_Frontend/      # source code React Native
└── README.md                 # file này
```

## Hướng dẫn chạy dự án

### Backend
```bash
cd Backend/WebChatEIU
dotnet restore
dotnet run
```
Kiểm tra `appsettings.json` để cấu hình connection string SQL Server. Sau khi chạy, xem API docs tại `/swagger`.

### Mobile
```bash
cd Mobile_Frontend/Mobile_Frontend
npm install
npm run android
```
Cần cài Android SDK + máy ảo (hoặc thiết bị thật) chạy sẵn. Base URL của backend cần trỏ tới IP LAN của máy chạy backend (không dùng `localhost` vì mobile không chạy chung máy với backend).

