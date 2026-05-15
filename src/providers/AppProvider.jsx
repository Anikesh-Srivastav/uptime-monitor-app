import { useEffect } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../theme/ThemeContext';
import QueryProvider, { queryClient } from './QueryProvider';
import { useAppStore } from '../store/appStore';
import { onNetworkChange } from '../utils/networkUtils';

// ─── AppLifecycleWatcher ──────────────────────────────────────────────────────
// Listens to AppState and network changes, updates the app store, and
// triggers stale query invalidation when the app returns to foreground.

function AppLifecycleWatcher() {
  const setAppState = useAppStore((s) => s.setAppState);
  const setNetworkState = useAppStore((s) => s.setNetworkState);

  // AppState (foreground / background)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      setAppState(nextState);

      if (nextState === 'active') {
        // Invalidate stale queries when user returns to the app
        queryClient.invalidateQueries();
      }
    });
    return () => sub.remove();
  }, [setAppState]);

  // Network connectivity
  useEffect(() => {
    const unsubscribe = onNetworkChange(({ isConnected, isInternetReachable }) => {
      setNetworkState({ isConnected, isInternetReachable });

      if (isConnected && isInternetReachable) {
        // Resume failed queries when connectivity is restored
        queryClient.resumePausedMutations();
        queryClient.invalidateQueries();
      }
    });
    return () => unsubscribe();
  }, [setNetworkState]);

  return null;
}

// ─── AppProvider ──────────────────────────────────────────────────────────────

export default function AppProvider({ children }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <ThemeProvider>
            <AppLifecycleWatcher />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
