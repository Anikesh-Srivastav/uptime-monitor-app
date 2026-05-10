import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { NAV_HEIGHT, spacing } from '../../theme/tokens';

export default function ScreenLayout({ children, scrollable = true, noPadding = false }) {
  const { theme } = useTheme();

  const inner = (
    <View style={[styles.inner, noPadding ? null : styles.padded]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: NAV_HEIGHT + spacing.xl }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {inner}
        </ScrollView>
      ) : (
        <View style={[styles.content, { flex: 1 }]}>{inner}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
  inner: { flex: 1 },
  padded: { padding: spacing.lg },
});
