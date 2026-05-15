import NetInfo from '@react-native-community/netinfo';

// One-shot check — resolves to true if connected, false otherwise
export async function isConnected() {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable !== false;
}

// Returns a cleanup function that unsubscribes the listener
export function onNetworkChange(callback) {
  return NetInfo.addEventListener((state) => {
    callback({
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable ?? false,
      type: state.type,
    });
  });
}
