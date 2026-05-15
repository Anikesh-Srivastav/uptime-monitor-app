import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '../theme/ThemeContext';
import { forgotPassword } from '../api/authApi';
import { normalizeError } from '../utils/errorNormalizer';
import Input from '../components/atoms/Input';
import { spacing, typography, radius, shadow } from '../theme/tokens';

const schema = z.object({
  email: z.email('Enter a valid email address'),
});

export default function ForgotPasswordScreen({ navigation }) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }) => {
    setIsLoading(true);
    setError(null);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      console.log('[ForgotPassword] raw error:', JSON.stringify({
        message: err?.message,
        code: err?.code,
        status: err?.response?.status,
        data: err?.response?.data,
      }));
      setError(normalizeError(err).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={[styles.backText, { color: theme.accentText }]}>← Back</Text>
          </TouchableOpacity>

          {sent ? (
            <View style={styles.successState}>
              <Text style={styles.successEmoji}>📬</Text>
              <Text style={[styles.heading, { color: theme.textPrimary }]}>Check your inbox</Text>
              <Text style={[styles.sub, { color: theme.textSecondary }]}>
                We sent a password reset link to{'\n'}
                <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>
                  {getValues('email')}
                </Text>
              </Text>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.accent }]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.btnText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.hero}>
                <Text style={styles.emoji}>🔑</Text>
                <Text style={[styles.heading, { color: theme.textPrimary }]}>Forgot password?</Text>
                <Text style={[styles.sub, { color: theme.textSecondary }]}>
                  Enter your email and we'll send you a reset link.
                </Text>
              </View>

              <View style={[styles.card, { backgroundColor: theme.surface }, shadow.md]}>
                {error ? (
                  <View style={[styles.errorBanner, { backgroundColor: theme.dangerLight }]}>
                    <Text style={[styles.errorText, { color: theme.dangerText }]}>{error}</Text>
                  </View>
                ) : null}

                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Email address</Text>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <Input
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="you@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit(onSubmit)}
                      />
                    )}
                  />
                  {errors.email && (
                    <Text style={[styles.fieldError, { color: theme.dangerText }]}>
                      {errors.email.message}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: theme.accent, opacity: isLoading ? 0.7 : 1 }]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flex: 1, padding: spacing.lg },
  backBtn: { marginBottom: spacing.lg },
  backText: { fontSize: typography.body, fontWeight: '600' },
  hero: { alignItems: 'center', marginVertical: spacing.xl },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  heading: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  sub: { fontSize: typography.body, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  card: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md },
  errorBanner: { borderRadius: radius.sm, padding: spacing.md },
  errorText: { fontSize: typography.body, fontWeight: '500' },
  field: { gap: 6 },
  label: { fontSize: typography.small, fontWeight: '600', letterSpacing: 0.3 },
  fieldError: { fontSize: typography.caption, marginTop: 2 },
  btn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnText: { color: '#fff', fontSize: typography.subtitle, fontWeight: '700' },
  successState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  successEmoji: { fontSize: 64 },
});
