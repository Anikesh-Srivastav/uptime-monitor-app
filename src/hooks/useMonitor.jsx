import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMonitor,
  getMonitorGraphs,
  getAllHealthChecks,
} from '../api/monitorsApi';
import { QUERY_KEYS } from '../constants/queryKeys';
import { normalizeError } from '../utils/errorNormalizer';

const DETAIL_POLL_INTERVAL = 60_000;

function extractPath(url) {
  if (!url) return '/';
  try {
    return new URL(url).pathname || '/';
  } catch {
    const match = url.match(/^https?:\/\/[^/]+(\/.*)?$/);
    return match?.[1] || '/';
  }
}

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function mapHealthStatus(healthStatus, monitoringEnabled) {
  if (!monitoringEnabled) return 'unknown';
  const map = { UP: 'healthy', DEGRADED: 'degraded', DOWN: 'down', UNKNOWN: 'unknown' };
  return map[String(healthStatus ?? '').toUpperCase()] ?? 'unknown';
}

function normalizeMonitor(raw) {
  if (!raw) return null;
  // Backend wraps in { data: {...} } from detail endpoint, or sends directly
  const item = raw?.data ?? raw;
  // Detail endpoint: { property: {...}, role } OR flat property object
  const prop = item?.property ?? item;
  const health = prop.currentHealth ?? {};

  const monitoredUrls = prop.monitoredUrls ?? item.monitoredUrls ?? [];

  return {
    // Detail endpoint uses `id` (not `_id`) on the property object
    id: prop.id ?? prop._id ?? item.id ?? item._id,
    _id: prop.id ?? prop._id ?? item.id ?? item._id,
    name: prop.domain ?? prop.baseUrl,
    url: prop.baseUrl,
    domain: prop.domain,
    status: mapHealthStatus(health.status, prop.monitoringEnabled),
    monitoringEnabled: prop.monitoringEnabled ?? false,
    lastCheck: health.lastCheckedAt ?? prop.updatedAt ?? null,
    responseTime: health.responseTime || null,
    uptime24h: health.availability ?? null,
    incidents: health.downCount ?? null,
    role: item.role ?? prop.role ?? null,
    monitoredUrls,
    endpoints: monitoredUrls.map((mu, i) => ({
      id: mu._id ?? mu.id ?? String(i),
      monitoredUrlId: mu._id ?? mu.id,
      path: extractPath(mu.url ?? mu.monitoredUrl),
      url: mu.url ?? mu.monitoredUrl,
      status: mu.isActive !== false ? 'healthy' : 'unknown',
      lastCheck: formatDate(mu.updatedAt ?? mu.createdAt),
      responseTime: null,
      isActive: mu.isActive ?? true,
    })),
    currentHealth: health,
    _raw: raw,
  };
}

export function useMonitor(monitorId, { pollEnabled = true } = {}) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.monitor(monitorId),
    queryFn: async () => {
      const res = await getMonitor(monitorId);
      return normalizeMonitor(res.data);
    },
    enabled: Boolean(monitorId),
    staleTime: 15_000,
    refetchInterval: pollEnabled ? DETAIL_POLL_INTERVAL : false,
    // Seed from the list cache for instant navigation
    initialData: () => {
      const list = queryClient.getQueryData(QUERY_KEYS.monitors);
      const cached = list?.find((m) => (m._id ?? m.id) === monitorId);
      if (!cached) return undefined;
      return {
        ...cached,
        endpoints: (cached.monitoredUrls ?? []).map((mu, i) => ({
          id: mu._id ?? mu.id ?? String(i),
          monitoredUrlId: mu._id ?? mu.id,
          path: extractPath(mu.url ?? mu.monitoredUrl),
          url: mu.url ?? mu.monitoredUrl,
          status: mu.isActive !== false ? 'healthy' : 'unknown',
          lastCheck: formatDate(mu.updatedAt ?? mu.createdAt),
          responseTime: null,
          isActive: mu.isActive ?? true,
        })),
      };
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(QUERY_KEYS.monitors)?.dataUpdatedAt,
  });

  return {
    data,
    loading: isLoading,
    error: isError ? normalizeError(error).message : null,
    retry: refetch,
  };
}

export function useMonitorLogs(monitorId) {
  return { logs: [], loading: false, error: null, refetch: () => {} };
}

export function useMonitorStats(monitorId) {
  return { stats: null, loading: false, error: null, refetch: () => {} };
}

export function useMonitorGraphs(monitoredUrlId) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.urlGraphs(monitoredUrlId),
    queryFn: async () => {
      const res = await getMonitorGraphs(monitoredUrlId);
      // Backend: { data: { responseTimeOverTime: [...], uptimeTimeline: [...] } }
      const payload = res.data?.data ?? res.data ?? {};
      const arr = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.responseTimeOverTime)
        ? payload.responseTimeOverTime
        : [];
      return arr.map((p) => ({
        time: p.time ?? p.date ?? p.createdAt ?? p.timestamp ?? p.checkedAt,
        value: p.value ?? p.responseTime ?? p.avg ?? 0,
      }));
    },
    enabled: Boolean(monitoredUrlId),
    staleTime: 60_000,
  });

  return {
    graphs: data ?? [],
    loading: isLoading,
    error: isError ? normalizeError(error).message : null,
    refetch,
  };
}

export function useHealthChecks(monitoredUrlId) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.urlHealthChecks(monitoredUrlId),
    queryFn: async () => {
      const res = await getAllHealthChecks(monitoredUrlId);
      // Backend: { data: { healthChecks: [...], pagination: {...} } }
      const payload = res.data?.data ?? res.data ?? {};
      const arr = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.healthChecks)
        ? payload.healthChecks
        : [];
      return arr.map((hc) => ({
        id: hc._id ?? hc.id ?? String(Math.random()),
        // Backend uses `checkedAt`, fallback to other timestamp fields
        time: hc.checkedAt ?? hc.createdAt ?? hc.time ?? hc.timestamp,
        // Backend status is UP/DOWN/DEGRADED string
        status: String(hc.status ?? '').toUpperCase() === 'DOWN' ? 'down' : 'up',
        // Backend uses `httpCode`, fallback to other code fields
        statusCode: hc.httpCode ?? hc.statusCode ?? hc.httpStatus ?? null,
        responseTime: hc.responseTime ?? hc.latency ?? null,
        // Backend uses `errorMessage`
        message: hc.errorMessage ?? hc.message ?? hc.error ?? null,
      }));
    },
    enabled: Boolean(monitoredUrlId),
    staleTime: 30_000,
  });

  return {
    checks: data ?? [],
    loading: isLoading,
    error: isError ? normalizeError(error).message : null,
    refetch,
  };
}
