import * as SecureStore from 'expo-secure-store';
import { SECURE_KEYS } from '../constants/storage';

// Tokens are ONLY stored in SecureStore (hardware-backed on supported devices).
// Never use AsyncStorage or MMKV for tokens.

export async function saveTokens({ accessToken, refreshToken }) {
  await Promise.all([
    SecureStore.setItemAsync(SECURE_KEYS.ACCESS_TOKEN, accessToken),
    SecureStore.setItemAsync(SECURE_KEYS.REFRESH_TOKEN, refreshToken),
  ]);
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(SECURE_KEYS.ACCESS_TOKEN);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(SECURE_KEYS.REFRESH_TOKEN);
}

export async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(SECURE_KEYS.ACCESS_TOKEN),
    SecureStore.deleteItemAsync(SECURE_KEYS.REFRESH_TOKEN),
    SecureStore.deleteItemAsync(SECURE_KEYS.USER_ID),
  ]);
}

export async function saveUserId(userId) {
  await SecureStore.setItemAsync(SECURE_KEYS.USER_ID, String(userId));
}

export async function getUserId() {
  return SecureStore.getItemAsync(SECURE_KEYS.USER_ID);
}

// Returns true when both tokens are present (does not validate expiry)
export async function hasStoredSession() {
  const [access, refresh] = await Promise.all([
    SecureStore.getItemAsync(SECURE_KEYS.ACCESS_TOKEN),
    SecureStore.getItemAsync(SECURE_KEYS.REFRESH_TOKEN),
  ]);
  return Boolean(access && refresh);
}
