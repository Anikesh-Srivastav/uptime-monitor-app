import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllMonitors } from '../services/monitorService';

/**
 * Fetches the full monitor list. Exposes refreshing + refresh() for
 * pull-to-refresh, and error + retry() for error recovery.
 *
 * localAdditions: monitors added client-side (not yet persisted to server)
 * are merged into the returned list so the UI stays consistent.
 */
export function useMonitors() {
  const [serverData, setServerData] = useState(null);
  const [localAdditions, setLocalAdditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await fetchAllMonitors();
      if (mountedRef.current) {
        setServerData(result);
        if (isRefresh) {
          // Clear optimistic additions on refresh; fresh server list is canonical
          setLocalAdditions([]);
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'Failed to load monitors. Pull down to retry.');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  // Optimistically appends a monitor without waiting for a server round-trip
  const addMonitor = useCallback(monitor => {
    setLocalAdditions(prev => [...prev, monitor]);
  }, []);

  // Merged list: server data first, then any client-side additions
  const monitors = serverData
    ? [...serverData, ...localAdditions]
    : localAdditions.length > 0
    ? localAdditions
    : null;

  return { monitors, loading, refreshing, error, refresh, addMonitor };
}
