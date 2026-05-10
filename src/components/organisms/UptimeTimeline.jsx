import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

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

export default function UptimeTimeline({ history }) {
  const { theme } = useTheme();
  const [activeIdx, setActiveIdx] = useState(null);
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
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {days}-Day Uptime
        </Text>
        <View style={[styles.pctBadge, { backgroundColor: theme.successLight }]}>
          <Text style={[styles.pctText, { color: theme.successText }]}>{uptimePct}%</Text>
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
                <Text style={[styles.downtimeIcon, { color: activeColor }]}>↓</Text>
                <Text style={[styles.downtimeText, { color: activeColor }]}>
                  {activeDowntime}
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <Text style={[styles.tapHint, { color: theme.textMuted }]}>Tap a bar to inspect</Text>
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
  title: { fontSize: typography.subtitle, fontWeight: '700' },
  pctBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  pctText: { fontSize: typography.small, fontWeight: '800' },
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
});
