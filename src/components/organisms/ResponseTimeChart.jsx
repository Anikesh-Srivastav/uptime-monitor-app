import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function dayLabel(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function shortLabel(iso) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export default function ResponseTimeChart({ history }) {
  const { theme } = useTheme();
  const [activeIdx, setActiveIdx] = useState(null);

  const values = history.map(p => p.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;
  const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length);
  const CHART_H = 96;
  const accent = theme.isDark ? '#818CF8' : '#4361EE';
  const mid = Math.floor(values.length / 2);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Response Time</Text>
          <Text style={[styles.avg, { color: theme.textSecondary }]}>
            {avg}ms avg · last {values.length} days
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.accentLight }]}>
          <Text style={[styles.badgeText, { color: theme.accentText }]}>
            {values.length}D
          </Text>
        </View>
      </View>

      {/* Tap tooltip */}
      <View style={styles.tooltipArea}>
        {activeIdx !== null ? (
          <View style={[styles.tooltip, { backgroundColor: accent + '12', borderColor: accent + '28' }]}>
            <Text style={[styles.tooltipDate, { color: theme.textSecondary }]}>
              {dayLabel(history[activeIdx].time)}
            </Text>
            <Text style={[styles.tooltipVal, { color: accent }]}>
              {values[activeIdx]}ms
            </Text>
          </View>
        ) : (
          <Text style={[styles.tapHint, { color: theme.textMuted }]}>Tap a bar to inspect</Text>
        )}
      </View>

      {/* Bar chart */}
      <View style={[styles.bars, { height: CHART_H }]}>
        {values.map((val, i) => {
          const heightRatio = (val - minVal) / range;
          const barH = Math.max(8, heightRatio * (CHART_H - 12)) + 8;
          const isActive = i === activeIdx;
          return (
            <TouchableOpacity
              key={i}
              style={styles.barCol}
              activeOpacity={0.7}
              onPress={() => setActiveIdx(prev => (prev === i ? null : i))}
            >
              <View
                style={[
                  styles.bar,
                  {
                    height: barH,
                    backgroundColor: isActive ? accent : accent + '44',
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Axis */}
      <View style={styles.axis}>
        <Text style={[styles.axisLabel, { color: theme.textMuted }]}>
          {shortLabel(history[0].time)}
        </Text>
        <Text style={[styles.axisLabel, { color: theme.textMuted }]}>
          {shortLabel(history[mid].time)}
        </Text>
        <Text style={[styles.axisLabel, { color: theme.textMuted }]}>
          {shortLabel(history[values.length - 1].time)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: { fontSize: typography.subtitle, fontWeight: '700' },
  avg: { fontSize: typography.small, marginTop: 2 },
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: { fontSize: typography.caption, fontWeight: '800', letterSpacing: 0.5 },
  tooltipArea: {
    height: 32,
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  tooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  tooltipDate: { fontSize: typography.small },
  tooltipVal: { fontSize: typography.bodyLg, fontWeight: '700' },
  tapHint: { fontSize: typography.caption, textAlign: 'center' },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  barCol: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  axisLabel: { fontSize: typography.caption },
});
