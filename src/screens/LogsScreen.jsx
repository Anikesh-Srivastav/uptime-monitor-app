import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/templates/ScreenLayout';
import LogsTable from '../components/organisms/LogsTable';
import { useTheme } from '../theme/ThemeContext';
import { monitors } from '../data/mockMonitors';
import { spacing, typography } from '../theme/tokens';

export default function LogsScreen() {
  const { theme } = useTheme();
  const allLogs = monitors.flatMap(m => m.logs || []).slice(0, 100);

  return (
    <ScreenLayout>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Logs</Text>

      <View style={styles.meta}>
        <View style={[styles.pill, { backgroundColor: theme.accentLight }]}>
          <Text style={[styles.pillText, { color: theme.accentText }]}>
            {allLogs.length} entries
          </Text>
        </View>
        <Text style={[styles.desc, { color: theme.textSecondary }]}>All monitors · Last 24 hours</Text>
      </View>

      <LogsTable logs={allLogs} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.titleLg + 4, fontWeight: '800', marginBottom: spacing.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pillText: { fontSize: typography.small, fontWeight: '700' },
  desc: { fontSize: typography.small },
});
