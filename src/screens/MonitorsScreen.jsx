import { useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import ScreenLayout from '../components/templates/ScreenLayout';
import MonitorCard from '../components/molecules/MonitorCard';
import DashboardSkeleton from '../components/organisms/DashboardSkeleton';
import ErrorState from '../components/organisms/ErrorState';
import { useTheme } from '../theme/ThemeContext';
import { useMonitors } from '../hooks/useMonitors';
import { NAV_HEIGHT, radius, spacing, typography } from '../theme/tokens';

function StatChip({ label, count, color, bg }) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.chipCount, { color }]}>{count}</Text>
      <Text style={[styles.chipLabel, { color }]}>{label}</Text>
    </View>
  );
}

export default function MonitorsScreen({ navigation }) {
  const { theme } = useTheme();
  const { monitors, loading, refreshing, error, refresh } = useMonitors({ pollEnabled: true });

  const handleMonitorPress = useCallback(
    (monitorId) => navigation.push('MonitorDetail', { monitorId }),
    [navigation],
  );

  if (loading) {
    return <DashboardSkeleton theme={theme} />;
  }

  if (error && !monitors?.length) {
    return <ErrorState title="Could not load monitors" message={error} onRetry={refresh} />;
  }

  const healthy = monitors.filter((m) => m.status === 'healthy').length;
  const degraded = monitors.filter((m) => m.status === 'degraded').length;
  const down = monitors.filter((m) => m.status === 'down').length;
  const total = monitors.length;
  const overallOk = down === 0 && degraded === 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
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
        <Text style={[styles.title, { color: theme.textPrimary }]}>Monitors</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {total} monitor{total !== 1 ? 's' : ''} tracked
        </Text>
        {total > 0 && (
          <View style={[
            styles.overallBadge,
            { backgroundColor: overallOk ? '#10B98118' : '#EF444418' },
          ]}>
            <View style={[styles.overallDot, { backgroundColor: overallOk ? '#10B981' : '#EF4444' }]} />
            <Text style={[styles.overallText, { color: overallOk ? '#10B981' : '#EF4444' }]}>
              {overallOk ? 'All operational' : `${down + degraded} need attention`}
            </Text>
          </View>
        )}
      </View>

      {/* ── Status chips ── */}
      {total > 0 && (
        <View style={styles.chipsRow}>
          <StatChip label="Healthy" count={healthy} color={theme.successText} bg={theme.successLight} />
          <StatChip label="Degraded" count={degraded} color={theme.warningText} bg={theme.warningLight} />
          <StatChip label="Down" count={down} color={theme.dangerText} bg={theme.dangerLight} />
        </View>
      )}

      {/* ── Monitor list ── */}
      {monitors.map((monitor) => (
        <MonitorCard
          key={monitor._id ?? monitor.id}
          monitor={monitor}
          onPress={() => handleMonitorPress(monitor._id ?? monitor.id)}
        />
      ))}

      {total === 0 && (
        <View style={[styles.emptyState, { borderColor: theme.border }]}>
          <Text style={{ fontSize: 32, lineHeight: 40 }}>📡</Text>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No monitors yet</Text>
          <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
            Go to Dashboard to add your first monitor.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, flexGrow: 1 },
  header: {
    gap: 4,
    marginBottom: spacing.lg,
    paddingTop: spacing.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  subtitle: { fontSize: typography.small, fontWeight: '500' },
  overallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginTop: 6,
  },
  overallDot: { width: 7, height: 7, borderRadius: 4 },
  overallText: { fontSize: typography.small, fontWeight: '600' },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    gap: 2,
  },
  chipCount: { fontSize: typography.titleLg, fontWeight: '800' },
  chipLabel: { fontSize: typography.caption, fontWeight: '600' },
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
