export type TreasuryTone = "cyan" | "emerald" | "violet";

export type TreasuryOverviewMetric = {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  subtitle: string;
  status: string;
  glow: TreasuryTone;
};

export type TreasuryVaultRow = {
  id: string;
  vault: string;
  network: string;
  balance: string;
  health: string;
};

export type TreasuryCadenceBar = {
  label: string;
  value: number;
};

export type TreasuryTransferPoint = {
  label: string;
  transfers: number;
  volumeUsd: number;
};

export type TreasuryActivityItem = {
  id: string;
  hash: string;
  action: string;
  amount: string;
  amountUsd: number;
  network: string;
  time: string;
  status: "stable" | "review" | "queued";
  sparkline: number[];
};

export type TreasuryAllocationSlice = {
  label: string;
  amountUsd: number;
  share: number;
};

export type TreasuryNotificationItem = {
  id: string;
  title: string;
  detail: string;
  tone: TreasuryTone;
  createdAt: string;
};

export type TreasuryHealthItem = {
  label: string;
  value: string;
  tone: TreasuryTone;
};

export type TreasuryPreviewItem = {
  title: string;
  amount: string;
  status: string;
  detail: string;
};

export type TreasurySnapshot = {
  timestamp: string;
  totalBalanceUsd: number;
  protectedBalanceUsd: number;
  transferVolumeUsd: number;
  policyConfidence: number;
  transferCadencePerHour: number;
  overview: TreasuryOverviewMetric[];
  vaults: TreasuryVaultRow[];
  cadence: TreasuryCadenceBar[];
  transferSeries: TreasuryTransferPoint[];
  activities: TreasuryActivityItem[];
  allocations: TreasuryAllocationSlice[];
  notifications: TreasuryNotificationItem[];
  health: TreasuryHealthItem[];
  previews: TreasuryPreviewItem[];
};

export type TreasuryQueryState = {
  snapshot: TreasurySnapshot;
  walletBalanceUsd: number;
  connectedWalletLabel: string;
  walletAddress: string | null;
};

export type SimulatedPaymentStatus =
  | "queued"
  | "awaiting approval"
  | "routing"
  | "executing"
  | "completed"
  | "failed";

export type SimulatedPayment = {
  id: string;
  recipient: string;
  amountUsd: number;
  status: SimulatedPaymentStatus;
  rail: string;
  createdAt: string;
  updatedAt: string;
  transactionId: string;
  approvalState: string;
};

export type PayoutDraft = {
  recipient: string;
  amountUsd: number;
  rail: string;
};
