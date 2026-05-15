import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { verifyOtp, resendOtp } from '../api/authApi';
import { normalizeError } from '../utils/errorNormalizer';
import { spacing, typography, radius, shadow } from '../theme/tokens';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function OtpVerificationScreen({ route, navigation }) {
  const { email } = route.params;
  const { theme } = useTheme();
  const { setAuthData } = useAuth();

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleDigitChange = (text, index) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(null);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (digit && index === OTP_LENGTH - 1) {
      const code = [...next].join('');
      if (code.length === OTP_LENGTH) handleVerify(code);
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }, index) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeOverride) => {
    const code = codeOverride ?? digits.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await verifyOtp({ email, otp: code });
      // If backend returns tokens after OTP, log in directly
      if (res.data?.accessToken) {
        await setAuthData(res.data);
      } else {
        navigation.navigate('Login');
      }
    } catch (err) {
      setError(normalizeError(err).message);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await resendOtp({ email });
      setCooldown(RESEND_COOLDOWN);
      setError(null);
    } catch (err) {
      setError(normalizeError(err).message);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: theme.accentText }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <Text style={styles.emoji}>✉️</Text>
          <Text style={[styles.heading, { color: theme.textPrimary }]}>Check your email</Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            We sent a 6-digit code to{'\n'}
            <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{email}</Text>
          </Text>
        </View>

        {/* OTP input boxes */}
        <View style={styles.otpRow}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => (inputRefs.current[i] = r)}
              style={[
                styles.otpBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: digit ? theme.accent : theme.border,
                  color: theme.textPrimary,
                },
                shadow.sm,
              ]}
              value={digit}
              onChangeText={(t) => handleDigitChange(t, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.dangerText }]}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.verifyBtn,
            { backgroundColor: theme.accent, opacity: isLoading ? 0.7 : 1 },
          ]}
          onPress={() => handleVerify()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyBtnText}>Verify Code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendRow}
          onPress={handleResend}
          disabled={cooldown > 0}
        >
          <Text style={[styles.resendText, { color: cooldown > 0 ? theme.textMuted : theme.accentText }]}>
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive it? Resend"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: spacing.lg },
  backBtn: { marginBottom: spacing.lg },
  backText: { fontSize: typography.body, fontWeight: '600' },
  hero: { alignItems: 'center', marginVertical: spacing.xxl },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  heading: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  sub: { fontSize: typography.body, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 2,
    fontSize: 22,
    fontWeight: '700',
  },
  error: { textAlign: 'center', marginBottom: spacing.md, fontSize: typography.body },
  verifyBtn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  verifyBtnText: { color: '#fff', fontSize: typography.subtitle, fontWeight: '700' },
  resendRow: { alignItems: 'center', paddingVertical: spacing.md },
  resendText: { fontSize: typography.body, fontWeight: '600' },
});
