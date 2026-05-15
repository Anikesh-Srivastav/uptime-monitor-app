// SecureStore keys — used for sensitive token data
export const SECURE_KEYS = {
  ACCESS_TOKEN: 'auth.accessToken',
  REFRESH_TOKEN: 'auth.refreshToken',
  USER_ID: 'auth.userId',
};

// AsyncStorage keys — used for non-sensitive cached data only
export const STORAGE_KEYS = {
  THEME_OVERRIDE: 'app.themeOverride',
  LAST_ACTIVE_TAB: 'app.lastActiveTab',
  NOTIFICATION_PREFS: 'app.notificationPrefs',
  QUERY_CACHE: 'app.queryCache',
  FCM_TOKEN: 'app.fcmToken',
  ONBOARDING_DONE: 'app.onboardingDone',
};
