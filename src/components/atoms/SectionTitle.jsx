import { StyleSheet } from 'react-native';
import AppText from './AppText';
import { typography } from '../../theme/tokens';

export default function SectionTitle({ children, style }) {
  return <AppText style={[styles.title, style]}>{children}</AppText>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.title,
    fontWeight: '700',
  },
});
