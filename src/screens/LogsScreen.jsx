import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/templates/ScreenLayout';
import { useTheme } from '../theme/ThemeContext';
import { radius, spacing, typography } from '../theme/tokens';

export default function LogsScreen() {
  const { theme } = useTheme();

  return (
    <ScreenLayout>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Logs</Text>

      <View style={[styles.coming, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={styles.comingIcon}>📋</Text>
        <Text style={[styles.comingTitle, { color: theme.textPrimary }]}>Logs coming soon</Text>
        <Text style={[styles.comingDesc, { color: theme.textSecondary }]}>
          Tap a monitor, then select an endpoint to view its detailed health check history.
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, marginBottom: spacing.lg },
  coming: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  comingIcon: { fontSize: 32, lineHeight: 40 },
  comingTitle: { fontSize: typography.subtitle, fontWeight: '700' },
  comingDesc: { fontSize: typography.body, textAlign: 'center', lineHeight: 20, maxWidth: 280 },
});
