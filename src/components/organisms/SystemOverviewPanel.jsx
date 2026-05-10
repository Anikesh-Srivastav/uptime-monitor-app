import { View, StyleSheet } from 'react-native';
import SectionTitle from '../atoms/SectionTitle';
import MetricCard from '../molecules/MetricCard';
import { spacing } from '../../theme/tokens';

export default function SystemOverviewPanel({ stats }) {
  return (
    <View style={styles.container}>
      <SectionTitle>Overview</SectionTitle>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
