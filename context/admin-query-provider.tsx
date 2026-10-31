"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function AdminQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client: QueryClient = new QueryClient({
      // Saves touch several screens at once (an order changes the list, stats,
      // dashboard and finance), so every successful one refreshes all of them.
      mutationCache: new MutationCache({
        onSuccess: () => {
          void client.invalidateQueries();
        },
      }),
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          refetchOnWindowFocus: false,
          // Only a first load has nothing to show. A failed refresh keeps the data.
          throwOnError: (_error, query) => query.state.data === undefined,
        },
      },
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
