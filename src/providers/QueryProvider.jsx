import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Singleton — created once at module level so it survives hot-reloads in dev
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,          // 30 s — data is fresh without refetch
      gcTime: 5 * 60_000,         // 5 min — garbage collect unused cache
      retry: (failureCount, error) => {
        // Don't retry auth errors
        const status = error?.response?.status;
        if (status === 401 || status === 403) return false;
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export { queryClient };

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
