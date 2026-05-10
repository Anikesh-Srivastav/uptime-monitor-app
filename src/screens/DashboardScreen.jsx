import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useMonitors } from '../hooks/useMonitors';
import SummaryCard from '../components/molecules/SummaryCard';
import MonitorCard from '../components/molecules/MonitorCard';
import AddMonitorModal from '../components/organisms/AddMonitorModal';
import DashboardSkeleton from '../components/organisms/DashboardSkeleton';
import ErrorState from '../components/organisms/ErrorState';
import { NAV_HEIGHT, shadow, spacing, typography } from '../theme/tokens';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen({ navigation }) {
  const { theme } = useTheme();
  const { monitors, loading, refreshing, error, refresh, addMonitor } = useMonitors();
  const [showModal, setShowModal] = useState(false);

  // Derived summary stats — recomputed only when the monitor list changes
  const stats = useMemo(() => {
    if (!monitors?.length) return { totalUptime: 100, avgResponseTime: 0, activeIncidents: 0 };
    const withResponse = monitors.filter(m => m.responseTime != null);
    return {
      totalUptime:
        Math.round(
          (monitors.reduce((s, m) => s + m.uptime24h, 0) / monitors.length) * 10,
        ) / 10,
      avgResponseTime: withResponse.length
        ? Math.round(withResponse.reduce((s, m) => s + m.responseTime, 0) / withResponse.length)
        : 0,
      activeIncidents: monitors.reduce((s, m) => s + m.incidents, 0),
    };
  }, [monitors]);

  // Pulse animation for the live status dot
  const pulseDot = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (stats.activeIncidents > 0) {
      pulseDot.setValue(1);
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseDot, { toValue: 0.25, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseDot, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [stats.activeIncidents, pulseDot]);

  // Stable callbacks
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);

  const handleAddMonitor = useCallback(
    ({ url, paths = [] }) => {
      const normalizedUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;
      const name = normalizedUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const endpointPaths = ['/', ...paths]
        .map(path => {
          if (!path || path === '/') return '/';
          return `/${path.replace(/^\/+/, '').replace(/\/$/, '')}`;
        })
        .filter((path, index, array) => array.indexOf(path) === index);

      const endpoints = endpointPaths.map((path, index) => ({
        id: `local-endpoint-${Date.now()}-${index}`,
        path,
        url: path === '/' ? normalizedUrl : `${normalizedUrl.replace(/\/$/, '')}${path}`,
        label: path === '/' ? 'Homepage' : path.replace('/', ''),
        status: 'healthy',
        lastCheck: 'just now',
        interval: '1 min',
        responseTime: null,
        uptime24h: 100,
        incidents: 0,
        logs: [],
      }));

      addMonitor({
        id: `local-${Date.now()}`,
        name,
        url: normalizedUrl,
        status: 'healthy',
        lastCheck: 'just now',
        interval: '1 min',
        responseTime: null,
        uptime24h: 100,
        incidents: 0,
        sparkline: [],
        uptimeHistory: [],
        responseHistory: [],
        ssl: null,
        domain: null,
        alerts: { configured: false, description: 'No alerts configured.' },
        endpoints,
        notes: [],
        logs: [],
      });
    },
    [addMonitor],
  );

  // push always creates a new stack entry — avoids the `navigate` no-op
  // when React Navigation thinks the screen is already active.
  const handleMonitorPress = useCallback(
    monitorId => navigation.push('MonitorDetail', { monitorId }),
    [navigation],
  );

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
        <DashboardSkeleton theme={theme} />
      </SafeAreaView>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error && !monitors) {
    return (
      <ErrorState
        title="Could not load monitors"
        message={error}
        onRetry={refresh}
      />
    );
  }

  // ── Content ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: NAV_HEIGHT + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.accent}
            colors={[theme.accent]}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: theme.textMuted }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Dashboard</Text>
            <View style={styles.statusRow}>
              <Animated.View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: stats.activeIncidents === 0 ? '#10B981' : '#EF4444',
                    opacity: pulseDot,
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: stats.activeIncidents === 0 ? '#10B981' : '#EF4444' },
                ]}
              >
                {stats.activeIncidents === 0
                  ? 'All systems operational'
                  : `${stats.activeIncidents} incident${stats.activeIncidents > 1 ? 's' : ''} active`}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleOpenModal}
            activeOpacity={0.8}
            style={[styles.addBtn, { backgroundColor: theme.accent }, shadow.md]}
          >
            <Text style={[styles.addBtnText, { color: '#fff' }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* ── Summary cards ── */}
        <View style={styles.statsRow}>
          <SummaryCard
            label="Uptime"
            value={`${stats.totalUptime}%`}
            subtitle="Live"
            subtitleColor={theme.successText}
            accentColor={theme.successText}
          />
          <SummaryCard
            label="Response"
            value={stats.avgResponseTime ? `${stats.avgResponseTime}ms` : '—'}
            subtitle="Avg"
            accentColor={theme.accent}
          />
          <SummaryCard
            label="Incidents"
            value={String(stats.activeIncidents)}
            subtitle={stats.activeIncidents === 0 ? 'All clear' : 'Open'}
            subtitleColor={stats.activeIncidents === 0 ? theme.successText : theme.dangerText}
            accentColor={stats.activeIncidents === 0 ? theme.successText : theme.dangerText}
          />
        </View>

        {/* ── Monitors list ── */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          ACTIVE MONITORS
        </Text>

        {monitors?.length ? (
          monitors.map(monitor => (
            <MonitorCard
              key={monitor.id}
              monitor={monitor}
              onPress={() => handleMonitorPress(monitor.id)}
            />
          ))
        ) : (
          <View style={[styles.emptyState, { borderColor: theme.border }]}>
            <Text style={{ fontSize: 32 }}>📡</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              No monitors yet
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              Tap "+ Add Monitor" to start tracking your first website.
            </Text>
          </View>
        )}
      </ScrollView>

      <AddMonitorModal
        visible={showModal}
        onClose={handleCloseModal}
        onAdd={handleAddMonitor}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, flexGrow: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    paddingTop: spacing.xs,
  },
  headerLeft: { gap: 2 },
  greeting: { fontSize: typography.small, fontWeight: '500' },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, lineHeight: 38 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: typography.small, fontWeight: '600' },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  addBtnText: { fontSize: 28, fontWeight: '300', lineHeight: 32, marginTop: -2 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  sectionTitle: { fontSize: typography.small, fontWeight: '700', letterSpacing: 0.5, marginBottom: spacing.md },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    gap: spacing.sm,
  },
  emptyTitle: { fontSize: typography.subtitle, fontWeight: '700' },
  emptyDesc: { fontSize: typography.body, textAlign: 'center', maxWidth: 240, lineHeight: 20 },
});
