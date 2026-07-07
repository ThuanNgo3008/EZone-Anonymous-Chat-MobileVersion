const API_BASE_URL = "https://localhost:44352/api";

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
    };

    // Chỉ thêm Content-Type nếu KHÔNG phải FormData
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    if (!response.ok) {
        throw data;
    }

    return data;
}