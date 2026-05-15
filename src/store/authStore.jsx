import { create } from 'zustand';
import {
  saveTokens,
  clearTokens,
  getRefreshToken,
  hasStoredSession,
} from '../utils/tokenManager';
import { getCurrentUser, logout as apiLogout, deleteAllSessions } from '../api/authApi';
import { setForceLogoutHandler } from '../api/client';
import { normalizeError } from '../utils/errorNormalizer';

const INITIAL = {
  user: null,
  isAuthenticated: false,
  isInitialized: false, // true once the initial session restore check has run
  isLoading: false,
  error: null,
};

export const useAuthStore = create((set, get) => {
  // Wire the API client so it can trigger force-logout without a circular import
  setForceLogoutHandler(() => get().clearSession());

  return {
    ...INITIAL,

    // ── Session restoration (called once on app start) ──────────────────────
    restoreSession: async () => {
      set({ isLoading: true });

      try {
        const hasSession = await hasStoredSession();
        if (!hasSession) {
          set({ ...INITIAL, isInitialized: true });
          return;
        }

        // Tokens are present — validate them by fetching the current user.
        // The Axios interceptor will handle a TOKEN_EXPIRED by refreshing silently.
        const res = await getCurrentUser();
        set({
          user: res.data,
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        // Refresh failed or tokens are truly invalid — clear everything
        await clearTokens();
        set({ ...INITIAL, isInitialized: true });
      }
    },

    // ── Login ──────────────────────────────────────────────────────────────
    setAuthData: async ({ token, accessToken, refreshToken, user }) => {
      // Backend returns both `token` (legacy) and `accessToken` — prefer explicit one
      const access = accessToken || token;
      await saveTokens({ accessToken: access, refreshToken });
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    },

    // ── Update user profile in store (from /me refetch) ────────────────────
    setUser: (user) => set({ user }),

    // ── Soft loading / error state ─────────────────────────────────────────
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // ── Logout (current session) ───────────────────────────────────────────
    logout: async () => {
      set({ isLoading: true });
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          await apiLogout({ refreshToken }).catch(() => {});
        }
      } finally {
        await clearTokens();
        set({ ...INITIAL, isInitialized: true });
      }
    },

    // ── Logout all devices ────────────────────────────────────────────────
    logoutAllDevices: async () => {
      set({ isLoading: true });
      try {
        await deleteAllSessions().catch(() => {});
      } finally {
        await clearTokens();
        set({ ...INITIAL, isInitialized: true });
      }
    },

    // ── Force-clear (called by Axios interceptor on hard-auth-failure) ─────
    clearSession: async () => {
      await clearTokens();
      set({ ...INITIAL, isInitialized: true });
    },
  };
});
