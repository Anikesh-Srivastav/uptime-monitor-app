import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import NoteItem from '../molecules/NoteItem';
import IconCircle from '../atoms/IconCircle';
import { radius, spacing, typography } from '../../theme/tokens';

export default function TeamNotes({ notes: initialNotes }) {
  const { theme } = useTheme();
  const [notes, setNotes] = useState(initialNotes || []);
  const [text, setText] = useState('');

  function sendNote() {
    if (!text.trim()) return;
    setNotes(prev => [
      ...prev,
      {
        id: String(Date.now()),
        author: 'You',
        initials: 'YO',
        timeAgo: 'just now',
        message: text.trim(),
      },
    ]);
    setText('');
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <IconCircle size={36} backgroundColor={theme.accentLight}>
          <Text style={{ fontSize: 16 }}>💬</Text>
        </IconCircle>
        <Text style={[styles.title, { color: theme.textPrimary }]}>INTERNAL TEAM NOTES</Text>
      </View>

      {notes.map(note => (
        <NoteItem key={note.id} note={note} />
      ))}

      {notes.length === 0 && (
        <Text style={[styles.empty, { color: theme.textMuted }]}>No notes yet. Be the first!</Text>
      )}

      <View style={[styles.inputRow, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a team note..."
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.textPrimary }]}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={sendNote}
        />
        <TouchableOpacity
          onPress={sendNote}
          disabled={!text.trim()}
          style={[styles.sendBtn, { backgroundColor: theme.accent, opacity: text.trim() ? 1 : 0.5 }]}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: { fontSize: typography.small, fontWeight: '800', letterSpacing: 0.5 },
  empty: { fontSize: typography.body, textAlign: 'center', paddingVertical: spacing.lg },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  input: { flex: 1, fontSize: typography.body, paddingVertical: spacing.sm },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { color: '#fff', fontSize: 14 },
});
