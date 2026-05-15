import { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useMonitor } from '../hooks/useMonitor';
import { useMonitors } from '../hooks/useMonitors';
import { enableMonitoring, addMonitorUrl } from '../api/monitorsApi';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/queryKeys';
import Svg, { Path } from 'react-native-svg';
import BackButton from '../components/atoms/BackButton';
import StatusBadge from '../components/atoms/StatusBadge';
import MetricCard from '../components/molecules/MetricCard';
import MonitoredUrlsCard from '../components/organisms/MonitoredUrlsCard';
import AddUrlModal from '../components/organisms/AddUrlModal';
import DangerZoneCard from '../components/organisms/DangerZoneCard';
import MonitorDetailSkeleton from '../components/organisms/MonitorDetailSkeleton';
import ErrorState from '../components/organisms/ErrorState';
import { NAV_HEIGHT, radius, spacing, typography } from '../theme/tokens';

export default function MonitorDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { monitorId } = route.params;
  const queryClient = useQueryClient();

  const { data: monitor, loading, error, retry } = useMonitor(monitorId);
  const { removeMonitor } = useMonitors();
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [addingUrl, setAddingUrl] = useState(false);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleRetry = useCallback(() => retry(), [retry]);

  const handleOpenUrl = useCallback(() => {
    if (monitor?.url) Linking.openURL(monitor.url);
  }, [monitor]);

  const handleEndpointPress = useCallback(
    (endpoint) => navigation.push('EndpointDetail', {
      monitorId,
      monitoredUrlId: endpoint.monitoredUrlId ?? endpoint.id,
      endpointUrl: endpoint.url,
    }),
    [navigation, monitorId],
  );

  const handleToggleMonitoring = useCallback(async () => {
    if (!monitor) return;
    try {
      await enableMonitoring({
        propertyId: monitor._id,
        monitoringEnabled: !monitor.monitoringEnabled,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitor(monitorId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitors });
    } catch {
      Alert.alert('Error', 'Could not update monitoring status.');
    }
  }, [monitor, monitorId, queryClient]);

  const handleAddUrl = useCallback(async (url) => {
    if (!monitor) return;
    setAddingUrl(true);
    try {
      await addMonitorUrl({ propertyId: monitor._id, url });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitor(monitorId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitors });
      setShowAddUrl(false);
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Could not add URL.';
      Alert.alert('Error', msg);
    } finally {
      setAddingUrl(false);
    }
  }, [monitor, monitorId, queryClient]);

  const handleRemove = useCallback(() => {
    Alert.alert(
      'Remove monitor?',
      'This will permanently delete this monitor and all its data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMonitor(monitor._id);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Could not remove monitor.');
            }
          },
        },
      ],
    );
  }, [monitor, removeMonitor, navigation]);

  const metrics = useMemo(() => {
    if (!monitor) return null;
    return {
      avgResponse: monitor.responseTime != null ? `${monitor.responseTime}ms` : '—',
      uptime: monitor.uptime24h != null ? `${monitor.uptime24h}%` : '—',
      incidents: monitor.incidents != null ? String(monitor.incidents) : '—',
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
  const lastCheckLabel = monitor.lastCheck
    ? new Date(monitor.lastCheck).toLocaleString()
    : 'Never';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* ── Header ── */}
      <View style={[styles.headerCard, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.statusBar, { backgroundColor: statusBarColor }]} />

        <View style={styles.headerInner}>
          <BackButton onPress={handleBack} />

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
              <View pointerEvents="none" style={styles.urlIcon}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke={theme.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </TouchableOpacity>

            <Text style={[styles.meta, { color: theme.textMuted }]}>
              Last checked {lastCheckLabel}
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
        {/* ── Monitoring toggle (OWNER only) ── */}
        {monitor.role === 'OWNER' && (
          <View style={[styles.toggleCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.toggleLeft}>
              <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>
                Active Monitoring
              </Text>
              <Text style={[styles.toggleSub, { color: theme.textSecondary }]}>
                {monitor.monitoringEnabled ? 'Monitoring is running' : 'Monitoring is paused'}
              </Text>
            </View>
            <Switch
              value={monitor.monitoringEnabled}
              onValueChange={handleToggleMonitoring}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        )}

        {/* ── Metric cards ── */}
        <View style={styles.metricsRow}>
          <MetricCard label="Response" value={metrics.avgResponse} accentColor={theme.accent} />
          <MetricCard label="Uptime 24h" value={metrics.uptime} accentColor={theme.successText} />
          <MetricCard label="Incidents" value={metrics.incidents} accentColor={theme.dangerText} />
        </View>

        {/* ── Monitored URLs ── */}
        {monitor.endpoints?.length > 0 && (
          <MonitoredUrlsCard
            endpoints={monitor.endpoints}
            selectedEndpointId={null}
            onSelectEndpoint={handleEndpointPress}
          />
        )}

        {monitor.endpoints?.length === 0 && (
          <View style={[styles.noUrls, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.noUrlsTitle, { color: theme.textPrimary }]}>No URLs tracked yet</Text>
            <Text style={[styles.noUrlsSub, { color: theme.textSecondary }]}>
              Add URLs to start monitoring individual pages.
            </Text>
          </View>
        )}

        {/* ── Add URL button (OWNER only) ── */}
        {monitor.role === 'OWNER' && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowAddUrl(true)}
            style={[styles.addUrlBtn, { borderColor: theme.accent }]}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5v14M5 12h14" stroke={theme.accent} strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
            <Text style={[styles.addUrlText, { color: theme.accent }]}>Add URL</Text>
          </TouchableOpacity>
        )}

        {monitor.role === 'OWNER' && <DangerZoneCard onRemove={handleRemove} />}
      </ScrollView>

      <AddUrlModal
        visible={showAddUrl}
        onClose={() => setShowAddUrl(false)}
        onAdd={handleAddUrl}
        baseUrl={monitor.url}
        loading={addingUrl}
      />
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
  monitorName: { fontSize: typography.titleLg, fontWeight: '800', flex: 1 },
  urlRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  urlText: { fontSize: typography.small, fontWeight: '500' },
  urlIcon: { marginTop: 1 },
  meta: { fontSize: typography.caption, marginTop: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
  },
  toggleLeft: { flex: 1, gap: 2 },
  toggleTitle: { fontSize: typography.body, fontWeight: '700' },
  toggleSub: { fontSize: typography.small },
  metricsRow: { flexDirection: 'row', gap: spacing.sm },
  noUrls: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  noUrlsTitle: { fontSize: typography.subtitle, fontWeight: '700' },
  noUrlsSub: { fontSize: typography.body, textAlign: 'center' },
  addUrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  addUrlText: { fontSize: typography.body, fontWeight: '700' },
});
