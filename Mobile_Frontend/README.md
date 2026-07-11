# EZone Mobile — Kế hoạch triển khai

Chuyển EZone (web) sang bản mobile cho môn Mobile. **Backend ASP.NET Core giữ nguyên**, chỉ bổ sung thêm vài API còn thiếu. **Frontend viết mới hoàn toàn bằng React Native**, không tái sử dụng UI web (Tailwind/Radix không chạy trên RN).

Tham khảo yêu cầu môn học: `CHAT-PROJECT/Project Requirements_v2.pdf` (tối thiểu 20 màn hình, tối thiểu 9 loại API, JSON response).

Danh sách task chia làm 3 phần (Backend, Mobile Frontend, Test/Docs/Integration) — tự nhận task theo phần phù hợp, không gán cứng ai làm gì.

Thứ tự làm: **Phần A (backend) nên xong task 1-3 trước** để Phần B có API thật để nối vào các screen Phase 1. Các task backend còn lại có thể làm song song với lúc dựng UI/navigation bên mobile (dùng mock data tạm trong lúc chờ).

---

## Phần A — Backend & Database

Code hiện có (không cần đụng vào, chỉ tham khảo): `Backend/WebChatEIU/Controllers/*`, `Hubs/ChatHub.cs`, `Services/*`.

### A1. Sửa API profile cho user tự dùng (ưu tiên cao — cần làm trước để mobile có API dùng ngay)
- [ ] Thêm `GET /api/Users/me` — lấy `userId` từ JWT claim (`User.FindFirst("userId")`), trả về profile của chính user đang login (không cần `[Authorize(Roles="Admin")]` như `GetUser` hiện tại).
- [ ] Review lại `PUT /api/Users/{id}` (`UpdateUsers`) — hiện đang không check quyền, user A có thể sửa profile user B nếu biết `id`. Thêm check `id` phải trùng với `userId` trong JWT.

### A2. API lịch sử match (list + detail — bắt buộc cho yêu cầu môn học)
- [ ] `GET /api/ChatRooms/history/{userId}` — trả danh sách các phòng đã `Closed` mà user từng tham gia (sắp xếp theo `UpdatedAt` giảm dần). Đây là **"Get list data API"**.
- [ ] `GET /api/ChatRooms/{roomId}` — trả chi tiết 1 phòng (nickname, thời gian, affinity score, trạng thái reveal). Đây là **"Get detail data API"**. Nhớ check user gọi API phải thuộc phòng đó (giống cách `RevealController` đang làm).

### A3. API report cho user thường (hiện tại report chỉ Admin xem được)
- [ ] `GET /api/ChatReports/my/{userId}` — trả các report mà chính user đó đã gửi đi (khác với `GET /api/ChatReports` hiện tại là dành riêng cho Admin).

### A4. Sửa 2 bug đã phát hiện khi test web (nên fix trước khi build mobile để khỏi lặp lại)
- [ ] `ChatHub.LeaveRoom()` hiện **không xóa message / không đóng phòng trong DB**, chỉ dọn kết nối SignalR. Cần gọi logic giống `ChatRoomsController.LeaveChat` (xóa `Messages` theo `RoomId`, set `Status = Closed`) ngay trong hub method này, để hành vi nhất quán dù gọi từ web hay mobile.
- [ ] `ChatHub.OnConnectedAsync()` dùng `int.Parse(userIdString)` — sẽ crash nếu client gửi `userId` không phải số (đã từng xảy ra ở bản web). Đổi sang `int.TryParse`, nếu parse fail thì abort connection với thông báo lỗi rõ ràng thay vì throw exception.

### A5. (Tuỳ chọn, cân nhắc nếu còn thời gian) API preferences — phục vụ screen "Search/Filter"
- [ ] Thêm bảng `Preferences` (`UserId`, `PreferredGender`, `PreferredMajor`).
- [ ] `GET /api/Preferences/{userId}`, `PUT /api/Preferences/{userId}`.
- [ ] `MatchmakingService.FindMatch` đọc preferences khi ghép cặp (lọc waiting queue theo tiêu chí, không bắt buộc phải áp dụng thật 100%, có thể để mức đơn giản: ưu tiên ghép ai match tiêu chí trước, không thì ghép ngẫu nhiên như cũ).

### A6. (Tuỳ chọn) API thống kê cho Admin Dashboard
- [ ] `GET /api/Admin/stats` — đếm nhanh: tổng số user, số report đang Pending, số phòng đang Active. Chỉ cần `COUNT` đơn giản qua `_context`.

### A7. Hạ tầng để mobile kết nối được (khác localhost)
- [x] Cấu hình backend lắng nghe trên `0.0.0.0` (không chỉ `localhost`) để điện thoại thật/emulator trong cùng mạng LAN gọi được API — đã sửa `applicationUrl` trong `launchSettings.json`.
- [x] Ghi lại địa chỉ IP LAN của máy chạy backend để cấu hình base URL bên app mobile:
  - **Base URL hiện tại (Wi-Fi, máy chạy backend):** `http://192.168.202.61:5044` (HTTP) / `https://192.168.202.61:7281` (HTTPS)
  - Lưu ý: IP này đổi mỗi khi máy chạy backend kết nối lại Wi-Fi / đổi mạng — kiểm tra lại bằng `ipconfig` (tìm dòng `IPv4 Address` của adapter `Wi-Fi`) nếu app mobile không gọi được API.
  - Điện thoại thật/emulator phải **cùng mạng Wi-Fi/LAN** với máy chạy backend thì mới gọi được, không dùng `localhost`/`127.0.0.1`.

---

## Phần B — Mobile Frontend, React Native

**Dùng React Native CLI thuần (`npx @react-native-community/cli init`), KHÔNG dùng Expo Go / Expo project.** Vì chạy CLI thuần nên các thư viện native bên dưới cần cài đặt kèm bước link native (`pod install` cho iOS, autolink cho Android) chứ không tự động như Expo.

Stack đề xuất: `@react-navigation/native` + `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler` (điều hướng), `@microsoft/signalr` (client cho ChatHub, cần thêm `react-native-url-polyfill`), `@react-native-async-storage/async-storage` (thay cho `localStorage`), `react-native-image-picker` (thay input file upload avatar).

### Cấu trúc thư mục project

React Native không bắt buộc cấu trúc thư mục nào cả — CLI init mặc định chỉ tạo `App.tsx` ở root, không có `src/`. Cấu trúc dưới đây là quy ước cộng đồng hay dùng nhất (type-based: chia theo vai trò api/components/screens), áp dụng cho project này để 3 người cùng làm không đụng file nhau:

```
EZoneMobile/
├── android/                  # native Android project (RN CLI tự sinh)
├── ios/                       # native iOS project (RN CLI tự sinh, cần pod install)
├── src/
│   ├── api/                   # toàn bộ code gọi REST API + SignalR, không rải rác trong screen
│   │   ├── client.js           # instance fetch/axios dùng chung, tự đính "Authorization: Bearer <token>"
│   │   ├── authApi.js          # login, logout
│   │   ├── userApi.js          # register, activate, me, update profile
│   │   ├── chatRoomApi.js       # active room, history, detail, leave
│   │   ├── reportApi.js        # create/list report
│   │   ├── revealApi.js        # request reveal, get identity
│   │   └── chatConnection.js    # setup SignalR HubConnection (tương đương chatService.js bên web)
│   │
│   ├── components/             # UI nhỏ, tái sử dụng nhiều screen (nút, bubble chat, avatar...)
│   │   ├── ChatBubble.jsx
│   │   ├── ActionButton.jsx
│   │   ├── TypingIndicator.jsx
│   │   └── ...
│   │
│   ├── screens/                # mỗi screen 1 folder riêng, map đúng danh sách screen bên dưới
│   │   ├── Auth/
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── RegisterScreen.jsx
│   │   │   └── ActivateScreen.jsx
│   │   ├── Home/
│   │   ├── Waiting/
│   │   ├── Chat/
│   │   │   ├── ChatRoomScreen.jsx
│   │   │   ├── ReportUserScreen.jsx
│   │   │   └── IdentityRevealedScreen.jsx
│   │   ├── Profile/
│   │   ├── History/
│   │   ├── Settings/
│   │   └── Admin/
│   │
│   ├── navigation/
│   │   └── AppNavigator.jsx    # khai báo Stack/Tab navigator, danh sách route
│   │
│   ├── context/                # AuthContext giữ token/userId hiện tại (thay cho localStorage bên web)
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/                  # custom hook tái sử dụng (VD useChatConnection, useAuth)
│   │
│   ├── constants/
│   │   └── config.js           # BASE_URL (IP LAN backend, xem mục A7), hằng số dùng chung
│   │
│   ├── utils/                  # hàm tiện ích thuần (format thời gian, validate email...)
│   │
│   └── assets/
│       ├── images/
│       └── fonts/
│
├── __tests__/
├── App.tsx                     # chỉ render <AppNavigator /> bọc trong <AuthProvider>
├── index.js
├── package.json
├── babel.config.js
├── metro.config.js
└── tsconfig.json
```

Danh sách màn hình theo 3 giai đoạn ưu tiên. **Làm xong Phase 1 là app chạy được luồng chính** (login → match → chat), Phase 2-3 bổ sung cho đủ 20+ screens theo yêu cầu môn học.

### Phase 1 — Luồng chính (bắt buộc, làm trước)
1. **Splash screen** — check token đã lưu (AsyncStorage) còn hạn không, tự chuyển vào Home hoặc Login.
2. **Login screen** — gọi `POST /api/Auth/login`, lưu `token` + `userId` vào AsyncStorage.
3. **Register screen** — gọi `POST /api/Users/register`.
4. **Activate account screen** — nhập email + code, gọi `POST /api/Users/activate`.
5. **Home screen** — nút "Find a match", hiển thị tên/nickname, entry point vào các mục khác.
6. **Rules / About EZone screen** — nội dung tĩnh (copy từ phần "EZone Rules" trong `login.html` cũ).
7. **Waiting / Finding match screen** — connect SignalR, gọi `FindMatch`, lắng nghe event `Matched`/`WaitingForMatch` (logic y hệt `WaitingScreen.jsx` bản web, viết lại UI bằng RN).
8. **Match success screen** — hiện khi nhận event `Matched` (tách từ modal web thành 1 screen riêng, có animation ngắn rồi tự chuyển qua Chat room).
9. **Chat room screen** — core: `SendMessage`, `ReceiveMessage`, `Typing`, `JoinRoom`, `LeaveRoom` (logic y hệt `AnonymousChatRoom.jsx` bản web).
10. **Report user screen** — tách từ dialog web thành screen riêng, gọi `POST /api/ChatReports`.
11. **Identity revealed screen** — tách từ dialog web thành screen riêng, gọi `POST /api/Reveal/{roomId}/{userId}` + `GET /api/Reveal/{roomId}/identity/{userId}`.
12. **Logout confirmation screen** — gọi `POST /api/Auth/logout`, xoá token khỏi storage.

### Phase 2 — Profile & lịch sử (cần API A1, A2, A3 ở Phần A)
13. **My profile screen** — `GET /api/Users/me`.
14. **Edit profile screen** — `PUT /api/Users/{id}` (fullname, gender, majorCode, socialLink).
15. **Change avatar screen** — dùng `react-native-image-picker`, gửi `multipart/form-data` tới `PUT /api/Users/{id}`.
16. **Match history (list) screen** — `GET /api/ChatRooms/history/{userId}`.
17. **Match detail screen** — `GET /api/ChatRooms/{roomId}`.
18. **My reports (list) screen** — `GET /api/ChatReports/my/{userId}`.
19. **Report detail screen** — hiển thị chi tiết 1 report user đã gửi.

### Phase 3 — Settings, Admin, phụ trợ (làm sau cùng nếu còn thời gian)
20. **Settings screen** — theme toggle, thông báo bật/tắt (local state, không cần API).
21. **Notification / history log screen** — gộp các sự kiện nhận được (bị report, được reveal...) hiển thị dạng list.
22. **Search / filter (match preferences) screen** — cần API A5.
23. **Admin — reports list screen** — `GET /api/ChatReports` (map từ `admin-reports.html` cũ).
24. **Admin — report detail / ban action screen** — `POST /api/ChatReports/{reportId}/ban`, `DELETE /api/ChatReports/{reportId}`.
25. **Admin — dashboard/stats screen** — cần API A6.

> Tổng cộng 25 screen được liệt kê (dư so với mức tối thiểu 20) — nếu thiếu thời gian có thể bỏ bớt vài cái ở Phase 3 (VD gộp Settings + Notification, hoặc bỏ Search/Filter nếu A5 không kịp làm) mà vẫn đạt yêu cầu tối thiểu.

### Việc kỹ thuật cần làm trước khi vào từng screen
- [ ] Setup project bằng React Native CLI (không dùng Expo Go), cài các thư viện điều hướng + SignalR + storage ở trên, chạy `pod install` (iOS) để link native.
- [ ] Viết `src/api/client.js` dùng chung: base URL đọc từ `src/constants/config.js` (IP LAN của backend, xem mục A7), tự đính kèm `Authorization: Bearer <token>` từ AsyncStorage vào mọi request.
- [ ] Viết `src/api/chatConnection.js` dùng chung cho SignalR (tương đương `chatService.js` bản web, đổi URL cứng thành config).

---

## Phần C — Test / Docs / Integration

- [ ] Viết test case cho từng API ở Phần A (dùng Swagger hoặc Postman) — đặc biệt test kỹ 2 bug vừa fix ở A4 (leave room có xóa message chưa, userId sai định dạng có bị crash không).
- [ ] Viết test case luồng chính trên mobile: register → activate → login → match → chat → report/reveal → leave → xem lại match history.
- [ ] Theo dõi tiến độ 20+ screens, đảm bảo mỗi screen đều nối đúng API thật (không còn mock data) trước khi tổng hợp báo cáo.
- [ ] Chuẩn bị Project Report + slide theo cấu trúc trong `Project Requirements_v2.pdf` (Introduction, Technology used, Analysis and design, Results and future work, References).
- [ ] Hỗ trợ tích hợp: khi cắm API thật vào app, cùng test trên điện thoại thật/emulator qua IP LAN thật (không phải localhost).

---

## Lưu ý chung
- Business logic (matchmaking, moderation từ khoá nhạy cảm, reveal theo affinity score) **giữ nguyên như bản web**, không cần thiết kế lại — chỉ UI và cách gọi API là mới.
- Trước khi báo cáo với giảng viên, xác nhận lại chủ đề "anonymous chat/matching app" có được chấp nhận không, vì các ví dụ trong đề bài chủ yếu là app dạng danh mục/CRUD (food ordering, booking...), khác thể loại real-time chat.
