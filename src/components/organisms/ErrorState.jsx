import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

/**
 * Full-screen error fallback. Renders an optional back-button header so it
 * can be used in stack screens without breaking navigation.
 */
export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  onBack,
}) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {onBack && (
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <Text style={[styles.backArrow, { color: theme.textPrimary }]}>‹</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: theme.dangerLight }]}>
          <Text style={styles.icon}>⚠️</Text>
        </View>

        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>

        {message ? (
          <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
        ) : null}

        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            activeOpacity={0.8}
            style={[styles.retryBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}

        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backLink}>
            <Text style={[styles.backLinkText, { color: theme.accentText }]}>← Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4, alignSelf: 'flex-start' },
  backArrow: { fontSize: 28, fontWeight: '300', lineHeight: 32 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  icon: { fontSize: 32 },
  title: { fontSize: typography.titleLg, fontWeight: '700', textAlign: 'center' },
  message: {
    fontSize: typography.bodyLg,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  retryBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  retryText: { color: '#fff', fontSize: typography.subtitle, fontWeight: '600' },
  backLink: { marginTop: spacing.xs },
  backLinkText: { fontSize: typography.body, fontWeight: '500' },
});
