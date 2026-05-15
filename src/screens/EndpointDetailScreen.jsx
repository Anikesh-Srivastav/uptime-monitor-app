import { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useMonitorGraphs, useHealthChecks } from '../hooks/useMonitor';
import Svg, { Path } from 'react-native-svg';
import BackButton from '../components/atoms/BackButton';
import StatusBadge from '../components/atoms/StatusBadge';
import Skeleton from '../components/atoms/Skeleton';
import MetricCard from '../components/molecules/MetricCard';
import ResponseTimeChart from '../components/organisms/ResponseTimeChart';
import ErrorState from '../components/organisms/ErrorState';
import { NAV_HEIGHT, radius, spacing, typography } from '../theme/tokens';

const STATUS_COLORS = {
  up: '#10B981',
  down: '#EF4444',
};

function HealthCheckRow({ check, isLast, theme }) {
  const statusColor = STATUS_COLORS[check.status] ?? theme.textMuted;
  const timeLabel = check.time ? new Date(check.time).toLocaleString() : '—';

  return (
    <View style={[styles.checkRow, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border }]}>
      <View style={[styles.checkDot, { backgroundColor: statusColor }]} />
      <View style={styles.checkContent}>
        <Text style={[styles.checkTime, { color: theme.textSecondary }]}>{timeLabel}</Text>
        <Text style={[styles.checkStatus, { color: statusColor }]}>
          {check.status.toUpperCase()}
          {check.statusCode ? ` · ${check.statusCode}` : ''}
        </Text>
      </View>
      {check.responseTime != null && (
        <Text style={[styles.checkLatency, { color: theme.textPrimary }]}>
          {check.responseTime}ms
        </Text>
      )}
    </View>
  );
}

export default function EndpointDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { monitorId, monitoredUrlId, endpointUrl } = route.params;

  const { graphs, loading: graphsLoading, error: graphsError, refetch: refetchGraphs } = useMonitorGraphs(monitoredUrlId);
  const { checks, loading: checksLoading, error: checksError, refetch: refetchChecks } = useHealthChecks(monitoredUrlId);

  const loading = graphsLoading && checksLoading;
  const refreshing = graphsLoading || checksLoading;

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleRefresh = useCallback(() => {
    refetchGraphs();
    refetchChecks();
  }, [refetchGraphs, refetchChecks]);

  const handleOpenUrl = useCallback(() => {
    if (endpointUrl) Linking.openURL(endpointUrl);
  }, [endpointUrl]);

  const metrics = useMemo(() => {
    if (!checks.length) return { avgResponse: '—', uptime: '—', incidents: '—' };
    const withTime = checks.filter((c) => c.responseTime != null);
    const avgResponse = withTime.length
      ? Math.round(withTime.reduce((s, c) => s + c.responseTime, 0) / withTime.length)
      : null;
    const upCount = checks.filter((c) => c.status === 'up').length;
    const uptime = Math.round((upCount / checks.length) * 1000) / 10;
    const incidents = checks.filter((c) => c.status === 'down').length;
    return {
      avgResponse: avgResponse != null ? `${avgResponse}ms` : '—',
      uptime: `${uptime}%`,
      incidents: String(incidents),
    };
  }, [checks]);

  const urlPath = useMemo(() => {
    if (!endpointUrl) return '/';
    try {
      return new URL(endpointUrl).pathname || '/';
    } catch {
      return endpointUrl;
    }
  }, [endpointUrl]);

  // Infer status from most recent check
  const latestStatus = checks[0]?.status === 'up' ? 'healthy' : checks[0]?.status === 'down' ? 'down' : 'unknown';
  const statusBarColor = { healthy: '#10B981', degraded: '#F59E0B', down: '#EF4444' }[latestStatus] ?? theme.border;

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={[styles.headerCard, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <View style={[styles.statusBar, { backgroundColor: theme.border }]} />
          <View style={styles.headerInner}>
            <BackButton onPress={handleBack} />
            <View style={styles.headerContent}>
              <Skeleton width={160} height={18} borderRadius={6} />
              <Skeleton width={220} height={12} borderRadius={4} style={{ marginTop: 6 }} />
            </View>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ gap: spacing.md, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Skeleton height={80} style={{ flex: 1 }} borderRadius={12} />
            <Skeleton height={80} style={{ flex: 1 }} borderRadius={12} />
            <Skeleton height={80} style={{ flex: 1 }} borderRadius={12} />
          </View>
          <Skeleton height={200} borderRadius={12} />
          <Skeleton height={300} borderRadius={12} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (graphsError && checksError) {
    return (
      <ErrorState
        title="Failed to load endpoint data"
        message={graphsError ?? checksError}
        onRetry={handleRefresh}
        onBack={handleBack}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* ── Header ── */}
      <View style={[styles.headerCard, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.statusBar, { backgroundColor: statusBarColor }]} />

        <View style={styles.headerInner}>
          <BackButton onPress={handleBack} />

          <View style={styles.headerContent}>
            <View style={styles.nameRow}>
              <Text style={[styles.pathTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                {urlPath}
              </Text>
              <StatusBadge status={latestStatus} />
            </View>

            <TouchableOpacity onPress={handleOpenUrl} activeOpacity={0.7} style={styles.urlRow}>
              <Text style={[styles.urlText, { color: theme.accent }]} numberOfLines={1} ellipsizeMode="tail">
                {endpointUrl}
              </Text>
              <View pointerEvents="none" style={styles.urlIcon}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: NAV_HEIGHT + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.accent}
            colors={[theme.accent]}
          />
        }
      >
        {/* ── Metrics ── */}
        <View style={styles.metricsRow}>
          <MetricCard label="Avg Response" value={metrics.avgResponse} accentColor={theme.accent} />
          <MetricCard label="Uptime" value={metrics.uptime} accentColor={theme.successText} />
          <MetricCard label="Incidents" value={metrics.incidents} accentColor={theme.dangerText} />
        </View>

        {/* ── Response time chart ── */}
        {graphs.length > 1 && (
          <ResponseTimeChart history={graphs} />
        )}

        {graphs.length === 0 && !graphsLoading && (
          <View style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No graph data available yet. Graphs appear after monitoring runs.
            </Text>
          </View>
        )}

        {/* ── Health checks ── */}
        {checks.length > 0 && (
          <View style={[styles.checksCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.checksTitle, { color: theme.textPrimary }]}>Recent Health Checks</Text>
            <Text style={[styles.checksSub, { color: theme.textSecondary }]}>
              {checks.length} check{checks.length !== 1 ? 's' : ''} recorded
            </Text>
            <View style={[styles.checksList, { borderTopColor: theme.border }]}>
              {checks.slice(0, 50).map((check, i) => (
                <HealthCheckRow
                  key={check.id}
                  check={check}
                  isLast={i === Math.min(checks.length, 50) - 1}
                  theme={theme}
                />
              ))}
            </View>
          </View>
        )}

        {checks.length === 0 && !checksLoading && (
          <View style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No health checks recorded yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerCard: {
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  statusBar: { height: 4 },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  headerContent: { flex: 1, gap: 3 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pathTitle: { fontSize: typography.titleLg, fontWeight: '800', flex: 1 },
  urlRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  urlText: { fontSize: typography.small, fontWeight: '500' },
  urlIcon: { marginTop: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md },
  metricsRow: { flexDirection: 'row', gap: spacing.sm },
  emptyCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  checksCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  checksTitle: { fontSize: typography.subtitle, fontWeight: '700' },
  checksSub: { fontSize: typography.small },
  checksList: {
    borderTopWidth: 1,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  checkContent: { flex: 1, gap: 2 },
  checkTime: { fontSize: typography.small },
  checkStatus: { fontSize: typography.caption, fontWeight: '700' },
  checkLatency: { fontSize: typography.small, fontWeight: '700' },
});
