import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

export default function StatusBadge({ status }) {
  const { theme } = useTheme();

  const config = {
    healthy: { bg: theme.successLight, text: theme.successText, dot: theme.success, label: 'Healthy' },
    degraded: { bg: theme.warningLight, text: theme.warningText, dot: theme.warning, label: 'Degraded' },
    down: { bg: theme.dangerLight, text: theme.dangerText, dot: theme.danger, label: 'Down' },
  }[status] || { bg: theme.accentLight, text: theme.accentText, dot: theme.accent, label: status };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    gap: 5,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontSize: typography.small, fontWeight: '600' },
});
