import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/templates/ScreenLayout';
import UptimeTimeline from '../components/organisms/UptimeTimeline';
import ResponseTimeChart from '../components/organisms/ResponseTimeChart';
import { useTheme } from '../theme/ThemeContext';
import { monitors } from '../data/mockMonitors';
import { spacing, typography } from '../theme/tokens';

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const monitor = monitors[0];

  return (
    <ScreenLayout>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Analytics</Text>
      <UptimeTimeline history={monitor.uptimeHistory} />
      <ResponseTimeChart history={monitor.responseHistory} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.titleLg + 4, fontWeight: '800', marginBottom: spacing.lg },
});
