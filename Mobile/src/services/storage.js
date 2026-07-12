import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenValid } from '../utils/jwt';

export const STORAGE_KEYS = {
  token: 'token',
  userId: 'userId',
  fullname: 'fullname',
  roles: 'roles',
};

export async function saveSession(data = {}) {
  const token =
    data.token ||
    data.accessToken ||
    data.jwt ||
    '';

  const userId =
    data.userId ||
    data.UserId ||
    data.id ||
    data.user?.id ||
    data.user?.userId ||
    '';

  const fullname =
    data.fullname ||
    data.fullName ||
    data.name ||
    data.user?.fullname ||
    data.user?.fullName ||
    data.user?.name ||
    '';

  const roles = data.roles || data.user?.roles || [];

  await AsyncStorage.setItem(STORAGE_KEYS.token, String(token));
  await AsyncStorage.setItem(STORAGE_KEYS.userId, String(userId));
  await AsyncStorage.setItem(STORAGE_KEYS.fullname, String(fullname));
  await AsyncStorage.setItem(STORAGE_KEYS.roles, JSON.stringify(roles));
}

export async function getSession() {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
  const userId = await AsyncStorage.getItem(STORAGE_KEYS.userId);
  const fullname = await AsyncStorage.getItem(STORAGE_KEYS.fullname);
  const rolesText = await AsyncStorage.getItem(STORAGE_KEYS.roles);

  let roles = [];

  try {
    roles = rolesText ? JSON.parse(rolesText) : [];
  } catch {
    roles = [];
  }

  return {
    token: token || '',
    userId: userId || '',
    fullname: fullname || '',
    roles,
  };
}

export async function clearSession() {
  await AsyncStorage.removeItem(STORAGE_KEYS.token);
  await AsyncStorage.removeItem(STORAGE_KEYS.userId);
  await AsyncStorage.removeItem(STORAGE_KEYS.fullname);
  await AsyncStorage.removeItem(STORAGE_KEYS.roles);
}

export async function hasValidSession() {
  try {
    const { token } = await getSession();
    return isTokenValid(token);
  } catch {
    return false;
  }
}