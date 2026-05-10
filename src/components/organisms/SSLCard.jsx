import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

export default function SSLCard({ ssl }) {
  const { theme } = useTheme();
  const pct = Math.max(0, Math.min(1, ssl.daysLeft / ssl.totalDays));

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.textMuted }]}>SSL CERTIFICATE</Text>

      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: theme.successLight }]}>
          <Text style={{ fontSize: 20 }}>🔒</Text>
        </View>
        <View>
          <Text style={[styles.valid, { color: theme.successText }]}>Valid</Text>
          <Text style={[styles.issuer, { color: theme.textSecondary }]}>
            Issued by {ssl.issuer}
          </Text>
        </View>
      </View>

      <InfoRow label="Issued On" value={ssl.issuedOn} theme={theme} />
      <InfoRow label="Expires On" value={ssl.expiresOn} theme={theme} />
      <InfoRow label="Validity" value={`${ssl.daysLeft} days left`} theme={theme} />

      <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
        <View
          style={[styles.progressFill, { width: `${pct * 100}%`, backgroundColor: theme.success }]}
        />
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
  label: { fontSize: typography.caption, fontWeight: '700', letterSpacing: 0.5 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xs },
  iconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  valid: { fontSize: typography.subtitle, fontWeight: '700' },
  issuer: { fontSize: typography.small },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: typography.body },
  rowValue: { fontSize: typography.body, fontWeight: '600' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginTop: spacing.xs },
  progressFill: { height: '100%', borderRadius: 4 },
});
