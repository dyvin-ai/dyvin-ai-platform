import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error: any) => {
          const status = error?.status;
          // Never automatically retry client errors (bad request, unauthorized, forbidden, not found, unprocessable)
          if (status === 400 || status === 401 || status === 403 || status === 404 || status === 422) {
            return false;
          }
          if (error?.retryable === false) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        // Enforce zero automatic retries for mutations to prevent unsafe duplicate non-idempotent operations
        retry: false,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
