import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { login as apiLogin, register as apiRegister } from '../api/authApi';
import { normalizeError } from '../utils/errorNormalizer';

/**
 * High-level auth hook used by screens.
 * Thin layer that maps raw API calls to store state updates.
 */
export function useAuth() {
  const store = useAuthStore();

  const login = useCallback(async ({ email, password }) => {
    store.setLoading(true);
    store.clearError();
    try {
      const res = await apiLogin({ email, password });
      await store.setAuthData(res.data);
      return { success: true };
    } catch (err) {
      const { message } = normalizeError(err);
      store.setError(message);
      store.setLoading(false);
      return { success: false, error: message };
    }
  }, [store]);

  const register = useCallback(async ({ name, email, password }) => {
    store.setLoading(true);
    store.clearError();
    try {
      const res = await apiRegister({ name, email, password });
      return { success: true, data: res.data };
    } catch (err) {
      const { message } = normalizeError(err);
      store.setError(message);
      store.setLoading(false);
      return { success: false, error: message };
    }
  }, [store]);

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isInitialized: store.isInitialized,
    isLoading: store.isLoading,
    error: store.error,
    login,
    register,
    logout: store.logout,
    logoutAllDevices: store.logoutAllDevices,
    clearError: store.clearError,
  };
}
