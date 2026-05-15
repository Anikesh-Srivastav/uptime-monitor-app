import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import BackButton from '../atoms/BackButton';
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
          <BackButton onPress={onBack} />
        </View>
      )}

      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: theme.dangerLight }]}>
          <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
            <Path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#EF4444"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path d="M12 9v4M12 17h.01" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" />
          </Svg>
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
          <TouchableOpacity onPress={onBack} style={styles.backLink} activeOpacity={0.7}>
            <Text style={[styles.backLinkText, { color: theme.accentText }]}>Go back</Text>
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
