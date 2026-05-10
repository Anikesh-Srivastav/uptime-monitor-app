import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import IconCircle from '../atoms/IconCircle';
import { radius, spacing, typography } from '../../theme/tokens';

export default function AlertsCard({ alerts }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.row}>
        <IconCircle size={44} backgroundColor={theme.accentLight}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </IconCircle>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {alerts.configured ? 'Alert Configured' : 'No Alerts'}
          </Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>{alerts.description}</Text>
        </View>
      </View>

      <TouchableOpacity>
        <Text style={[styles.link, { color: theme.accentText }]}>Manage Alerts →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  content: { flex: 1, gap: 4 },
  title: { fontSize: typography.subtitle, fontWeight: '700' },
  desc: { fontSize: typography.body, lineHeight: 20 },
  link: { fontSize: typography.body, fontWeight: '600' },
});
