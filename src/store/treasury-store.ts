"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { treasurySeedNotifications } from "@/features/treasury/constants";
import {
  SimulatedPayment,
  SimulatedPaymentStatus,
  TreasuryNotificationItem,
} from "@/features/treasury/types";
import { createRuntimeEntityId, createStableKey } from "@/lib/react-keys";

type TreasuryState = {
  notifications: TreasuryNotificationItem[];
  simulatedPayments: SimulatedPayment[];
  addNotification: (
    notification: Omit<TreasuryNotificationItem, "id" | "createdAt">,
  ) => void;
  createSimulatedPayment: (
    payment: Omit<
      SimulatedPayment,
      "id" | "createdAt" | "updatedAt" | "transactionId"
    >,
  ) => string;
  updateSimulatedPayment: (
    id: string,
    status: SimulatedPaymentStatus,
    patch?: Partial<SimulatedPayment>,
  ) => void;
  clearTreasuryState: () => void;
};

function createId(prefix: string) {
  return createRuntimeEntityId(prefix);
}

function createTransactionId() {
  return `sim_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

const seedPayments: SimulatedPayment[] = [
  {
    id: "pay-seed-1",
    recipient: "Design contributor pod",
    amountUsd: 4800,
    status: "completed",
    rail: "Solana payout rail",
    createdAt: "2026-05-11T11:46:00.000Z",
    updatedAt: "2026-05-11T11:48:00.000Z",
    transactionId: "sim_dsgn84ea",
    approvalState: "Operator approved",
  },
  {
    id: "pay-seed-2",
    recipient: "Audit review team",
    amountUsd: 12000,
    status: "routing",
    rail: "Treasury guardrail",
    createdAt: "2026-05-11T12:02:00.000Z",
    updatedAt: "2026-05-11T12:04:00.000Z",
    transactionId: "sim_audt29rb",
    approvalState: "Treasury review in progress",
  },
];

const seedNotifications = treasurySeedNotifications.map((item) => ({
  ...item,
  id: createStableKey("store", item.id),
}));

export const useTreasuryStore = create<TreasuryState>()(
  persist(
    (set) => ({
      notifications: seedNotifications,
      simulatedPayments: seedPayments,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              id: createId("note"),
              createdAt: new Date().toISOString(),
              ...notification,
            },
            ...state.notifications,
          ].slice(0, 12),
        })),
      createSimulatedPayment: (payment) => {
        const id = createId("payment");
        set((state) => ({
          simulatedPayments: [
            {
              id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              transactionId: createTransactionId(),
              ...payment,
            },
            ...state.simulatedPayments,
          ].slice(0, 12),
        }));
        return id;
      },
      updateSimulatedPayment: (id, status, patch) =>
        set((state) => ({
          simulatedPayments: state.simulatedPayments.map((payment) =>
            payment.id === id
              ? {
                  ...payment,
                  ...patch,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : payment,
          ),
        })),
      clearTreasuryState: () =>
        set({
          notifications: seedNotifications,
          simulatedPayments: [],
        }),
    }),
    {
      name: "agentos-treasury-state",
      merge: (persistedState, currentState) => {
        const typedPersisted = persistedState as
          | Partial<TreasuryState>
          | undefined;

        return {
          ...currentState,
          ...typedPersisted,
          notifications: (typedPersisted?.notifications?.length
            ? typedPersisted.notifications
            : seedNotifications
          ).map((item) => ({
            ...item,
            id:
              item.id.startsWith("store__") || item.id.startsWith("store-")
                ? item.id
                : createStableKey("store", item.id),
          })),
        };
      },
    },
  ),
);
