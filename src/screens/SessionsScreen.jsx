import { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useSessions } from '../hooks/useSessions';
import { NAV_HEIGHT, shadow, spacing, typography, radius } from '../theme/tokens';

const PLATFORM_ICONS = { ios: '🍎', android: '🤖', web: '🌐' };

function SessionCard({ session, onRevoke, isRevoking, isCurrent }) {
  const { theme } = useTheme();
  const icon = PLATFORM_ICONS[session.platform] ?? '📱';

  const handleRevoke = () => {
    Alert.alert(
      'Revoke session?',
      `This will sign out the device: ${session.deviceName ?? 'Unknown device'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Revoke', style: 'destructive', onPress: () => onRevoke(session.id) },
      ],
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }, shadow.sm]}>
      <View style={styles.cardLeft}>
        <Text style={styles.platformIcon}>{icon}</Text>
        <View style={styles.cardInfo}>
          <View style={styles.cardNameRow}>
            <Text style={[styles.deviceName, { color: theme.textPrimary }]}>
              {session.deviceName ?? 'Unknown device'}
            </Text>
            {isCurrent && (
              <View style={[styles.currentBadge, { backgroundColor: theme.successLight }]}>
                <Text style={[styles.currentBadgeText, { color: theme.successText }]}>
                  This device
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.deviceMeta, { color: theme.textSecondary }]}>
            {session.platform ?? 'Unknown'} • {session.location ?? 'Unknown location'}
          </Text>
          <Text style={[styles.deviceMeta, { color: theme.textMuted }]}>
            Last active: {session.lastActiveAt ?? 'Unknown'}
          </Text>
        </View>
      </View>

      {!isCurrent && (
        <TouchableOpacity
          onPress={handleRevoke}
          disabled={isRevoking}
          style={[styles.revokeBtn, { borderColor: theme.dangerText }]}
        >
          {isRevoking ? (
            <ActivityIndicator size="small" color={theme.dangerText} />
          ) : (
            <Text style={[styles.revokeBtnText, { color: theme.dangerText }]}>Revoke</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function SessionsScreen({ navigation }) {
  const { theme } = useTheme();
  const { sessions, isLoading, error, refetch, revokeSession, revokeAllSessions, isRevoking, isRevokingAll } =
    useSessions();

  const currentSessionId = sessions.find((s) => s.isCurrent)?.id;

  const handleRevokeAll = () => {
    Alert.alert(
      'Sign out everywhere?',
      'This will sign you out of all other devices. You will be redirected to login.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out everywhere',
          style: 'destructive',
          onPress: () => revokeAllSessions(),
        },
      ],
    );
  };

  const renderSession = useCallback(
    ({ item }) => (
      <SessionCard
        session={item}
        onRevoke={revokeSession}
        isRevoking={isRevoking}
        isCurrent={item.id === currentSessionId || item.isCurrent}
      />
    ),
    [revokeSession, isRevoking, currentSessionId],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: theme.accentText }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Active Sessions</Text>
        <View style={{ width: 48 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.dangerText }]}>{error}</Text>
          <TouchableOpacity onPress={refetch} style={[styles.retryBtn, { borderColor: theme.border }]}>
            <Text style={{ color: theme.textPrimary }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlashList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          estimatedItemSize={90}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              {sessions.length} device{sessions.length !== 1 ? 's' : ''} signed in
            </Text>
          }
          ListFooterComponent={
            sessions.length > 1 ? (
              <TouchableOpacity
                style={[styles.revokeAllBtn, { borderColor: theme.dangerText }]}
                onPress={handleRevokeAll}
                disabled={isRevokingAll}
              >
                {isRevokingAll ? (
                  <ActivityIndicator color={theme.dangerText} />
                ) : (
                  <Text style={[styles.revokeAllText, { color: theme.dangerText }]}>
                    Sign out all other devices
                  </Text>
                )}
              </TouchableOpacity>
            ) : null
          }
          onRefresh={refetch}
          refreshing={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backText: { fontSize: typography.body, fontWeight: '600', width: 48 },
  title: { fontSize: typography.subtitle, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  errorText: { fontSize: typography.body },
  retryBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderWidth: 1, borderRadius: radius.sm },
  listContent: { padding: spacing.lg, paddingBottom: NAV_HEIGHT + spacing.xl },
  sectionLabel: { fontSize: typography.small, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, flex: 1 },
  platformIcon: { fontSize: 28, marginTop: 2 },
  cardInfo: { flex: 1, gap: 3 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  deviceName: { fontSize: typography.bodyLg, fontWeight: '600' },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  currentBadgeText: { fontSize: typography.caption, fontWeight: '700' },
  deviceMeta: { fontSize: typography.small },
  revokeBtn: {
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  revokeBtnText: { fontSize: typography.small, fontWeight: '700' },
  revokeAllBtn: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  revokeAllText: { fontSize: typography.body, fontWeight: '700' },
});
