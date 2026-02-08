import { QueryClient } from '@tanstack/react-query';

// Configure React Query with optimized defaults
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache data for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 10 minutes
            cacheTime: 10 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Refetch on window focus only if data is stale
            refetchOnWindowFocus: 'always',
            // Don't refetch on mount if we have cached data
            refetchOnMount: false,
            // Don't refetch on reconnect if we have cached data
            refetchOnReconnect: false,
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
        },
    },
});
