import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, typography } from '../../theme/tokens';

export default function NoteItem({ note }) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
        <Text style={styles.initials}>{note.initials}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{note.author}</Text>
          <Text style={[styles.time, { color: theme.textMuted }]}>{note.timeAgo}</Text>
        </View>
        <View style={[styles.bubble, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <Text style={[styles.message, { color: theme.textSecondary }]}>{note.message}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: { color: '#fff', fontSize: typography.small, fontWeight: '700' },
  body: { flex: 1, gap: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: typography.bodyLg, fontWeight: '600' },
  time: { fontSize: typography.small },
  bubble: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  message: { fontSize: typography.body, lineHeight: 20 },
});
