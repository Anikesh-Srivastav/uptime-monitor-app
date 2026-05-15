import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useAppStore } from '../store/appStore';
import { parseNotificationTarget } from './pushNotificationService';

/**
 * Headless hook — renders nothing, wires up Expo Notifications listeners.
 * Mount once inside the authenticated navigation tree.
 *
 * @param {object} navigationRef – the ref passed to <NavigationContainer>
 */
export function useNotificationHandler(navigationRef) {
  const setPendingNotification = useAppStore((s) => s.setPendingNotification);
  const foregroundSub = useRef(null);
  const responseSub = useRef(null);

  useEffect(() => {
    // Foreground notification — show in-app banner / store for display
    foregroundSub.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setPendingNotification(notification);
      },
    );

    // User tapped a notification (foreground or background)
    responseSub.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const target = parseNotificationTarget(response.notification);
        if (!target || !navigationRef?.current) return;

        // Wait for navigator to be ready before navigating
        if (navigationRef.current.isReady()) {
          navigationRef.current.navigate(target.screen, target.params);
        }
      },
    );

    return () => {
      foregroundSub.current?.remove();
      responseSub.current?.remove();
    };
  }, [navigationRef, setPendingNotification]);
}

/**
 * Handles the notification that launched the app from a terminated state.
 * Call once on mount inside the root navigator.
 */
export async function handleInitialNotification(navigationRef) {
  const response = await Notifications.getLastNotificationResponseAsync();
  if (!response || !navigationRef?.current) return;

  const target = parseNotificationTarget(response.notification);
  if (!target) return;

  // Defer until navigator is ready
  const tryNavigate = () => {
    if (navigationRef.current?.isReady()) {
      navigationRef.current.navigate(target.screen, target.params);
    } else {
      setTimeout(tryNavigate, 100);
    }
  };
  tryNavigate();
}
