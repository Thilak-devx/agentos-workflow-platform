"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowRight,
  CheckCircle2,
  BookmarkPlus,
  BrainCircuit,
  Clock3,
  Coins,
  Command,
  FolderOpen,
  GitBranchPlus,
  History,
  LoaderCircle,
  Pause,
  Orbit,
  Pin,
  Play,
  RefreshCcw,
  Search,
  Shield,
  Sparkles,
  Users2,
  WandSparkles,
} from "lucide-react";
import {
  SavedWorkflow,
  WorkflowGenerationResult,
} from "@/lib/workflow-generation";
import { useWorkflowOperations } from "@/features/platform/hooks";
import {
  useWorkflowRuntimeData,
  useWorkflowRuntimeStore,
} from "@/features/workflows/store";
import {
  buildLocalWorkflowNarrative,
  generateLocalWorkflow,
} from "@/features/workflows/local-orchestrator";
import { WorkflowRuntimeRecord } from "@/features/workflows/types";
import { createStableKey } from "@/lib/react-keys";
import { cn } from "@/lib/utils";
import { useWorkflowStudioStore } from "@/store/workflow-studio-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useOperatorSession } from "@/components/providers/operator-provider";

const quickStartTemplates = [
  "Launch an NFT campaign",
  "Coordinate a smart contract audit",
  "Run a growth campaign",
  "Deploy a DAO contributor workflow",
];

const aiSuggestions = [
  "Design a multi-agent community activation sprint",
  "Prepare a treasury diversification operating plan",
  "Coordinate a protocol upgrade launch with audit review",
];

const fallbackStreamLines = [
  "Treasury routing policy refreshed",
  "Review queue reduced to 2 items",
  "Execution summary archived",
  "2 agents awaiting review",
  "Workflow checkpoint committed",
];

const operationalMetadata = [
  {
    label: "Approvals",
    value: "Treasury routing policy refreshed",
    detail: "Policy routing refreshed",
  },
  {
    label: "Workflows",
    value: "Review queue reduced to 2 items",
    detail: "2 agents awaiting review",
  },
  {
    label: "Memory",
    value: "Workflow checkpoint committed",
    detail: "Checkpoint integrity stable",
  },
];

const agentPreviewNodes = [
  { name: "Research Agent", detail: "Signal mapping", icon: BrainCircuit },
  { name: "Treasury Guard", detail: "Budget gating", icon: Shield },
  { name: "Ops Sentinel", detail: "Execution routing", icon: Orbit },
  { name: "Support Relay", detail: "Escalation handling", icon: Users2 },
];

type StreamPhase =
  | "idle"
  | "connecting"
  | "streaming"
  | "retrying"
  | "unavailable"
  | "recovered";

type HistoryMode = "history" | "saved";

type WorkflowCategory =
  | "Treasury"
  | "Growth"
  | "Security"
  | "Community"
  | "Operations";

const streamPhaseCopy: Record<
  StreamPhase,
  {
    label: string;
    status: string;
    tone: "cyan" | "emerald" | "violet";
  }
> = {
  idle: {
    label: "Idle",
    status: "System standing by.",
    tone: "violet",
  },
  connecting: {
    label: "Syncing",
    status: "Preparing the response pipeline.",
    tone: "cyan",
  },
  streaming: {
    label: "Active",
    status: "Workflow insights are updating live.",
    tone: "cyan",
  },
  retrying: {
    label: "Recovering",
    status: "Reconnecting the response pipeline.",
    tone: "violet",
  },
  unavailable: {
    label: "Idle",
    status: "Workflow orchestration paused.",
    tone: "violet",
  },
  recovered: {
    label: "Active",
    status: "Workflow insights recovered.",
    tone: "emerald",
  },
};

const workflowHealthSignals = [
  "Confidence 0.97",
  "Balanced load",
  "Approval ready",
  "Memory synced",
] as const;

function getWorkflowCategory(prompt: string) {
  const lowered = prompt.toLowerCase();

  if (
    lowered.includes("treasury") ||
    lowered.includes("payout") ||
    lowered.includes("allocation")
  ) {
    return "Treasury";
  }

  if (lowered.includes("audit") || lowered.includes("security")) {
    return "Security";
  }

  if (
    lowered.includes("community") ||
    lowered.includes("contributor") ||
    lowered.includes("dao")
  ) {
    return "Community";
  }

  if (
    lowered.includes("growth") ||
    lowered.includes("campaign") ||
    lowered.includes("nft")
  ) {
    return "Growth";
  }

  return "Operations";
}

function getApprovalState(workflow: WorkflowGenerationResult) {
  if (workflow.totalEstimatedCostUsd >= 20000) return "2 approvals";
  if (workflow.totalEstimatedCostUsd >= 8000) return "1 approval";
  return "Auto-cleared";
}

function getEstimatedDuration(workflow: WorkflowGenerationResult) {
  const totalHours = workflow.stages.reduce(
    (sum, stage) =>
      sum +
      stage.tasks.reduce((taskSum, task) => taskSum + task.estimatedHours, 0),
    0,
  );

  if (totalHours >= 48) return "3-5 days";
  if (totalHours >= 24) return "1-3 days";
  return "< 1 day";
}

function getSeverityTone(detail: string) {
  const lowered = detail.toLowerCase();

  if (
    lowered.includes("approval") ||
    lowered.includes("checkpoint") ||
    lowered.includes("review")
  ) {
    return "violet" as const;
  }

  if (
    lowered.includes("reroute") ||
    lowered.includes("recovery") ||
    lowered.includes("retry")
  ) {
    return "emerald" as const;
  }

  return "cyan" as const;
}

function sleep(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - date.getTime()) / 60000),
  );

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getWorkflowComplexity(workflow: WorkflowGenerationResult) {
  const totalTasks = workflow.stages.reduce(
    (count, stage) => count + stage.tasks.length,
    0,
  );

  if (totalTasks >= 12) return "High";
  if (totalTasks >= 7) return "Moderate";
  return "Lean";
}

function getWorkflowConfidence(workflow: WorkflowGenerationResult) {
  const signal =
    0.86 +
    Math.min(workflow.suggestedAgents.length, 5) * 0.014 +
    Math.min(workflow.stages.length, 5) * 0.01;

  return Math.min(signal, 0.98).toFixed(2);
}

function getWorkflowAgentCount(workflow: WorkflowGenerationResult) {
  return (
    workflow.suggestedAgents.length || workflow.contributorAssignments.length
  );
}

function TerminalPlaceholder({
  phase,
  showRecoveryIndicator,
}: {
  phase: StreamPhase;
  showRecoveryIndicator: boolean;
}) {
  const placeholderWidths = ["w-[88%]", "w-[68%]", "w-[76%]"];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[10px] tracking-[0.14em] text-white/32 uppercase">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/40" />
        {showRecoveryIndicator
          ? "Recovering session"
          : "Awaiting next execution cycle"}
      </div>
      <div className="space-y-2.5">
        {placeholderWidths.map((width) => (
          <div
            key={width}
            className={cn(
              "h-2.5 animate-pulse rounded-full bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.03]",
              width,
            )}
          />
        ))}
      </div>
      {phase === "retrying" || phase === "unavailable" ? (
        <div className="rounded-[14px] bg-white/[0.03] px-3 py-2.5">
          <div className="space-y-1.5 text-[13px] leading-6 text-white/62">
            {fallbackStreamLines.slice(0, 3).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getOperationalTimestamp(index: number) {
  const baseDate = new Date();
  baseDate.setSeconds(baseDate.getSeconds() - index * 18);

  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(baseDate);
}

function OperationalStateBadge({
  label,
  tone,
}: {
  label: string;
  tone: "cyan" | "emerald" | "violet";
}) {
  const toneClasses = {
    cyan: {
      shell: "border-cyan-300/16 bg-cyan-400/[0.08] text-cyan-50",
      dot: "bg-cyan-300 shadow-[0_0_14px_rgba(147,231,255,0.75)]",
    },
    emerald: {
      shell: "border-emerald-300/16 bg-emerald-400/[0.08] text-emerald-50",
      dot: "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.78)]",
    },
    violet: {
      shell: "border-fuchsia-300/14 bg-fuchsia-400/[0.08] text-fuchsia-50",
      dot: "bg-fuchsia-300 shadow-[0_0_14px_rgba(216,180,254,0.75)]",
    },
  }[tone];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] uppercase backdrop-blur-xl",
        toneClasses.shell,
      )}
    >
      <motion.span
        className={cn("h-2 w-2 rounded-full", toneClasses.dot)}
        animate={{ opacity: [0.45, 1, 0.45], scale: [0.95, 1.08, 0.95] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      />
      {label}
    </div>
  );
}

function CommandLibraryItem({
  label,
  meta,
  detail,
  badge,
  category,
  pinned,
  archived,
  recent,
  onPin,
  onArchive,
  onClick,
}: {
  label: string;
  meta: string;
  detail: string;
  badge: string;
  category: WorkflowCategory | "History";
  pinned?: boolean;
  archived?: boolean;
  recent?: boolean;
  onPin?: () => void;
  onArchive?: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group rounded-[22px] border p-4 transition duration-200",
        archived
          ? "border-white/5 bg-white/[0.02] opacity-72"
          : "border-white/8 bg-white/[0.04] hover:-translate-y-0.5 hover:border-cyan-300/18 hover:bg-white/[0.07]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={onClick} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-white">{label}</p>
            {recent ? (
              <span className="rounded-full border border-emerald-300/18 bg-emerald-400/[0.08] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-emerald-50">
                Recent
              </span>
            ) : null}
            {pinned ? (
              <span className="rounded-full border border-cyan-300/16 bg-cyan-400/[0.08] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-50">
                Pinned
              </span>
            ) : null}
            {archived ? (
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/38">
                Archived
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-white/36">{meta}</p>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/40 uppercase">
            {badge}
          </span>
          <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/40 uppercase">
            {category}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="mt-3 block w-full text-left text-sm leading-6 text-white/52"
      >
        {detail}
      </button>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/42 transition hover:border-cyan-300/18 hover:text-white"
        >
          <Play className="h-3.5 w-3.5" />
          Replay
        </button>
        {onPin ? (
          <button
            type="button"
            onClick={onPin}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/42 transition hover:border-cyan-300/18 hover:text-white"
          >
            <Pin className="h-3.5 w-3.5" />
            {pinned ? "Unpin" : "Pin"}
          </button>
        ) : null}
        {onArchive ? (
          <button
            type="button"
            onClick={onArchive}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/42 transition hover:border-cyan-300/18 hover:text-white"
          >
            <Archive className="h-3.5 w-3.5" />
            {archived ? "Restore" : "Archive"}
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}

function SavedWorkflowCard({
  workflow,
  pinned,
  archived,
  onTogglePin,
  onToggleArchive,
  onSelect,
}: {
  workflow: SavedWorkflow;
  pinned: boolean;
  archived: boolean;
  onTogglePin: () => void;
  onToggleArchive: () => void;
  onSelect: (workflow: WorkflowGenerationResult, prompt: string) => void;
}) {
  return (
    <CommandLibraryItem
      label={workflow.workflow.title}
      meta={`${formatRelativeTime(workflow.createdAt)} · ${getWorkflowAgentCount(workflow.workflow)} agents · ${getWorkflowComplexity(workflow.workflow)} complexity`}
      detail={workflow.workflow.summary}
      badge={`C ${getWorkflowConfidence(workflow.workflow)}`}
      category={getWorkflowCategory(workflow.prompt)}
      pinned={pinned}
      archived={archived}
      recent={Date.now() - new Date(workflow.createdAt).getTime() < 1000 * 60 * 90}
      onPin={onTogglePin}
      onArchive={onToggleArchive}
      onClick={() => onSelect(workflow.workflow, workflow.prompt)}
    />
  );
}

function HistoryPromptCard({
  prompt,
  recent,
  onSelect,
}: {
  prompt: string;
  recent: boolean;
  onSelect: () => void;
}) {
  return (
    <CommandLibraryItem
      label={prompt}
      meta="Prompt history · Ready to regenerate"
      detail="Reopen this operational brief and issue a fresh orchestration pass."
      badge="Queued"
      category="History"
      recent={recent}
      onClick={onSelect}
    />
  );
}

function EmptyCommandLibrary({
  mode,
  onAction,
}: {
  mode: HistoryMode;
  onAction: () => void;
}) {
  const Icon = mode === "saved" ? FolderOpen : History;

  return (
    <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-100 shadow-[0_16px_40px_rgba(8,15,30,0.2)]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-base font-medium text-white">
        {mode === "saved"
          ? "No workflows saved yet."
          : "No prompts issued yet."}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/46">
        {mode === "saved"
          ? "Generate operational sequences to build your command library."
          : "Start with a goal and AgentOS will turn it into a structured execution plan."}
      </p>
      <Button variant="secondary" size="sm" onClick={onAction} className="mt-5">
        <Sparkles className="h-4 w-4" />
        {mode === "saved" ? "Generate first workflow" : "Load a smart prompt"}
      </Button>
    </div>
  );
}

function WorkflowPreviewCard({
  workflow,
  runtimeWorkflow,
}: {
  workflow: WorkflowGenerationResult | null;
  runtimeWorkflow?: WorkflowRuntimeRecord | null;
}) {
  const agentNames = workflow?.suggestedAgents ?? [];
  const executionDuration = workflow ? getEstimatedDuration(workflow) : "1-3 days";
  const approvalState = workflow ? getApprovalState(workflow) : "1 approval";
  const liveNodes = runtimeWorkflow?.nodes ?? [];

  return (
    <GlassCard className="h-full p-5" glow="violet">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">
            Orchestration preview
          </p>
          <p className="mt-1 text-sm leading-6 text-white/48">
            Cross-agent routing across research, treasury, operations, and
            support.
          </p>
        </div>
        <Badge variant="violet">
          <GitBranchPlus className="h-3.5 w-3.5" />
          Live map
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/42">
          {approvalState}
        </span>
        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/42">
          {executionDuration}
        </span>
        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/42">
          {workflow ? `Health ${getWorkflowConfidence(workflow)}` : "Health 0.94"}
        </span>
        {runtimeWorkflow ? (
          <span className="rounded-full border border-cyan-300/14 bg-cyan-400/[0.06] px-2.5 py-1 text-[11px] text-cyan-50/88">
            {runtimeWorkflow.progress}% sequenced
          </span>
        ) : null}
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
        <div className="pointer-events-none absolute inset-0 hidden sm:block">
          <div className="absolute top-[28%] left-1/2 h-px w-[34%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/36 to-transparent" />
          <div className="absolute top-[72%] left-1/2 h-px w-[34%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/28 to-transparent" />
          <div className="absolute top-1/2 left-1/2 h-[42%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/12 to-transparent" />
          <motion.div
            className="absolute top-[27%] left-[30%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(147,231,255,0.9)]"
            animate={{ x: [0, 96, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[71%] left-[42%] h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]"
            animate={{ x: [0, 88, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
          />
        </div>

        {(liveNodes.length
          ? liveNodes.map((node) => ({
              name: node.name,
              detail: `${node.role} · ${node.phase}`,
              icon:
                node.role === "Treasury"
                  ? Shield
                  : node.role === "Support"
                    ? Users2
                    : node.role === "Operations"
                      ? Orbit
                      : BrainCircuit,
              status: node.status,
              progress: node.progress,
            }))
          : agentPreviewNodes.map((node) => ({
              ...node,
              status: "standby" as const,
              progress: 22,
            }))).map((node) => {
          const Icon = node.icon;
          const highlighted = agentNames.some((agent) =>
            agent.toLowerCase().includes(node.name.split(" ")[0].toLowerCase()),
          );
          const active = node.status === "active" || node.status === "rerouting";
          const waiting = node.status === "waiting";

          return (
            <div
              key={node.name}
              className={cn(
                "relative rounded-[22px] border p-4 transition duration-200",
                active
                  ? "border-cyan-300/20 bg-cyan-400/[0.06]"
                  : waiting
                    ? "border-fuchsia-300/18 bg-fuchsia-400/[0.05]"
                    : highlighted
                  ? "border-cyan-300/18 bg-cyan-400/[0.05]"
                  : "border-white/8 bg-white/[0.03]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] text-cyan-100">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">{node.name}</p>
                  <p className="text-sm text-white/44">{node.detail}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/40">
                <span>
                  {active
                    ? "Executing"
                    : waiting
                      ? "Awaiting review"
                      : highlighted
                        ? "Assigned"
                        : "Standby"}
                </span>
                <span>
                  {active
                    ? "Signal moving"
                    : waiting
                      ? "Approval hold"
                      : highlighted
                        ? "Confidence linked"
                        : "Available lane"}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    active
                      ? "bg-cyan-300/80"
                      : waiting
                        ? "bg-fuchsia-300/72"
                        : highlighted
                          ? "bg-cyan-300/75"
                          : "bg-white/10",
                  )}
                  animate={{
                    width: active
                      ? [`${Math.max(node.progress - 12, 14)}%`, `${Math.min(node.progress + 12, 100)}%`, `${node.progress}%`]
                      : waiting
                        ? ["58%", "66%", "58%"]
                        : highlighted
                          ? ["32%", "74%", "58%"]
                          : ["18%", "24%", "18%"],
                  }}
                  transition={{ repeat: Infinity, duration: 3.8 + (highlighted ? 0.2 : 0.6), ease: "easeInOut" }}
                />
              </div>
              {active ? (
                <motion.span
                  className="absolute top-4 right-4 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.82)]"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.08, 0.95] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function GeneratedWorkflowView({
  workflow,
  runtimeWorkflow,
  onSave,
  isSaving,
  onPauseResume,
  onReroute,
  onComplete,
}: {
  workflow: WorkflowGenerationResult;
  runtimeWorkflow?: WorkflowRuntimeRecord | null;
  onSave: () => void;
  isSaving: boolean;
  onPauseResume: () => void;
  onReroute: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-4">
      <GlassCard className="p-5 sm:p-6" glow="cyan">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="cyan">
              <Sparkles className="h-3.5 w-3.5" />
              AI-generated workflow
            </Badge>
            <h2 className="mt-4 text-[clamp(1.75rem,2vw,2.35rem)] font-semibold tracking-[-0.05em] text-white">
              {workflow.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
              {workflow.summary}
            </p>
            {runtimeWorkflow ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-300/14 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] text-cyan-50/88">
                  {runtimeWorkflow.runtimeStatus}
                </span>
                <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/42">
                  {runtimeWorkflow.progress}% progress
                </span>
                <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/42">
                  {runtimeWorkflow.priority} priority
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {runtimeWorkflow ? (
              <>
                <Button variant="ghost" size="sm" onClick={onPauseResume}>
                  {runtimeWorkflow.runtimeStatus === "paused" ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                  {runtimeWorkflow.runtimeStatus === "paused" ? "Resume" : "Pause"}
                </Button>
                <Button variant="ghost" size="sm" onClick={onReroute}>
                  <RefreshCcw className="h-4 w-4" />
                  Reroute
                </Button>
                <Button variant="ghost" size="sm" onClick={onComplete}>
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </Button>
              </>
            ) : null}
            <Button variant="secondary" onClick={onSave} disabled={isSaving}>
              <BookmarkPlus className="h-4 w-4" />
              {isSaving ? "Saved" : "Save workflow"}
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
            <Clock3 className="h-4 w-4 text-cyan-100" />
            <p className="mt-3 text-[11px] tracking-[0.16em] text-white/34 uppercase">
              Timeline
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {workflow.estimatedTimeline}
            </p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
            <Coins className="h-4 w-4 text-cyan-100" />
            <p className="mt-3 text-[11px] tracking-[0.16em] text-white/34 uppercase">
              Estimated cost
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              ${workflow.totalEstimatedCostUsd.toLocaleString()}
            </p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
            <Users2 className="h-4 w-4 text-cyan-100" />
            <p className="mt-3 text-[11px] tracking-[0.16em] text-white/34 uppercase">
              Assignments
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {workflow.contributorAssignments.length}
            </p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
            <BrainCircuit className="h-4 w-4 text-cyan-100" />
            <p className="mt-3 text-[11px] tracking-[0.16em] text-white/34 uppercase">
              Confidence
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {getWorkflowConfidence(workflow)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            `${getApprovalState(workflow)}`,
            `${getEstimatedDuration(workflow)} execution`,
            `${workflow.stages.length} dependency chains`,
            `${workflow.suggestedAgents.length || workflow.contributorAssignments.length} active agents`,
          ].map((signal) => (
            <span
              key={signal}
              className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/42"
            >
              {signal}
            </span>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="p-5" glow="violet">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Workflow stages
            </h3>
            <Badge variant="violet">{workflow.stages.length} stages</Badge>
          </div>
          <div className="space-y-3">
            {workflow.stages.map((stage, index) => (
              <details
                key={stage.name}
                open={index === 0}
                className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">
                        {stage.name}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/46">
                        {stage.goal}
                      </p>
                    </div>
                    <Badge variant="cyan">{stage.duration}</Badge>
                  </div>
                </summary>
                <div className="mt-4 space-y-3">
                  {stage.tasks.map((task) => (
                    <div
                      key={task.title}
                      className="rounded-[20px] border border-white/8 bg-black/10 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-medium text-white">{task.title}</p>
                        <span className="text-xs text-white/38">
                          {task.assignedAgent}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/50">
                        {task.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {task.contributors.map((contributor) => (
                          <Badge key={contributor} variant="cyan">
                            {contributor}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/38">
                        <span>{task.estimatedHours}h</span>
                        <span>${task.estimatedCostUsd.toLocaleString()}</span>
                        <span>{task.assignedAgent.includes("Treasury") ? "Approval checkpoint" : "Execution ready"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-4">
          <WorkflowPreviewCard
            workflow={workflow}
            runtimeWorkflow={runtimeWorkflow}
          />

          <GlassCard className="p-5" glow="emerald">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                AI reasoning panel
              </h3>
              <Badge variant="emerald">Interpretation</Badge>
            </div>
            <p className="text-sm leading-7 text-white/56">
              {workflow.reasoning}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {workflow.suggestedAgents.map((agent) => (
                <Badge key={agent} variant="emerald">
                  {agent}
                </Badge>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" glow="cyan">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Contributor assignments
              </h3>
              <Badge variant="cyan">Generated staffing</Badge>
            </div>
            <div className="space-y-3">
              {workflow.contributorAssignments.map((assignment) => (
                <div
                  key={`${assignment.role}-${assignment.owner}`}
                  className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-white">{assignment.role}</p>
                    <span className="text-xs text-white/38">
                      {assignment.owner}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    {assignment.focus}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" glow="violet">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Timeline and treasury
              </h3>
              <Badge variant="violet">Operational plan</Badge>
            </div>
            <div className="space-y-3">
              {workflow.timeline.map((phase) => (
                <div
                  key={phase.phase}
                  className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-white">{phase.phase}</p>
                    <span className="text-xs text-white/38">
                      {phase.duration}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {phase.deliverables.map((deliverable) => (
                      <Badge key={deliverable} variant="violet">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              {workflow.treasuryEstimates.map((estimate) => (
                <div
                  key={estimate.category}
                  className="rounded-[20px] border border-white/8 bg-black/10 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-white">
                      {estimate.category}
                    </p>
                    <span className="text-xs text-white/38">
                      ${estimate.amountUsd.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    {estimate.rationale}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" glow="emerald">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Operational recommendations
              </h3>
              <Badge variant="emerald">AI suggestions</Badge>
            </div>
            <div className="space-y-2">
              {workflow.operationalRecommendations.map((recommendation) => (
                <div
                  key={recommendation}
                  className="rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/58"
                >
                  {recommendation}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export function WorkflowGeneratorStudio() {
  const { operator } = useOperatorSession();
  const { saveWorkflow: persistWorkflow, isSavingWorkflow } =
    useWorkflowOperations(operator);
  const { activeWorkflow } = useWorkflowRuntimeData();
  const beginGeneration = useWorkflowRuntimeStore(
    (state) => state.beginGeneration,
  );
  const advanceParsing = useWorkflowRuntimeStore((state) => state.advanceParsing);
  const markStreaming = useWorkflowRuntimeStore((state) => state.markStreaming);
  const finalizeGeneration = useWorkflowRuntimeStore(
    (state) => state.finalizeGeneration,
  );
  const markGenerationError = useWorkflowRuntimeStore(
    (state) => state.markGenerationError,
  );
  const setWorkflowStatus = useWorkflowRuntimeStore(
    (state) => state.setWorkflowStatus,
  );
  const parsingStages = useWorkflowRuntimeStore((state) => state.parsingStages);
  const generationStatus = useWorkflowRuntimeStore(
    (state) => state.generationStatus,
  );
  const {
    promptHistory,
    savedWorkflows,
    pinnedWorkflowIds,
    archivedWorkflowIds,
    addPromptToHistory,
    saveWorkflow,
    togglePinnedWorkflow,
    toggleArchivedWorkflow,
  } = useWorkflowStudioStore();
  const [prompt, setPrompt] = useState(quickStartTemplates[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamPhase, setStreamPhase] = useState<StreamPhase>("idle");
  const [status, setStatus] = useState(streamPhaseCopy.idle.status);
  const [streamedResponse, setStreamedResponse] = useState("");
  const [generatedWorkflow, setGeneratedWorkflow] =
    useState<WorkflowGenerationResult | null>(null);
  const [savedWorkflowId, setSavedWorkflowId] = useState<string | null>(null);
  const [fallbackFrame, setFallbackFrame] = useState(0);
  const [historyMode, setHistoryMode] = useState<HistoryMode>("history");
  const [librarySearch, setLibrarySearch] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [shortcutHint, setShortcutHint] = useState("Cmd/Ctrl + Enter");
  const parsingTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (parsingTimerRef.current) {
        window.clearInterval(parsingTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (streamPhase !== "retrying" && streamPhase !== "unavailable") {
      setFallbackFrame(0);
      return;
    }

    const timer = window.setInterval(() => {
      setFallbackFrame((current) =>
        Math.min(current + 1, fallbackStreamLines.length),
      );
    }, 420);

    return () => window.clearInterval(timer);
  }, [streamPhase]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShortcutHint(
      navigator.userAgent.includes("Mac") ? "Cmd + Enter" : "Ctrl + Enter",
    );
  }, []);

  const hasSavedCurrentWorkflow = useMemo(
    () =>
      generatedWorkflow
        ? savedWorkflows.some(
            (item) => item.workflow.title === generatedWorkflow.title,
          )
        : false,
    [generatedWorkflow, savedWorkflows],
  );

  const streamPhaseMeta = streamPhaseCopy[streamPhase];
  const fallbackOutput = fallbackStreamLines.slice(
    0,
    Math.max(fallbackFrame, 3),
  );
  const terminalOutput = streamedResponse.trim();
  const workflowForDisplay = generatedWorkflow ?? activeWorkflow?.workflow ?? null;
  const runtimeWorkflowForDisplay =
    workflowForDisplay && activeWorkflow?.workflow.title === workflowForDisplay.title
      ? activeWorkflow
      : activeWorkflow ?? null;
  const trimmedLibrarySearch = librarySearch.trim().toLowerCase();
  const showRecoveryIndicator =
    streamPhase === "retrying" || streamPhase === "connecting";
  const filteredHistory = promptHistory.filter((historyItem) =>
    trimmedLibrarySearch ? historyItem.toLowerCase().includes(trimmedLibrarySearch) : true,
  );
  const filteredSavedWorkflows = savedWorkflows
    .filter((workflow) =>
      trimmedLibrarySearch
        ? [workflow.prompt, workflow.workflow.title, workflow.workflow.summary]
            .join(" ")
            .toLowerCase()
            .includes(trimmedLibrarySearch)
        : true,
    )
    .sort((a, b) => {
      const aPinned = pinnedWorkflowIds.includes(a.id) ? 1 : 0;
      const bPinned = pinnedWorkflowIds.includes(b.id) ? 1 : 0;
      return bPinned - aPinned;
    });
  const commandLibraryCount =
    historyMode === "history" ? filteredHistory.length : filteredSavedWorkflows.length;
  const operationalSummary = workflowForDisplay
    ? [
        `Confidence ${getWorkflowConfidence(workflowForDisplay)}`,
        getApprovalState(workflowForDisplay),
        getEstimatedDuration(workflowForDisplay),
      ]
    : [...workflowHealthSignals];
  const displayedLogLines = useMemo(() => {
    const runtimeLines = runtimeWorkflowForDisplay?.terminal ?? [];
    if (runtimeLines.length) {
      return runtimeLines.slice(-6).map((entry, index, collection) => ({
        id: entry.id,
        line: entry.message,
        timestamp: getOperationalTimestamp(collection.length - index),
        tone: entry.tone,
      }));
    }

    if (generationStatus === "parsing" && parsingStages.length) {
      return parsingStages.slice(-6).map((stage, index, collection) => ({
        id: stage.id,
        line: `${stage.label.replace("...", "")} ${stage.detail}`,
        timestamp: getOperationalTimestamp(collection.length - index),
        tone: stage.state === "completed" ? "emerald" : "cyan",
      }));
    }

    const sourceLines = terminalOutput
      ? terminalOutput
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : streamPhase === "retrying" || streamPhase === "unavailable"
        ? fallbackOutput
        : [];

    return sourceLines.slice(-6).map((line, index) => ({
      id: createStableKey("workflow-stream-line", index, line),
      line,
      timestamp: getOperationalTimestamp(sourceLines.length - index),
      tone: getSeverityTone(line),
    }));
  }, [
    fallbackOutput,
    generationStatus,
    parsingStages,
    runtimeWorkflowForDisplay,
    streamPhase,
    terminalOutput,
  ]);

  async function runGenerationRequest(targetPrompt: string): Promise<void> {
    const workflow = generateLocalWorkflow(targetPrompt);
    const narrative = buildLocalWorkflowNarrative(targetPrompt, workflow);

    setStatus("Interpreting workflow intent locally.");
    await sleep(460);

    setStreamPhase("streaming");
    setStatus("Constructing orchestration lanes.");
    markStreaming();
    await sleep(320);

    for (const [index, line] of narrative.lines.entries()) {
      setStreamedResponse((current) => `${current}${current ? "\n" : ""}${line}`);
      setStatus(
        narrative.statusMessages[
          Math.min(index, narrative.statusMessages.length - 1)
        ] ?? streamPhaseCopy.streaming.status,
      );
      await sleep(index === 0 ? 380 : 260 + index * 40);
    }

    setGeneratedWorkflow(workflow);
    finalizeGeneration(targetPrompt, workflow);
    setStreamPhase("recovered");
    setStatus("Workflow generated successfully.");
    void persistWorkflow({
      prompt: targetPrompt,
      workflow,
    });
  }

  async function handleGenerate(nextPrompt?: string) {
    const targetPrompt = (nextPrompt ?? prompt).trim();
    if (!targetPrompt || isGenerating) return;

    setPrompt(targetPrompt);
    setIsGenerating(true);
    setStreamPhase("connecting");
    setStatus(streamPhaseCopy.connecting.status);
    setStreamedResponse("");
    setGeneratedWorkflow(null);
    setSavedWorkflowId(null);
    addPromptToHistory(targetPrompt);
    setHistoryMode("history");
    beginGeneration(targetPrompt);

    if (parsingTimerRef.current) {
      window.clearInterval(parsingTimerRef.current);
    }
    parsingTimerRef.current = window.setInterval(() => {
      advanceParsing();
    }, 760);

    try {
      await runGenerationRequest(targetPrompt);
    } catch {
      setStreamPhase("unavailable");
      setStatus("Workflow orchestration paused.");
      markGenerationError();
    } finally {
      if (parsingTimerRef.current) {
        window.clearInterval(parsingTimerRef.current);
        parsingTimerRef.current = null;
      }
      setIsGenerating(false);
    }
  }

  function handleSaveCurrentWorkflow() {
    if (!generatedWorkflow || hasSavedCurrentWorkflow) return;
    saveWorkflow(prompt, generatedWorkflow);
    void persistWorkflow({ prompt, workflow: generatedWorkflow });
    setSavedWorkflowId(generatedWorkflow.title);
    setHistoryMode("saved");
  }

  function handleSelectSavedWorkflow(
    workflow: WorkflowGenerationResult,
    savedPrompt: string,
  ) {
    setPrompt(savedPrompt);
    setGeneratedWorkflow(workflow);
    setStreamedResponse("");
    setStreamPhase("recovered");
    setStatus("Loaded saved workflow.");
    setSavedWorkflowId(workflow.title);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="h-full"
        >
          <GlassCard className="h-full p-5 sm:p-6" glow="cyan">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <Badge variant="cyan">
                  <WandSparkles className="h-3.5 w-3.5" />
                  Local orchestration engine
                </Badge>
                <h2 className="mt-4 text-[clamp(1.95rem,2.4vw,2.9rem)] font-semibold tracking-[-0.055em] text-white">
                  Command autonomous operations with intent
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/56">
                  Turn a single instruction into a coordinated execution plan
                  with agent assignments, treasury estimates, and operational
                  sequencing.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/42">
                Powered by local procedural intelligence
              </div>
            </div>

            <div
              className={cn(
                "mt-6 rounded-[30px] border bg-[linear-gradient(180deg,rgba(5,10,18,0.84),rgba(8,12,20,0.96))] p-4 transition duration-300 sm:p-5",
                inputFocused
                  ? "border-cyan-300/22 shadow-[0_0_0_1px_rgba(103,232,249,0.18),0_24px_80px_rgba(8,15,30,0.28)]"
                  : "border-white/10 shadow-[0_16px_50px_rgba(2,6,23,0.22)]",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.05] text-cyan-100">
                    <Command className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Workflow command
                    </p>
                    <p className="text-xs text-white/38">
                      Natural language to execution graph
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] tracking-[0.14em] text-white/38 uppercase">
                  {shortcutHint}
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3">
                <span className="pt-2 font-mono text-sm text-cyan-100/72">
                  &gt;
                </span>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={(event) => {
                    if (
                      (event.metaKey || event.ctrlKey) &&
                      event.key === "Enter"
                    ) {
                      event.preventDefault();
                      void handleGenerate();
                    }
                  }}
                  placeholder="Describe the workflow you want AgentOS to generate"
                  className="min-h-32 w-full resize-none bg-transparent text-base leading-8 text-white outline-none placeholder:text-white/30"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {quickStartTemplates.map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => setPrompt(template)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/54 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.07] hover:text-white"
                  >
                    {template}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid gap-2 sm:grid-cols-3">
                  {aiSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void handleGenerate(suggestion)}
                      className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-left text-sm leading-6 text-white/60 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/18 hover:bg-white/[0.06] hover:text-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => void handleGenerate()}
                  disabled={isGenerating}
                  className="min-w-[196px]"
                >
                  {isGenerating ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  {isGenerating ? "Generating workflow" : "Generate workflow"}
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1.25fr_0.75fr_1fr]">
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-[11px] tracking-[0.14em] text-white/34 uppercase">
                  Execution readiness
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {workflowForDisplay ? "Dependency map prepared" : "Multi-agent planning"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(workflowForDisplay?.suggestedAgents.slice(0, 2) ?? ["Research Agent", "Ops Sentinel"]).map((agent) => (
                    <span
                      key={agent}
                      className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/42"
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-[11px] tracking-[0.14em] text-white/34 uppercase">
                  Approval
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {workflowForDisplay ? getApprovalState(workflowForDisplay) : "1 approval"}
                </p>
                <p className="mt-2 text-xs text-white/40">
                  Sensitive routing remains operator-aware
                </p>
              </div>
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-[11px] tracking-[0.14em] text-white/34 uppercase">
                  Live indicators
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {operationalSummary.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/42"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.04 }}
          className="h-full"
        >
          <GlassCard className="flex h-full flex-col p-5 sm:p-6" glow="violet">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Command library
                </h3>
                <p className="mt-1 text-sm leading-6 text-white/46">
                  Regenerate prior prompts or reopen saved operating plans.
                </p>
              </div>
              <Badge variant="violet">{commandLibraryCount} items</Badge>
            </div>

            <div className="mt-5 inline-flex w-fit rounded-full border border-white/8 bg-white/[0.03] p-1">
              {(
                [
                  ["history", "History", History],
                  ["saved", "Saved", FolderOpen],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setHistoryMode(value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition duration-200",
                    historyMode === value
                      ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "text-white/46 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-3.5 py-3">
              <Search className="h-4 w-4 text-white/34" />
              <input
                value={librarySearch}
                onChange={(event) => setLibrarySearch(event.target.value)}
                placeholder="Search workflows, prompts, or categories"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
              />
            </div>

            <div className="mt-5 flex-1 space-y-3">
              {historyMode === "history" ? (
                filteredHistory.length === 0 ? (
                  <EmptyCommandLibrary
                    mode="history"
                    onAction={() => setPrompt(aiSuggestions[0])}
                  />
                ) : (
                  filteredHistory.map((historyItem, index) => (
                    <HistoryPromptCard
                      key={historyItem}
                      prompt={historyItem}
                      recent={index < 2}
                      onSelect={() => setPrompt(historyItem)}
                    />
                  ))
                )
              ) : filteredSavedWorkflows.length === 0 ? (
                <EmptyCommandLibrary
                  mode="saved"
                  onAction={() => void handleGenerate()}
                />
              ) : (
                filteredSavedWorkflows.map((workflow) => (
                  <SavedWorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    pinned={pinnedWorkflowIds.includes(workflow.id)}
                    archived={archivedWorkflowIds.includes(workflow.id)}
                    onTogglePin={() => togglePinnedWorkflow(workflow.id)}
                    onToggleArchive={() => toggleArchivedWorkflow(workflow.id)}
                    onSelect={handleSelectSavedWorkflow}
                  />
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.94fr_1.06fr]">
        <GlassCard className="p-4 sm:p-5" glow="none">
          <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-[1.02rem] font-semibold tracking-[-0.02em] text-white">
                Streaming AI response
              </h3>
              <p className="mt-1 max-w-lg text-sm leading-6 text-white/46">
                Planning, approvals, reroutes, and execution summaries update here in sequence.
              </p>
            </div>
            <OperationalStateBadge
              label={streamPhaseMeta.label}
              tone={streamPhaseMeta.tone}
            />
          </div>

          <div
            className={cn(
              "relative overflow-hidden rounded-[22px] border p-3 shadow-[0_8px_24px_rgba(2,6,23,0.12)] transition duration-300 sm:p-3.5",
              streamPhase === "retrying"
                ? "border-violet-300/12 bg-[linear-gradient(180deg,rgba(16,14,24,0.94),rgba(10,12,18,0.98))]"
                : streamPhase === "unavailable"
                  ? "border-white/10 bg-[linear-gradient(180deg,rgba(16,16,20,0.96),rgba(10,12,18,0.98))]"
                  : "border-white/8 bg-[linear-gradient(180deg,rgba(10,14,20,0.96),rgba(8,12,18,0.98))]",
            )}
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_72%)]" />
            <div className="relative flex items-center justify-between gap-3 border-b border-white/6 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-white/28" />
                <span className="h-2 w-2 rounded-full bg-white/18" />
                <span className="h-2 w-2 rounded-full bg-white/14" />
              </div>
              {showRecoveryIndicator ? (
                <div className="flex shrink-0 items-center gap-2 text-[11px] tracking-[0.12em] text-white/44 uppercase">
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  Recovering
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-2 text-[10px] tracking-[0.12em] text-white/34 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                  Active feed
                </div>
              )}
            </div>

            <div className="relative mt-2.5 rounded-[18px] bg-white/[0.02] px-3 py-3 sm:px-3.5 sm:py-3.5">
              {(streamPhase === "connecting" || streamPhase === "streaming") &&
              !terminalOutput ? (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-[-18%] w-[20%] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
                  animate={{ x: ["0%", "420%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.4,
                    ease: "linear",
                  }}
                />
              ) : null}

              <div className="relative mb-3 flex flex-col gap-2 border-b border-white/6 pb-2.5 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-lg">
                  <p className="text-[10px] tracking-[0.16em] text-white/30 uppercase">
                    Latest update
                  </p>
                  <p className="mt-1.5 text-sm leading-6 font-medium text-white/82">
                    {status}
                  </p>
                  {generationStatus === "parsing" ? (
                    <div className="mt-3 space-y-2">
                      {parsingStages.map((stage) => (
                        <div
                          key={stage.id}
                          className="flex items-center gap-2 text-xs text-white/48"
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              stage.state === "completed"
                                ? "bg-emerald-300"
                                : stage.state === "active"
                                  ? "bg-cyan-300"
                                  : "bg-white/18",
                            )}
                          />
                          <span>{stage.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="text-[10px] tracking-[0.14em] text-white/32 uppercase">
                  {runtimeWorkflowForDisplay
                    ? runtimeWorkflowForDisplay.runtimeStatus
                    : "Feed"}
                </div>
              </div>

              <div className="relative">
                {displayedLogLines.length > 0 ? (
                  <div className="space-y-1.5">
                    {displayedLogLines.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.22,
                          delay: index * 0.04,
                          ease: "easeOut",
                        }}
                        className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-[12px] px-2 py-1.5 transition-colors duration-200 hover:bg-white/[0.025]"
                      >
                        <div className="flex items-center gap-2.5 pt-0.5">
                          <motion.span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(110,231,183,0.42)]",
                              entry.tone === "violet"
                                ? "bg-fuchsia-300 shadow-[0_0_8px_rgba(216,180,254,0.42)]"
                                : entry.tone === "emerald"
                                  ? "bg-emerald-300"
                                  : "bg-cyan-300 shadow-[0_0_8px_rgba(147,231,255,0.42)]",
                            )}
                            animate={{
                              opacity: [0.45, 0.9, 0.45],
                              scale: [0.98, 1.06, 0.98],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2.4 + index * 0.12,
                              ease: "easeInOut",
                            }}
                          />
                          <span className="font-mono text-[11px] tracking-[0.08em] text-white/38">
                            {entry.timestamp}
                          </span>
                        </div>
                        <p className="text-[13px] leading-5 break-words text-white/74 sm:text-[13.5px]">
                          {entry.line}
                          {index === displayedLogLines.length - 1 &&
                          (isGenerating || streamPhase === "recovered") ? (
                            <motion.span
                              animate={{ opacity: [0.16, 0.8, 0.16] }}
                              transition={{ repeat: Infinity, duration: 1.1 }}
                              className="ml-1 inline-block h-[0.95rem] w-[0.36rem] rounded-[2px] bg-white/75 align-[-2px]"
                            />
                          ) : null}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <TerminalPlaceholder
                    phase={streamPhase}
                    showRecoveryIndicator={showRecoveryIndicator}
                  />
                )}
              </div>
            </div>

            <div className="relative mt-3 flex flex-wrap gap-1.5 border-t border-white/6 pt-2.5">
              {(runtimeWorkflowForDisplay
                ? [
                    {
                      label: "Confidence",
                      value: `${runtimeWorkflowForDisplay.confidenceScore.toFixed(2)} execution confidence`,
                      detail: `${runtimeWorkflowForDisplay.priority} priority · ${runtimeWorkflowForDisplay.workflowPhase}`,
                    },
                    {
                      label: "Queue",
                      value: `${runtimeWorkflowForDisplay.queueCount} active tasks`,
                      detail: `${runtimeWorkflowForDisplay.linkedSystems} linked systems in scope`,
                    },
                    {
                      label: "Memory",
                      value: runtimeWorkflowForDisplay.memoryState,
                      detail: `${runtimeWorkflowForDisplay.telemetry.health}% workflow health`,
                    },
                  ]
                : operationalMetadata).map((item) => (
                <div
                  key={item.label}
                  className="min-w-0 flex-1 rounded-[16px] bg-white/[0.035] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                >
                  <p className="text-[10px] tracking-[0.14em] text-white/30 uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 font-medium text-white/78">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-4 text-white/34">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <WorkflowPreviewCard
          workflow={workflowForDisplay}
          runtimeWorkflow={runtimeWorkflowForDisplay}
        />
      </div>

      {workflowForDisplay ? (
        <GeneratedWorkflowView
          workflow={workflowForDisplay}
          runtimeWorkflow={runtimeWorkflowForDisplay}
          onSave={handleSaveCurrentWorkflow}
          onPauseResume={() => {
            if (!runtimeWorkflowForDisplay) return;
            setWorkflowStatus(
              runtimeWorkflowForDisplay.id,
              runtimeWorkflowForDisplay.runtimeStatus === "paused"
                ? "running"
                : "paused",
            );
          }}
          onReroute={() => {
            if (!runtimeWorkflowForDisplay) return;
            setWorkflowStatus(runtimeWorkflowForDisplay.id, "rerouting");
          }}
          onComplete={() => {
            if (!runtimeWorkflowForDisplay) return;
            setWorkflowStatus(runtimeWorkflowForDisplay.id, "completed");
          }}
          isSaving={
            isSavingWorkflow ||
            hasSavedCurrentWorkflow ||
            savedWorkflowId === workflowForDisplay.title
          }
        />
      ) : null}
    </div>
  );
}
