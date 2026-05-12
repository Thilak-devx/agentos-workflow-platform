"use client";

import { ThemeProvider } from "next-themes";
import { OperatorProvider } from "@/components/providers/operator-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { RealtimeProvider } from "@/components/providers/realtime-provider";
import { SolanaProvider } from "@/components/providers/solana-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
    >
      <QueryProvider>
        <OperatorProvider>
          <RealtimeProvider>
            <SolanaProvider>{children}</SolanaProvider>
          </RealtimeProvider>
        </OperatorProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
