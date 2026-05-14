"use client";

import { motion, useReducedMotion } from "framer-motion";
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

type Stage = {
  id: string;
  title: string;
  detail: string;
  status: string;
  tone: "cyan" | "emerald" | "violet";
  value: number;
};

const stageBlueprint = [
  {
    id: "intent",
    title: "Intent",
    detail: "Objective parsed into scope and risk envelope.",
    status: "Live intake",
    tone: "cyan" as const,
  },
  {
    id: "research",
    title: "Research",
    detail: "Signals consolidated into an execution brief.",
    status: "Context ready",
    tone: "violet" as const,
  },
  {
    id: "review",
    title: "Review",
    detail: "Operator checkpoints compressed to critical approvals.",
    status: "Review staged",
    tone: "cyan" as const,
  },
  {
    id: "guard",
    title: "Guard",
    detail: "Policy rails and treasury thresholds stay enforced.",
    status: "Policy active",
    tone: "emerald" as const,
  },
  {
    id: "execute",
    title: "Execute",
    detail: "The run advances through a bounded execution lane.",
    status: "Dispatch ready",
    tone: "cyan" as const,
  },
  {
    id: "archive",
    title: "Archive",
    detail: "Outputs, replay state, and audit trace are retained.",
    status: "Replay sealed",
    tone: "violet" as const,
  },
];

const toneClasses = {
  cyan: {
    badge: "border-cyan-300/18 bg-cyan-400/[0.09] text-cyan-100",
    dot: "bg-cyan-200 shadow-[0_0_18px_rgba(147,231,255,0.55)]",
    card: "border-cyan-300/14 bg-cyan-400/[0.06]",
    connector:
      "from-cyan-300/10 via-cyan-200/50 to-cyan-300/10",
  },
  emerald: {
    badge: "border-emerald-300/18 bg-emerald-400/[0.09] text-emerald-100",
    dot: "bg-emerald-200 shadow-[0_0_18px_rgba(110,231,183,0.5)]",
    card: "border-emerald-300/14 bg-emerald-400/[0.06]",
    connector:
      "from-emerald-300/10 via-emerald-200/48 to-emerald-300/10",
  },
  violet: {
    badge: "border-fuchsia-300/16 bg-fuchsia-400/[0.08] text-fuchsia-100",
    dot: "bg-fuchsia-200 shadow-[0_0_18px_rgba(232,121,249,0.42)]",
    card: "border-fuchsia-300/12 bg-fuchsia-400/[0.05]",
    connector:
      "from-fuchsia-300/10 via-fuchsia-200/46 to-fuchsia-300/10",
  },
};

function buildStages(data: WorkflowTopologyMetric[]) {
  return stageBlueprint.map((stage, index) => ({
    ...stage,
    value: data[index]?.value ?? 72 + index * 3,
  })) satisfies Stage[];
}

export function WorkflowTopologyVisualization({
  data,
  className,
}: WorkflowTopologyVisualizationProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const stages = buildStages(data);

  return (
    <div
      className={cn(
        "rounded-[26px] border border-white/8 bg-[#0a1019]/82 p-3 sm:p-4",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">
            Orchestration flow
          </p>
          <Badge variant="emerald" className="shrink-0">
            Stable sequence
          </Badge>
        </div>

        <div className="rounded-[22px] border border-white/6 bg-white/[0.02] px-3 py-3.5 sm:px-4 sm:py-4">
          <div className="hidden items-center justify-center gap-2 lg:flex">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-2">
                <StageCard stage={stage} reduceMotion={reduceMotion} compact />
                {index < stages.length - 1 ? (
                  <Connector
                    tone={stage.tone}
                    reduceMotion={reduceMotion}
                    className="w-9 xl:w-11"
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {stages.map((stage, index) => (
              <div key={stage.id} className="space-y-3">
                <StageCard stage={stage} reduceMotion={reduceMotion} />
                {index < stages.length - 1 ? (
                  <Connector
                    tone={stage.tone}
                    reduceMotion={reduceMotion}
                    vertical
                    className="mx-auto h-6"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StageCard({
  stage,
  reduceMotion,
  compact = false,
}: {
  stage: Stage;
  reduceMotion: boolean;
  compact?: boolean;
}) {
  const tone = toneClasses[stage.tone];

  return (
    <motion.div
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -1.5, 0],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 3.4,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
      className={cn(
        "min-w-0 rounded-[22px] border p-3.5 backdrop-blur-xl",
        "shadow-[0_14px_36px_rgba(2,6,23,0.22)]",
        tone.card,
        compact ? "w-[148px] xl:w-[156px]" : "w-full",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/34">
            {stage.status}
          </p>
          <h4 className="mt-2 text-sm font-medium text-white xl:text-[0.95rem]">
            {stage.title}
          </h4>
        </div>
        <span className={cn("mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full", tone.dot)} />
      </div>

      <div className="mt-3">
        <p className="text-[1.35rem] font-semibold tracking-[-0.05em] text-white">
          {stage.value}%
        </p>
        <p className="mt-1 text-xs leading-5 text-white/48">{stage.detail}</p>
      </div>
    </motion.div>
  );
}

function Connector({
  tone,
  reduceMotion,
  vertical = false,
  className,
}: {
  tone: Stage["tone"];
  reduceMotion: boolean;
  vertical?: boolean;
  className?: string;
}) {
  const toneClass = toneClasses[tone];

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        vertical ? "w-px" : "h-px",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-70",
          toneClass.connector,
          vertical ? "bg-gradient-to-b" : undefined,
        )}
      />
      {!reduceMotion ? (
        <motion.div
          className={cn(
            "absolute rounded-full bg-white/80 blur-[1px]",
            vertical ? "left-1/2 h-8 w-1 -translate-x-1/2" : "top-1/2 h-1 w-8 -translate-y-1/2",
          )}
          animate={
            vertical
              ? { y: ["-65%", "165%"] }
              : { x: ["-65%", "165%"] }
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ) : null}
    </div>
  );
}
