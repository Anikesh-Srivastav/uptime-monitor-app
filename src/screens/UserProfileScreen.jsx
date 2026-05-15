import { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import BackButton from '../components/atoms/BackButton';
import { radius, shadow, spacing, typography } from '../theme/tokens';

function FormField({ label, value, onChangeText, placeholder, keyboardType, autoCapitalize, theme }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        style={[
          styles.input,
          { backgroundColor: theme.surfaceSecondary, borderColor: theme.border, color: theme.textPrimary },
        ]}
      />
    </View>
  );
}

export default function UserProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);

  const hasChanges = name.trim() !== (user?.name ?? '');

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const res = await updateUserProfile({ name: name.trim() });
      const updated = res.data?.data ?? res.data;
      if (updated) setUser({ ...user, ...updated });
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message ?? 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  }, [name, user, setUser]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[styles.title, { color: theme.textPrimary }]}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!hasChanges || saving}
          style={[
            styles.saveBtn,
            { backgroundColor: theme.accent },
            (!hasChanges || saving) && { opacity: 0.5 },
          ]}
        >
          {saving
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.saveBtnText}>Save</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar placeholder */}
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: theme.accent + '22' }]}>
            <Text style={[styles.avatarInitials, { color: theme.accent }]}>
              {(user?.name ?? 'U').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={[styles.avatarName, { color: theme.textPrimary }]}>{user?.name ?? 'User'}</Text>
            <Text style={[styles.avatarEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
          </View>
        </View>

        {/* Form */}
        <View style={[styles.card, shadow.sm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <FormField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            theme={theme}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <FormField
            label="Email"
            value={user?.email ?? ''}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            theme={theme}
          />
          <Text style={[styles.emailNote, { color: theme.textMuted }]}>
            Email address cannot be changed here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  title: { flex: 1, fontSize: typography.title, fontWeight: '700' },
  saveBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    minWidth: 60,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: typography.body },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { fontSize: 24, fontWeight: '800' },
  avatarInfo: { gap: 4 },
  avatarName: { fontSize: typography.subtitle, fontWeight: '700' },
  avatarEmail: { fontSize: typography.body },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fieldGroup: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  fieldLabel: { fontSize: typography.caption, fontWeight: '700', letterSpacing: 0.5 },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.body,
  },
  divider: { height: StyleSheet.hairlineWidth },
  emailNote: {
    fontSize: typography.small,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
});
