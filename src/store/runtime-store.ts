"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  activityStream,
  healthMetrics,
  reasoningLogs,
  systemNotifications,
  transactionFeed,
} from "@/lib/mock-data";
import { createRuntimeEntityId } from "@/lib/react-keys";

type Tone = "cyan" | "emerald" | "violet";

export type RuntimeActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: Tone;
};

export type RuntimeReasoningItem = {
  id: string;
  agent: string;
  summary: string;
  confidence: string;
};

export type RuntimeHealthItem = {
  label: string;
  value: string;
  tone: Tone;
};

export type RuntimeTransactionItem = {
  id: string;
  hash: string;
  action: string;
  amount: string;
  network: string;
  time: string;
  status?: string;
  sparkline?: number[];
};

export type RuntimeToast = {
  id: string;
  title: string;
  detail: string;
  tone: Tone;
};

export type RecentAction = {
  id: string;
  label: string;
  href?: string;
  kind: "route" | "action";
  createdAt: string;
};

type RuntimeState = {
  activeRoute: string;
  currentTimeLabel: string;
  systemStatus: string;
  agentOnlineCount: number;
  cycle: number;
  activityFeed: RuntimeActivityItem[];
  reasoningFeed: RuntimeReasoningItem[];
  health: RuntimeHealthItem[];
  treasuryTransactions: RuntimeTransactionItem[];
  notifications: Array<{
    id: string;
    title: string;
    detail: string;
    tone: Tone;
    createdAt: string;
  }>;
  recentActions: RecentAction[];
  toasts: RuntimeToast[];
  searchFocusTick: number;
  setActiveRoute: (route: string) => void;
  addRecentAction: (action: Omit<RecentAction, "id" | "createdAt">) => void;
  pushToast: (toast: Omit<RuntimeToast, "id">) => void;
  dismissToast: (id: string) => void;
  requestSearchFocus: () => void;
  tickClock: () => void;
  runSimulationCycle: () => void;
};

const CLOCK_PLACEHOLDER = "--:--:--";

function formatClock(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

const liveActivityTemplates: Array<Omit<RuntimeActivityItem, "id" | "time">> = [
  {
    title: "Treasury guard",
    detail:
      "Treasury approval path updated for low-risk internal disbursements.",
    tone: "emerald",
  },
  {
    title: "Ops Sentinel",
    detail:
      "Compressed one review queue after confidence returned above threshold.",
    tone: "cyan",
  },
  {
    title: "Memory archive",
    detail: "Execution summary archived into the active coordination graph.",
    tone: "violet",
  },
  {
    title: "Workflow engine",
    detail:
      "Two agents are awaiting operator review before settlement continues.",
    tone: "cyan",
  },
];

const liveNotificationTemplates = [
  {
    title: "Review queue updated",
    detail: "A workflow review checkpoint was cleared without policy drift.",
    tone: "cyan" as const,
  },
  {
    title: "Treasury lane healthy",
    detail: "Protected routing stayed inside the current approval envelope.",
    tone: "emerald" as const,
  },
  {
    title: "Memory snapshot refreshed",
    detail: "Recovery context was committed for the next execution cycle.",
    tone: "violet" as const,
  },
];

const liveTransactionTemplates = [
  {
    hash: "7Lm2...R4pt",
    action: "Treasury approval path updated",
    amount: "$64,000",
    network: "Solana Devnet",
    status: "stable",
    sparkline: [30, 34, 33, 38, 42, 45, 43, 48],
  },
  {
    hash: "4Ns8...K1aq",
    action: "Research workflow completed",
    amount: "$18,400",
    network: "Solana Devnet",
    status: "review",
    sparkline: [18, 22, 24, 23, 27, 30, 28, 31],
  },
  {
    hash: "9Za4...X2ce",
    action: "Consensus checkpoint saved",
    amount: "$12,200",
    network: "Solana Devnet",
    status: "queued",
    sparkline: [16, 17, 19, 22, 21, 24, 25, 27],
  },
];

export const useRuntimeStore = create<RuntimeState>()(
  persist(
    (set) => ({
      activeRoute: "/dashboard",
      currentTimeLabel: CLOCK_PLACEHOLDER,
      systemStatus: "All systems stable",
      agentOnlineCount: 18,
      cycle: 0,
      activityFeed: activityStream.map((item) => ({
        ...item,
        id: item.id,
        tone: item.tone,
      })),
      reasoningFeed: reasoningLogs.map((item) => ({
        ...item,
        id: item.id,
      })),
      health: [...healthMetrics],
      treasuryTransactions: transactionFeed.map((item, index) => ({
        ...item,
        status: index === 1 ? "review" : index === 2 ? "queued" : "stable",
        sparkline: Array.from(
          { length: 8 },
          (_, sparkIndex) => 20 + index * 5 + sparkIndex * 2,
        ),
      })),
      notifications: systemNotifications,
      recentActions: [],
      toasts: [],
      searchFocusTick: 0,
      setActiveRoute: (route) => set({ activeRoute: route }),
      addRecentAction: (action) =>
        set((state) => {
          const nextAction = {
            ...action,
            id: createRuntimeEntityId("recent"),
            createdAt: new Date().toISOString(),
          };

          return {
            recentActions: [nextAction, ...state.recentActions]
              .filter(
                (item, index, list) =>
                  list.findIndex(
                    (candidate) =>
                      candidate.label === item.label &&
                      candidate.kind === item.kind &&
                      candidate.href === item.href,
                  ) === index,
              )
              .slice(0, 8),
          };
        }),
      pushToast: (toast) =>
        set(() => ({
          toasts: [{ ...toast, id: createRuntimeEntityId("toast") }],
        })),
      dismissToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      requestSearchFocus: () =>
        set((state) => ({ searchFocusTick: state.searchFocusTick + 1 })),
      tickClock: () => set({ currentTimeLabel: formatClock() }),
      runSimulationCycle: () =>
        set((state) => {
          const nextCycle = state.cycle + 1;
          const activityTemplate =
            liveActivityTemplates[nextCycle % liveActivityTemplates.length];
          const notificationTemplate =
            liveNotificationTemplates[
              nextCycle % liveNotificationTemplates.length
            ];
          const transactionTemplate =
            liveTransactionTemplates[
              nextCycle % liveTransactionTemplates.length
            ];

          return {
            cycle: nextCycle,
            agentOnlineCount: 17 + (nextCycle % 4),
            systemStatus:
              nextCycle % 4 === 0
                ? "Review queue low"
                : nextCycle % 3 === 0
                  ? "Treasury routing healthy"
                  : "All systems stable",
            activityFeed: [
              {
                id: createRuntimeEntityId("activity"),
                ...activityTemplate,
                time: "Just now",
              },
              ...state.activityFeed.slice(0, 4).map((item, index) => ({
                ...item,
                time: `${(index + 1) * 2}m ago`,
              })),
            ].slice(0, 5),
            reasoningFeed: state.reasoningFeed.map((item, index) => ({
              ...item,
              confidence: `0.${92 + ((nextCycle + index) % 6)}`,
            })),
            health: state.health.map((metric, index) => ({
              ...metric,
              value:
                metric.label === "Agent latency"
                  ? `${228 + ((nextCycle + index) % 5) * 9}ms`
                  : metric.label === "Runtime health"
                    ? `99.99${(nextCycle + index) % 3}%`
                    : metric.label === "Approval drift"
                      ? nextCycle % 3 === 0
                        ? "Reviewing"
                        : "Low"
                      : nextCycle % 4 === 0
                        ? "Watching"
                        : "Guarded",
            })),
            treasuryTransactions: [
              {
                id: createRuntimeEntityId("tx"),
                ...transactionTemplate,
                time: "Just now",
                sparkline: transactionTemplate.sparkline.map(
                  (value, index) => value + ((nextCycle + index) % 3),
                ),
              },
              ...state.treasuryTransactions
                .slice(0, 3)
                .map((item, index) => ({ ...item, time: `${index + 1}m ago` })),
            ].slice(0, 4),
            notifications: [
              {
                id: createRuntimeEntityId("runtime-note"),
                createdAt: new Date().toISOString(),
                ...notificationTemplate,
              },
              ...state.notifications,
            ].slice(0, 8),
          };
        }),
    }),
    {
      name: "agentos-runtime-state",
      partialize: (state) => ({
        activeRoute: state.activeRoute,
        recentActions: state.recentActions,
      }),
    },
  ),
);
