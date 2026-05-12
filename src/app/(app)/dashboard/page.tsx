"use client";

import { useMemo } from "react";
import { Layers3, Wallet2 } from "lucide-react";
import { ActivityBars } from "@/components/charts/activity-bars";
import { TreasurySparkline } from "@/components/charts/treasury-sparkline";
import { SignalFlowChart } from "@/components/charts/signal-flow-chart";
import { ActivityFeedCard } from "@/components/app/activity-feed-card";
import { LiveMetricsStrip } from "@/components/app/live-metrics-strip";
import { PageHeader } from "@/components/app/page-header";
import { ReasoningLogCard } from "@/components/app/reasoning-log-card";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { SystemHealthGrid } from "@/components/app/system-health-grid";
import { TransactionFeedCard } from "@/components/app/transaction-feed-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlatformSnapshot } from "@/features/platform/hooks";
import { workflowBars } from "@/lib/mock-data";
import { useRuntimeStore } from "@/store/runtime-store";

function formatCurrencyCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 1000000 ? 1 : 0,
  }).format(value);
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <GlassCard className="p-6" glow="none">
        <div className="h-4 w-28 rounded-full bg-white/[0.06]" />
        <div className="mt-4 h-10 w-80 max-w-full rounded-full bg-white/[0.08]" />
        <div className="mt-4 h-4 w-full rounded-full bg-white/[0.04]" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`dashboard-skeleton-insight-${index}`}
              className="rounded-[22px] border border-white/6 bg-white/[0.03] px-4 py-3"
            >
              <div className="h-3 w-20 rounded-full bg-white/[0.05]" />
              <div className="mt-3 h-6 w-24 rounded-full bg-white/[0.08]" />
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <GlassCard key={`dashboard-skeleton-metric-${index}`} className="px-4 py-4" glow="none">
            <div className="h-3 w-24 rounded-full bg-white/[0.05]" />
            <div className="mt-3 h-7 w-20 rounded-full bg-white/[0.08]" />
            <div className="mt-3 h-3 w-full rounded-full bg-white/[0.04]" />
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)]">
        <GlassCard className="p-6" glow="none">
          <div className="h-5 w-40 rounded-full bg-white/[0.06]" />
          <div className="mt-4 h-4 w-72 max-w-full rounded-full bg-white/[0.04]" />
          <div className="mt-6 h-48 rounded-[28px] bg-white/[0.03]" />
        </GlassCard>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <GlassCard key={`dashboard-skeleton-side-${index}`} className="p-5" glow="none">
              <div className="h-3 w-20 rounded-full bg-white/[0.05]" />
              <div className="mt-3 h-8 w-24 rounded-full bg-white/[0.08]" />
              <div className="mt-3 h-3 w-full rounded-full bg-white/[0.04]" />
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { operator } = useOperatorSession();
  const platformQuery = usePlatformSnapshot(operator);
  const activityFeed = useRuntimeStore((state) => state.activityFeed);
  const reasoningFeed = useRuntimeStore((state) => state.reasoningFeed);
  const health = useRuntimeStore((state) => state.health);
  const treasuryTransactions = useRuntimeStore(
    (state) => state.treasuryTransactions,
  );
  const agentOnlineCount = useRuntimeStore((state) => state.agentOnlineCount);
  const cycle = useRuntimeStore((state) => state.cycle);
  const systemStatus = useRuntimeStore((state) => state.systemStatus);

  const signalValues = useMemo(
    () =>
      [26, 34, 28, 48, 42, 56, 68, 62, 80, 74, 88, 94].map((value, index) =>
        Math.min(value + ((cycle + index) % 4) * 3, 98),
      ),
    [cycle],
  );

  const dynamicWorkflowBars = useMemo(
    () =>
      workflowBars.map((item, index) => ({
        ...item,
        value: Math.min(item.value + ((cycle + index) % 3) * 4, 96),
      })),
    [cycle],
  );

  const activityItems =
    platformQuery.data?.activityLogs.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.detail,
      time: item.time,
      tone: item.tone,
    })) ?? activityFeed;
  const reviewLoad = platformQuery.data?.workflowRuns.filter(
    (workflow) => workflow.status === "awaiting approval",
  ).length;
  const isInitialLoading = platformQuery.isLoading && !platformQuery.data;
  const settlementSeries = treasuryTransactions[0]?.sparkline ?? [
    18, 22, 24, 28, 27, 31, 35, 38,
  ];
  const telemetrySeries = [64, 70, 68, 76, 80, 84, 82, 88];

  if (isInitialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="System command"
        title="Autonomous command center"
        description="A focused operating surface for monitoring AI execution, treasury movement, and system trust without excess noise."
        badge={`${agentOnlineCount} agents online`}
        insights={[
          { label: "Loop latency", value: "240ms" },
          { label: "Execution health", value: systemStatus },
          {
            label: "Treasury ready",
            value: treasuryTransactions[0]?.amount ?? "$8.9M",
          },
          {
            label: "Review load",
            value: reviewLoad ? `${reviewLoad} queued` : cycle % 3 === 0 ? "Moderate" : "Low",
          },
        ]}
      />

      <LiveMetricsStrip
        metrics={[
          {
            label: "Agents online",
            base: 18,
            liveValue: agentOnlineCount,
            tone: "emerald",
            detail: "Multi-agent fleet currently available",
          },
          {
            label: "Workflow pressure",
            base: 72,
            suffix: "%",
            liveValue: 70 + (cycle % 5) * 3,
            tone: "cyan",
            detail: "Active orchestration demand across queues",
          },
          {
            label: "Treasury confidence",
            base: 97,
            suffix: "%",
            liveValue: 95 + (cycle % 4),
            tone: cycle % 3 === 0 ? "amber" : "emerald",
            detail: "Settlement safeguards and policy confidence",
          },
          {
            label: "Settlements today",
            base: 14,
            liveValue: 14 + (cycle % 4),
            tone: "emerald",
            detail: "Completed treasury actions in this cycle",
          },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)]">
        <GlassCard className="min-w-0 p-6" glow="none">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold tracking-[-0.05em] text-white sm:text-3xl">
                Operational overview
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/52">
                One surface for live throughput, reasoning confidence, and
                treasury posture across the current execution window.
              </p>
            </div>
            <div className="shrink-0 rounded-[20px] border border-white/6 bg-white/[0.03] px-4 py-3 text-sm text-white/44">
              {systemStatus}
            </div>
          </div>
          <SignalFlowChart values={signalValues} />
        </GlassCard>

        <div className="grid min-w-0 gap-4 md:grid-cols-3 xl:grid-cols-1">
          {[
            {
              label: "Agent fleet",
              value: `${agentOnlineCount}`,
              detail:
                "Active workers across research, ops, treasury, and support.",
            },
            {
              label: "Orchestration",
              value: `${22 + (cycle % 4)}`,
              detail:
                "High-priority tasks moving through governed execution paths.",
            },
            {
              label: "Treasury",
              value: treasuryTransactions[0]?.amount ?? "$8.9M",
              detail:
                "Protected operational capital connected to settlement controls.",
            },
          ].map((item) => (
            <GlassCard key={item.label} className="min-w-0 p-5" glow="none">
              <p className="text-xs break-words text-white/38">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] break-words text-white">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/50">
                {item.detail}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <ActivityFeedCard title="Live activity stream" items={activityItems} />
        <GlassCard className="min-w-0 p-6" glow="none">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">Coordination intelligence</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Live reasoning state, execution pressure, and orchestration
                confidence in one place.
              </p>
            </div>
            <Layers3 className="h-5 w-5 text-white/38" />
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <GlassCard className="min-w-0 p-4" glow="none">
              <p className="text-xs text-white/38">Execution pressure</p>
              <div className="mt-4">
                <ActivityBars data={dynamicWorkflowBars} />
              </div>
            </GlassCard>
            <ReasoningLogCard logs={reasoningFeed.slice(0, 4)} />
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <TransactionFeedCard transactions={treasuryTransactions} />
        <GlassCard className="min-w-0 p-6" glow="none">
          <div className="mb-5 flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">
                Treasury settlement summary
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Current payout readiness, settlement velocity, and treasury
                confidence across the active operational window.
              </p>
            </div>
            <Wallet2 className="h-5 w-5 text-white/38" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Ready to settle",
                value: 184000 + (cycle % 4) * 12000,
              },
              { label: "Pending review", value: 2 + (cycle % 3), suffix: " routes" },
              { label: "Confidence", value: 95 + (cycle % 4), suffix: "%" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="min-w-0 rounded-[22px] border border-white/6 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs break-words text-white/36">
                    {item.label}
                  </p>
                  <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-[-0.05em] break-words text-white">
                  {index === 0 ? (
                    <AnimatedCounter
                      value={item.value}
                      prefix="$"
                      formatter={(value) => `$${formatCurrencyCompact(value)}`}
                    />
                  ) : (
                    <AnimatedCounter
                      value={item.value}
                      suffix={item.suffix}
                    />
                  )}
                </div>
                <div className="mt-4">
                  <TreasurySparkline values={settlementSeries.map((value, sparkIndex) => value + ((cycle + sparkIndex + index) % 2) * 2)} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <SystemHealthGrid metrics={health} />
        <GlassCard className="min-w-0 p-6" glow="none">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-white/70">
              <Layers3 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">
                Operational cognition
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/50">
                Research, treasury, and operations remain aligned in the same
                execution loop with no stalled agents and no policy drift.
              </p>
              <div className="mt-4 rounded-[20px] border border-white/6 bg-white/[0.03] p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-white/36">Execution telemetry</p>
                  <span className="text-[11px] text-white/30">Live</span>
                </div>
                <TreasurySparkline values={telemetrySeries.map((value, index) => value + ((cycle + index) % 3))} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Shared context",
                    value: cycle % 2 === 0 ? "Warm" : "Aligned",
                  },
                  { label: "Escalations", value: `${1 + (cycle % 3)} open` },
                  {
                    label: "Fallback paths",
                    value: `${6 + (cycle % 2)} ready`,
                  },
                  {
                    label: "Memory snapshots",
                    value: `${4 + (cycle % 3)} warm`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[20px] border border-white/6 bg-white/[0.03] px-4 py-3"
                  >
                    <p className="text-xs text-white/36">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {item.value}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(125,211,252,0.9),rgba(110,231,183,0.82))] transition-all duration-500"
                        style={{
                          width: `${58 + ((cycle + item.label.length) % 5) * 8}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
