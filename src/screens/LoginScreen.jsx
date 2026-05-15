import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/atoms/Input';
import PrimaryButton from '../components/atoms/PrimaryButton';
import { spacing, typography, radius, shadow } from '../theme/tokens';

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    clearError();
    await login(values);
    // Navigation is handled automatically by RootNavigator watching isAuthenticated
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand */}
          <View style={styles.brand}>
            <View style={[styles.logoBox, { backgroundColor: theme.accentLight }]}>
              <Text style={styles.logoText}>📡</Text>
            </View>
            <Text style={[styles.appName, { color: theme.textPrimary }]}>UptimeMonitor</Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              Keep every service online, always.
            </Text>
          </View>

          {/* Card */}
          <View style={[styles.card, { backgroundColor: theme.surface }, shadow.md]}>
            <Text style={[styles.heading, { color: theme.textPrimary }]}>Welcome back</Text>
            <Text style={[styles.subheading, { color: theme.textSecondary }]}>
              Sign in to your account
            </Text>

            {/* Server error */}
            {error ? (
              <View style={[styles.errorBanner, { backgroundColor: theme.dangerLight }]}>
                <Text style={[styles.errorBannerText, { color: theme.dangerText }]}>{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
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
                    returnKeyType="next"
                  />
                )}
              />
              {errors.email && (
                <Text style={[styles.fieldError, { color: theme.dangerText }]}>
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={[styles.forgotLink, { color: theme.accentText }]}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="••••••••"
                      secureTextEntry={!showPassword}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                >
                  <Text style={{ color: theme.textMuted }}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={[styles.fieldError, { color: theme.dangerText }]}>
                  {errors.password.message}
                </Text>
              )}
            </View>

            <PrimaryButton
              label={isLoading ? 'Signing in…' : 'Sign In'}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              style={styles.submitBtn}
            />
          </View>

          {/* Register link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.footerLink, { color: theme.accentText }]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  brand: { alignItems: 'center', marginBottom: spacing.xl },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: { fontSize: 36 },
  appName: { fontSize: typography.titleLg, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { fontSize: typography.body, marginTop: 4 },
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  heading: { fontSize: typography.titleLg, fontWeight: '700' },
  subheading: { fontSize: typography.body, marginTop: -spacing.sm },
  errorBanner: {
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  errorBannerText: { fontSize: typography.body, fontWeight: '500' },
  field: { gap: 6 },
  label: { fontSize: typography.small, fontWeight: '600', letterSpacing: 0.3 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotLink: { fontSize: typography.small, fontWeight: '600' },
  fieldError: { fontSize: typography.caption, marginTop: 2 },
  eyeBtn: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  submitBtn: { marginTop: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { fontSize: typography.body },
  footerLink: { fontSize: typography.body, fontWeight: '700' },
});
