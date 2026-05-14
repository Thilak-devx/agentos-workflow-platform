"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Command,
  Cpu,
  Database,
  Layers3,
  Orbit,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  Wallet2,
  Zap,
} from "lucide-react";
import { WorkflowTopologyVisualization } from "@/components/app/workflow-topology-visualization";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { SignalFlowChart } from "@/components/charts/signal-flow-chart";
import { ClientWalletMultiButton } from "@/components/solana/client-wallet-multi-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { NeuralMesh } from "@/components/visuals/neural-mesh";
import { useWalletTreasury } from "@/hooks/use-wallet-treasury";
import { signalChart, workflowBars } from "@/lib/mock-data";
import { formatSol, shortenAddress } from "@/lib/wallet";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.24 },
  transition: { duration: 0.62, ease: "easeOut" as const },
};

const heroMetrics = [
  { label: "Agent uptime", value: "99.98%" },
  { label: "Decision latency", value: "240ms" },
  { label: "Daily executions", value: "3.4k" },
];

const heroSignals = [
  "Solana treasury rails online",
  "6 agent classes with persistent memory",
  "Governed autonomy with operator checkpoints",
];

const terminalBursts = [
  [
    "$ agentos launch growth-ops",
    "> loading treasury policy lattice",
    "> assigning research, dev, and community agents",
    "> confidence envelope now at 0.94",
  ],
  [
    "$ agentos execute audit-coordination",
    "> routing legal and security review threads",
    "> notifying wallet controllers for staged payout preview",
    "> escalation pressure remains below threshold",
  ],
  [
    "$ agentos provision dao-campaign",
    "> synthesizing audience and contributor signals",
    "> linking budget routing to workflow milestones",
    "> system throughput stabilized at 98.4%",
  ],
];

const activityFeed = [
  {
    title: "Research agent",
    detail:
      "Synthesized launch signals from wallet, product, and community telemetry.",
    time: "11s ago",
  },
  {
    title: "Workflow engine",
    detail:
      "Collapsed approval depth from three checkpoints to one governed path.",
    time: "34s ago",
  },
  {
    title: "Treasury guard",
    detail:
      "Prepared a staged payout preview before any irreversible transfer.",
    time: "1m ago",
  },
  {
    title: "Operator console",
    detail:
      "Accepted a manual override without disrupting active agent memory.",
    time: "2m ago",
  },
];

const agentCards = [
  {
    name: "Research Agent",
    icon: BrainCircuit,
    role: "Builds context from market, product, and contributor signals.",
    state: "Mapping launch windows and narrative risk.",
    confidence: "0.96",
  },
  {
    name: "Developer Agent",
    icon: Cpu,
    role: "Owns implementation tasks, QA loops, and delivery coordination.",
    state: "Sequencing execution dependencies across active workflows.",
    confidence: "0.92",
  },
  {
    name: "Treasury Agent",
    icon: Wallet2,
    role: "Applies treasury policy, budget routing, and settlement review.",
    state: "Monitoring disbursement readiness on Solana rails.",
    confidence: "0.98",
  },
];

const orchestrationStages = [
  {
    name: "Intent intake",
    duration: "00:45",
    status: "Live",
    notes: "Prompt is decomposed into agents, risks, and treasury scope.",
  },
  {
    name: "Agent alignment",
    duration: "02:10",
    status: "Running",
    notes:
      "Research, developer, and operator roles share memory and ownership.",
  },
  {
    name: "Governed execution",
    duration: "04:30",
    status: "Guarded",
    notes:
      "Only critical actions require review. Everything else keeps moving.",
  },
  {
    name: "Settlement and replay",
    duration: "01:20",
    status: "Queued",
    notes:
      "Treasury previews, logs, and auditability stay attached to the run.",
  },
];

const solanaRows = [
  {
    title: "Operational treasury",
    detail:
      "Budget routing, policy checks, and workflow-linked settlement all live in the same layer.",
  },
  {
    title: "Wallet-native governance",
    detail:
      "AgentOS uses wallets as controlled authority surfaces rather than passive balances.",
  },
  {
    title: "Verifiable execution",
    detail:
      "Every transfer preview, operator approval, and transaction path stays inspectable.",
  },
];

const securityRows = [
  {
    title: "Role-scoped operator access",
    detail:
      "Owner, Admin, Operator, and Viewer permissions keep execution rights aligned with trust boundaries.",
  },
  {
    title: "Wallet-aware approvals",
    detail:
      "Treasury actions stay attached to wallet authority, approval thresholds, and reversible preview paths.",
  },
  {
    title: "Session and audit continuity",
    detail:
      "Supabase-backed sessions, protected routes, and retained memory keep operational state inspectable.",
  },
];

const testimonials = [
  {
    quote:
      "AgentOS feels like the first interface where workflows, treasury, and AI agents actually behave like one operating system.",
    role: "Design partner",
  },
  {
    quote:
      "The product reads like serious infrastructure software instead of a concept dashboard. That changes how quickly teams trust it.",
    role: "Operator lead",
  },
  {
    quote:
      "Treasury intelligence and governed autonomy in the same surface is the difference between a demo and something we would actually run.",
    role: "Protocol contributor",
  },
];

const pricingRows = [
  {
    title: "Starter",
    price: "$19",
    detail:
      "For early operator teams getting their first autonomous workflows and treasury previews live.",
    features: [
      "Up to 3 operator seats",
      "Workflow generation",
      "Wallet-aware treasury preview",
    ],
    featured: false,
  },
  {
    title: "Pro",
    price: "$79",
    detail:
      "For launch-stage teams running live AI operations with shared access, visibility, and governed execution.",
    features: [
      "Unlimited workflows",
      "Role-based operator access",
      "Realtime notifications and activity",
    ],
    featured: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    detail:
      "For organizations that need custom controls, deployment support, and advanced policy infrastructure.",
    features: [
      "Custom policy rails",
      "Advanced operator controls",
      "Dedicated deployment support",
    ],
    featured: false,
  },
];

const previewTransactions = [
  {
    label: "Creator cohort payout",
    amount: "$12.4k",
    status: "Previewed",
  },
  {
    label: "Audit retainer release",
    amount: "$28.0k",
    status: "Awaiting review",
  },
  {
    label: "Growth campaign budget",
    amount: "$8.2k",
    status: "Policy approved",
  },
];

const faqs = [
  {
    question: "What makes AgentOS feel operational instead of just AI-themed?",
    answer:
      "The product is organized around live execution surfaces: agent state, workflow pressure, treasury readiness, and operator intervention. The page previews that operating model instead of describing it abstractly.",
  },
  {
    question: "Why is Solana part of the product experience?",
    answer:
      "Solana is the programmable treasury layer. It gives AgentOS fast settlement, wallet-native approvals, and verifiable operational movement without forcing the rest of the product into a crypto dashboard aesthetic.",
  },
  {
    question: "Can humans still control autonomous execution?",
    answer:
      "Yes. AgentOS is built around governed autonomy. Humans intervene where trust matters, while lower-risk work continues in real time with memory, telemetry, and audit trails intact.",
  },
  {
    question: "Is this a workflow tool or an agent platform?",
    answer:
      "It is both. Workflows define the structure of execution, and agents provide the intelligence and specialization inside that structure. AgentOS makes them feel like one system.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
      <Badge variant="cyan" className="mx-auto">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </Badge>
      <h2 className="landing-display-section mt-5 font-[family:var(--font-display-stack)] font-semibold text-white">
        {title}
      </h2>
      <p className="landing-body-md mt-4 text-white/60">{description}</p>
    </motion.div>
  );
}

function LiveWalletState() {
  const { address, connected, balanceSol, isLoading, walletName } =
    useWalletTreasury();

  return (
    <GlassCard className="p-4 sm:p-5" glow={connected ? "emerald" : "violet"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Wallet state
          </p>
          <h3 className="mt-2 text-lg font-medium text-white">
            {connected ? shortenAddress(address) : "Awaiting wallet session"}
          </h3>
        </div>
        <Badge variant={connected ? "emerald" : "violet"}>
          {connected ? "Connected" : "Not connected"}
        </Badge>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Balance
          </p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.05em] text-white">
            {connected && balanceSol !== null
              ? `${formatSol(balanceSol)} SOL`
              : "0.00 SOL"}
          </p>
          <p className="mt-2 text-xs text-white/42">
            {isLoading
              ? "Refreshing client state"
              : "Live wallet treasury readout"}
          </p>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Session rail
          </p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.05em] text-white">
            {connected ? walletName : "Phantom ready"}
          </p>
          <p className="mt-2 text-xs text-white/42">
            Client-only wallet controls with governed treasury routing
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Home() {
  const { operator, isLoading } = useOperatorSession();
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [activeStage, setActiveStage] = useState(1);
  const isAuthenticated = operator.sessionState === "authenticated";

  useEffect(() => {
    const terminalTimer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setTerminalIndex((current) => (current + 1) % terminalBursts.length);
    }, 3200);

    const stageTimer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setActiveStage((current) => (current + 1) % orchestrationStages.length);
    }, 2400);

    return () => {
      window.clearInterval(terminalTimer);
      window.clearInterval(stageTimer);
    };
  }, []);

  const activeTerminal = terminalBursts[terminalIndex];
  const demoBars = workflowBars.map((item, index) => ({
    ...item,
    value: Math.min(item.value + ((terminalIndex + index) % 3) * 6, 98),
  }));
  const liveChart = signalChart.map((value, index) =>
    Math.min(value + ((activeStage + index) % 4) * 3, 96),
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="ambient-grid absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(56,189,248,0.18),transparent_18%),radial-gradient(circle_at_85%_10%,rgba(99,102,241,0.16),transparent_20%),radial-gradient(circle_at_50%_82%,rgba(52,211,153,0.09),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="screen-vignette absolute inset-0 opacity-80" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-6 pt-6 pb-20 sm:px-8 lg:px-10">
        <header className="mb-12 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-2xl sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,rgba(56,189,248,0.16),rgba(255,255,255,0.04))] text-cyan-100 ring-1 ring-cyan-300/25 ring-inset">
              <Orbit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-white uppercase">
                AgentOS
              </p>
              <p className="text-xs text-white/42">
                Solana-native autonomous operations
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/58 lg:flex">
            <a href="#agents" className="transition hover:text-white">
              Agents
            </a>
            <a href="#automation" className="transition hover:text-white">
              Workflows
            </a>
            <a href="#solana" className="transition hover:text-white">
              Solana
            </a>
            <a href="#preview" className="transition hover:text-white">
              Demo
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="hidden md:inline-flex">
                  <Link href="/settings">Settings</Link>
                </Button>
                <Button size="sm" asChild className="sm:h-11 sm:px-5">
                  <Link href="/dashboard">
                    Launch Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden md:inline-flex">
                  <Link href="/login">{isLoading ? "Loading" : "Login"}</Link>
                </Button>
                <Button size="sm" asChild className="sm:h-11 sm:px-5">
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <section className="grid items-start gap-10 pb-18 lg:grid-cols-[0.96fr_1.04fr] lg:pb-24">
          <div className="max-w-[47rem] xl:max-w-[50rem]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <Badge variant="cyan" className="mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Finalist-level Solana AI operations
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.04 }}
              className="landing-display-hero max-w-[15ch] font-[family:var(--font-display-stack)] font-semibold text-balance text-white"
            >
              Run an autonomous organization through one{" "}
              <span className="text-gradient">live command system</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.08 }}
              className="landing-body-lg mt-8 max-w-[41rem] text-white/62"
            >
              AgentOS brings AI agents, workflow orchestration, Solana treasury
              controls, and human governance into one operating surface that
              feels active, trustworthy, and ready to run in public.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.12 }}
              className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button size="xl" asChild>
                <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                  {isAuthenticated ? "Launch Dashboard" : "Get Started"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="xl" variant="secondary" asChild>
                <Link href={isAuthenticated ? "/demo" : "/login"}>
                  {isAuthenticated ? "Start Demo" : "Login"}
                  {isAuthenticated ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.16 }}
              className="mt-7 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <ClientWalletMultiButton />
                <p className="text-sm text-white/46">
                  Wallet actions stay live on the client so treasury execution
                  feels native, not bolted on.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {heroSignals.map((signal) => (
                  <div
                    key={signal}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] tracking-[0.16em] text-white/48 uppercase"
                  >
                    {signal}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.2 }}
              className="mt-11 grid gap-4 sm:grid-cols-3"
            >
              {heroMetrics.map((item, index) => (
                <GlassCard
                  key={item.label}
                  className="p-4"
                  glow={index === 1 ? "violet" : "cyan"}
                >
                  <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
                    {item.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.06em] text-white">
                    {item.value}
                  </p>
                </GlassCard>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.99, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.82, delay: 0.12 }}
            className="w-full"
          >
            <GlassCard
              className="overflow-hidden rounded-[32px] p-4 sm:p-5 lg:p-6"
              glow="none"
            >
              <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] tracking-[0.22em] text-cyan-200 uppercase">
                    Live autonomous command center
                  </p>
                  <h2 className="landing-display-card mt-2 text-2xl font-[family:var(--font-display-stack)] font-semibold text-white sm:text-[1.75rem]">
                    Operational surfaces in motion
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/52">
                    A bounded live surface for agent activity, execution
                    telemetry, and governed treasury readiness.
                  </p>
                </div>
                <Badge variant="emerald" className="self-start">
                  Realtime
                </Badge>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] lg:items-stretch">
                <GlassCard
                  className="min-w-0 rounded-[28px] border-white/8 bg-[linear-gradient(180deg,rgba(10,14,24,0.96),rgba(9,13,23,0.92))] p-4 sm:p-5"
                  glow="none"
                >
                  <div className="mb-4 flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/42 uppercase">
                    <Command className="h-3.5 w-3.5 text-cyan-200" />
                    Live AI terminal logs
                  </div>
                  <div className="space-y-3 font-mono text-[13px] leading-6 sm:text-sm">
                    {activeTerminal.map((line, index) => (
                      <motion.div
                        key={`${terminalIndex}-${line}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.28, delay: index * 0.06 }}
                        className="break-words text-white/74"
                      >
                        <span className="text-emerald-200">{">"}</span> {line}
                      </motion.div>
                    ))}
                    <motion.div
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="inline-block h-4 w-2 rounded-sm bg-cyan-200"
                    />
                  </div>
                </GlassCard>

                <div className="grid min-w-0 grid-rows-[minmax(0,1fr)_auto] gap-4">
                  <GlassCard
                    className="min-w-0 rounded-[28px] border-white/8 bg-[linear-gradient(180deg,rgba(11,17,30,0.94),rgba(8,12,23,0.9))] p-4 sm:p-5"
                    glow="none"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] tracking-[0.18em] text-white/36 uppercase">
                          Live analytics
                        </p>
                        <h3 className="landing-display-card mt-2 text-lg font-[family:var(--font-display-stack)] font-semibold text-white sm:text-xl">
                          Coordination signal
                        </h3>
                      </div>
                      <div className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] tracking-[0.16em] text-white/40 uppercase">
                        240ms
                      </div>
                    </div>
                    <SignalFlowChart values={liveChart} />
                  </GlassCard>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <GlassCard
                      className="rounded-[28px] border-white/8 bg-[linear-gradient(180deg,rgba(11,16,28,0.94),rgba(8,12,22,0.9))] p-4 sm:p-5"
                      glow="none"
                    >
                      <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
                        Fleet load
                      </p>
                      <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white">
                        18 agents
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/50">
                        Shared memory and execution context remain synchronized.
                      </p>
                    </GlassCard>
                    <GlassCard
                      className="rounded-[28px] border-white/8 bg-[linear-gradient(180deg,rgba(11,16,28,0.94),rgba(8,12,22,0.9))] p-4 sm:p-5"
                      glow="none"
                    >
                      <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
                        Governance
                      </p>
                      <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white">
                        Inline
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/50">
                        Operators can approve critical actions without breaking
                        the execution loop.
                      </p>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        <section id="agents" className="py-16">
          <SectionHeading
            eyebrow="AI agents showcase"
            title="Specialized workers with memory, telemetry, and clear authority"
            description="Each agent feels like a role inside a real operations team, not a decorative card. You can see what it owns, what it is doing, and how confidently it is acting."
          />

          <div className="mt-12 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-4 md:grid-cols-3">
              {agentCards.map((agent, index) => {
                const Icon = agent.icon;
                return (
                  <motion.div
                    key={agent.name}
                    {...fadeUp}
                    transition={{ duration: 0.52, delay: index * 0.06 }}
                  >
                    <GlassCard
                      className="group h-full p-6"
                      glow={index === 1 ? "violet" : "cyan"}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-cyan-100 transition group-hover:scale-105 group-hover:bg-cyan-400/14">
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant={index === 2 ? "emerald" : "violet"}>
                          {agent.confidence}
                        </Badge>
                      </div>
                      <h3 className="landing-display-card mt-5 text-2xl font-[family:var(--font-display-stack)] font-semibold text-white">
                        {agent.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-white/56">
                        {agent.role}
                      </p>
                      <div className="mt-5 rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
                        <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
                          Current task
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/62">
                          {agent.state}
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>

            <motion.div {...fadeUp}>
              <GlassCard className="overflow-hidden p-5 sm:p-6" glow="violet">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                      Coordination map
                    </p>
                    <h3 className="landing-display-card mt-2 text-2xl font-[family:var(--font-display-stack)] font-semibold text-white">
                      Multi-agent synchronization
                    </h3>
                  </div>
                  <Badge variant="cyan">Shared memory graph</Badge>
                </div>
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-3">
                    {activityFeed.slice(0, 3).map((item, index) => (
                      <motion.div
                        key={item.title}
                        animate={{ x: [0, 2, 0] }}
                        transition={{
                          duration: 4.8,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                        className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{item.title}</p>
                          <span className="text-xs text-white/34">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/54">
                          {item.detail}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <NeuralMesh className="min-h-[260px] p-4" />
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section
          id="automation"
          className="pt-8 pb-5 sm:pt-10 sm:pb-6 lg:pt-12 lg:pb-7"
        >
          <SectionHeading
            eyebrow="Workflow automation"
            title="A workflow system that behaves like a live operating loop"
            description="Instead of static diagrams, AgentOS shows how orchestration is progressing, which stage is live, and where human trust boundaries actually matter."
          />

          <div className="mt-6 grid gap-4 sm:mt-8 xl:grid-cols-[0.92fr_1.08fr]">
            <motion.div {...fadeUp}>
              <GlassCard className="p-5 sm:p-6" glow="cyan">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <Badge variant="cyan">Interactive orchestration</Badge>
                    <h3 className="landing-display-card mt-4 text-3xl font-[family:var(--font-display-stack)] font-semibold text-white">
                      Workflow topology
                    </h3>
                  </div>
                  <Layers3 className="h-5 w-5 text-cyan-100" />
                </div>
                <WorkflowTopologyVisualization data={demoBars} />
              </GlassCard>
            </motion.div>

            <motion.div {...fadeUp}>
              <GlassCard className="p-6" glow="violet">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                      Workflow states
                    </p>
                    <h3 className="landing-display-card mt-2 text-2xl font-[family:var(--font-display-stack)] font-semibold text-white">
                      Real-time orchestration path
                    </h3>
                  </div>
                  <Badge variant="emerald">
                    {orchestrationStages[activeStage]?.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {orchestrationStages.map((stage, index) => (
                    <motion.div
                      key={stage.name}
                      animate={
                        index === activeStage ? { scale: [1, 1.01, 1] } : {}
                      }
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className={`rounded-[24px] border p-4 transition ${
                        index === activeStage
                          ? "border-cyan-300/20 bg-cyan-400/[0.08]"
                          : "border-white/8 bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{stage.name}</p>
                          <p className="mt-2 text-sm leading-6 text-white/54">
                            {stage.notes}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {stage.duration}
                          </p>
                          <p className="mt-1 text-xs text-white/38">
                            {stage.status}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section
          id="solana"
          className="pt-5 pb-8 sm:pt-6 sm:pb-10 lg:pt-7 lg:pb-12"
        >
          <SectionHeading
            eyebrow="Solana integration"
            title="Treasury execution feels native to the product, not stapled onto it"
            description="Solana gives AgentOS a fast settlement layer, but the experience is designed around operational clarity, policy control, and real wallet interactions."
          />

          <div className="mt-6 grid gap-4 sm:mt-8 xl:grid-cols-[1.02fr_0.98fr]">
            <motion.div {...fadeUp} className="space-y-4">
              <LiveWalletState />
              <GlassCard className="p-5" glow="violet">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                      Solana operating rails
                    </p>
                    <h3 className="landing-display-card mt-2 text-2xl font-[family:var(--font-display-stack)] font-semibold text-white">
                      Treasury capabilities
                    </h3>
                  </div>
                  <Cpu className="h-5 w-5 text-cyan-100" />
                </div>
                <div className="space-y-3">
                  {solanaRows.map((row) => (
                    <div
                      key={row.title}
                      className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
                    >
                      <p className="font-medium text-white">{row.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/54">
                        {row.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div {...fadeUp}>
              <GlassCard className="overflow-hidden p-6" glow="emerald">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <Badge variant="emerald">On-chain preview</Badge>
                    <h3 className="landing-display-card mt-4 text-3xl font-[family:var(--font-display-stack)] font-semibold text-white">
                      Transaction preparation surface
                    </h3>
                  </div>
                  <Wallet2 className="h-5 w-5 text-cyan-100" />
                </div>

                <div className="grid gap-4 lg:grid-cols-[0.94fr_1.06fr]">
                  <div className="space-y-3">
                    {previewTransactions.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.42, delay: index * 0.06 }}
                        className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{item.label}</p>
                          <span className="text-sm text-white/42">
                            {item.amount}
                          </span>
                        </div>
                        <div className="mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] tracking-[0.18em] text-emerald-100 uppercase">
                          {item.status}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-5">
                    <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/36 uppercase">
                      <Database className="h-3.5 w-3.5 text-cyan-200" />
                      Treasury reasoning
                    </div>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-white/60">
                      <p>
                        AgentOS is holding the treasury path until audit and
                        operations agree on the final release boundary.
                      </p>
                      <p>
                        Once the operator approves, the system can route the
                        release through wallet-native controls with full replay
                        visibility.
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Badge variant="cyan">Policy linked</Badge>
                      <Badge variant="violet">Review aware</Badge>
                      <Badge variant="emerald">Ready to settle</Badge>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section id="security" className="py-16">
          <SectionHeading
            eyebrow="Security layer"
            title="Governed autonomy with the controls serious operators expect"
            description="AgentOS keeps session control, treasury approvals, and execution rights inside the same security model so the product stays trustworthy as it scales."
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {securityRows.map((row, index) => (
              <motion.div
                key={row.title}
                {...fadeUp}
                transition={{ duration: 0.48, delay: index * 0.05 }}
              >
                <GlassCard className="h-full p-6" glow={index === 1 ? "emerald" : "violet"}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-cyan-100">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <p className="text-lg font-semibold text-white">{row.title}</p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/56">{row.detail}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="preview" className="py-16">
          <SectionHeading
            eyebrow="Live demo preview"
            title="A believable product slice instead of a decorative screenshot"
            description="This section previews the actual energy of AgentOS: moving activity, live reasoning, wallet-aware orchestration, and a calm but dense operating layout."
          />

          <motion.div {...fadeUp} className="mt-12">
            <GlassCard className="overflow-hidden p-6 sm:p-7" glow="cyan">
              <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
                <div className="space-y-4">
                  <GlassCard className="p-4" glow="none">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] tracking-[0.18em] text-white/38 uppercase">
                          Realtime dashboard activity
                        </p>
                        <h3 className="landing-display-card mt-2 text-xl font-[family:var(--font-display-stack)] font-semibold text-white">
                          Operational decision feed
                        </h3>
                      </div>
                      <Badge variant="emerald">Streaming</Badge>
                    </div>
                    <div className="space-y-3">
                      {activityFeed.map((item, index) => (
                        <motion.div
                          key={item.title}
                          animate={{ y: [0, -2, 0] }}
                          transition={{
                            duration: 5.6,
                            repeat: Infinity,
                            delay: index * 0.18,
                          }}
                          className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-white">
                              {item.title}
                            </p>
                            <span className="text-xs text-white/34">
                              {item.time}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-white/54">
                            {item.detail}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                <div className="space-y-4">
                  <SignalFlowChart values={liveChart} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <GlassCard className="p-5" glow="emerald">
                      <div className="mb-3 flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/38 uppercase">
                        <Radar className="h-3.5 w-3.5 text-cyan-200" />
                        Activity pressure
                      </div>
                      <p className="text-3xl font-[family:var(--font-display-stack)] font-semibold tracking-[-0.06em] text-white">
                        98.4%
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/54">
                        Execution confidence remains stable across active
                        workflow branches.
                      </p>
                    </GlassCard>
                    <GlassCard className="p-5" glow="violet">
                      <div className="mb-3 flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/38 uppercase">
                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-200" />
                        Human checkpoint
                      </div>
                      <p className="text-3xl font-[family:var(--font-display-stack)] font-semibold tracking-[-0.06em] text-white">
                        1 required
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/54">
                        The system asks for intervention only where trust
                        genuinely matters.
                      </p>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        <section id="testimonials" className="py-16">
          <SectionHeading
            eyebrow="Testimonials"
            title="Why operator teams remember the product"
            description="The strongest feedback is about trust: the system feels usable, governed, and real enough to imagine running critical workflows inside it."
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.quote}
                {...fadeUp}
                transition={{ duration: 0.48, delay: index * 0.05 }}
              >
                <GlassCard className="h-full p-6" glow={index === 1 ? "cyan" : "violet"}>
                  <p className="text-base leading-8 text-white/66">“{item.quote}”</p>
                  <p className="mt-6 text-sm font-medium text-white">{item.role}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="pricing" className="py-16">
          <SectionHeading
            eyebrow="Pricing"
            title="Plans built for teams moving from prototype to live operations"
            description="Choose a starting point for operator access, workflow intelligence, and treasury visibility, then expand into governed execution as your system matures."
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {pricingRows.map((plan, index) => (
              <motion.div
                key={plan.title}
                {...fadeUp}
                transition={{ duration: 0.48, delay: index * 0.05 }}
              >
                <GlassCard className="h-full p-6" glow={index === 1 ? "emerald" : "cyan"}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-lg font-semibold text-white">{plan.title}</p>
                    {plan.featured ? (
                      <Badge variant="emerald">Most Popular</Badge>
                    ) : null}
                  </div>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">
                    {plan.price}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/56">{plan.detail}</p>
                  <div className="mt-6 space-y-2">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/62"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="faq" className="py-16">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions teams ask when this starts to feel real"
            description="The product should read clearly even when the interface is ambitious. These answers keep the story grounded in how the system actually works."
          />

          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={faq.question}
                {...fadeUp}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
              >
                <summary className="landing-display-card cursor-pointer list-none text-lg font-[family:var(--font-display-stack)] font-semibold text-white">
                  {faq.question}
                </summary>
                <p className="mt-4 max-w-3xl text-sm leading-8 text-white/58">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </div>
        </section>

        <section className="pt-16">
          <motion.div {...fadeUp}>
            <GlassCard className="overflow-hidden p-8 sm:p-10" glow="violet">
              <div className="animated-gradient absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.12),rgba(99,102,241,0.12),rgba(52,211,153,0.12))]" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <Badge variant="emerald">Final CTA</Badge>
                  <h2 className="landing-display-section mt-5 font-[family:var(--font-display-stack)] font-semibold text-white">
                    Operate AI agents, workflows, and treasury from one live
                    system
                  </h2>
                  <p className="landing-body-md mt-4 text-white/60">
                    AgentOS is built to feel like real software for autonomous
                    organizations at scale: calm under pressure, dense with
                    signal, and ready to demo in front of judges or operators.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="xl" asChild>
                    <Link href="/dashboard">
                      Launch Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="xl" variant="secondary" asChild>
                    <Link href="/demo">
                      Open Demo Mode
                      <Zap className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
