import { QueryClient } from '@tanstack/react-query';

// Configure React Query with optimized defaults
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache data for 5 minutes before considering it stale
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 10 minutes before garbage collection (gcTime = v5 name for cacheTime)
            gcTime: 10 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Refetch on window focus only if data is stale
            refetchOnWindowFocus: true,
            // Refetch on mount if data is stale
            refetchOnMount: true,
            // Refetch on reconnect for fresh data
            refetchOnReconnect: true,
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
        },
    },
});
