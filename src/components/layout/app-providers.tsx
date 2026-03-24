"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode, useState } from "react"
import { ToastProvider } from "./toast-provider"
import { UserPreferencesProvider } from "./user-preferences-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  // TODO: Hydrate React Query from real concert/search APIs once the data layer is connected.
  return (
    <QueryClientProvider client={queryClient}>
      <UserPreferencesProvider>
        <ToastProvider>{children}</ToastProvider>
      </UserPreferencesProvider>
    </QueryClientProvider>
  )
}
