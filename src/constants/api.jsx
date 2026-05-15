export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export const API_TIMEOUT_MS = 15000;

export const ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  LOGIN: '/api/users/login',
  REGISTER: '/api/users/register',
  VERIFY_OTP: '/api/users/verify-otp',
  RESEND_OTP: '/api/users/resend-otp',
  FORGOT_PASSWORD: '/api/users/forgot-password',
  RESET_PASSWORD: '/api/users/reset-password',

  // ── Session ───────────────────────────────────────────────────────────────
  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  LOGOUT_ALL: '/api/auth/logout-all',
  ME: '/api/auth/me',
  SESSIONS: '/api/auth/sessions',
  SESSION_BY_ID: (id) => `/api/auth/sessions/${id}`,

  // ── Device (FCM) ──────────────────────────────────────────────────────────
  DEVICE_REGISTER: '/api/auth/device',
  DEVICE_DELETE: '/api/auth/device',

  // ── User Settings ─────────────────────────────────────────────────────────
  USER_SETTINGS: '/api/user/settings',
  USER_PROFILE: '/api/user/settings/profile',
  USER_ALERT_CHANNELS: '/api/user/settings/alert-channels',
  USER_ALERT_CHANNEL_BY_ID: (id) => `/api/user/settings/alert-channels/${id}`,

  // ── Website Properties (Monitors) ─────────────────────────────────────────
  MONITORS: '/api/website-property/get-properties',
  MONITOR_BY_ID: (id) => `/api/website-property/property/${id}`,
  MONITOR_CREATE: '/api/website-property/add',
  MONITOR_DELETE: (id) => `/api/website-property/delete/${id}`,
  MONITOR_ADD_URL: '/api/website-property/add-manual',
  MONITOR_DELETE_URL: (id) => `/api/website-property/delete-monitored-url/${id}`,
  MONITOR_ENABLE: '/api/website-property/monitoring/enable',
  MONITOR_GRAPHS: (monitoredUrlId) => `/api/website-property/monitoring-graphs/${monitoredUrlId}`,
  MONITOR_HEALTH_CHECK: (monitoredUrlId) => `/api/website-property/health-checks/${monitoredUrlId}`,
  MONITOR_ALL_HEALTH_CHECKS: (monitoredUrlId) => `/api/website-property/all-health-checks/${monitoredUrlId}`,
  MONITOR_RESET_FLAPPING: '/api/website-property/reset-flapping',
};
