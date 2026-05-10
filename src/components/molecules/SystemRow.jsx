import { View, StyleSheet } from 'react-native';
import AppText from '../atoms/AppText';
import StatusBadge from '../atoms/StatusBadge';
import { colors, radius, spacing } from '../../theme/tokens';

export default function SystemRow({ name, uptime, latency, status }) {
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <AppText style={styles.name}>{name}</AppText>
          <AppText tone="secondary">Uptime {uptime}</AppText>
        </View>
        <StatusBadge label={status} />
      </View>
      <AppText tone="secondary">Latency {latency}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontWeight: '700',
  },
});
