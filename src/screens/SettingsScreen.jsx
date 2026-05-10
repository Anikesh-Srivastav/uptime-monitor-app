import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import ScreenLayout from '../components/templates/ScreenLayout';
import { useTheme } from '../theme/ThemeContext';
import { radius, shadow, spacing, typography } from '../theme/tokens';

// ── SVG Icons ────────────────────────────────────────────────────────────────

function IcMoon({ c }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function IcSun({ c }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="5" stroke={c} strokeWidth="2" />
      <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function IcBell({ c }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function IcClock({ c }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2" />
      <Path d="M12 6v6l4 2" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function IcGlobe({ c }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2" />
      <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke={c} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function IcUser({ c }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="7" r="4" stroke={c} strokeWidth="2" />
    </Svg>
  );
}

function IcKey({ c }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="7.5" cy="15.5" r="4.5" stroke={c} strokeWidth="2" />
      <Path d="M21 2l-9.6 9.6M15.5 7.5l3 3L21 8l-3-3"
        stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function IcLogOut({ c }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 17l5-5-5-5M21 12H9"
        stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function IcChevron({ c }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Icon badge ────────────────────────────────────────────────────────────────

function IconBadge({ bg, children }) {
  return (
    <View style={[styles.iconBadge, { backgroundColor: bg }]}>
      <View pointerEvents="none">{children}</View>
    </View>
  );
}

// ── Row components ────────────────────────────────────────────────────────────

function SettingsRow({ iconBg, icon, title, subtitle, right, theme, danger }) {
  return (
    <View style={styles.row}>
      <IconBadge bg={iconBg}>{icon}</IconBadge>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: danger ? theme.dangerText : theme.textPrimary }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
      {right ?? <IcChevron c={theme.textMuted} />}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <ScreenLayout>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>
      </View>

      {/* Appearance */}
      <Text style={[styles.groupLabel, { color: theme.textMuted }]}>APPEARANCE</Text>
      <View style={[styles.group, shadow.sm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <SettingsRow
          theme={theme}
          iconBg="#6366F1"
          icon={isDark ? <IcMoon c="#fff" /> : <IcSun c="#fff" />}
          title={isDark ? 'Dark Mode' : 'Light Mode'}
          subtitle={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          }
        />
      </View>

      {/* Monitoring */}
      <Text style={[styles.groupLabel, { color: theme.textMuted }]}>MONITORING</Text>
      <View style={[styles.group, shadow.sm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity activeOpacity={0.7}>
          <SettingsRow theme={theme} iconBg="#F59E0B" icon={<IcBell c="#fff" />}
            title="Notifications" subtitle="Alert preferences" />
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <TouchableOpacity activeOpacity={0.7}>
          <SettingsRow theme={theme} iconBg="#3B82F6" icon={<IcClock c="#fff" />}
            title="Check Interval" subtitle="Default: 1 minute" />
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <TouchableOpacity activeOpacity={0.7}>
          <SettingsRow theme={theme} iconBg="#10B981" icon={<IcGlobe c="#fff" />}
            title="Regions" subtitle="Monitor from 3 regions" />
        </TouchableOpacity>
      </View>

      {/* Account */}
      <Text style={[styles.groupLabel, { color: theme.textMuted }]}>ACCOUNT</Text>
      <View style={[styles.group, shadow.sm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity activeOpacity={0.7}>
          <SettingsRow theme={theme} iconBg="#8B5CF6" icon={<IcUser c="#fff" />}
            title="Profile" subtitle="Manage your account" />
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <TouchableOpacity activeOpacity={0.7}>
          <SettingsRow theme={theme} iconBg="#F59E0B" icon={<IcKey c="#fff" />}
            title="API Keys" subtitle="Manage integrations" />
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <TouchableOpacity activeOpacity={0.7}>
          <SettingsRow theme={theme} iconBg="#EF4444" icon={<IcLogOut c="#fff" />}
            title="Sign Out" danger />
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: theme.textMuted }]}>Uptime Monitor v1.0.0</Text>
    </ScreenLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: { paddingTop: spacing.xs, marginBottom: spacing.lg },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  groupLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  group: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: typography.body,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: typography.small,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.lg + 34 + spacing.md,
  },
  version: {
    textAlign: 'center',
    fontSize: typography.small,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
});
