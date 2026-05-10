import { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useMonitor } from '../hooks/useMonitor';
import StatusBadge from '../components/atoms/StatusBadge';
import Skeleton from '../components/atoms/Skeleton';
import MetricCard from '../components/molecules/MetricCard';
import LogsTable from '../components/organisms/LogsTable';
import ErrorState from '../components/organisms/ErrorState';
import { NAV_HEIGHT, spacing, typography } from '../theme/tokens';

export default function EndpointDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { monitorId, endpointId } = route.params;

  const { data: monitor, loading, error, retry } = useMonitor(monitorId);

  const endpoint = useMemo(() => {
    if (!monitor?.endpoints) return null;
    return monitor.endpoints.find(e => e.id === endpointId) ?? null;
  }, [monitor, endpointId]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleRetry = useCallback(() => retry(), [retry]);
  const handleOpenUrl = useCallback(() => {
    if (endpoint?.url) Linking.openURL(endpoint.url);
  }, [endpoint]);

  const metrics = useMemo(() => {
    if (!endpoint) return null;
    return {
      avgResponse: endpoint.responseTime != null ? `${endpoint.responseTime}ms` : '—',
      uptime: `${endpoint.uptime24h}%`,
      incidents: String(endpoint.incidents),
    };
  }, [endpoint]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={[styles.headerCard, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <View style={[styles.statusBar, { backgroundColor: theme.border }]} />
          <View style={styles.headerInner}>
            <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { backgroundColor: theme.background, borderColor: theme.border }]} hitSlop={8}>
              <Text style={[styles.backArrow, { color: theme.textPrimary }]}>‹</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Skeleton width={160} height={18} borderRadius={6} />
              <Skeleton width={220} height={12} borderRadius={4} style={{ marginTop: 6 }} />
              <Skeleton width={140} height={11} borderRadius={4} style={{ marginTop: 4 }} />
            </View>
          </View>
        </View>
        <ScrollView contentContainerStyle={[styles.content, { gap: spacing.md }]}>
          <Skeleton height={80} borderRadius={12} />
          <Skeleton height={80} borderRadius={12} />
          <Skeleton height={80} borderRadius={12} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load endpoint"
        message={error}
        onRetry={handleRetry}
        onBack={handleBack}
      />
    );
  }

  if (!endpoint) {
    return (
      <ErrorState
        title="Endpoint not found"
        message="This endpoint may have been removed."
        onBack={handleBack}
      />
    );
  }

  const statusBarColor = { healthy: '#10B981', degraded: '#F59E0B', down: '#EF4444' }[endpoint.status] ?? theme.border;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* ── Header ── */}
      <View style={[styles.headerCard, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.statusBar, { backgroundColor: statusBarColor }]} />

        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={8}
            style={[styles.backBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
          >
            <Text style={[styles.backArrow, { color: theme.textPrimary }]}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.nameRow}>
              <Text style={[styles.pathTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                {endpoint.path}
              </Text>
              <StatusBadge status={endpoint.status} />
            </View>

            <TouchableOpacity onPress={handleOpenUrl} activeOpacity={0.7} style={styles.urlRow}>
              <Text style={[styles.urlText, { color: theme.accent }]} numberOfLines={1} ellipsizeMode="tail">
                {endpoint.url}
              </Text>
              <Text style={[styles.urlIcon, { color: theme.accent }]}> ↗</Text>
            </TouchableOpacity>

            <Text style={[styles.meta, { color: theme.textMuted }]}>
              Checked {endpoint.lastCheck} · Every {endpoint.interval}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: NAV_HEIGHT + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.metricsRow}>
          <MetricCard label="Response" value={metrics.avgResponse} accentColor={theme.accent} />
          <MetricCard label="Uptime 24h" value={metrics.uptime} accentColor={theme.successText} />
          <MetricCard label="Incidents" value={metrics.incidents} accentColor={theme.dangerText} />
        </View>

        {endpoint.logs?.length > 0 && (
          <View style={[styles.logsSection, { borderTopColor: theme.border }]}>
            <LogsTable logs={endpoint.logs} />
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  backArrow: { fontSize: 22, lineHeight: 24, marginRight: 2 },
  headerContent: { flex: 1, gap: 3 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pathTitle: { fontSize: typography.titleLg, fontWeight: '800', flex: 1 },
  urlRow: { flexDirection: 'row', alignItems: 'center' },
  urlText: { fontSize: typography.small, fontWeight: '500' },
  urlIcon: { fontSize: typography.small },
  meta: { fontSize: typography.caption, marginTop: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  metricsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  logsSection: { borderTopWidth: 1, paddingTop: spacing.lg },
});
