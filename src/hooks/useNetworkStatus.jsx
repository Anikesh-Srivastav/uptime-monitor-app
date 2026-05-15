import { useAppStore } from '../store/appStore';

/**
 * Returns the current network state.
 * State is maintained by AppProvider's lifecycle watcher — no polling here.
 */
export function useNetworkStatus() {
  const isConnected = useAppStore((s) => s.isConnected);
  const isInternetReachable = useAppStore((s) => s.isInternetReachable);

  return {
    isConnected,
    isInternetReachable,
    isOnline: isConnected && isInternetReachable,
  };
}
