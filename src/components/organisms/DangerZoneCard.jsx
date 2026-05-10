import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

export default function DangerZoneCard({ onRemove }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.dangerLight, borderColor: theme.danger + '40' }]}>
      <Text style={[styles.zoneTitle, { color: theme.dangerText }]}>Danger Zone</Text>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Remove Property</Text>
        <Text style={[styles.desc, { color: theme.textSecondary }]}>
          Remove yourself from this property. You will no longer have access.
        </Text>
      </View>

      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.8}
        style={[styles.btn, { borderColor: theme.danger + '60' }]}
      >
        <Text style={[styles.btnText, { color: theme.dangerText }]}>Remove Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  zoneTitle: { fontSize: typography.titleLg, fontWeight: '700' },
  section: { gap: 4 },
  title: { fontSize: typography.subtitle, fontWeight: '600' },
  desc: { fontSize: typography.body, lineHeight: 20 },
  btn: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  btnText: { fontSize: typography.subtitle, fontWeight: '600' },
});
