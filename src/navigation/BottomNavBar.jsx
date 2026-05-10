import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Line } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { NAV_HEIGHT, radius, shadow } from '../theme/tokens';

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconDashboard({ size, color, active }) {
  const fill = active ? color : 'none';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="8" height="8" rx="2" fill={fill} stroke={color} strokeWidth="1.8" />
      <Rect x="13" y="3" width="8" height="8" rx="2" fill={fill} stroke={color} strokeWidth="1.8" />
      <Rect x="3" y="13" width="8" height="8" rx="2" fill={fill} stroke={color} strokeWidth="1.8" />
      <Rect x="13" y="13" width="8" height="8" rx="2" fill={fill} stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

function IconMonitors({ size, color, active }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill={active ? color + '22' : 'none'} />
      <Circle cx="12" cy="12" r="3.5" fill={color} />
    </Svg>
  );
}

function IconAnalytics({ size, color, active }) {
  const fill = active ? color : 'none';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3"   y="14" width="5" height="7" rx="1.5" fill={fill} stroke={color} strokeWidth="1.8" />
      <Rect x="9.5" y="9"  width="5" height="12" rx="1.5" fill={fill} stroke={color} strokeWidth="1.8" />
      <Rect x="16"  y="4"  width="5" height="17" rx="1.5" fill={fill} stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

function IconLogs({ size, color, active }) {
  const sw = active ? 2.2 : 1.8;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="4" y1="7"  x2="20" y2="7"  stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="4" y1="17" x2="14" y2="17" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </Svg>
  );
}

function IconSettings({ size, color, active, bg }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="3" y1="6"  x2="21" y2="6"  stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="8"  cy="6"  r="3" fill={bg} stroke={color} strokeWidth="1.8" />
      <Circle cx="16" cy="12" r="3" fill={bg} stroke={color} strokeWidth="1.8" />
      <Circle cx="11" cy="18" r="3" fill={bg} stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { name: 'Dashboard', Icon: IconDashboard },
  { name: 'Monitors',  Icon: IconMonitors  },
  { name: 'Analytics', Icon: IconAnalytics },
  { name: 'Logs',      Icon: IconLogs      },
  { name: 'Settings',  Icon: IconSettings  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function BottomNavBar({ state, navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 8) + 12;

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]} pointerEvents="box-none">
      <View style={[styles.pill, shadow.lg, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { Icon, name } = NAV_ITEMS[index] ?? { name: route.name, Icon: IconMonitors };
          const color = isFocused ? theme.navTint : theme.navInactive;

          function onPress() {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityLabel={name}
            >
              <View style={[styles.iconWrap, isFocused && { backgroundColor: theme.navTint + '18', borderRadius: 12 }]}>
                {/* pointerEvents="none" prevents SVG from eating the tap */}
                <View pointerEvents="none">
                  <Icon size={22} color={color} active={isFocused} bg={theme.surface} />
                </View>
              </View>
              <Text style={[styles.label, { color }]} numberOfLines={1}>{name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
  },
  pill: {
    height: NAV_HEIGHT,
    borderRadius: radius.xl + 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 4,
  },
  iconWrap: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
