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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [showPass, setShowPass] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    clearError();
    const res = await registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    if (res.success) {
      // Navigate to OTP verification if the backend requires it
      navigation.navigate('OtpVerification', { email: values.email });
    }
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
          {/* Header */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backText, { color: theme.accentText }]}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.hero}>
            <Text style={[styles.heading, { color: theme.textPrimary }]}>Create account</Text>
            <Text style={[styles.subheading, { color: theme.textSecondary }]}>
              Monitor your services in minutes.
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.surface }, shadow.md]}>
            {error ? (
              <View style={[styles.errorBanner, { backgroundColor: theme.dangerLight }]}>
                <Text style={[styles.errorText, { color: theme.dangerText }]}>{error}</Text>
              </View>
            ) : null}

            {[
              { name: 'name', label: 'Full Name', placeholder: 'Jane Smith', type: 'default' },
              { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email-address' },
              { name: 'password', label: 'Password', placeholder: '••••••••', secure: true },
              { name: 'confirmPassword', label: 'Confirm Password', placeholder: '••••••••', secure: true },
            ].map(({ name, label, placeholder, type, secure }) => (
              <View key={name} style={styles.field}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
                <Controller
                  control={control}
                  name={name}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={placeholder}
                      keyboardType={type ?? 'default'}
                      autoCapitalize={name === 'name' ? 'words' : 'none'}
                      secureTextEntry={secure ? !showPass : false}
                      autoCorrect={false}
                    />
                  )}
                />
                {errors[name] && (
                  <Text style={[styles.fieldError, { color: theme.dangerText }]}>
                    {errors[name].message}
                  </Text>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={styles.showPassRow}
              onPress={() => setShowPass((v) => !v)}
            >
              <Text style={[styles.showPassText, { color: theme.textMuted }]}>
                {showPass ? '🙈 Hide passwords' : '👁️ Show passwords'}
              </Text>
            </TouchableOpacity>

            <PrimaryButton
              label={isLoading ? 'Creating account…' : 'Create Account'}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.footerLink, { color: theme.accentText }]}>Sign in</Text>
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
  scroll: { flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xl },
  backBtn: { marginBottom: spacing.lg },
  backText: { fontSize: typography.body, fontWeight: '600' },
  hero: { marginBottom: spacing.xl },
  heading: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subheading: { fontSize: typography.body, marginTop: 4 },
  card: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md },
  errorBanner: { borderRadius: radius.sm, padding: spacing.md },
  errorText: { fontSize: typography.body, fontWeight: '500' },
  field: { gap: 6 },
  label: { fontSize: typography.small, fontWeight: '600', letterSpacing: 0.3 },
  fieldError: { fontSize: typography.caption, marginTop: 2 },
  showPassRow: { marginTop: -spacing.sm },
  showPassText: { fontSize: typography.small },
  submitBtn: { marginTop: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { fontSize: typography.body },
  footerLink: { fontSize: typography.body, fontWeight: '700' },
});
