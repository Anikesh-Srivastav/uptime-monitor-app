import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSessions, deleteSession, deleteAllSessions } from '../api/authApi';
import { QUERY_KEYS } from '../constants/queryKeys';
import { useAuthStore } from '../store/authStore';
import { normalizeError } from '../utils/errorNormalizer';

export function useSessions() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.sessions,
    queryFn: async () => {
      const res = await getSessions();
      return res.data;
    },
    staleTime: 60_000,
  });

  const revokeSession = useMutation({
    mutationFn: (sessionId) => deleteSession(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions }),
    onError: (err) => normalizeError(err),
  });

  const revokeAllSessions = useMutation({
    mutationFn: () => deleteAllSessions(),
    onSuccess: () => logout(),
  });

  return {
    sessions: data ?? [],
    isLoading,
    isError,
    error: isError ? normalizeError(error).message : null,
    refetch,
    revokeSession: revokeSession.mutateAsync,
    revokeAllSessions: revokeAllSessions.mutateAsync,
    isRevoking: revokeSession.isPending,
    isRevokingAll: revokeAllSessions.isPending,
  };
}
