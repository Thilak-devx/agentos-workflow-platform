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
  detail: string;
  status: "live" | "linked" | "guarded";
  toneClassName: string;
};

type Connector = {
  id: string;
  d: string;
};

const connectorLayout: Connector[] = [
  { id: "sync-review", d: "M 50 52 C 82 52, 96 52, 128 52" },
  { id: "review-deploy", d: "M 158 52 C 190 52, 204 52, 236 52" },
  { id: "sync-guard", d: "M 34 72 C 34 90, 34 106, 34 124" },
  { id: "review-route", d: "M 142 72 C 142 90, 142 106, 142 124" },
  { id: "deploy-adapt", d: "M 250 72 C 250 90, 250 106, 250 124" },
  { id: "guard-route", d: "M 50 124 C 82 124, 96 124, 128 124" },
  { id: "route-adapt", d: "M 158 124 C 190 124, 204 124, 236 124" },
];

const nodeCenterDots = [
  { id: "dot-sync", className: "left-[11.333%] top-[26.667%]" },
  { id: "dot-review", className: "left-1/2 top-[26.667%]" },
  { id: "dot-deploy", className: "left-[88.667%] top-[26.667%]" },
  { id: "dot-guard", className: "left-[11.333%] top-[74%]" },
  { id: "dot-route", className: "left-1/2 top-[74%]" },
  { id: "dot-adapt", className: "left-[88.667%] top-[74%]" },
] as const;

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

function buildNodeStatus(index: number): TopologyNode["status"] {
  if (index === 2) return "live";
  if (index === 3) return "guarded";
  return "linked";
}

function buildNodeTone(status: TopologyNode["status"]) {
  switch (status) {
    case "live":
      return "border-cyan-300/22 bg-cyan-400/[0.11] shadow-[0_16px_48px_rgba(56,189,248,0.16)]";
    case "guarded":
      return "border-emerald-300/20 bg-emerald-400/[0.1] shadow-[0_16px_44px_rgba(16,185,129,0.14)]";
    default:
      return "border-white/8 bg-white/[0.035] shadow-[0_14px_36px_rgba(2,6,23,0.22)]";
  }
}

export function WorkflowTopologyVisualization({
  data,
  className,
}: WorkflowTopologyVisualizationProps) {
  const reduceMotion = useReducedMotion();

  const nodes = useMemo<TopologyNode[]>(
    () =>
      data.slice(0, 6).map((item, index) => {
        const status = buildNodeStatus(index);

        return {
          ...item,
          id: `topology-${item.label.toLowerCase()}`,
          detail: buildNodeDetail(item.label),
          status,
          toneClassName: buildNodeTone(status),
        };
      }),
    [data],
  );

  return (
    <div
      className={cn(
        "rounded-[26px] border border-white/8 bg-[#0a1019]/82 p-3 sm:p-4",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[560px]">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">
            Execution lanes
          </p>
          <Badge variant="emerald" className="shrink-0">
            Stable graph
          </Badge>
        </div>

        <div className="relative overflow-hidden rounded-[22px] border border-white/6 bg-white/[0.02] px-3 py-3 sm:px-4 sm:py-4">
          <div className="relative mx-auto w-full max-w-[520px]">
            <svg
              aria-hidden="true"
              viewBox="0 0 284 176"
              className="pointer-events-none absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="workflow-topology-stroke"
                  x1="0"
                  y1="0"
                  x2="284"
                  y2="176"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="rgba(125,211,252,0.16)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.42)" />
                  <stop offset="100%" stopColor="rgba(110,231,183,0.2)" />
                </linearGradient>
              </defs>

              {connectorLayout.map((connector, index) => (
                <motion.path
                  key={connector.id}
                  d={connector.d}
                  fill="none"
                  stroke="url(#workflow-topology-stroke)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="5 7"
                  animate={
                    reduceMotion
                      ? undefined
                      : { strokeDashoffset: [0, -24] }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 2.8 + index * 0.16,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "linear",
                        }
                  }
                />
              ))}
            </svg>

            <div className="pointer-events-none absolute inset-0">
              {nodeCenterDots.map((dot, index) => (
                <motion.span
                  key={dot.id}
                  className={cn(
                    "absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                    index === 2
                      ? "bg-cyan-200 shadow-[0_0_18px_rgba(147,231,255,0.7)]"
                      : index === 3
                        ? "bg-emerald-200 shadow-[0_0_16px_rgba(110,231,183,0.55)]"
                        : "bg-white/60 shadow-[0_0_12px_rgba(255,255,255,0.18)]",
                    dot.className,
                  )}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: [0.38, 1, 0.38],
                          scale: [1, 1.18, 1],
                        }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 2.4 + index * 0.18,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                />
              ))}
            </div>

            <div className="relative grid min-h-[214px] grid-cols-3 gap-x-4 gap-y-5 sm:min-h-[228px] sm:gap-x-5">
              {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  animate={
                    reduceMotion || node.status !== "live"
                      ? undefined
                      : {
                          scale: [1, 1.015, 1],
                          boxShadow: [
                            "0 16px 48px rgba(56,189,248,0.16)",
                            "0 18px 52px rgba(56,189,248,0.22)",
                            "0 16px 48px rgba(56,189,248,0.16)",
                          ],
                        }
                  }
                  transition={
                    reduceMotion || node.status !== "live"
                      ? undefined
                      : {
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  className={cn(
                    "relative z-10 flex min-h-[96px] w-full min-w-0 flex-col justify-between self-center rounded-[22px] border p-3 text-left backdrop-blur-xl sm:min-h-[104px] sm:p-3.5",
                    node.toneClassName,
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/34">
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
    </div>
  );
}
