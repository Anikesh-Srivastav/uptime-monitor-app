import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMonitors,
  createMonitor as apiCreateMonitor,
  deleteMonitor as apiDeleteMonitor,
} from '../api/monitorsApi';
import { QUERY_KEYS } from '../constants/queryKeys';
import { normalizeError } from '../utils/errorNormalizer';

const POLL_INTERVAL = 30_000;

// Backend health status → app status string
function mapHealthStatus(healthStatus, monitoringEnabled) {
  if (!monitoringEnabled) return 'unknown';
  const map = { UP: 'healthy', DEGRADED: 'degraded', DOWN: 'down', UNKNOWN: 'unknown' };
  return map[String(healthStatus ?? '').toUpperCase()] ?? 'unknown';
}

export function useMonitors({ pollEnabled = false } = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.monitors,
    queryFn: async () => {
      const res = await getMonitors();
      // Backend: { status, data: [{ _id, userId, role, joinedAt, property: {...} }] }
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];

      return list.map((item) => {
        const prop = item.property ?? item;
        const health = prop.currentHealth ?? {};

        return {
          id: prop._id ?? prop.id ?? item._id,
          _id: prop._id ?? prop.id ?? item._id,
          name: prop.domain ?? prop.baseUrl,
          url: prop.baseUrl,
          domain: prop.domain,
          // Real status from currentHealth, fallback to monitoring flag
          status: mapHealthStatus(health.status, prop.monitoringEnabled),
          monitoringEnabled: prop.monitoringEnabled ?? false,
          lastCheck: health.lastCheckedAt ?? prop.updatedAt ?? null,
          // currentHealth.availability is uptime % (e.g. 99.5)
          uptime24h: health.availability ?? null,
          // responseTime in currentHealth is reserved but unused; fall back to null
          responseTime: health.responseTime || null,
          // downCount = URLs currently DOWN
          incidents: health.downCount ?? null,
          sparkline: [],
          monitoredUrls: prop.monitoredUrls ?? [],
          role: item.role ?? null,   // 'OWNER' | 'VIEWER'
          currentHealth: health,
          _raw: item,
        };
      });
    },
    staleTime: 20_000,
    refetchInterval: pollEnabled ? POLL_INTERVAL : false,
  });

  const addMonitorMutation = useMutation({
    mutationFn: (monitorData) => apiCreateMonitor(monitorData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitors }),
    onError: (err) => normalizeError(err),
  });

  const removeMonitorMutation = useMutation({
    mutationFn: (id) => apiDeleteMonitor(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.monitors });
      const previous = queryClient.getQueryData(QUERY_KEYS.monitors);
      queryClient.setQueryData(
        QUERY_KEYS.monitors,
        (old) => (old ?? []).filter((m) => m._id !== id && m.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(QUERY_KEYS.monitors, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitors }),
  });

  const addMonitor = useCallback(
    (monitorData) => addMonitorMutation.mutateAsync(monitorData),
    [addMonitorMutation],
  );

  const removeMonitor = useCallback(
    (id) => removeMonitorMutation.mutateAsync(id),
    [removeMonitorMutation],
  );

  return {
    monitors: data ?? [],
    loading: isLoading,
    refreshing: isFetching && !isLoading,
    error: isError ? normalizeError(error).message : null,
    refresh: refetch,
    addMonitor,
    removeMonitor,
    isAdding: addMonitorMutation.isPending,
  };
}
