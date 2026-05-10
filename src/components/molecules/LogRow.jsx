import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme/tokens';

const STATUS_STYLES = {
  healthy: { bg: '#ECFDF5', text: '#059669' },
  degraded: { bg: '#FFF7ED', text: '#D97706' },
  down: { bg: '#FEF2F2', text: '#DC2626' },
};

export default function LogRow({ log, isLast }) {
  const { theme } = useTheme();
  const st = STATUS_STYLES[log.status] || STATUS_STYLES.healthy;

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: isLast ? 'transparent' : theme.border },
      ]}
    >
      <Text style={[styles.time, { color: theme.textSecondary }]}>{log.time}</Text>

      <View style={[styles.badge, { backgroundColor: st.bg }]}>
        <Text style={[styles.badgeText, { color: st.text }]}>
          {log.status.toUpperCase()}
        </Text>
      </View>

      <Text style={[styles.code, { color: theme.textPrimary }]}>{log.code}</Text>
      <Text style={[styles.latency, { color: theme.textSecondary }]}>{log.latency}</Text>
      <Text style={[styles.details, { color: theme.textMuted }]} numberOfLines={1}>
        {log.details}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  time: { width: 64, fontSize: typography.small },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeText: { fontSize: typography.caption, fontWeight: '700' },
  code: { width: 36, fontSize: typography.small, fontWeight: '700', textAlign: 'center' },
  latency: { width: 48, fontSize: typography.small, textAlign: 'right' },
  details: { flex: 1, fontSize: typography.caption },
});
