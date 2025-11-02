/**
 * Centralized React Query configuration
 * Provides default settings for all queries in the application
 */

export const queryConfig = {
  // Default stale time: how long data is considered fresh (1 minute)
  staleTime: 60000, // 60 seconds

  // Default garbage collection time: how long unused data stays in cache (5 minutes)
  gcTime: 300000, // 300 seconds (5 minutes)

  // Default query options
  defaultOptions: {
    queries: {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: false, // Don't refetch when component mounts if data exists
      retry: 1,
    },
  },
};
