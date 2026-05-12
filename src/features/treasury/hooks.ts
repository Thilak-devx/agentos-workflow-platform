"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { TREASURY_QUERY_INTERVAL_MS } from "@/features/treasury/constants";
import { fetchTreasurySnapshot } from "@/features/treasury/service";
import { useWalletTreasury } from "@/hooks/use-wallet-treasury";
import { dedupeById } from "@/lib/react-keys";
import { useTreasuryStore } from "@/store/treasury-store";

export function useTreasuryPlatform() {
  const wallet = useWalletTreasury();
  const treasuryStore = useTreasuryStore();

  const query = useQuery({
    queryKey: [
      "treasury-platform",
      wallet.address,
      wallet.balanceSol,
      wallet.signatures[0]?.signature,
    ],
    queryFn: () =>
      fetchTreasurySnapshot({
        walletAddress: wallet.address,
        walletBalanceSol: wallet.balanceSol,
      }),
    staleTime: TREASURY_QUERY_INTERVAL_MS / 2,
    refetchInterval: TREASURY_QUERY_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });

  const mergedNotifications = useMemo(() => {
    const dynamic = query.data?.snapshot.notifications ?? [];
    const local = treasuryStore.notifications;

    return dedupeById(
      [...local, ...dynamic]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 8),
    );
  }, [query.data?.snapshot.notifications, treasuryStore.notifications]);

  return {
    ...wallet,
    ...query,
    snapshot: query.data?.snapshot ?? null,
    walletBalanceUsd: query.data?.walletBalanceUsd ?? 0,
    notifications: mergedNotifications,
    simulatedPayments: treasuryStore.simulatedPayments,
    createSimulatedPayment: treasuryStore.createSimulatedPayment,
    updateSimulatedPayment: treasuryStore.updateSimulatedPayment,
    addNotification: treasuryStore.addNotification,
    clearTreasuryState: treasuryStore.clearTreasuryState,
  };
}
