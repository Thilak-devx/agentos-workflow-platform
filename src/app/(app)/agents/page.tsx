"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Clock3,
  Cpu,
  Layers3,
  Radar,
  ShieldCheck,
  Wallet2,
} from "lucide-react";
import { ActivityFeedCard } from "@/components/app/activity-feed-card";
import { CoordinationPanel } from "@/components/app/coordination-panel";
import { DataTableCard } from "@/components/app/data-table-card";
import { PageHeader } from "@/components/app/page-header";
import { TerminalStreamCard } from "@/components/app/terminal-stream-card";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlatformSnapshot } from "@/features/platform/hooks";
import { AgentProfile, agentProfiles } from "@/lib/agent-data";
import { activityStream, coordinationNodes } from "@/lib/mock-data";

type PrimaryAgentView = AgentProfile & {
  workflowPhase: string;
  lastActive: string;
  queueCount: number;
  linkedSystemsCount: number;
  coordinationState: string;
  syncState: string;
  retryCount: number;
  approvalLayer: string;
  escalationDepth: string;
  operationalLatency: string;
  memoryContinuity: string;
  telemetryNarrative: string;
};

const phaseOptions = [
  "Signal intake",
  "Execution routing",
  "Review checkpoint",
  "Settlement sync",
] as const;

const coordinationStates = [
  "Shared memory link",
  "Guarded handoff",
  "Parallel review",
  "Escalation ready",
] as const;

const syncStates = [
  "Context synced",
  "Graph aligned",
  "Policy verified",
  "Memory warm",
] as const;

const approvalLayers = [
  "Single approval layer",
  "Dual approval layer",
  "Policy auto-clear",
  "Guarded operator review",
] as const;

const escalationDepths = [
  "Escalation depth 1",
  "Escalation depth 2",
  "Escalation depth 0",
  "Escalation depth 1",
] as const;

const agentTerminalSeeds = [
  "Treasury routing policy refreshed for low-risk internal disbursements.",
  "Research workflow completed and pushed into the shared execution graph.",
  "Two agents are awaiting review before external propagation resumes.",
  "Workflow checkpoint committed across approval and payout memory lanes.",
];

function derivePrimaryAgentView(agent: AgentProfile, index: number): PrimaryAgentView {
  return {
    ...agent,
    workflowPhase: phaseOptions[index % phaseOptions.length],
    lastActive: `${index + 1}m ago`,
    queueCount: 3 + index * 2,
    linkedSystemsCount: Math.max(3, agent.linkedWorkflows.length + 1),
    coordinationState: coordinationStates[index % coordinationStates.length],
    syncState: syncStates[index % syncStates.length],
    retryCount: index % 2,
    approvalLayer: approvalLayers[index % approvalLayers.length],
    escalationDepth: escalationDepths[index % escalationDepths.length],
    operationalLatency: agent.telemetry.avgLatency,
    memoryContinuity:
      index === 0
        ? "Continuity retained"
        : index === 1
          ? "Release memory stable"
          : "Settlement memory healthy",
    telemetryNarrative:
      index === 0
        ? "High-signal research context is still feeding launch and treasury decisions."
        : index === 1
          ? "Execution pressure remains governed across review and release lanes."
          : "Financial control paths are stable under guarded routing conditions.",
  };
}

function toneStatusClass(status: PrimaryAgentView["status"]) {
  if (status === "Active") return "bg-emerald-300/90";
  if (status === "Monitoring") return "bg-amber-300/85";
  if (status === "Learning") return "bg-violet-300/85";
  return "bg-cyan-300/85";
}

function typeAccent(agent: AgentProfile) {
  if (agent.type === "Treasury Agent") {
    return { icon: Wallet2, label: "Treasury rail", value: agent.treasuryAccessLevel };
  }

  if (agent.type === "Security Agent") {
    return { icon: ShieldCheck, label: "Approval posture", value: "Policy review" };
  }

  if (agent.type === "Research Agent") {
    return { icon: BrainCircuit, label: "Signal map", value: "Demand synthesis" };
  }

  if (agent.type === "Community Agent") {
    return { icon: Radar, label: "Contributor state", value: "Trust pacing" };
  }

  return { icon: Cpu, label: "Execution lane", value: "Workflow-linked" };
}

function SecondaryAgentRow({ agent, index }: { agent: AgentProfile; index: number }) {
  const accent = typeAccent(agent);
  const AccentIcon = accent.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.24, delay: index * 0.04 }}
    >
      <Link href={`/agents/${agent.slug}`}>
        <div className="group flex min-w-0 flex-col gap-4 rounded-[24px] border border-white/7 bg-white/[0.025] p-4 transition duration-200 hover:-translate-y-[1px] hover:border-white/12 hover:bg-white/[0.04]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <AccentIcon className="h-4 w-4 shrink-0 text-cyan-100" />
                <p className="truncate text-base font-medium text-white">{agent.name}</p>
              </div>
              <p className="mt-1 text-sm text-white/42">{agent.type}</p>
            </div>
            <Badge variant={agent.tone}>{agent.status}</Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-[16px] border border-white/6 bg-black/10 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Queue
              </p>
              <p className="mt-1 text-sm font-medium text-white">{2 + index} active</p>
            </div>
            <div className="rounded-[16px] border border-white/6 bg-black/10 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Memory
              </p>
              <p className="mt-1 text-sm font-medium text-white">{agent.memoryState}</p>
            </div>
            <div className="rounded-[16px] border border-white/6 bg-black/10 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Systems
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {agent.linkedWorkflows.length + 1} linked
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function AgentsPage() {
  const { operator } = useOperatorSession();
  const platformQuery = usePlatformSnapshot(operator);
  const [showAllAgents, setShowAllAgents] = useState(false);
  const agents = platformQuery.data?.agents ?? agentProfiles;
  const primaryAgents = useMemo(
    () => agents.slice(0, 3).map(derivePrimaryAgentView),
    [agents],
  );
  const secondaryAgents = agents.slice(3);
  const activeAgents = agents.filter((agent) => ("online" in agent ? agent.online : true))
    .length;

  const activityItems =
    platformQuery.data?.activityLogs.slice(0, 5).map((item, index) => ({
      id: item.id,
      title: item.title,
      detail:
        index === 0
          ? `${item.detail} Queue pressure remains inside the current approval envelope.`
          : item.detail,
      time: item.time,
      tone: item.tone,
    })) ?? activityStream;

  const fleetRows = agents.map((agent, index) => ({
    id: agent.slug,
    name: agent.name,
    type: agent.type,
    phase: phaseOptions[index % phaseOptions.length],
    queue: `${2 + index} queued`,
    latency: agent.telemetry.avgLatency,
    sync: syncStates[index % syncStates.length],
    confidence: agent.confidence,
  }));

  const coordinationView = primaryAgents.map((agent, index) => ({
    name: agent.name,
    status: index === 1 ? "Guarded" : index === 2 ? "Adaptive" : "Aligned",
    load: `${agent.workflowPhase} • ${agent.queueCount} active tasks`,
  }));

  const totalQueue = primaryAgents.reduce((sum, agent) => sum + agent.queueCount, 0);
  const averageConfidence =
    primaryAgents.reduce((sum, agent) => sum + Number(agent.confidence), 0) /
    Math.max(primaryAgents.length, 1);
  const totalLinkedSystems = primaryAgents.reduce(
    (sum, agent) => sum + agent.linkedSystemsCount,
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agent fleet"
        title="Autonomous workforce control"
        description="Track the agents currently shaping execution, review coordination pressure, and keep memory, treasury, and approval layers visible without drowning the operator in repeated panels."
        badge={`${activeAgents} agents online`}
        insights={[
          { label: "Fleet confidence", value: averageConfidence.toFixed(2) },
          {
            label: "Memory continuity",
            value: `${platformQuery.data?.memorySnapshots.length ?? 0} retained`,
          },
          { label: "Active queue", value: `${totalQueue} items` },
          { label: "Linked systems", value: `${totalLinkedSystems} live` },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <GlassCard className="p-5 sm:p-6" glow="cyan">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <Badge variant="cyan">Primary control surface</Badge>
              <h2 className="mt-4 max-w-3xl text-[clamp(1.75rem,2.5vw,2.5rem)] font-semibold tracking-[-0.06em] text-white">
                Direct the agents carrying the current execution load
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">
                The page now prioritizes the workers under active pressure and
                collapses the long tail of operators into a quieter secondary
                roster, so coordination feels intentional instead of crowded.
              </p>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Primary agents",
                  value: primaryAgents.length,
                  detail: "Currently influencing treasury, review, or release paths",
                },
                {
                  label: "Confidence",
                  value: Math.round(averageConfidence * 100),
                  suffix: "%",
                  detail: "Blended execution confidence across the active layer",
                },
                {
                  label: "Settled queues",
                  value: Math.max(totalQueue - 4, 0),
                  detail: "Work items cleared during the current operating window",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[22px] border border-white/7 bg-white/[0.03] px-4 py-3.5"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/32">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-white">
                    <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/42">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6" glow="none">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">
                System cadence
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.05em] text-white">
                Live operator health
              </h2>
            </div>
            <Activity className="h-4 w-4 shrink-0 text-cyan-100" />
          </div>
          <div className="mt-5 grid gap-3">
            {[
              {
                label: "Active operators",
                value: activeAgents,
                detail: "Connected to shared execution memory",
                tone: "cyan",
              },
              {
                label: "Approval readiness",
                value: 2 + (primaryAgents.length % 2),
                detail: "Sensitive actions under governed review",
                tone: "emerald",
              },
              {
                label: "Retry pressure",
                value: primaryAgents.reduce((sum, agent) => sum + agent.retryCount, 0),
                detail: "Low retry load across active orchestration",
                tone: "amber",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between gap-4 rounded-[20px] border border-white/7 bg-white/[0.03] px-4 py-3.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{metric.label}</p>
                  <p className="mt-1 text-sm text-white/42">{metric.detail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                    className={
                      metric.tone === "emerald"
                        ? "h-2.5 w-2.5 rounded-full bg-emerald-300/85"
                        : metric.tone === "amber"
                          ? "h-2.5 w-2.5 rounded-full bg-amber-300/85"
                          : "h-2.5 w-2.5 rounded-full bg-cyan-300/85"
                    }
                  />
                  <p className="text-2xl font-semibold tracking-[-0.05em] text-white">
                    <AnimatedCounter value={metric.value} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">
              Primary agents
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-white">
              Operationally critical workers
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/42">
            Primary cards emphasize the fields that actually guide action:
            phase, queue pressure, continuity, approvals, and system links.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {primaryAgents.map((agent, index) => {
            const accentMeta = typeAccent(agent);
            const AccentIcon = accentMeta.icon;

            return (
              <motion.div
                key={agent.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/agents/${agent.slug}`} className="group block h-full">
                  <GlassCard className="h-full rounded-[28px] p-5 sm:p-6" glow={agent.tone}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <motion.span
                            animate={{
                              opacity: [0.46, 1, 0.46],
                              scale: agent.status === "Active" ? [1, 1.1, 1] : [1, 1.03, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${toneStatusClass(agent.status)}`}
                          />
                          <Badge variant={agent.tone}>{agent.type}</Badge>
                        </div>
                        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">
                          {agent.name}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-white/50">{agent.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.14em] text-white/28">
                          Last active
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">{agent.lastActive}</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/32">
                          Workflow phase
                        </p>
                        <span className="text-xs text-white/38">{agent.syncState}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-white">{agent.workflowPhase}</p>
                      <p className="mt-2 text-sm leading-6 text-white/48">{agent.currentTask}</p>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[18px] border border-white/7 bg-black/10 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                            Queue
                          </span>
                          <Clock3 className="h-4 w-4 text-cyan-100" />
                        </div>
                        <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white">
                          <AnimatedCounter value={agent.queueCount} /> active
                        </p>
                        <p className="mt-2 text-xs leading-5 text-white/38">
                          {agent.retryCount} retries • {agent.escalationDepth}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-white/7 bg-black/10 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                            Focus
                          </span>
                          <AccentIcon className="h-4 w-4 text-cyan-100" />
                        </div>
                        <p className="mt-2 text-base font-semibold text-white">
                          {accentMeta.value}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-white/38">
                          {accentMeta.label} • {agent.operationalLatency}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                      <div className="rounded-[18px] border border-white/7 bg-white/[0.03] px-4 py-3.5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">
                            Memory continuity
                          </p>
                          <Layers3 className="h-4 w-4 text-white/38" />
                        </div>
                        <p className="mt-2 text-sm font-medium text-white">
                          {agent.memoryContinuity}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-white/38">
                          {agent.memoryState}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-white/7 bg-white/[0.03] px-4 py-3.5">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">
                          Confidence
                        </p>
                        <p className="mt-2 flex items-end gap-2 text-white">
                          <span className="text-xl font-semibold">{agent.confidence}</span>
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2.4, repeat: Infinity }}
                            className="mb-1 text-xs text-emerald-200"
                          >
                            stable
                          </motion.span>
                        </p>
                        <p className="mt-2 text-xs leading-5 text-white/38">
                          {agent.successRate} success rate
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[18px] border border-white/7 bg-white/[0.03] px-4 py-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">{agent.coordinationState}</p>
                        <ArrowUpRight className="h-4 w-4 text-white/30 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/46">
                        {agent.telemetryNarrative}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/44">
                          {agent.linkedSystemsCount} linked systems
                        </span>
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/44">
                          {agent.approvalLayer}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {secondaryAgents.length ? (
          <GlassCard className="rounded-[28px] p-4 sm:p-5" glow="none">
            <button
              type="button"
              onClick={() => setShowAllAgents((current) => !current)}
              className="flex w-full items-center justify-between gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition duration-200 hover:bg-white/[0.045]"
            >
              <div>
                <p className="text-sm font-medium text-white">View all agents</p>
                <p className="mt-1 text-sm text-white/42">
                  Secondary operators remain available without crowding the live control layer.
                </p>
              </div>
              {showAllAgents ? (
                <ChevronDown className="h-5 w-5 text-white/42" />
              ) : (
                <ChevronRight className="h-5 w-5 text-white/42" />
              )}
            </button>

            <AnimatePresence initial={false}>
              {showAllAgents ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {secondaryAgents.map((agent, index) => (
                      <SecondaryAgentRow key={agent.slug} agent={agent} index={index} />
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </GlassCard>
        ) : null}
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
        <ActivityFeedCard title="Coordination intelligence" items={activityItems} />
        <CoordinationPanel
          nodes={[...coordinationView, ...coordinationNodes.slice(0, 1)].slice(0, 4)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.84fr_1.16fr]">
        <TerminalStreamCard title="Agent reasoning layer" lines={agentTerminalSeeds} />
        <DataTableCard
          title="Execution analysis"
          columns={[
            { key: "name", label: "Agent" },
            { key: "type", label: "Type" },
            { key: "phase", label: "Phase" },
            { key: "queue", label: "Queue" },
            { key: "latency", label: "Latency" },
            { key: "sync", label: "Sync state" },
            { key: "confidence", label: "Confidence", className: "text-right" },
          ]}
          rows={fleetRows}
        />
      </div>
    </div>
  );
}
