import { API_BASE_URL } from '../constants/config';
import { getSession } from './storage';

export async function apiRequest(endpoint, options = {}) {
  const { token } = await getSession();

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message;
    throw new Error(message || 'Request failed');
  }

  return data;
}

export function login(email, password) {
  return apiRequest('/Auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser({ fullname, email, password, majorCode }) {
  return apiRequest('/Users/register', {
    method: 'POST',
    body: JSON.stringify({
      Fullname: fullname,
      Email: email,
      Password: password,
      MajorCode: majorCode,
    }),
  });
}

export function activateAccount({ email, code }) {
  return apiRequest('/Users/activate', {
    method: 'POST',
    body: JSON.stringify({ Email: email, Code: code }),
  });
}

export function createReport({ roomId, reporterId, violatingMessage, reason }) {
  return apiRequest('/ChatReports', {
    method: 'POST',
    body: JSON.stringify({
      RoomId: Number(roomId),
      ReporterId: Number(reporterId),
      ReportedUserId: 0,
      ViolatingMessage: violatingMessage || 'Reported from mobile app',
      Reason: reason,
    }),
  });
}

export function logoutRequest() {
  return apiRequest('/Auth/logout', { method: 'POST' });
}
