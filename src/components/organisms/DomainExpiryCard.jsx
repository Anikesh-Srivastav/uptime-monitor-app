import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

export default function DomainExpiryCard({ domain }) {
  const { theme } = useTheme();
  const daysColor = domain.daysRemaining <= 30
    ? theme.dangerText
    : domain.daysRemaining <= 60
    ? theme.warningText
    : theme.accentText;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: theme.textMuted }]}>DOMAIN EXPIRY</Text>
        <Text style={{ fontSize: 18, lineHeight: 22 }}>🌐</Text>
      </View>

      <View style={styles.daysBlock}>
        <Text style={[styles.days, { color: daysColor }]}>{domain.daysRemaining}</Text>
        <Text style={[styles.daysLabel, { color: theme.textMuted }]}>DAYS REMAINING</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <InfoRow label="Registrar" value={domain.registrar} theme={theme} />
      <InfoRow label="Registered" value={domain.registered} theme={theme} />
      <View style={styles.row}>
        <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Auto-renew</Text>
        <Text style={[styles.autoRenew, { color: domain.autoRenew ? theme.successText : theme.dangerText }]}>
          {domain.autoRenew ? '✓ Enabled' : '✗ Disabled'}
        </Text>
      </View>
    </View>
  );
}

function InfoRow({ label, value, theme }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: typography.caption, fontWeight: '700', letterSpacing: 0.5 },
  daysBlock: { alignItems: 'center', paddingVertical: spacing.md },
  days: { fontSize: typography.display + 12, fontWeight: '800', lineHeight: 72 },
  daysLabel: { fontSize: typography.caption, fontWeight: '700', letterSpacing: 1 },
  divider: { height: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: typography.body },
  rowValue: { fontSize: typography.body, fontWeight: '600' },
  autoRenew: { fontSize: typography.body, fontWeight: '600' },
});
