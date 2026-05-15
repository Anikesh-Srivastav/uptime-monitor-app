import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS, ENDPOINTS } from '../constants/api';
import { AUTH_ERRORS, FORCE_LOGOUT_CODES, REFRESH_ON_STATUS } from '../constants/errors';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from '../utils/tokenManager';

// ─── Axios instance ───────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Token refresh state ──────────────────────────────────────────────────────
// Single in-flight refresh promise prevents parallel refresh storms
let refreshPromise = null;

// Injected by authStore after it boots — avoids circular import
let onForceLogout = null;

export function setForceLogoutHandler(handler) {
  onForceLogout = handler;
}

// ─── Request interceptor: attach Bearer token ─────────────────────────────────

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor: handle 401 → refresh → retry ──────────────────────

apiClient.interceptors.response.use(
  (response) => normalizeResponse(response),
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh once per request
    if (originalRequest._retried) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const code = error?.response?.data?.code;

    // Hard-logout conditions — refresh won't help
    if (FORCE_LOGOUT_CODES.includes(code)) {
      await clearTokens();
      onForceLogout?.();
      return Promise.reject(error);
    }

    // Attempt silent refresh on 401 or TOKEN_EXPIRED
    const shouldRefresh =
      REFRESH_ON_STATUS.includes(status) || code === AUTH_ERRORS.TOKEN_EXPIRED;

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      // Deduplicate: reuse an in-flight refresh if one already started
      if (!refreshPromise) {
        refreshPromise = performTokenRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      const { accessToken, refreshToken } = await refreshPromise;
      await saveTokens({ accessToken, refreshToken });

      // Retry the original request with the fresh token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch {
      await clearTokens();
      onForceLogout?.();
      return Promise.reject(error);
    }
  },
);

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function performTokenRefresh() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  // Use a bare axios call to avoid interceptor loops
  const response = await axios.post(
    `${API_BASE_URL}${ENDPOINTS.REFRESH}`,
    { refreshToken },
    { timeout: API_TIMEOUT_MS },
  );

  const { accessToken, refreshToken: newRefreshToken } = response.data?.data || response.data;
  return { accessToken, refreshToken: newRefreshToken };
}

/**
 * Normalises the response so all callers receive { data, success, status }.
 * The backend sends both `data` and `success` fields — we pass them through.
 */
function normalizeResponse(response) {
  const raw = response.data;
  return {
    data: raw?.data ?? raw,
    success: raw?.success ?? true,
    status: response.status,
    meta: raw?.meta ?? null,
  };
}

export default apiClient;
