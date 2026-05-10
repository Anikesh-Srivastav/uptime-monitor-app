import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import LogRow from '../molecules/LogRow';
import { radius, spacing, typography } from '../../theme/tokens';

const PAGE_SIZES = [10, 25, 50];

export default function LogsTable({ logs }) {
  const { theme } = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const totalPages = Math.ceil(logs.length / pageSize);
  const pageData = logs.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.toolbar}>
        <View style={styles.titleRow}>
          <View style={[styles.logIcon, { backgroundColor: theme.textPrimary }]}>
            <Text style={{ color: theme.surface, fontSize: 14 }}>≡</Text>
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>DETAILED LOGS</Text>
        </View>
        <View style={styles.toolbarActions}>
          <TouchableOpacity style={[styles.toolBtn, { borderColor: theme.border }]}>
            <Text style={[styles.toolBtnText, { color: theme.textSecondary }]}>↓ Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toolBtn, { borderColor: theme.border }]}>
            <Text style={[styles.toolBtnText, { color: theme.textSecondary }]}>≡ All Logs</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableHead}>
        {['TIME', 'STATUS', 'CODE', 'LATENCY', 'DETAILS'].map(col => (
          <Text
            key={col}
            style={[styles.headCell, { color: theme.textMuted, flex: col === 'DETAILS' ? 1 : 0 }]}
          >
            {col}
          </Text>
        ))}
      </View>

      {pageData.map((log, i) => (
        <LogRow key={log.id} log={log} isLast={i === pageData.length - 1} />
      ))}

      <View style={styles.pagination}>
        <Text style={[styles.pageInfo, { color: theme.textSecondary }]}>
          Page <Text style={{ fontWeight: '700', color: theme.textPrimary }}>{page + 1}</Text> of{' '}
          <Text style={{ fontWeight: '700', color: theme.textPrimary }}>{totalPages}</Text>
        </Text>

        <View style={styles.pageSizeContainer}>
          <TouchableOpacity
            style={[styles.sizeBtn, { borderColor: theme.border }]}
            onPress={() => setShowSizePicker(s => !s)}
          >
            <Text style={[styles.sizeBtnText, { color: theme.textPrimary }]}>
              Show {pageSize} ▾
            </Text>
          </TouchableOpacity>
          {showSizePicker && (
            <View style={[styles.sizePicker, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {PAGE_SIZES.map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => { setPageSize(s); setPage(0); setShowSizePicker(false); }}
                  style={[styles.sizeOption, { borderBottomColor: theme.border }]}
                >
                  <Text style={[styles.sizeOptionText, { color: theme.textPrimary }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.navBtns}>
        {[
          { label: '«', action: () => setPage(0), disabled: page === 0 },
          { label: '‹', action: () => setPage(p => Math.max(0, p - 1)), disabled: page === 0 },
          { label: '›', action: () => setPage(p => Math.min(totalPages - 1, p + 1)), disabled: page === totalPages - 1 },
          { label: '»', action: () => setPage(totalPages - 1), disabled: page === totalPages - 1 },
        ].map(({ label, action, disabled }) => (
          <TouchableOpacity
            key={label}
            onPress={action}
            disabled={disabled}
            style={[
              styles.navBtn,
              { borderColor: theme.border, backgroundColor: theme.surface },
              disabled && { opacity: 0.35 },
            ]}
          >
            <Text style={[styles.navBtnText, { color: theme.textPrimary }]}>{label}</Text>
          </TouchableOpacity>
        ))}
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
  toolbar: { gap: spacing.md, marginBottom: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logIcon: { width: 30, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: typography.small, fontWeight: '800', letterSpacing: 0.5 },
  toolbarActions: { flexDirection: 'row', gap: spacing.sm },
  toolBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  toolBtnText: { fontSize: typography.small, fontWeight: '500' },
  tableHead: {
    flexDirection: 'row',
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headCell: {
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    width: 64,
    textAlign: 'left',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    position: 'relative',
  },
  pageInfo: { fontSize: typography.body },
  pageSizeContainer: { position: 'relative' },
  sizeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  sizeBtnText: { fontSize: typography.body, fontWeight: '500' },
  sizePicker: {
    position: 'absolute',
    right: 0,
    bottom: '110%',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 10,
    minWidth: 80,
  },
  sizeOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  sizeOptionText: { fontSize: typography.body },
  navBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: { fontSize: typography.bodyLg, fontWeight: '600' },
});
