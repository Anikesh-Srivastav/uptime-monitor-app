import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getItem, setItem } from '../utils/asyncStorage';
import { STORAGE_KEYS } from '../constants/storage';
import { registerDevice, unregisterDevice } from '../api/authApi';

// ─── Notification presentation config ────────────────────────────────────────
// Determines how notifications appear while the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── Permission request ───────────────────────────────────────────────────────

export async function requestNotificationPermission() {
  const { status: existing } = await Notifications.getPermissionsAsync();

  if (existing === 'granted') return 'granted';

  const { status } = await Notifications.requestPermissionsAsync();
  return status; // 'granted' | 'denied' | 'undetermined'
}

// ─── Token registration ───────────────────────────────────────────────────────

export async function getExpoPushToken() {
  // Physical devices only — simulators do not support push tokens
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return null;

  // On Android, a notification channel is required
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366F1',
    });
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Monitor Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 200, 500],
      lightColor: '#EF4444',
      sound: 'default',
    });
  }

  const token = await Notifications.getExpoPushTokenAsync().catch(() => null);
  return token?.data ?? null;
}

// ─── Register with backend ────────────────────────────────────────────────────

export async function registerFcmTokenWithBackend(fcmToken) {
  if (!fcmToken) return;

  const cached = await getItem(STORAGE_KEYS.FCM_TOKEN);
  if (cached === fcmToken) return; // already registered

  await registerDevice({
    fcmToken,
    platform: Platform.OS,
    deviceName: `${Platform.OS} device`,
  });

  await setItem(STORAGE_KEYS.FCM_TOKEN, fcmToken);
}

// ─── Unregister on logout ─────────────────────────────────────────────────────

export async function unregisterFcmToken() {
  const fcmToken = await getItem(STORAGE_KEYS.FCM_TOKEN);
  if (!fcmToken) return;

  await unregisterDevice({ fcmToken }).catch(() => {});
  await setItem(STORAGE_KEYS.FCM_TOKEN, null);
}

// ─── Notification routing helpers ────────────────────────────────────────────

/**
 * Extracts the navigation target from a notification payload.
 * Returns { screen, params } or null.
 */
export function parseNotificationTarget(notification) {
  const data = notification?.request?.content?.data;
  if (!data) return null;

  if (data.type === 'monitor_down' || data.type === 'monitor_up') {
    return { screen: 'MonitorDetail', params: { monitorId: data.monitorId } };
  }
  if (data.type === 'incident') {
    return { screen: 'Incidents', params: { incidentId: data.incidentId } };
  }
  if (data.type === 'alert') {
    return { screen: 'Alerts', params: {} };
  }

  return null;
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export async function setBadgeCount(count) {
  await Notifications.setBadgeCountAsync(count);
}

export async function clearBadge() {
  await Notifications.setBadgeCountAsync(0);
}
