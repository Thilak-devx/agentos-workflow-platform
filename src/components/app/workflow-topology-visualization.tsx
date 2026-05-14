"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type WorkflowTopologyMetric = {
  label: string;
  value: number;
};

type WorkflowTopologyVisualizationProps = {
  data: WorkflowTopologyMetric[];
  className?: string;
};

type StageTone = "cyan" | "emerald" | "violet";

type Stage = {
  id: string;
  title: string;
  detail: string;
  status: string;
  tone: StageTone;
  agent: string;
  telemetry: string[];
  value: number;
};

const stageBlueprint = [
  {
    id: "intent",
    title: "Intent",
    detail: "Objective intake resolves priority, scope, and execution pressure.",
    status: "Live intake",
    tone: "cyan" as const,
    agent: "Signal Mapper",
    telemetry: ["Scope: 6 lanes", "Risk: low"],
  },
  {
    id: "research",
    title: "Research",
    detail: "Context is synthesized into an operational brief with source confidence.",
    status: "Context ready",
    tone: "violet" as const,
    agent: "Research Swarm",
    telemetry: ["Sources: 18", "Confidence: 0.94"],
  },
  {
    id: "validation",
    title: "Validation",
    detail: "Checkpoints compress approval depth before treasury and execution paths open.",
    status: "Review staged",
    tone: "cyan" as const,
    agent: "Review Relay",
    telemetry: ["Approvals: 2", "Queue: stable"],
  },
  {
    id: "treasury",
    title: "Treasury",
    detail: "Policy rails bind budget routing, settlement windows, and guarded release scope.",
    status: "Policy active",
    tone: "emerald" as const,
    agent: "Treasury Guard",
    telemetry: ["Budget: linked", "Vault: ready"],
  },
  {
    id: "execution",
    title: "Execution",
    detail: "Workflow dispatch advances through a bounded lane with audit-aware state retention.",
    status: "Dispatch ready",
    tone: "cyan" as const,
    agent: "Ops Sentinel",
    telemetry: ["Latency: 240ms", "Health: 98%"],
  },
  {
    id: "archive",
    title: "Archive",
    detail: "Replay trace, memory lineage, and settlement artifacts are sealed for later review.",
    status: "Replay sealed",
    tone: "violet" as const,
    agent: "Memory Ledger",
    telemetry: ["Trace: retained", "Audit: sealed"],
  },
];

const toneStyles: Record<
  StageTone,
  {
    card: string;
    dot: string;
    rail: string;
    badge: string;
    panel: string;
  }
> = {
  cyan: {
    card:
      "border-cyan-300/16 bg-cyan-400/[0.06] shadow-[0_16px_40px_rgba(56,189,248,0.12)]",
    dot: "bg-cyan-200 shadow-[0_0_16px_rgba(147,231,255,0.52)]",
    rail: "from-cyan-300/8 via-cyan-200/55 to-cyan-300/8",
    badge: "border-cyan-300/16 bg-cyan-400/[0.08] text-cyan-100",
    panel: "border-cyan-300/10 bg-cyan-400/[0.05]",
  },
  emerald: {
    card:
      "border-emerald-300/16 bg-emerald-400/[0.06] shadow-[0_16px_40px_rgba(16,185,129,0.11)]",
    dot: "bg-emerald-200 shadow-[0_0_16px_rgba(110,231,183,0.48)]",
    rail: "from-emerald-300/8 via-emerald-200/52 to-emerald-300/8",
    badge: "border-emerald-300/16 bg-emerald-400/[0.08] text-emerald-100",
    panel: "border-emerald-300/10 bg-emerald-400/[0.05]",
  },
  violet: {
    card:
      "border-fuchsia-300/14 bg-fuchsia-400/[0.055] shadow-[0_16px_40px_rgba(232,121,249,0.1)]",
    dot: "bg-fuchsia-200 shadow-[0_0_16px_rgba(232,121,249,0.42)]",
    rail: "from-fuchsia-300/8 via-fuchsia-200/48 to-fuchsia-300/8",
    badge: "border-fuchsia-300/14 bg-fuchsia-400/[0.08] text-fuchsia-100",
    panel: "border-fuchsia-300/10 bg-fuchsia-400/[0.045]",
  },
};

function buildStages(data: WorkflowTopologyMetric[]) {
  return stageBlueprint.map((stage, index) => ({
    ...stage,
    value: data[index]?.value ?? 70 + index * 4,
  })) satisfies Stage[];
}

export function WorkflowTopologyVisualization({
  data,
  className,
}: WorkflowTopologyVisualizationProps) {
  const stages = buildStages(data);

  return (
    <div
      className={cn(
        "rounded-[26px] border border-white/8 bg-[#0a1019]/82 p-3 sm:p-4",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1140px]">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">
            Orchestration map
          </p>
          <Badge variant="emerald" className="shrink-0">
            Stable sequence
          </Badge>
        </div>

        <div className="rounded-[22px] border border-white/6 bg-white/[0.02] px-3 py-3.5 sm:px-4 sm:py-4">
          <div className="mb-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/34">
                Active orchestration
              </p>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Intent flows through research, validation, treasury enforcement,
                and execution before the run is archived with replay state and
                operational memory intact.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <InsightChip label="Agents" value="6 active" />
              <InsightChip label="Checkpoints" value="2 guarded" />
              <InsightChip label="Replay" value="sealed" />
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)_44px_minmax(0,1fr)_44px_minmax(0,1fr)_44px_minmax(0,1fr)_44px_minmax(0,1fr)] lg:items-stretch">
            {stages.map((stage, index) => (
              <StageRow
                key={stage.id}
                stage={stage}
                withConnector={index < stages.length - 1}
              />
            ))}
          </div>

          <div className="grid gap-3 lg:hidden">
            {stages.map((stage, index) => (
              <div key={stage.id} className="grid gap-3">
                <StageCard stage={stage} />
                {index < stages.length - 1 ? (
                  <div className="flex justify-center">
                    <Connector tone={stage.tone} vertical className="h-6" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StageRow({
  stage,
  withConnector,
}: {
  stage: Stage;
  withConnector: boolean;
}) {
  return (
    <>
      <StageCard stage={stage} compact />
      {withConnector ? <Connector tone={stage.tone} className="w-11" /> : null}
    </>
  );
}

function StageCard({
  stage,
  compact = false,
}: {
  stage: Stage;
  compact?: boolean;
}) {
  const tone = toneStyles[stage.tone];

  return (
    <div
      className={cn(
        "min-w-0 rounded-[22px] border p-3.5 backdrop-blur-xl transition duration-200 hover:-translate-y-[1px] hover:border-white/12 hover:bg-white/[0.055]",
        "shadow-[0_14px_36px_rgba(2,6,23,0.22)]",
        tone.card,
        compact ? "h-full" : "w-full",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", tone.dot)} />
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/34">
              {stage.status}
            </p>
          </div>
          <h4 className="mt-2.5 text-sm font-medium text-white xl:text-[0.95rem]">
            {stage.title}
          </h4>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]",
            tone.badge,
          )}
        >
          {stage.value}%
        </span>
      </div>

      <p className="mt-3 text-xs leading-5 text-white/54">{stage.detail}</p>

      <div
        className={cn(
          "mt-4 rounded-[18px] border px-3 py-2.5",
          tone.panel,
        )}
      >
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/34">
          {stage.agent}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {stage.telemetry.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-1 text-[10px] text-white/48"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Connector({
  tone,
  vertical = false,
  className,
}: {
  tone: StageTone;
  vertical?: boolean;
  className?: string;
}) {
  const toneStyle = toneStyles[tone];

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        vertical ? "w-px" : "h-px self-center",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-80",
          toneStyle.rail,
          vertical ? "bg-gradient-to-b" : undefined,
        )}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-50 blur-[2px]",
          vertical
            ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.32),transparent_70%)]"
            : "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_72%)]",
        )}
      />
    </div>
  );
}

function InsightChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-2.5 text-center">
      <p className="text-[10px] uppercase tracking-[0.14em] text-white/34">
        {label}
      </p>
      <p className="mt-1 text-xs font-medium text-white/72">{value}</p>
    </div>
  );
}
