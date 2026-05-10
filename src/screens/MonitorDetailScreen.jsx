import { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useMonitor } from '../hooks/useMonitor';
import StatusBadge from '../components/atoms/StatusBadge';
import MetricCard from '../components/molecules/MetricCard';
import UptimeTimeline from '../components/organisms/UptimeTimeline';
import ResponseTimeChart from '../components/organisms/ResponseTimeChart';
import SSLCard from '../components/organisms/SSLCard';
import DomainExpiryCard from '../components/organisms/DomainExpiryCard';
import AlertsCard from '../components/organisms/AlertsCard';
import DangerZoneCard from '../components/organisms/DangerZoneCard';
import LogsTable from '../components/organisms/LogsTable';
import TeamNotes from '../components/organisms/TeamNotes';
import MonitoredUrlsCard from '../components/organisms/MonitoredUrlsCard';
import MonitorDetailSkeleton from '../components/organisms/MonitorDetailSkeleton';
import ErrorState from '../components/organisms/ErrorState';
import { NAV_HEIGHT, spacing, typography } from '../theme/tokens';

export default function MonitorDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { monitorId } = route.params;

  const { data: monitor, loading, error, retry } = useMonitor(monitorId);
  const scrollRef = useRef(null);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleRemove = useCallback(() => navigation.goBack(), [navigation]);
  const handleRetry = useCallback(() => retry(), [retry]);
  const handleOpenUrl = useCallback(() => {
    if (monitor?.url) Linking.openURL(monitor.url);
  }, [monitor]);
  const handleEndpointPress = useCallback(
    endpoint => navigation.push('EndpointDetail', { monitorId, endpointId: endpoint.id }),
    [navigation, monitorId],
  );

  const metrics = useMemo(() => {
    if (!monitor) return null;
    return {
      avgResponse: monitor.responseTime != null ? `${monitor.responseTime}ms` : '—',
      uptime: `${monitor.uptime24h}%`,
      incidents: String(monitor.incidents),
    };
  }, [monitor]);

  if (loading) {
    return <MonitorDetailSkeleton navigation={navigation} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load monitor"
        message={error}
        onRetry={handleRetry}
        onBack={handleBack}
      />
    );
  }

  if (!monitor) return null;

  const statusBarColor = { healthy: '#10B981', degraded: '#F59E0B', down: '#EF4444' }[monitor.status] ?? theme.border;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* ── Header ── */}
      <View style={[styles.headerCard, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {/* Status accent bar */}
        <View style={[styles.statusBar, { backgroundColor: statusBarColor }]} />

        <View style={styles.headerInner}>
          {/* Back button */}
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={8}
            style={[styles.backBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
          >
            <Text style={[styles.backArrow, { color: theme.textPrimary }]}>‹</Text>
          </TouchableOpacity>

          {/* Title block */}
          <View style={styles.headerContent}>
            <View style={styles.nameRow}>
              <Text style={[styles.monitorName, { color: theme.textPrimary }]} numberOfLines={1}>
                {monitor.name}
              </Text>
              <StatusBadge status={monitor.status} />
            </View>

            <TouchableOpacity onPress={handleOpenUrl} activeOpacity={0.7} style={styles.urlRow}>
              <Text style={[styles.urlText, { color: theme.accent }]} numberOfLines={1} ellipsizeMode="tail">
                {monitor.url}
              </Text>
              <Text style={[styles.urlIcon, { color: theme.accent }]}> ↗</Text>
            </TouchableOpacity>

            <Text style={[styles.meta, { color: theme.textMuted }]}>
              Checked {monitor.lastCheck} · Every {monitor.interval}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: NAV_HEIGHT + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        // Keeps the scroll position when the keyboard opens/closes
        keyboardShouldPersistTaps="handled"
      >
        {/* Metric cards */}
        <View style={styles.metricsRow}>
          <MetricCard label="Response" value={metrics.avgResponse} accentColor={theme.accent} />
          <MetricCard label="Uptime 24h" value={metrics.uptime} accentColor={theme.successText} />
          <MetricCard label="Incidents" value={metrics.incidents} accentColor={theme.dangerText} />
        </View>

        <MonitoredUrlsCard
          endpoints={monitor.endpoints}
          selectedEndpointId={null}
          onSelectEndpoint={handleEndpointPress}
        />

        {monitor.uptimeHistory?.length > 0 && (
          <UptimeTimeline history={monitor.uptimeHistory} />
        )}

        {/* Response time line chart */}
        {monitor.responseHistory?.length > 0 && (
          <ResponseTimeChart history={monitor.responseHistory} />
        )}

        {/* Info sections — only render when data is present */}
        {monitor.ssl && <SSLCard ssl={monitor.ssl} />}
        {monitor.domain && <DomainExpiryCard domain={monitor.domain} />}
        {monitor.alerts && <AlertsCard alerts={monitor.alerts} />}

        {/* Logs table */}
        {monitor.logs?.length > 0 && (
          <View style={[styles.logsSection, { borderTopColor: theme.border }]}>
            <LogsTable logs={monitor.logs} />
          </View>
        )}

        {/* Internal notes + danger zone always rendered */}
        <TeamNotes notes={monitor.notes} />
        <DangerZoneCard onRemove={handleRemove} />
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
  statusBar: {
    height: 4,
  },
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
  monitorName: { fontSize: typography.titleLg, fontWeight: '800', flex: 1 },
  urlRow: { flexDirection: 'row', alignItems: 'center' },
  urlText: { fontSize: typography.small, fontWeight: '500' },
  urlIcon: { fontSize: typography.small },
  meta: { fontSize: typography.caption, marginTop: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  metricsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  logsSection: { borderTopWidth: 1, paddingTop: spacing.lg },
});
