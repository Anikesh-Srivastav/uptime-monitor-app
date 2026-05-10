import { Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { typography } from '../../theme/tokens';

export default function AppText({ children, size, weight, color, tone, style, ...props }) {
  const { theme } = useTheme();

  const colorMap = {
    primary: theme.textPrimary,
    secondary: theme.textSecondary,
    muted: theme.textMuted,
    accent: theme.accentText,
    success: theme.successText,
    warning: theme.warningText,
    danger: theme.dangerText,
    inverse: theme.textInverse,
  };

  const resolved = color || colorMap[tone] || theme.textPrimary;

  return (
    <Text
      style={[
        {
          fontSize: typography[size] || typography.body,
          fontWeight: weight || '400',
          color: resolved,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
