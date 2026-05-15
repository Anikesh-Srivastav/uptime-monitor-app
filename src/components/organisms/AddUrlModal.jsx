import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import Input from '../atoms/Input';
import PrimaryButton from '../atoms/PrimaryButton';
import { radius, shadow, spacing, typography } from '../../theme/tokens';

export default function AddUrlModal({ visible, onClose, onAdd, baseUrl, loading }) {
  const { theme } = useTheme();
  const [path, setPath] = useState('');
  const [error, setError] = useState('');

  function buildUrl(rawPath) {
    if (!baseUrl) return rawPath.trim();
    try {
      const base = new URL(/^https?:\/\//.test(baseUrl) ? baseUrl : `https://${baseUrl}`);
      const p = rawPath.trim().startsWith('/') ? rawPath.trim() : `/${rawPath.trim()}`;
      return `${base.origin}${p}`;
    } catch {
      return rawPath.trim();
    }
  }

  function handleAdd() {
    const trimmed = path.trim();
    if (!trimmed) {
      setError('Please enter a path or URL.');
      return;
    }
    setError('');
    const fullUrl = buildUrl(trimmed);
    onAdd(fullUrl);
  }

  function handleClose() {
    setPath('');
    setError('');
    onClose();
  }

  const origin = (() => {
    try {
      return new URL(/^https?:\/\//.test(baseUrl) ? baseUrl : `https://${baseUrl}`).origin;
    } catch {
      return baseUrl ?? '';
    }
  })();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, shadow.lg, { backgroundColor: theme.surface }]}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Add URL</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  hitSlop={8}
                  style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
                >
                  <View pointerEvents="none">
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path d="M18 6L6 18M6 6l12 12" stroke={theme.textSecondary} strokeWidth={2} strokeLinecap="round" />
                    </Svg>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.body}>
                <Text style={[styles.hint, { color: theme.textSecondary }]}>
                  Add a path under{' '}
                  <Text style={{ color: theme.accent, fontWeight: '600' }}>{origin}</Text>
                  {' '}to monitor. Must be on the same domain.
                </Text>

                <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>
                  Path <Text style={{ color: theme.danger }}>*</Text>
                </Text>
                <Input
                  value={path}
                  onChangeText={(t) => { setPath(t); setError(''); }}
                  placeholder="/pricing, /login, /status"
                  autoCapitalize="none"
                  keyboardType="url"
                  returnKeyType="done"
                  onSubmitEditing={handleAdd}
                />
                {!!error && (
                  <Text style={[styles.error, { color: theme.danger ?? '#EF4444' }]}>{error}</Text>
                )}
                {!!path.trim() && (
                  <Text style={[styles.preview, { color: theme.textMuted }]}>
                    Will monitor: {buildUrl(path)}
                  </Text>
                )}
              </View>

              <View style={styles.actions}>
                <PrimaryButton
                  label="Cancel"
                  variant="secondary"
                  onPress={handleClose}
                  style={styles.actionBtn}
                />
                <PrimaryButton
                  label={loading ? 'Adding…' : 'Add URL'}
                  variant="primary"
                  onPress={handleAdd}
                  disabled={!path.trim() || loading}
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
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1 },
  body: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  hint: { fontSize: typography.small, lineHeight: 18, marginBottom: spacing.xs },
  fieldLabel: { fontSize: typography.bodyLg, fontWeight: '500' },
  error: { fontSize: typography.small },
  preview: { fontSize: typography.caption, lineHeight: 16 },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  actionBtn: { flex: 1 },
});
