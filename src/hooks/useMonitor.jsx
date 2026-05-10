import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMonitorById } from '../services/monitorService';

// Module-level cache: survives component unmount/remount (i.e. navigating away and back).
// Maps monitorId → fetched monitor data.
const cache = new Map();

/**
 * Fetches a single monitor by id. On subsequent visits the cached copy is
 * returned instantly; call retry() to force a fresh network request.
 */
export function useMonitor(monitorId) {
  const [state, setState] = useState(() => {
    const cached = cache.get(monitorId);
    return { data: cached || null, loading: !cached, error: null };
  });

  // Tracks whether the component that owns this hook is still mounted so we
  // never call setState after unmount.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const load = useCallback(
    async (skipCache = false) => {
      if (!skipCache && cache.has(monitorId)) {
        if (mountedRef.current) {
          setState({ data: cache.get(monitorId), loading: false, error: null });
        }
        return;
      }

      if (mountedRef.current) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      try {
        const result = await fetchMonitorById(monitorId);
        cache.set(monitorId, result);
        if (mountedRef.current) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (err) {
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err.message || 'Failed to load monitor data. Please try again.',
          }));
        }
      }
    },
    [monitorId],
  );

  // Initial fetch on mount (uses cache if available)
  useEffect(() => {
    load(false);
  }, [load]);

  // Exposed retry: clears cache entry so the next load is fresh
  const retry = useCallback(() => {
    cache.delete(monitorId);
    load(true);
  }, [monitorId, load]);

  return { data: state.data, loading: state.loading, error: state.error, retry };
}
