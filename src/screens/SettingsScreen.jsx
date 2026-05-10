import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenLayout from '../components/templates/ScreenLayout';
import { useTheme } from '../theme/ThemeContext';
import { radius, shadow, spacing, typography } from '../theme/tokens';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <ScreenLayout>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>

      <View style={[styles.section, shadow.sm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>APPEARANCE</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={[styles.rowIcon]}>
              {isDark ? '🌙' : '☀️'}
            </Text>
            <View>
              <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
                {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: theme.accent }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={[styles.section, shadow.sm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>MONITORING</Text>

        <SettingsRow icon="🔔" title="Notifications" subtitle="Alert preferences" theme={theme} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingsRow icon="⏱" title="Check Interval" subtitle="Default: 1 minute" theme={theme} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingsRow icon="🌍" title="Regions" subtitle="Monitor from 3 regions" theme={theme} />
      </View>

      <View style={[styles.section, shadow.sm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>ACCOUNT</Text>

        <SettingsRow icon="👤" title="Profile" subtitle="Manage your account" theme={theme} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingsRow icon="🔑" title="API Keys" subtitle="Manage integrations" theme={theme} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <TouchableOpacity style={styles.dangerRow}>
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={[styles.dangerText, { color: theme.dangerText }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: theme.textMuted }]}>Uptime Monitor v1.0.0</Text>
    </ScreenLayout>
  );
}

function SettingsRow({ icon, title, subtitle, theme }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowIcon}>{icon}</Text>
        <View>
          <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>{title}</Text>
          <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        </View>
      </View>
      <Text style={[styles.chevron, { color: theme.textMuted }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: typography.titleLg + 4, fontWeight: '800', marginBottom: spacing.lg },
  section: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  rowIcon: { fontSize: 20 },
  rowTitle: { fontSize: typography.bodyLg, fontWeight: '500' },
  rowSubtitle: { fontSize: typography.small },
  chevron: { fontSize: 22, fontWeight: '300' },
  divider: { height: 1, marginLeft: spacing.lg + 20 + spacing.md },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dangerText: { fontSize: typography.bodyLg, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: typography.small, marginTop: spacing.sm },
});
