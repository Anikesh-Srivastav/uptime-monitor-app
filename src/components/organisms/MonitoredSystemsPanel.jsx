import { View, StyleSheet } from 'react-native';
import SectionTitle from '../atoms/SectionTitle';
import SystemRow from '../molecules/SystemRow';
import { spacing } from '../../theme/tokens';

export default function MonitoredSystemsPanel({ systems }) {
  return (
    <View style={styles.container}>
      <SectionTitle>Monitored Systems</SectionTitle>
      <View style={styles.list}>
        {systems.map((system) => (
          <SystemRow
            key={system.id}
            name={system.name}
            uptime={system.uptime}
            latency={system.latency}
            status={system.status}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
});
