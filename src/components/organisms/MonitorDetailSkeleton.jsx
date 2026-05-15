import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../atoms/BackButton';
import Skeleton from '../atoms/Skeleton';
import { useTheme } from '../../theme/ThemeContext';
import { NAV_HEIGHT, radius, spacing } from '../../theme/tokens';

function MetricSkeleton({ theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.metricRow}>
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton height={11} width={110} borderRadius={4} />
          <Skeleton height={44} width={150} borderRadius={6} />
          <Skeleton height={13} width={90} borderRadius={4} />
        </View>
        <Skeleton width={48} height={48} borderRadius={24} />
      </View>
    </View>
  );
}

function TimelineSkeleton({ theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Skeleton width={4} height={20} borderRadius={2} />
        <Skeleton height={12} width={180} borderRadius={4} />
      </View>
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
        <Skeleton height={12} width={70} borderRadius={4} />
        <Skeleton height={12} width={70} borderRadius={4} />
        <Skeleton height={12} width={50} borderRadius={4} />
      </View>
      <Skeleton height={48} borderRadius={6} style={{ marginTop: 8 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <Skeleton height={10} width={72} borderRadius={4} />
        <Skeleton height={10} width={48} borderRadius={4} />
      </View>
    </View>
  );
}

function ChartSkeleton({ theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Skeleton width={24} height={20} borderRadius={4} />
        <View style={{ gap: 5, flex: 1 }}>
          <Skeleton height={18} width={220} borderRadius={5} />
          <Skeleton height={12} width={160} borderRadius={4} />
        </View>
      </View>
      <Skeleton height={26} width={90} borderRadius={6} style={{ marginTop: 4 }} />
      <Skeleton height={12} width={210} borderRadius={4} style={{ marginTop: 8 }} />
      <Skeleton height={180} borderRadius={8} style={{ marginTop: 10 }} />
    </View>
  );
}

function InfoCardSkeleton({ theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Skeleton height={11} width={100} borderRadius={4} />
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 8 }}>
        <Skeleton width={44} height={44} borderRadius={12} />
        <View style={{ gap: 6 }}>
          <Skeleton height={15} width={60} borderRadius={4} />
          <Skeleton height={12} width={140} borderRadius={4} />
        </View>
      </View>
      <View style={{ gap: 8, marginTop: 8 }}>
        {[140, 120, 100].map(w => (
          <View key={w} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Skeleton height={12} width={80} borderRadius={4} />
            <Skeleton height={12} width={w} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
}

export default function MonitorDetailSkeleton({ navigation }) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header skeleton mirrors the real header layout */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={{ flex: 1, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Skeleton height={20} style={{ flex: 1 }} borderRadius={5} />
            <Skeleton width={72} height={26} borderRadius={13} />
          </View>
          <Skeleton height={12} width={190} borderRadius={4} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: NAV_HEIGHT + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <MetricSkeleton theme={theme} />
        <MetricSkeleton theme={theme} />
        <MetricSkeleton theme={theme} />
        <TimelineSkeleton theme={theme} />
        <ChartSkeleton theme={theme} />
        <InfoCardSkeleton theme={theme} />
        <InfoCardSkeleton theme={theme} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
