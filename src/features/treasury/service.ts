import {
  SOL_USD_FALLBACK_RATE,
  treasurySeedNotifications,
} from "@/features/treasury/constants";
import {
  TreasuryActivityItem,
  TreasuryAllocationSlice,
  TreasuryCadenceBar,
  TreasuryHealthItem,
  TreasuryPreviewItem,
  TreasuryQueryState,
  TreasurySnapshot,
  TreasuryTransferPoint,
  TreasuryVaultRow,
} from "@/features/treasury/types";
import { createRuntimeEntityId, createStableKey } from "@/lib/react-keys";

type TreasuryServiceInput = {
  walletAddress: string | null;
  walletBalanceSol: number | null;
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
    notation: value >= 1_000_000 ? "compact" : "standard",
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(0)}%`;
}

function formatRelativeMinutes(totalMinutes: number) {
  if (totalMinutes < 1) return "just now";
  if (totalMinutes < 60) return `${totalMinutes}m ago`;
  const hours = Math.floor(totalMinutes / 60);
  return `${hours}h ago`;
}

function wave(seed: number, amplitude: number, offset = 0) {
  return Math.sin(seed + offset) * amplitude;
}

function makeCadence(seed: number): TreasuryCadenceBar[] {
  const labels = ["Policy", "Vendor", "Ops", "Rewards", "Review", "Archive"];
  return labels.map((label, index) => ({
    label,
    value: Math.max(
      24,
      Math.min(
        92,
        Math.round(56 + wave(seed / 2.8, 19, index * 0.7) + index * 3),
      ),
    ),
  }));
}

function makeTransferSeries(seed: number): TreasuryTransferPoint[] {
  return Array.from({ length: 12 }, (_, index) => {
    const transfers = Math.max(
      4,
      Math.round(14 + wave(seed / 3.2, 5, index * 0.45) + index * 0.35),
    );
    const volumeUsd = Math.max(
      32_000,
      Math.round(118_000 + wave(seed / 4.4, 28_000, index * 0.55)),
    );

    return {
      label: `${index + 1}`,
      transfers,
      volumeUsd,
    };
  });
}

function makeSparkline(seed: number, floor = 24) {
  return Array.from({ length: 8 }, (_, index) =>
    Math.max(
      floor,
      Math.round(floor + 14 + wave(seed / 2.5, 9, index * 0.6) + index),
    ),
  );
}

function makeActivities(seed: number): TreasuryActivityItem[] {
  const activityTemplates = [
    {
      hash: "5Qf9...D2ka",
      action: "Treasury routing policy refreshed",
      amountUsd: 84_000,
      status: "stable" as const,
      baseMinutes: 1,
    },
    {
      hash: "8Tu3...L9pf",
      action: "Approval batch escalated to treasury review",
      amountUsd: 42_400,
      status: "review" as const,
      baseMinutes: 4,
    },
    {
      hash: "2Kd8...Q7am",
      action: "Settlement queue compressed into a guarded payout lane",
      amountUsd: 18_400,
      status: "queued" as const,
      baseMinutes: 9,
    },
    {
      hash: "9Mx1...V8ne",
      action: "Recovery confirmation posted after routing anomaly cleared",
      amountUsd: 126_000,
      status: "stable" as const,
      baseMinutes: 14,
    },
  ];

  return [
    ...activityTemplates.map((template, index) => ({
      id: createRuntimeEntityId("treasury-activity"),
      hash: template.hash,
      action: template.action,
      amountUsd: template.amountUsd,
      amount: formatUsd(template.amountUsd),
      network: "Solana Devnet",
      time: formatRelativeMinutes(
        Math.max(template.baseMinutes, Math.round(template.baseMinutes + (seed % (index + 5)))),
      ),
      status: template.status,
      sparkline: makeSparkline(seed + 1.2 + index * 2.1, 20 + index * 3),
    })),
  ];
}

function makeVaults(
  totalBalanceUsd: number,
  walletBalanceUsd: number,
): TreasuryVaultRow[] {
  const operating = totalBalanceUsd * 0.43 + walletBalanceUsd * 0.16;
  const growth = totalBalanceUsd * 0.28;
  const buffer = totalBalanceUsd * 0.21;
  const reserve = totalBalanceUsd * 0.08;

  return [
    {
      id: "vault-operating",
      vault: "Operating Vault",
      network: "Solana Devnet",
      balance: formatUsd(operating),
      health: "Healthy",
    },
    {
      id: "vault-growth-reserve",
      vault: "Growth Reserve",
      network: "Solana Devnet",
      balance: formatUsd(growth),
      health: "Healthy",
    },
    {
      id: "vault-liquidity-buffer",
      vault: "Liquidity Buffer",
      network: "Solana Devnet",
      balance: formatUsd(buffer),
      health: "Monitored",
    },
    {
      id: "vault-strategy-reserve",
      vault: "Strategy Reserve",
      network: "Solana Devnet",
      balance: formatUsd(reserve),
      health: "Healthy",
    },
  ];
}

function makeAllocations(totalBalanceUsd: number): TreasuryAllocationSlice[] {
  return [
    {
      label: "Contributor payouts",
      amountUsd: Math.round(totalBalanceUsd * 0.24),
      share: 24,
    },
    {
      label: "Security and audits",
      amountUsd: Math.round(totalBalanceUsd * 0.19),
      share: 19,
    },
    {
      label: "Growth operations",
      amountUsd: Math.round(totalBalanceUsd * 0.31),
      share: 31,
    },
    {
      label: "Protocol ops reserve",
      amountUsd: Math.round(totalBalanceUsd * 0.26),
      share: 26,
    },
  ];
}

function makeHealth(
  seed: number,
  policyConfidence: number,
): TreasuryHealthItem[] {
  return [
    { label: "Settlement health", value: "99.992%", tone: "emerald" },
    {
      label: "Routing latency",
      value: `${Math.round(210 + wave(seed, 22, 0.8))}ms`,
      tone: "cyan",
    },
    {
      label: "Policy drift",
      value: policyConfidence >= 96 ? "Low" : "Moderate",
      tone: policyConfidence >= 96 ? "violet" : "cyan",
    },
    {
      label: "Vault pressure",
      value: policyConfidence >= 96 ? "Guarded" : "Reviewing",
      tone: "emerald",
    },
  ];
}

function makePreviews(totalBalanceUsd: number): TreasuryPreviewItem[] {
  return [
    {
      title: "Audit payment batch",
      amount: formatUsd(totalBalanceUsd * 0.0021),
      status: "Awaiting approval",
      detail:
        "Three contributor disbursements remain inside the current treasury routing policy.",
    },
    {
      title: "Contributor rewards sweep",
      amount: formatUsd(totalBalanceUsd * 0.0008),
      status: "Signature batching",
      detail:
        "Reward lane compressed into a single settlement path for operator review.",
    },
  ];
}

export async function fetchTreasurySnapshot(
  input: TreasuryServiceInput,
): Promise<TreasuryQueryState> {
  await new Promise((resolve) => setTimeout(resolve, 280));

  const now = Date.now();
  const seed = now / 1000 / 15;
  const walletBalanceUsd =
    (input.walletBalanceSol ?? 0) * SOL_USD_FALLBACK_RATE;

  const totalBalanceUsd = Math.round(
    8_720_000 + wave(seed, 116_000) + walletBalanceUsd,
  );
  const protectedBalanceUsd = Math.round(totalBalanceUsd * 0.286);
  const transferVolumeUsd = Math.round(712_000 + wave(seed, 42_000, 1.4));
  const policyConfidence = 96.4 + wave(seed, 0.9, 0.2);
  const transferCadencePerHour = Math.max(
    8,
    Math.round(11 + wave(seed, 1.8, 0.6)),
  );

  const snapshot: TreasurySnapshot = {
    timestamp: new Date(now).toISOString(),
    totalBalanceUsd,
    protectedBalanceUsd,
    transferVolumeUsd,
    policyConfidence,
    transferCadencePerHour,
    overview: [
      {
        id: "treasury-balance",
        label: "Treasury monitoring",
        value: totalBalanceUsd,
        formattedValue: formatUsd(totalBalanceUsd),
        subtitle: "Tracked across active operational vaults",
        status: input.walletAddress ? "Wallet scoped" : "Core vaults live",
        glow: "cyan",
      },
      {
        id: "treasury-protected",
        label: "Protected settlement",
        value: protectedBalanceUsd,
        formattedValue: formatUsd(protectedBalanceUsd),
        subtitle: "Subject to automated approval thresholds",
        status: `${formatPercent(policyConfidence)} confidence`,
        glow: "emerald",
      },
      {
        id: "treasury-volume",
        label: "Transfer volume",
        value: transferVolumeUsd,
        formattedValue: formatUsd(transferVolumeUsd),
        subtitle: "Internal and vendor settlement activity",
        status: `${transferCadencePerHour}/hr routing`,
        glow: "violet",
      },
    ],
    vaults: makeVaults(totalBalanceUsd, walletBalanceUsd),
    cadence: makeCadence(seed),
    transferSeries: makeTransferSeries(seed),
    activities: makeActivities(seed),
    allocations: makeAllocations(totalBalanceUsd),
    notifications: treasurySeedNotifications.map((item, index) => ({
      ...item,
      id: createStableKey("snapshot", item.id),
      createdAt: new Date(now - index * 7 * 60_000).toISOString(),
    })),
    health: makeHealth(seed, policyConfidence),
    previews: makePreviews(totalBalanceUsd),
  };

  return {
    snapshot,
    walletBalanceUsd,
    connectedWalletLabel: input.walletAddress ? "Connected" : "Awaiting wallet",
    walletAddress: input.walletAddress,
  };
}
