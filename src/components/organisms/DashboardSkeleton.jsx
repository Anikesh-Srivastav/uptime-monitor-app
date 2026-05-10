import { View, ScrollView, StyleSheet } from 'react-native';
import Skeleton from '../atoms/Skeleton';
import { NAV_HEIGHT, radius, spacing } from '../../theme/tokens';

function SummaryCardSkeleton({ theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.row}>
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton height={11} width={110} borderRadius={4} />
          <Skeleton height={32} width={130} borderRadius={6} />
          <Skeleton height={14} width={110} borderRadius={4} />
        </View>
        <Skeleton width={48} height={48} borderRadius={24} />
      </View>
    </View>
  );
}

function MonitorCardSkeleton({ theme }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderLeftWidth: 4,
          borderLeftColor: theme.border,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Skeleton width={8} height={8} borderRadius={4} />
        <Skeleton height={11} width={72} borderRadius={4} />
      </View>
      <Skeleton height={17} width={170} borderRadius={5} style={{ marginTop: 4 }} />
      <Skeleton height={12} width={130} borderRadius={4} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <Skeleton height={18} width={55} borderRadius={4} />
        <Skeleton height={32} width={120} borderRadius={4} />
      </View>
    </View>
  );
}

export default function DashboardSkeleton({ theme }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingBottom: NAV_HEIGHT + spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header row */}
      <View style={styles.header}>
        <Skeleton height={28} width={140} borderRadius={6} />
        <Skeleton height={36} width={130} borderRadius={10} />
      </View>

      <SummaryCardSkeleton theme={theme} />
      <SummaryCardSkeleton theme={theme} />
      <SummaryCardSkeleton theme={theme} />

      {/* Section title + view toggle */}
      <View style={styles.sectionHeader}>
        <Skeleton height={13} width={120} borderRadius={4} />
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <Skeleton width={28} height={28} borderRadius={6} />
          <Skeleton width={28} height={28} borderRadius={6} />
        </View>
      </View>

      <MonitorCardSkeleton theme={theme} />
      <MonitorCardSkeleton theme={theme} />
      <MonitorCardSkeleton theme={theme} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, flexGrow: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
});
