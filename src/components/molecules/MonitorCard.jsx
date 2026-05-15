import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Sparkline from '../atoms/Sparkline';
import { radius, shadow, spacing, typography } from '../../theme/tokens';

const STATUS_COLORS = {
  healthy: '#10B981',
  degraded: '#F59E0B',
  down: '#EF4444',
};

export default function MonitorCard({ monitor, onPress }) {
  const { theme } = useTheme();
  const dotColor = STATUS_COLORS[monitor.status?.toLowerCase()] || theme.textMuted;
  const borderLeft = dotColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        shadow.sm,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderLeftColor: borderLeft,
        },
      ]}
    >
      <View style={styles.top}>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={[styles.statusText, { color: dotColor }]}>
            {(monitor.status ?? 'unknown').toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={[styles.name, { color: theme.textPrimary }]}>{monitor.name}</Text>
      <Text style={[styles.meta, { color: theme.textSecondary }]}>
        {monitor.url ?? monitor.name}
      </Text>

      <View style={styles.bottom}>
        <Text style={[styles.latency, { color: theme.textPrimary }]}>
          {monitor.responseTime ? `${monitor.responseTime}ms` : '—'}
        </Text>
        {/* pointerEvents="none" prevents the SVG from absorbing the tap */}
        <View pointerEvents="none">
          <Sparkline
            data={monitor.sparkline ?? []}
            width={120}
            height={32}
            color={theme.accent + 'BB'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: 4,
  },
  top: { marginBottom: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: typography.small, fontWeight: '700', letterSpacing: 0.4 },
  name: { fontSize: typography.subtitle, fontWeight: '700' },
  meta: { fontSize: typography.small },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  latency: { fontSize: typography.subtitle, fontWeight: '700' },
});
