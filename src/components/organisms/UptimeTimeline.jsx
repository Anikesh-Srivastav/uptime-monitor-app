import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Polyline, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';
import AnimatedChartSheet from './AnimatedChartSheet';

const STATUS_COLOR = {
  up: '#10B981',
  degraded: '#F59E0B',
  down: '#EF4444',
  'no-data': null,
};

const STATUS_LABEL = {
  up: 'Up',
  degraded: 'Degraded',
  down: 'Down',
  'no-data': 'No data',
};

function formatDowntime(mins) {
  if (!mins) return null;
  if (mins < 60) return `${mins}m downtime`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m downtime` : `${h}h downtime`;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function dateForIndex(i, total) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (total - 1 - i));
  return d;
}

function formatDate(d) {
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function shortDate(d) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function UptimeTimeline({ history }) {
  const { theme } = useTheme();
  const [activeIdx, setActiveIdx] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const days = history.length;

  const uptimePct = (() => {
    const valid = history.filter(d => d.status !== 'no-data');
    if (!valid.length) return 100;
    const up = valid.filter(d => d.status === 'up').length;
    return ((up / valid.length) * 100).toFixed(1);
  })();

  const activeDay = activeIdx !== null ? history[activeIdx] : null;
  const activeColor = activeDay ? (STATUS_COLOR[activeDay.status] || theme.border) : null;
  const activeDate = activeIdx !== null ? dateForIndex(activeIdx, days) : null;
  const activeDowntime = activeDay?.downtimeMins ? formatDowntime(activeDay.downtimeMins) : null;

  return (
    <>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {days}-Day Uptime
          </Text>
          <View style={styles.headerRight}>
            <View style={[styles.pctBadge, { backgroundColor: theme.successLight }]}>
              <Text style={[styles.pctText, { color: theme.successText }]}>{uptimePct}%</Text>
            </View>
            <TouchableOpacity
              style={[styles.expandBtn, { backgroundColor: '#10B98115', borderColor: '#10B98130' }]}
              activeOpacity={0.7}
              onPress={() => setSheetOpen(true)}
            >
              <View pointerEvents="none">
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="#10B981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <LegendDot color="#10B981" label="Up" />
          <LegendDot color="#F59E0B" label="Degraded" />
          <LegendDot color="#EF4444" label="Down" />
        </View>

        {/* Tooltip */}
        <View style={[styles.tooltipArea, activeDowntime && styles.tooltipAreaTall]}>
          {activeDay ? (
            <View style={[styles.tooltip, { backgroundColor: activeColor + '12', borderColor: activeColor + '30' }]}>
              <View style={styles.tooltipRow}>
                <Text style={[styles.tooltipDate, { color: theme.textSecondary }]}>
                  {formatDate(activeDate)}
                </Text>
                <View style={styles.tooltipStatus}>
                  <View style={[styles.tooltipDot, { backgroundColor: activeColor }]} />
                  <Text style={[styles.tooltipLabel, { color: activeColor }]}>
                    {STATUS_LABEL[activeDay.status]}
                  </Text>
                </View>
              </View>
              {activeDowntime ? (
                <View style={[styles.downtimeRow, { borderTopColor: activeColor + '25' }]}>
                  <View pointerEvents="none">
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path d="M12 5v14M19 12l-7 7-7-7" stroke={activeColor} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                  <Text style={[styles.downtimeText, { color: activeColor }]}>
                    {activeDowntime}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <Text style={[styles.tapHint, { color: theme.textMuted }]}>Tap a bar · expand icon to zoom</Text>
          )}
        </View>

        {/* Bars */}
        <View style={styles.bars}>
          {history.map((day, i) => {
            const color = STATUS_COLOR[day.status] || theme.border;
            const isActive = i === activeIdx;
            return (
              <TouchableOpacity
                key={i}
                style={styles.barBtn}
                activeOpacity={0.7}
                onPress={() => setActiveIdx(prev => (prev === i ? null : i))}
              >
                <View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: color,
                      borderRadius: radius.sm / 2,
                      opacity: activeIdx !== null && !isActive ? 0.4 : 1,
                      borderWidth: isActive ? 2 : 0,
                      borderColor: isActive ? '#fff' : 'transparent',
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Axis */}
        <View style={styles.axisRow}>
          <Text style={[styles.axisLabel, { color: theme.textMuted }]}>{days}d ago</Text>
          <Text style={[styles.axisLabel, { color: theme.textMuted }]}>Today</Text>
        </View>
      </View>

      {/* Expanded sheet */}
      <AnimatedChartSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <UptimeExpanded history={history} theme={theme} />
      </AnimatedChartSheet>
    </>
  );
}

function UptimeExpanded({ history, theme }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const days = history.length;

  const counts = history.reduce(
    (acc, d) => {
      if (d.status === 'up') acc.up++;
      else if (d.status === 'degraded') acc.degraded++;
      else if (d.status === 'down') acc.down++;
      return acc;
    },
    { up: 0, degraded: 0, down: 0 },
  );

  const valid = history.filter(d => d.status !== 'no-data');
  const uptimePct = valid.length
    ? ((valid.filter(d => d.status === 'up').length / valid.length) * 100).toFixed(2)
    : '100.00';

  const incidents = history
    .map((d, i) => ({ ...d, i }))
    .filter(d => d.status === 'down' || d.status === 'degraded')
    .reverse();

  const activeDay = activeIdx !== null ? history[activeIdx] : null;
  const activeColor = activeDay ? (STATUS_COLOR[activeDay.status] || theme.border) : null;
  const activeDate = activeIdx !== null ? dateForIndex(activeIdx, days) : null;

  return (
    <ScrollView
      style={styles.sheetScroll}
      contentContainerStyle={styles.sheetContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Sheet title */}
      <View style={styles.sheetHeader}>
        <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>{days}-Day Uptime</Text>
        <View style={styles.uptimeBig}>
          <Text style={[styles.uptimePct, { color: '#10B981' }]}>{uptimePct}%</Text>
        </View>
      </View>

      {/* Status breakdown pills */}
      <View style={styles.statsRow}>
        <StatusCountPill label="UP" count={counts.up} color="#10B981" theme={theme} />
        <StatusCountPill label="DEGRADED" count={counts.degraded} color="#F59E0B" theme={theme} />
        <StatusCountPill label="DOWN" count={counts.down} color="#EF4444" theme={theme} />
      </View>

      {/* Tooltip */}
      <View style={[styles.tooltipArea, { height: 36, marginBottom: spacing.sm }]}>
        {activeDay ? (
          <View style={[styles.tooltip, { backgroundColor: activeColor + '12', borderColor: activeColor + '30' }]}>
            <View style={styles.tooltipRow}>
              <Text style={[styles.tooltipDate, { color: theme.textSecondary }]}>
                {formatDate(activeDate)}
              </Text>
              <View style={styles.tooltipStatus}>
                <View style={[styles.tooltipDot, { backgroundColor: activeColor }]} />
                <Text style={[styles.tooltipLabel, { color: activeColor }]}>
                  {STATUS_LABEL[activeDay.status]}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={[styles.tapHint, { color: theme.textMuted }]}>Tap a bar to inspect</Text>
        )}
      </View>

      {/* Large bars */}
      <View style={[styles.bars, { height: 80 }]}>
        {history.map((day, i) => {
          const color = STATUS_COLOR[day.status] || theme.border;
          const isActive = i === activeIdx;
          return (
            <TouchableOpacity
              key={i}
              style={styles.barBtn}
              activeOpacity={0.7}
              onPress={() => setActiveIdx(prev => (prev === i ? null : i))}
            >
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: color,
                    borderRadius: radius.sm / 2,
                    opacity: activeIdx !== null && !isActive ? 0.35 : 1,
                    borderWidth: isActive ? 2 : 0,
                    borderColor: isActive ? '#fff' : 'transparent',
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.axisRow}>
        <Text style={[styles.axisLabel, { color: theme.textMuted }]}>{days}d ago</Text>
        <Text style={[styles.axisLabel, { color: theme.textMuted }]}>Today</Text>
      </View>

      {incidents.length > 0 && (
        <>
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            Incidents ({incidents.length})
          </Text>
          {incidents.map((inc, idx) => {
            const d = dateForIndex(inc.i, days);
            const color = STATUS_COLOR[inc.status];
            const dt = inc.downtimeMins ? formatDowntime(inc.downtimeMins) : null;
            return (
              <View key={idx} style={[styles.incidentRow, { borderColor: theme.border }]}>
                <View style={[styles.incidentDot, { backgroundColor: color }]} />
                <View style={styles.incidentInfo}>
                  <Text style={[styles.incidentDate, { color: theme.textPrimary }]}>
                    {shortDate(d)}
                  </Text>
                  {dt && (
                    <Text style={[styles.incidentDowntime, { color: theme.textMuted }]}>{dt}</Text>
                  )}
                </View>
                <View style={[styles.incidentBadge, { backgroundColor: color + '15' }]}>
                  <Text style={[styles.incidentStatus, { color }]}>
                    {STATUS_LABEL[inc.status]}
                  </Text>
                </View>
              </View>
            );
          })}
        </>
      )}

      {incidents.length === 0 && (
        <>
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <View style={styles.noIncidents}>
            <View style={styles.checkCircle}>
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth={1.8} />
                <Path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={[styles.noIncidentsText, { color: '#10B981' }]}>
              No incidents in the last {days} days
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function StatusCountPill({ label, count, color, theme }) {
  return (
    <View style={[styles.statusPill, { backgroundColor: color + '12', borderColor: color + '28' }]}>
      <Text style={[styles.statusPillLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.statusPillCount, { color }]}>{count}d</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: { fontSize: typography.subtitle, fontWeight: '700' },
  pctBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  pctText: { fontSize: typography.small, fontWeight: '800' },
  expandBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: { flexDirection: 'row', gap: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: typography.small, color: '#6B7280', fontWeight: '500' },
  tooltipArea: {
    height: 32,
    justifyContent: 'center',
  },
  tooltipAreaTall: {
    height: 58,
  },
  tooltip: {
    borderRadius: radius.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  tooltipDate: { fontSize: typography.small },
  tooltipStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tooltipDot: { width: 7, height: 7, borderRadius: 4 },
  tooltipLabel: { fontSize: typography.small, fontWeight: '700' },
  downtimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
  },
  downtimeIcon: { fontSize: 11, fontWeight: '700' },
  downtimeText: { fontSize: typography.small, fontWeight: '700' },
  tapHint: { fontSize: typography.caption, textAlign: 'center' },
  bars: {
    flexDirection: 'row',
    gap: 3,
    height: 56,
    alignItems: 'stretch',
  },
  barBtn: { flex: 1 },
  bar: { flex: 1 },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisLabel: { fontSize: typography.caption, fontWeight: '500' },

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
  uptimeBig: { alignItems: 'flex-end' },
  uptimePct: { fontSize: typography.titleLg, fontWeight: '800' },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  statusPill: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  statusPillLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.6 },
  statusPillCount: { fontSize: typography.subtitle, fontWeight: '800' },
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
  incidentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  incidentDot: { width: 10, height: 10, borderRadius: 5 },
  incidentInfo: { flex: 1 },
  incidentDate: { fontSize: typography.body, fontWeight: '600' },
  incidentDowntime: { fontSize: typography.caption, marginTop: 1 },
  incidentBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  incidentStatus: { fontSize: typography.caption, fontWeight: '700' },
  noIncidents: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B98118',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noIncidentsText: { fontSize: typography.body, fontWeight: '600' },
});
