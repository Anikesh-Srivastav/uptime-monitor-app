import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme/ThemeContext';
import { useNotificationHandler, handleInitialNotification } from '../notifications/notificationHandler';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

// Deep link config — maps notification-driven URLs to navigator routes
const LINKING_CONFIG = {
  prefixes: ['uptimemonitor://', 'https://app.yourplatform.com'],
  config: {
    screens: {
      Dashboard: {
        screens: {
          MonitorDetail: 'monitors/:monitorId',
        },
      },
      Settings: {
        screens: {
          Sessions: 'settings/sessions',
        },
      },
    },
  },
};

function SplashScreen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.splash, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.accent} />
    </View>
  );
}

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  const navigationRef = useRef(null);

  // Wire notification tap → navigation
  useNotificationHandler(navigationRef);

  // Restore session on first mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Handle notification that cold-started the app
  useEffect(() => {
    if (isAuthenticated) {
      handleInitialNotification(navigationRef);
    }
  }, [isAuthenticated]);

  // Block render until we know whether the user is authenticated
  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} linking={LINKING_CONFIG}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
