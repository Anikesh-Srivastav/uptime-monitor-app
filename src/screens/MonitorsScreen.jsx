import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/templates/ScreenLayout';
import MonitorCard from '../components/molecules/MonitorCard';
import { useTheme } from '../theme/ThemeContext';
import { monitors } from '../data/mockMonitors';
import { radius, spacing, typography } from '../theme/tokens';

export default function MonitorsScreen({ navigation }) {
  const { theme } = useTheme();

  const healthy = monitors.filter(m => m.status === 'healthy').length;
  const degraded = monitors.filter(m => m.status === 'degraded').length;
  const down = monitors.filter(m => m.status === 'down').length;
  const total = monitors.length;

  const overallOk = down === 0 && degraded === 0;

  return (
    <ScreenLayout>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Monitors</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {total} monitor{total !== 1 ? 's' : ''} tracked
        </Text>
        <View style={[
          styles.overallBadge,
          { backgroundColor: overallOk ? '#10B98118' : '#EF444418' },
        ]}>
          <View style={[
            styles.overallDot,
            { backgroundColor: overallOk ? '#10B981' : '#EF4444' },
          ]} />
          <Text style={[
            styles.overallText,
            { color: overallOk ? '#10B981' : '#EF4444' },
          ]}>
            {overallOk ? 'All operational' : `${down + degraded} need attention`}
          </Text>
        </View>
      </View>

      {/* ── Status chips ── */}
      <View style={styles.chipsRow}>
        <StatChip label="Healthy" count={healthy} color={theme.successText} bg={theme.successLight} />
        <StatChip label="Degraded" count={degraded} color={theme.warningText} bg={theme.warningLight} />
        <StatChip label="Down" count={down} color={theme.dangerText} bg={theme.dangerLight} />
      </View>

      {/* ── Monitor list ── */}
      {monitors.map(monitor => (
        <MonitorCard
          key={monitor.id}
          monitor={monitor}
          onPress={() => navigation.push('MonitorDetail', { monitorId: monitor.id })}
        />
      ))}
    </ScreenLayout>
  );
}

function StatChip({ label, count, color, bg }) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.chipCount, { color }]}>{count}</Text>
      <Text style={[styles.chipLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  subtitle: {
    fontSize: typography.small,
    fontWeight: '500',
  },
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
  overallDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  overallText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
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
});
