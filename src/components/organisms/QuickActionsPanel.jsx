import { View, StyleSheet } from 'react-native';
import SectionTitle from '../atoms/SectionTitle';
import PrimaryButton from '../atoms/PrimaryButton';
import { spacing } from '../../theme/tokens';

export default function QuickActionsPanel({ actions }) {
  return (
    <View style={styles.container}>
      <SectionTitle>Quick Actions</SectionTitle>
      <View style={styles.actions}>
        {actions.map((action, index) => (
          <PrimaryButton
            key={action.id}
            label={action.label}
            variant={index === 0 ? 'primary' : 'secondary'}
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
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
