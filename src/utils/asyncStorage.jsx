import AsyncStorage from '@react-native-async-storage/async-storage';

// Thin wrappers around AsyncStorage for non-sensitive cached data.
// For tokens use tokenManager.jsx (SecureStore) instead.

export async function getItem(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Non-critical; silent failure is acceptable for cache writes
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // no-op
  }
}

export async function multiRemove(keys) {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch {
    // no-op
  }
}
