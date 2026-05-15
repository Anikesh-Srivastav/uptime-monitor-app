import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenLayout from '../components/templates/ScreenLayout';
import { useTheme } from '../theme/ThemeContext';
import { useMonitors } from '../hooks/useMonitors';
import { NAV_HEIGHT, radius, spacing, typography } from '../theme/tokens';

function StatRow({ label, value, color, theme }) {
  return (
    <View style={[styles.statRow, { borderBottomColor: theme.border }]}>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color: color ?? theme.textPrimary }]}>{value}</Text>
    </View>
  );
}

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const { monitors, loading } = useMonitors({ pollEnabled: false });

  const stats = useMemo(() => {
    if (!monitors?.length) return null;
    const healthy = monitors.filter((m) => m.status === 'healthy').length;
    const down = monitors.filter((m) => m.status === 'down').length;
    const degraded = monitors.filter((m) => m.status === 'degraded').length;
    const withResponse = monitors.filter((m) => m.responseTime != null);
    const avgResponse = withResponse.length
      ? Math.round(withResponse.reduce((s, m) => s + m.responseTime, 0) / withResponse.length)
      : null;
    return { healthy, down, degraded, total: monitors.length, avgResponse };
  }, [monitors]);

  return (
    <ScreenLayout>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Analytics</Text>

      {!loading && stats && (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Fleet Overview</Text>
          <StatRow label="Total Monitors" value={String(stats.total)} theme={theme} />
          <StatRow label="Healthy" value={String(stats.healthy)} color={theme.successText} theme={theme} />
          <StatRow label="Degraded" value={String(stats.degraded)} color={theme.warningText} theme={theme} />
          <StatRow label="Down" value={String(stats.down)} color={theme.dangerText} theme={theme} />
          {stats.avgResponse != null && (
            <StatRow label="Avg Response" value={`${stats.avgResponse}ms`} color={theme.accent} theme={theme} />
          )}
        </View>
      )}

      {!loading && !stats && (
        <View style={[styles.empty, { borderColor: theme.border }]}>
          <Text style={{ fontSize: 32, lineHeight: 40 }}>📈</Text>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No data yet</Text>
          <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
            Add monitors to see analytics here.
          </Text>
        </View>
      )}

      <View style={[styles.coming, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.comingIcon, { color: theme.accent }]}>🚀</Text>
        <Text style={[styles.comingTitle, { color: theme.textPrimary }]}>More analytics coming soon</Text>
        <Text style={[styles.comingDesc, { color: theme.textSecondary }]}>
          Uptime trends, SLA reports, and incident timelines will appear here.
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, marginBottom: spacing.lg },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: 2,
  },
  cardTitle: { fontSize: typography.subtitle, fontWeight: '700', marginBottom: spacing.sm },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statLabel: { fontSize: typography.body },
  statValue: { fontSize: typography.body, fontWeight: '700' },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  emptyTitle: { fontSize: typography.subtitle, fontWeight: '700' },
  emptyDesc: { fontSize: typography.body, textAlign: 'center', maxWidth: 240, lineHeight: 20 },
  coming: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  comingIcon: { fontSize: 28, lineHeight: 36 },
  comingTitle: { fontSize: typography.subtitle, fontWeight: '700' },
  comingDesc: { fontSize: typography.body, textAlign: 'center', lineHeight: 20, color: '#888' },
});
