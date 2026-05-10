import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Input from '../atoms/Input';
import PrimaryButton from '../atoms/PrimaryButton';
import { radius, shadow, spacing, typography } from '../../theme/tokens';

export default function AddMonitorModal({ visible, onClose, onAdd }) {
  const { theme } = useTheme();
  const [url, setUrl] = useState('');
  const [paths, setPaths] = useState('');

  function handleAdd() {
    if (!url.trim()) return;
    const endpointPaths = paths
      .split(',')
      .map(path => path.trim())
      .filter(Boolean);

    onAdd({
      url: url.trim(),
      paths: endpointPaths,
    });
    setUrl('');
    setPaths('');
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, shadow.lg, { backgroundColor: theme.surface }]}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Add Website</Text>
                <TouchableOpacity onPress={onClose} hitSlop={8} style={styles.closeBtn}>
                  <Text style={[styles.closeIcon, { color: theme.textSecondary }]}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.body}>
                <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>
                  Website URL <Text style={{ color: theme.danger }}>*</Text>
                </Text>
                <Input
                  value={url}
                  onChangeText={setUrl}
                  placeholder="example.com or https://example.com"
                  autoCapitalize="none"
                  keyboardType="url"
                  returnKeyType="done"
                  onSubmitEditing={handleAdd}
                />

                <Text style={[styles.fieldLabel, { color: theme.textPrimary, marginTop: spacing.md }]}>
                  Paths to monitor
                </Text>
                <Input
                  value={paths}
                  onChangeText={setPaths}
                  placeholder="/pricing, /login, /status"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleAdd}
                />
                <Text style={[styles.helperText, { color: theme.textSecondary }]}>
                  Optional. Add comma-separated paths to track multiple pages under the same domain.
                </Text>
              </View>

              <View style={styles.actions}>
                <PrimaryButton
                  label="Cancel"
                  variant="secondary"
                  onPress={onClose}
                  style={styles.actionBtn}
                />
                <PrimaryButton
                  label="Add"
                  variant="primary"
                  onPress={handleAdd}
                  disabled={!url.trim()}
                  style={styles.actionBtn}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  sheet: {
    width: '100%',
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: { fontSize: typography.titleLg, fontWeight: '700' },
  closeBtn: { padding: 4 },
  closeIcon: { fontSize: 18, fontWeight: '400' },
  divider: { height: 1 },
  body: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  fieldLabel: { fontSize: typography.bodyLg, fontWeight: '500' },
  helperText: { fontSize: typography.small, lineHeight: 18 },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  actionBtn: { flex: 1 },
});
