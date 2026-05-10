import { View, StyleSheet } from 'react-native';
import ScreenLayout from '../components/templates/ScreenLayout';
import AppText from '../components/atoms/AppText';
import SystemOverviewPanel from '../components/organisms/SystemOverviewPanel';
import MonitoredSystemsPanel from '../components/organisms/MonitoredSystemsPanel';
import QuickActionsPanel from '../components/organisms/QuickActionsPanel';
import { monitoredSystems, quickActions, summaryStats } from '../data/mockSystems';
import { spacing, typography } from '../theme/tokens';

export default function HomeScreen() {
  return (
    <ScreenLayout>
      <View style={styles.hero}>
        <AppText tone="accent" style={styles.kicker}>
          Uptime Monitor
        </AppText>
        <AppText style={styles.title}>Service health at a glance.</AppText>
        <AppText tone="secondary" style={styles.description}>
          This starter keeps screens thin and pushes UI into reusable components
          so the app can grow cleanly as monitors, incidents, and alerts are
          added.
        </AppText>
      </View>

      <SystemOverviewPanel stats={summaryStats} />
      <MonitoredSystemsPanel systems={monitoredSystems} />
      <QuickActionsPanel actions={quickActions} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
  },
  kicker: {
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: typography.hero,
    fontWeight: '800',
    lineHeight: 36,
  },
  description: {
    maxWidth: 560,
    lineHeight: 22,
  },
});
