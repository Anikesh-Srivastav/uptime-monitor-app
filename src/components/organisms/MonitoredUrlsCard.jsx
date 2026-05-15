import { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

const STATUS_LABELS = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Down',
};

export default function MonitoredUrlsCard({ endpoints = [], selectedEndpointId, onSelectEndpoint }) {
  const { theme } = useTheme();

  const statusColors = useMemo(
    () => ({
      healthy: {
        bg: theme.successLight,
        text: theme.successText,
      },
      degraded: {
        bg: theme.warningLight,
        text: theme.warningText,
      },
      down: {
        bg: theme.dangerLight,
        text: theme.dangerText,
      },
    }),
    [theme],
  );

  if (!endpoints.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Monitored URLs</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Tap a path to inspect that page
        </Text>
      </View>

      <View style={styles.list}>
        {endpoints.map((endpoint, index) => {
          const palette = statusColors[endpoint.status] || {
            bg: theme.accentLight,
            text: theme.accentText,
          };
          const isSelected = endpoint.id === selectedEndpointId;

          return (
            <TouchableOpacity
              key={endpoint.id ?? endpoint.monitoredUrlId ?? String(index)}
              activeOpacity={0.8}
              onPress={() => onSelectEndpoint(endpoint)}
              style={[
                styles.row,
                {
                  backgroundColor: isSelected ? theme.accentLight : theme.surfaceSecondary,
                  borderColor: isSelected ? theme.accent : theme.border,
                },
              ]}
            >
              <View style={styles.rowTop}>
                <View style={styles.copy}>
                  <Text style={[styles.path, { color: theme.textPrimary }]} numberOfLines={1}>
                    {endpoint.path}
                  </Text>
                  <Text style={[styles.fullUrl, { color: theme.textSecondary }]} numberOfLines={1}>
                    {endpoint.url}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: palette.bg }]}>
                  <Text style={[styles.badgeText, { color: palette.text }]}>
                    {STATUS_LABELS[endpoint.status] || endpoint.status}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: theme.textSecondary }]}>
                  Last check {endpoint.lastCheck}
                </Text>
                <Text style={[styles.meta, { color: theme.textSecondary }]}>
                  {endpoint.responseTime ? `${endpoint.responseTime}ms` : 'No response'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    gap: 2,
  },
  title: {
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: typography.small,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  path: {
    fontSize: typography.bodyLg,
    fontWeight: '700',
  },
  fullUrl: {
    fontSize: typography.small,
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
  },
  badgeText: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  meta: {
    fontSize: typography.small,
  },
});
