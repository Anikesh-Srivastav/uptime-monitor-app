import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import IconCircle from '../atoms/IconCircle';
import { radius, spacing, typography } from '../../theme/tokens';

export default function AlertsCard({ alerts }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.row}>
        <IconCircle size={44} backgroundColor={theme.accentLight}>
          <Text style={{ fontSize: 20, lineHeight: 24 }}>🔔</Text>
        </IconCircle>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {alerts.configured ? 'Alert Configured' : 'No Alerts'}
          </Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>{alerts.description}</Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.7} style={styles.linkRow}>
        <Text style={[styles.link, { color: theme.accentText }]}>Manage Alerts</Text>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill={theme.accentText}>
          <Path d="M5 12h14M12 5l7 7-7 7" stroke={theme.accentText} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
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
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  link: { fontSize: typography.body, fontWeight: '600' },
});
