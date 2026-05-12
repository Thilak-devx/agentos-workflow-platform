import {
  PayoutDraft,
  TreasuryNotificationItem,
} from "@/features/treasury/types";

export const SOL_USD_FALLBACK_RATE = 172.4;
export const TREASURY_QUERY_INTERVAL_MS = 15_000;

export const payoutTemplates: PayoutDraft[] = [
  {
    recipient: "Growth contributor pod",
    amountUsd: 6400,
    rail: "Solana payout rail",
  },
  {
    recipient: "Smart contract audit guild",
    amountUsd: 14000,
    rail: "Treasury guardrail",
  },
  {
    recipient: "DAO operations squad",
    amountUsd: 8800,
    rail: "Contributor multisig lane",
  },
];

export const treasurySeedNotifications: TreasuryNotificationItem[] = [
  {
    id: "treasury-seed-1",
    title: "Treasury routing policy refreshed",
    detail:
      "Approval compression remains enabled for low-risk internal payouts.",
    tone: "emerald",
    createdAt: "2026-05-11T12:12:00.000Z",
  },
  {
    id: "treasury-seed-2",
    title: "Review queue reduced to 2 items",
    detail: "Ops Sentinel resolved one vendor lane check without escalation.",
    tone: "cyan",
    createdAt: "2026-05-11T12:04:00.000Z",
  },
  {
    id: "treasury-seed-3",
    title: "Execution summary archived",
    detail:
      "Contributor payout batch moved into the signed settlement archive.",
    tone: "violet",
    createdAt: "2026-05-11T11:56:00.000Z",
  },
];
