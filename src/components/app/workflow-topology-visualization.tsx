"use client";

import { useMemo } from "react";
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

type TopologyNode = WorkflowTopologyMetric & {
  id: string;
  status: "live" | "linked" | "guarded";
  detail: string;
  accentClassName: string;
  gridClassName: string;
};

const connectorPaths = [
  "M 18 30 C 28 30, 34 30, 44 30",
  "M 52 30 C 62 30, 68 30, 78 30",
  "M 18 30 C 18 44, 18 58, 18 72",
  "M 44 30 C 44 44, 44 58, 44 72",
  "M 78 30 C 78 44, 78 58, 78 72",
  "M 18 72 C 28 72, 34 72, 44 72",
  "M 52 72 C 62 72, 68 72, 78 72",
] as const;

const pulseDurations = [3.2, 2.8, 3.4, 3.1, 3.5, 2.9, 3.3] as const;

function buildNodeDetail(label: string) {
  switch (label.toLowerCase()) {
    case "sync":
      return "Context aligned";
    case "review":
      return "Approval staged";
    case "deploy":
      return "Execution armed";
    case "guard":
      return "Policy shielded";
    case "route":
      return "Lane selected";
    case "adapt":
      return "Recovery ready";
    default:
      return "Operational";
  }
}

export function WorkflowTopologyVisualization({
  data,
  className,
}: WorkflowTopologyVisualizationProps) {
  const reduceMotion = useReducedMotion();

  const topologyNodes = useMemo<TopologyNode[]>(
    () =>
      data.slice(0, 6).map((item, index) => ({
        ...item,
        id: `topology-${item.label.toLowerCase()}`,
        status:
          index === 2 ? "live" : index === 3 ? "guarded" : "linked",
        detail: buildNodeDetail(item.label),
        accentClassName:
          index === 2
            ? "border-cyan-300/22 bg-cyan-400/[0.11] shadow-[0_16px_48px_rgba(56,189,248,0.16)]"
            : index === 3
              ? "border-emerald-300/20 bg-emerald-400/[0.1] shadow-[0_16px_44px_rgba(16,185,129,0.14)]"
              : "border-white/8 bg-white/[0.035] shadow-[0_14px_36px_rgba(2,6,23,0.22)]",
        gridClassName: [
          "col-start-1 row-start-1",
          "col-start-2 row-start-1",
          "col-start-3 row-start-1",
          "col-start-1 row-start-2",
          "col-start-2 row-start-2",
          "col-start-3 row-start-2",
        ][index] ?? "col-start-1 row-start-1",
      })),
    [data],
  );

  return (
    <div className={cn("rounded-[26px] border border-white/8 bg-[#0a1019]/82 p-3 sm:p-4", className)}>
      <div className="mx-auto w-full max-w-[560px]">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Execution lanes
          </p>
          <Badge variant="emerald" className="shrink-0">
            Stable graph
          </Badge>
        </div>

        <div className="relative mx-auto h-[218px] w-full sm:h-[236px] lg:h-[248px]">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="workflow-topology-stroke" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="rgba(125,211,252,0.16)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.44)" />
                <stop offset="100%" stopColor="rgba(110,231,183,0.18)" />
              </linearGradient>
            </defs>

            {connectorPaths.map((path) => (
              <path
                key={path}
                d={path}
                fill="none"
                stroke="url(#workflow-topology-stroke)"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeDasharray="4 7"
                opacity="0.88"
              />
            ))}

            {!reduceMotion
              ? connectorPaths.map((path, index) => (
                  <motion.circle
                    key={`${path}-pulse`}
                    r="1.35"
                    fill={index % 3 === 0 ? "#93e7ff" : index % 3 === 1 ? "#ffffff" : "#9ff7d1"}
                    animate={{ opacity: [0.28, 1, 0.28] }}
                    transition={{
                      duration: pulseDurations[index],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <animateMotion
                      dur={`${pulseDurations[index]}s`}
                      repeatCount="indefinite"
                      path={path}
                    />
                  </motion.circle>
                ))
              : null}
          </svg>

          <div className="relative grid h-full grid-cols-3 grid-rows-2 items-center justify-items-center gap-x-4 gap-y-5 sm:gap-x-5">
            {topologyNodes.map((node) => (
              <motion.div
                key={node.id}
                animate={
                  reduceMotion || node.status !== "live"
                    ? undefined
                    : { y: [0, -2, 0], boxShadow: [
                        "0 16px 48px rgba(56,189,248,0.16)",
                        "0 20px 52px rgba(56,189,248,0.22)",
                        "0 16px 48px rgba(56,189,248,0.16)",
                      ] }
                }
                transition={
                  reduceMotion || node.status !== "live"
                    ? undefined
                    : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                }
                className={cn(
                  "relative z-10 flex h-full w-full max-w-[148px] flex-col justify-between rounded-[22px] border p-3 text-left backdrop-blur-xl sm:max-w-[156px] sm:p-3.5",
                  node.gridClassName,
                  node.accentClassName,
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-[0.16em] text-white/34 uppercase">
                      {node.status}
                    </p>
                    <h4 className="mt-2 text-sm font-medium text-white sm:text-[0.95rem]">
                      {node.label}
                    </h4>
                  </div>
                  <span
                    className={cn(
                      "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full",
                      node.status === "live"
                        ? "bg-cyan-200 shadow-[0_0_18px_rgba(147,231,255,0.7)]"
                        : node.status === "guarded"
                          ? "bg-emerald-200 shadow-[0_0_16px_rgba(110,231,183,0.55)]"
                          : "bg-white/60",
                    )}
                  />
                </div>

                <div className="mt-3">
                  <p className="text-[1.35rem] font-semibold tracking-[-0.05em] text-white">
                    {node.value}%
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/48">
                    {node.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
