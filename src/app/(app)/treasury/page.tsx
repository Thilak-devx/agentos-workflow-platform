"use client";

import {
  ArrowLeftRight,
  BrainCircuit,
  Shield,
  Wallet2,
  Waves,
} from "lucide-react";
import { ActivityBars } from "@/components/charts/activity-bars";
import { TreasuryTransferChart } from "@/components/charts/treasury-transfer-chart";
import { DataTableCard } from "@/components/app/data-table-card";
import { OperationalPaymentsCard } from "@/components/app/operational-payments-card";
import { PageHeader } from "@/components/app/page-header";
import { StatusPulseCard } from "@/components/app/status-pulse-card";
import { SystemHealthGrid } from "@/components/app/system-health-grid";
import { TransactionPreviewCard } from "@/components/app/transaction-preview-card";
import { TransactionFeedCard } from "@/components/app/transaction-feed-card";
import { TreasuryAllocationCard } from "@/components/app/treasury-allocation-card";
import { TreasuryNotificationsCard } from "@/components/app/treasury-notifications-card";
import { WalletActivityCard } from "@/components/app/wallet-activity-card";
import { WalletBalanceHero } from "@/components/app/wallet-balance-hero";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTreasuryPlatform } from "@/features/treasury/hooks";
import { createStableKey } from "@/lib/react-keys";

export default function TreasuryPage() {
  const { snapshot, notifications, isError } = useTreasuryPlatform();

  const loadingInsights = [
    { label: "Treasury balance", value: "Syncing" },
    { label: "Protected rails", value: "Syncing" },
    { label: "Transfer cadence", value: "Syncing" },
    { label: "Policy confidence", value: "Syncing" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Treasury intelligence"
        title="Programmable capital operations"
        description="The financial control layer for autonomous organizations: wallet activation, protected settlement lanes, policy-aware routing, and live treasury intelligence without generic crypto-dashboard clutter."
        badge={snapshot ? "4 vault lanes" : "Syncing"}
        insights={
          snapshot
            ? [
                {
                  label: "Treasury balance",
                  value: snapshot.overview[0]?.formattedValue ?? "—",
                },
                {
                  label: "Protected rails",
                  value: snapshot.overview[1]?.formattedValue ?? "—",
                },
                {
                  label: "Transfer cadence",
                  value: `${snapshot.transferCadencePerHour}/hr`,
                },
                {
                  label: "Policy confidence",
                  value: `${snapshot.policyConfidence.toFixed(0)}%`,
                },
              ]
            : loadingInsights
        }
      />

      <WalletBalanceHero />

      {isError && !snapshot ? (
        <GlassCard className="p-6" glow="none">
          <p className="text-lg font-semibold text-white">
            Treasury telemetry is reconnecting
          </p>
          <p className="mt-2 text-sm leading-7 text-white/48">
            Live treasury intelligence is temporarily unavailable. Existing
            wallet state and simulated payouts remain intact while the data
            layer recovers.
          </p>
        </GlassCard>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {snapshot
          ? snapshot.overview.map((metric) => (
              <StatusPulseCard
                key={metric.id}
                title={metric.label}
                value={metric.formattedValue}
                subtitle={metric.subtitle}
                status={metric.status}
                glow={metric.glow}
              />
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <GlassCard
                key={createStableKey("treasury-overview-skeleton", index)}
                className="p-5"
                glow="none"
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-4 h-10 w-32" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-6 h-7 w-24 rounded-full" />
              </GlassCard>
            ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        {snapshot ? (
          <DataTableCard
            title="Treasury vault registry"
            columns={[
              { key: "vault", label: "Vault" },
              { key: "network", label: "Network" },
              { key: "balance", label: "Balance" },
              { key: "health", label: "Health", className: "text-right" },
            ]}
            rows={snapshot.vaults}
          />
        ) : (
          <GlassCard className="p-5" glow="none">
            <Skeleton className="h-5 w-44" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={createStableKey("treasury-vault-skeleton", index)}
                  className="h-16 w-full"
                />
              ))}
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-6" glow="emerald">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <Badge variant="emerald">Liquidity rhythm</Badge>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Live treasury cadence
              </h2>
            </div>
            <Waves className="h-5 w-5 text-cyan-100" />
          </div>
          {snapshot ? (
            <ActivityBars data={snapshot.cadence} />
          ) : (
            <Skeleton className="h-56 w-full rounded-[28px]" />
          )}
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        {snapshot ? (
          <TransactionFeedCard transactions={snapshot.activities} />
        ) : (
          <GlassCard className="p-5" glow="none">
            <Skeleton className="h-5 w-40" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={createStableKey("treasury-activity-skeleton", index)}
                  className="h-20 w-full"
                />
              ))}
            </div>
          </GlassCard>
        )}
        <WalletActivityCard />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        {snapshot ? (
          <SystemHealthGrid metrics={snapshot.health} />
        ) : (
          <GlassCard className="p-5" glow="none">
            <Skeleton className="h-5 w-32" />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={createStableKey("treasury-health-skeleton", index)}
                  className="h-24 w-full"
                />
              ))}
            </div>
          </GlassCard>
        )}
        {snapshot ? (
          <TreasuryAllocationCard allocations={snapshot.allocations} />
        ) : (
          <GlassCard className="p-5" glow="none">
            <Skeleton className="h-5 w-52" />
            <div className="mt-5 grid gap-4 lg:grid-cols-[190px_1fr]">
              <Skeleton className="h-44 w-full rounded-[28px]" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={createStableKey("treasury-allocation-skeleton", index)}
                    className="h-18 w-full"
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <OperationalPaymentsCard />
        {snapshot ? (
          <TransactionPreviewCard previews={snapshot.previews} />
        ) : (
          <GlassCard className="p-5" glow="none">
            <Skeleton className="h-5 w-48" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton
                  key={createStableKey("treasury-preview-skeleton", index)}
                  className="h-28 w-full"
                />
              ))}
            </div>
          </GlassCard>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <TreasuryNotificationsCard notifications={notifications} />
        <GlassCard className="p-6" glow="violet">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Badge variant="violet">Live flow visualization</Badge>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Treasury flow graph
              </h2>
            </div>
            <ArrowLeftRight className="h-5 w-5 text-cyan-100" />
          </div>
          {snapshot ? (
            <TreasuryTransferChart data={snapshot.transferSeries} />
          ) : (
            <Skeleton className="h-64 w-full rounded-[28px]" />
          )}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-5">
              <Wallet2 className="h-5 w-5 text-cyan-100" />
              <p className="mt-4 text-lg font-semibold text-white">
                Settlement routing depth
              </p>
              <p className="mt-2 text-sm leading-7 text-white/52">
                Contributor, audit, and operations disbursements are mapped to dedicated routing lanes with policy-aware approval checkpoints.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-5">
              <BrainCircuit className="h-5 w-5 text-cyan-100" />
              <p className="mt-4 text-lg font-semibold text-white">
                Treasury intelligence
              </p>
              <p className="mt-2 text-sm leading-7 text-white/52">
                AgentOS folds workflow cost projections and payout readiness into treasury planning so operational spend is visible before execution begins.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-5 md:col-span-2">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 text-cyan-100" />
                <div>
                  <p className="text-lg font-semibold text-white">Policy and execution monitoring</p>
                  <p className="mt-2 text-sm leading-7 text-white/52">
                    Every preview, payout simulation, wallet update, and settlement path is surfaced with execution state, routing depth, signature batching context, and treasury policy confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
