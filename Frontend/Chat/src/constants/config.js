// Backend chạy bằng `dotnet run` (profile http mặc định) tại port 5044.
// Đổi BASE_URL nếu bạn chạy backend ở port/profile khác (vd https 7281,
// hoặc IIS Express 44352).
export const BASE_URL = 'http://localhost:5044';
export const API_BASE_URL = `${BASE_URL}/api`;
export const HUB_URL = `${BASE_URL}/chatHub`;