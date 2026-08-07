import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,          // 2 minutes
      gcTime: 1000 * 60 * 10,            // 10 minutes garbage collection
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        const err = error as { statusCode?: number };
        if (err?.statusCode === 401 || err?.statusCode === 403) return false;
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export { queryClient };
