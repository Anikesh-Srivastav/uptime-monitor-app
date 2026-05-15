import { create } from 'zustand';

// App-level ephemeral state: network, notifications, offline queue.
// Nothing sensitive lives here — only runtime UI state.

export const useAppStore = create((set, get) => ({
  // ── Network ────────────────────────────────────────────────────────────────
  isConnected: true,
  isInternetReachable: true,

  setNetworkState: ({ isConnected, isInternetReachable }) =>
    set({ isConnected, isInternetReachable }),

  // ── Push notifications ────────────────────────────────────────────────────
  fcmToken: null,
  notificationPermission: 'undetermined', // 'undetermined' | 'granted' | 'denied'
  pendingNotification: null, // notification received while app was in foreground

  setFcmToken: (fcmToken) => set({ fcmToken }),
  setNotificationPermission: (status) => set({ notificationPermission: status }),
  setPendingNotification: (notification) => set({ pendingNotification: notification }),
  clearPendingNotification: () => set({ pendingNotification: null }),

  // ── App lifecycle ─────────────────────────────────────────────────────────
  appState: 'active', // 'active' | 'background' | 'inactive'
  lastForegroundAt: null,

  setAppState: (appState) =>
    set({
      appState,
      lastForegroundAt: appState === 'active' ? Date.now() : get().lastForegroundAt,
    }),
}));
