import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';
import AnimatedChartSheet from './AnimatedChartSheet';

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
  const [sheetOpen, setSheetOpen] = useState(false);

  const values = history.map(p => p.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;
  const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length);
  const CHART_H = 96;
  const accent = theme.isDark ? '#818CF8' : '#4361EE';
  const mid = Math.floor(values.length / 2);

  return (
    <>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Response Time</Text>
            <Text style={[styles.avg, { color: theme.textSecondary }]}>
              {avg}ms avg · last {values.length} days
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.badge, { backgroundColor: theme.accentLight }]}>
              <Text style={[styles.badgeText, { color: theme.accentText }]}>
                {values.length}D
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.expandBtn, { backgroundColor: accent + '15', borderColor: accent + '30' }]}
              activeOpacity={0.7}
              onPress={() => setSheetOpen(true)}
            >
              <View pointerEvents="none">
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </TouchableOpacity>
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

      {/* Expanded sheet */}
      <AnimatedChartSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <ResponseTimeExpanded history={history} accent={accent} theme={theme} />
      </AnimatedChartSheet>
    </>
  );
}

function ResponseTimeExpanded({ history, accent, theme }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const values = history.map(p => p.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;
  const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length);
  const CHART_H = 180;

  const sorted = [...values].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? maxVal;

  const prevHalf = values.slice(0, Math.floor(values.length / 2));
  const currHalf = values.slice(Math.floor(values.length / 2));
  const prevAvg = Math.round(prevHalf.reduce((s, v) => s + v, 0) / prevHalf.length);
  const currAvg = Math.round(currHalf.reduce((s, v) => s + v, 0) / currHalf.length);
  const trendPct = prevAvg ? Math.round(((currAvg - prevAvg) / prevAvg) * 100) : 0;
  const trendUp = trendPct > 0;

  return (
    <ScrollView
      style={styles.sheetScroll}
      contentContainerStyle={styles.sheetContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Sheet title */}
      <View style={styles.sheetHeader}>
        <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>Response Time</Text>
        <View style={[styles.trendPill, { backgroundColor: trendUp ? '#EF444418' : '#10B98118' }]}>
          <Text style={[styles.trendText, { color: trendUp ? '#EF4444' : '#10B981' }]}>
            {trendUp ? '▲' : '▼'} {Math.abs(trendPct)}% vs prev
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatPill label="MIN" value={`${minVal}ms`} color="#10B981" theme={theme} />
        <StatPill label="AVG" value={`${avg}ms`} color={accent} theme={theme} />
        <StatPill label="MAX" value={`${maxVal}ms`} color="#EF4444" theme={theme} />
        <StatPill label="P95" value={`${p95}ms`} color="#F59E0B" theme={theme} />
      </View>

      {/* Tooltip */}
      <View style={[styles.tooltipArea, { height: 36 }]}>
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

      {/* Large bar chart */}
      <View style={[styles.bars, { height: CHART_H }]}>
        {values.map((val, i) => {
          const heightRatio = (val - minVal) / range;
          const barH = Math.max(10, heightRatio * (CHART_H - 16)) + 10;
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

      {/* Full axis */}
      <View style={styles.fullAxis}>
        {history.map((p, i) =>
          i % Math.ceil(history.length / 6) === 0 ? (
            <Text key={i} style={[styles.axisLabel, { color: theme.textMuted }]}>
              {shortLabel(p.time)}
            </Text>
          ) : null
        )}
      </View>

      {/* Y-axis reference lines label */}
      <View style={[styles.divider, { borderColor: theme.border }]} />

      {/* Slowest days */}
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Slowest days</Text>
      {[...history]
        .map((p, i) => ({ ...p, value: values[i], i }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .map((p, idx) => (
          <View key={idx} style={[styles.slowRow, { borderColor: theme.border }]}>
            <Text style={[styles.slowDate, { color: theme.textSecondary }]}>
              {dayLabel(p.time)}
            </Text>
            <View style={[styles.slowBar, { backgroundColor: accent + '18', flex: p.value / maxVal }]} />
            <Text style={[styles.slowVal, { color: accent }]}>{p.value}ms</Text>
          </View>
        ))}
    </ScrollView>
  );
}

function StatPill({ label, value, color, theme }) {
  return (
    <View style={[styles.statPill, { backgroundColor: color + '12', borderColor: color + '28' }]}>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: { fontSize: typography.subtitle, fontWeight: '700' },
  avg: { fontSize: typography.small, marginTop: 2 },
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: { fontSize: typography.caption, fontWeight: '800', letterSpacing: 0.5 },
  expandBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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

  // Sheet styles
  sheetScroll: { flex: 1 },
  sheetContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sheetTitle: { fontSize: typography.title, fontWeight: '700' },
  trendPill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  trendText: { fontSize: typography.caption, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  statPill: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  statValue: { fontSize: typography.small, fontWeight: '800' },
  fullAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.small,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  slowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
  },
  slowDate: { fontSize: typography.small, width: 68 },
  slowBar: { height: 6, borderRadius: 3, minWidth: 8 },
  slowVal: { fontSize: typography.small, fontWeight: '700', marginLeft: 'auto' },
});
