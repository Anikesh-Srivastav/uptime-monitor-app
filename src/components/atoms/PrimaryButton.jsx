import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

export default function PrimaryButton({ label, onPress, variant = 'primary', disabled, style }) {
  const { theme } = useTheme();

  const bgColor = {
    primary: theme.accent,
    secondary: 'transparent',
    danger: 'transparent',
  }[variant];

  const textColor = {
    primary: '#FFFFFF',
    secondary: theme.textPrimary,
    danger: theme.dangerText,
  }[variant];

  const borderColor = {
    primary: 'transparent',
    secondary: theme.border,
    danger: theme.border,
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.btn,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: variant !== 'primary' ? 1.5 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.subtitle,
    fontWeight: '600',
  },
});
