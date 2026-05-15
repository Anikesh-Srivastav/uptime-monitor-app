import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import {
  requestNotificationPermission,
  getExpoPushToken,
  registerFcmTokenWithBackend,
  unregisterFcmToken,
} from '../notifications/pushNotificationService';
import { useAuthStore } from '../store/authStore';

/**
 * Requests permission, fetches the push token, and registers it with the backend.
 * Call once inside the authenticated app tree.
 */
export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setFcmToken = useAppStore((s) => s.setFcmToken);
  const setNotificationPermission = useAppStore((s) => s.setNotificationPermission);
  const fcmToken = useAppStore((s) => s.fcmToken);

  const setup = useCallback(async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);

    if (permission !== 'granted') return;

    const token = await getExpoPushToken();
    if (!token) return;

    setFcmToken(token);
    await registerFcmTokenWithBackend(token).catch(() => {});
  }, [setFcmToken, setNotificationPermission]);

  useEffect(() => {
    if (isAuthenticated) {
      setup();
    }
  }, [isAuthenticated, setup]);

  return { fcmToken };
}
