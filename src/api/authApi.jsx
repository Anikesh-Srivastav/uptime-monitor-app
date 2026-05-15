import apiClient from './client';
import { ENDPOINTS } from '../constants/api';

// ─── Authentication ───────────────────────────────────────────────────────────

export async function login({ email, password, deviceInfo }) {
  return apiClient.post(ENDPOINTS.LOGIN, { email, password, deviceInfo });
}

export async function register({ name, email, password }) {
  return apiClient.post(ENDPOINTS.REGISTER, { name, email, password });
}

export async function verifyOtp({ email, otp }) {
  return apiClient.post(ENDPOINTS.VERIFY_OTP, { email, otp });
}

export async function resendOtp({ email }) {
  return apiClient.post(ENDPOINTS.RESEND_OTP, { email });
}

export async function forgotPassword({ email }) {
  return apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
}

export async function resetPassword({ token, password }) {
  return apiClient.post(ENDPOINTS.RESET_PASSWORD, { token, password });
}

// ─── Session ──────────────────────────────────────────────────────────────────

export async function logout({ refreshToken }) {
  return apiClient.post(ENDPOINTS.LOGOUT, { refreshToken });
}

export async function getCurrentUser() {
  return apiClient.get(ENDPOINTS.ME);
}

export async function getSessions() {
  return apiClient.get(ENDPOINTS.SESSIONS);
}

export async function deleteSession(sessionId) {
  return apiClient.delete(ENDPOINTS.SESSION_BY_ID(sessionId));
}

export async function deleteAllSessions() {
  return apiClient.delete(ENDPOINTS.SESSIONS);
}

// ─── Device (FCM) ─────────────────────────────────────────────────────────────

export async function registerDevice({ fcmToken, platform, deviceName }) {
  return apiClient.post(ENDPOINTS.DEVICE_REGISTER, { fcmToken, platform, deviceName });
}

export async function unregisterDevice({ fcmToken }) {
  return apiClient.delete(ENDPOINTS.DEVICE_DELETE, { data: { fcmToken } });
}

// ─── User Settings ────────────────────────────────────────────────────────────

export async function getUserSettings() {
  return apiClient.get(ENDPOINTS.USER_SETTINGS);
}

export async function updateUserProfile(data) {
  return apiClient.put(ENDPOINTS.USER_PROFILE, data);
}

export async function getUserAlertChannels() {
  return apiClient.get(ENDPOINTS.USER_ALERT_CHANNELS);
}

export async function addAlertChannel(data) {
  return apiClient.post(ENDPOINTS.USER_ALERT_CHANNELS, data);
}

export async function deleteAlertChannel(channelId) {
  return apiClient.delete(ENDPOINTS.USER_ALERT_CHANNEL_BY_ID(channelId));
}

export async function logoutAllDevices() {
  return apiClient.post(ENDPOINTS.LOGOUT_ALL);
}
