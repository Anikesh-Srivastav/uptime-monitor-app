import { View, StyleSheet } from 'react-native';
import { radius } from '../../theme/tokens';

export default function IconCircle({ children, size = 44, backgroundColor }) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
