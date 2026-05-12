"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle2,
  CirclePause,
  CirclePlay,
  Clock3,
  FastForward,
  Layers3,
  MonitorPlay,
  Wallet2,
} from "lucide-react";
import { DemoScenario, demoScenarios } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SignalFlowChart } from "@/components/charts/signal-flow-chart";
import { ActivityBars } from "@/components/charts/activity-bars";
import { NeuralMesh } from "@/components/visuals/neural-mesh";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const baseChart = [24, 32, 30, 42, 48, 54, 63, 60, 72, 78, 84, 92];
const terminalStatuses = ["synced", "verified", "routed", "approved"] as const;

type TerminalLine = {
  id: string;
  command: string;
  status: (typeof terminalStatuses)[number];
  phaseLabel: string;
};

function createDemoId(prefix: string, step: number, suffix: string) {
  return `${prefix}-${step}-${suffix}`;
}

function buildTerminalCommand(scenario: DemoScenario, step: number) {
  const timelineIndex = Math.min(step, scenario.timeline.length - 1);
  const phase = scenario.timeline[timelineIndex];
  const baseCommand = scenario.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    id: createDemoId("terminal", step, baseCommand),
    command: `agentos run ${baseCommand} --phase="${phase.label.toLowerCase()}"`,
    status: terminalStatuses[step % terminalStatuses.length],
    phaseLabel: phase.label,
  } satisfies TerminalLine;
}

function buildActivityLine(scenario: DemoScenario, step: number) {
  const timelineIndex = Math.min(step, scenario.timeline.length - 1);
  const phase = scenario.timeline[timelineIndex];
  return `${phase.label}: ${phase.detail}`;
}

export function DemoModeExperience() {
  const initialScenario = demoScenarios[0];
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    initialScenario.id,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [streamLog, setStreamLog] = useState<string[]>([
    `Demo ready: ${initialScenario.title}`,
  ]);
  const [typedCommand, setTypedCommand] = useState("");
  const [terminalQueue, setTerminalQueue] = useState<TerminalLine[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const scenario = useMemo(
    () =>
      demoScenarios.find((item) => item.id === selectedScenarioId) ??
      demoScenarios[0],
    [selectedScenarioId],
  );

  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }
      setStep((current) => {
        if (current >= scenario.timeline.length - 1) {
          window.clearInterval(timer);
          setIsPlaying(false);
          setIsComplete(true);
          return current;
        }

        return current + 1;
      });
    }, 2600);

    return () => window.clearInterval(timer);
  }, [isComplete, isPlaying, scenario.timeline.length]);

  useEffect(() => {
    const nextLine = buildActivityLine(scenario, step);
    const nextCommand = buildTerminalCommand(scenario, step);
    const frame = window.requestAnimationFrame(() => {
      setStreamLog((current) => [nextLine, ...current].slice(0, 8));
      setTerminalQueue((current) => [nextCommand, ...current].slice(0, 5));
      setTypedCommand("");
    });

    let charIndex = 0;
    const typer = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }
      charIndex += 1;
      setTypedCommand(nextCommand.command.slice(0, charIndex));

      if (charIndex >= nextCommand.command.length) {
        window.clearInterval(typer);
      }
    }, 26);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(typer);
    };
  }, [scenario, step]);

  const progress = useMemo(() => {
    if (isComplete) return 100;
    return ((step + 1) / scenario.timeline.length) * 100;
  }, [isComplete, scenario.timeline.length, step]);

  const activePhase =
    scenario.timeline[Math.min(step, scenario.timeline.length - 1)];

  const dynamicChart = useMemo(
    () =>
      baseChart.map((value, index) => {
        const pulse = ((step + index) % 3) * 3;
        return Math.min(value + pulse, 98);
      }),
    [step],
  );

  const barData = useMemo(
    () => [
      { label: "Agents", value: scenario.telemetry.agentConcurrency * 12 },
      { label: "Flow", value: scenario.telemetry.workflowPressure },
      {
        label: "Funds",
        value: Math.min(90, scenario.telemetry.treasuryMovementUsd / 1800),
      },
      { label: "Trust", value: scenario.telemetry.confidence },
      { label: "Ops", value: 70 + (step % 3) * 6 },
      { label: "Sync", value: 62 + (step % 2) * 10 },
    ],
    [scenario.telemetry.agentConcurrency, scenario.telemetry.confidence, scenario.telemetry.treasuryMovementUsd, scenario.telemetry.workflowPressure, step],
  );

  const liveTreasuryValue =
    scenario.telemetry.treasuryMovementUsd * (0.62 + progress / 260);
  const executionConfidence = Math.min(
    99,
    Math.round(scenario.telemetry.confidence - 3 + progress / 8),
  );
  const liveAgents = Math.max(
    2,
    Math.min(
      scenario.telemetry.agentConcurrency,
      Math.round(
        scenario.telemetry.agentConcurrency * (0.52 + progress / 220),
      ),
    ),
  );
  const coordinationSuccess = Math.min(
    99,
    Math.round(72 + progress / 4),
  );
  const approvalsCompleted = Math.min(
    scenario.timeline.length,
    Math.max(1, Math.round((progress / 100) * scenario.timeline.length)),
  );

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.16),transparent_18%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.16),transparent_20%),linear-gradient(180deg,rgba(6,10,20,0.98),rgba(3,6,14,0.98))] p-4 sm:p-6">
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-15" />
      <motion.div
        className="absolute -top-12 left-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ x: [0, 22, 0], y: [0, 14, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-10 bottom-10 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl"
        animate={{ x: [0, -18, 0], y: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 space-y-4">
        <GlassCard className="p-5" glow="violet">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-4xl">
              <Badge variant="violet">
                <MonitorPlay className="h-3.5 w-3.5" />
                Hackathon demo mode
              </Badge>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl">
                Watch an autonomous AI organization operate in real time
              </h1>
              <p className="mt-4 text-sm leading-8 text-white/56 sm:text-base">
                This guided simulation is optimized for judging demos: one click
                starts a cinematic, living workflow with AI coordination,
                treasury actions, and decision telemetry unfolding together.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  if (isComplete) {
                    setStep(0);
                    setIsComplete(false);
                  }
                  setIsPlaying((value) => !value || isComplete);
                }}
              >
                {isPlaying ? (
                  <>
                    <CirclePause className="h-4 w-4" />
                    Pause demo
                  </>
                ) : (
                  <>
                    <CirclePlay className="h-4 w-4" />
                    {isComplete ? "Replay Demo" : "Start Demo"}
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setStep((current) =>
                    current >= scenario.timeline.length - 1 ? current : current + 1,
                  )
                }
              >
                <FastForward className="h-4 w-4" />
                Advance
              </Button>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
          <GlassCard className="p-5" glow="cyan">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                  Scenario selection
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Demo scenarios
                </h2>
              </div>
              <Badge variant="cyan">{scenario.durationLabel}</Badge>
            </div>

            <div className="space-y-3">
              {demoScenarios.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenarioId(item.id);
                    setStep(0);
                    setIsComplete(false);
                    setTypedCommand("");
                    setTerminalQueue([]);
                    setStreamLog([`Demo ready: ${item.title}`]);
                    setIsPlaying(false);
                  }}
                  className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                    item.id === scenario.id
                      ? "border-cyan-300/20 bg-cyan-400/[0.08]"
                      : "border-white/8 bg-white/[0.04] hover:border-cyan-300/14 hover:bg-white/[0.07]"
                  }`}
                >
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-white/48">{item.objective}</p>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" glow="emerald">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="emerald">Playback controls</Badge>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-white">
                  {scenario.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/56">
                  {scenario.objective}
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/42">
                {isComplete
                  ? "Execution complete"
                  : `Phase ${step + 1}/${scenario.timeline.length}`}
              </div>
            </div>

            <div className="rounded-full border border-white/8 bg-white/[0.04] p-1">
              <motion.div
                className="animated-gradient h-2 rounded-full bg-[linear-gradient(90deg,rgba(147,231,255,0.95),rgba(110,231,183,0.85),rgba(192,132,252,0.88))]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {scenario.timeline.map((item, index) => (
                <motion.div
                  key={item.label}
                  animate={{
                    opacity: index <= step || isComplete ? 1 : 0.58,
                    y: index === step && isPlaying ? [0, -2, 0] : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: index === step && isPlaying ? Infinity : 0,
                    repeatDelay: 0.6,
                  }}
                  className={`rounded-[22px] border p-4 transition ${
                    index === step
                      ? "border-cyan-300/18 bg-cyan-400/[0.08]"
                      : index < step || isComplete
                        ? "border-emerald-300/12 bg-emerald-400/[0.05]"
                        : "border-white/8 bg-white/[0.04]"
                  }`}
                >
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="mt-2 text-sm text-white/46">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="p-5" glow="violet">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                  Autonomous decision feed
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Live streaming AI reasoning
                </h2>
              </div>
              <Badge variant="violet">{activePhase.label}</Badge>
            </div>

            <div className="space-y-3">
              {scenario.reasoning.map((line, index) => (
                <motion.div
                  key={`${line}-${step}-${index}`}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    Reasoning thread {index + 1}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/58">{line}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" glow="cyan">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                  Streaming terminal UI
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Command execution visualization
                </h2>
              </div>
              <Badge variant="cyan">
                {isPlaying ? "Auto-play active" : isComplete ? "Complete" : "Paused"}
              </Badge>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-black/20 p-4 font-mono text-sm">
              <div className="space-y-2">
                {terminalQueue.map((line, index) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.08 }}
                    className="flex items-start justify-between gap-3 text-white/68"
                  >
                    <div className="min-w-0">
                      <span className="text-emerald-200">{">"}</span>{" "}
                      {index === 0 ? typedCommand : line.command}
                      {index === 0 ? (
                        <motion.span
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 0.9, repeat: Infinity }}
                          className="ml-1 inline-block h-4 w-[2px] bg-cyan-200 align-middle"
                        />
                      ) : null}
                    </div>
                    <span className="shrink-0 text-[11px] uppercase text-white/34">
                      {line.status}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {streamLog.map((line, index) => (
                  <motion.div
                    key={`${line}-${index}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.08 }}
                    className="text-white/52"
                  >
                    <span className="text-white/26">log</span> {line}
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
          <GlassCard className="p-5" glow="emerald">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                  Real-time operational telemetry
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Autonomous execution visualization
                </h2>
              </div>
              <Badge variant="emerald">
                <AnimatedCounter value={executionConfidence} suffix="%" /> confidence
              </Badge>
            </div>
            <SignalFlowChart values={dynamicChart} />
          </GlassCard>

          <GlassCard className="p-5" glow="violet">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                  Dynamic workflow orchestration
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Real-time analytics updates
                </h2>
              </div>
              <Layers3 className="h-5 w-5 text-cyan-100" />
            </div>
            <ActivityBars data={barData} />
          </GlassCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="p-5" glow="cyan">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                  Multi-agent coordination simulation
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Agent collaboration map
                </h2>
              </div>
              <Badge variant="cyan">
                <AnimatedCounter value={liveAgents} /> agents
              </Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {scenario.coordination.map((node, index) => (
                <motion.div
                  key={node.agent}
                  animate={{
                    y: node.status === "Active" || index === step % scenario.coordination.length ? [0, -3, 0] : 0,
                    scale:
                      node.status === "Active" || index === step % scenario.coordination.length
                        ? [1, 1.012, 1]
                        : 1,
                  }}
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.16,
                  }}
                  className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
                >
                  <p className="font-medium text-white">{node.agent}</p>
                  <p className="mt-2 text-sm text-white/48">{node.role}</p>
                  <Badge
                    className="mt-4"
                    variant={
                      node.status === "Guarded"
                        ? "emerald"
                        : node.status === "Adaptive" || node.status === "Learning"
                          ? "violet"
                          : "cyan"
                    }
                  >
                    {node.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <NeuralMesh className="min-h-[320px] p-5" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <GlassCard className="p-5" glow="emerald">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                  Simulated treasury transactions
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Financial operating layer
                </h2>
              </div>
              <Badge variant="emerald">
                <Wallet2 className="h-3.5 w-3.5" />$
                <AnimatedCounter
                  value={liveTreasuryValue}
                  formatter={(value) =>
                    new Intl.NumberFormat("en-US", {
                      maximumFractionDigits: 0,
                    }).format(value)
                  }
                />
              </Badge>
            </div>
            <div className="space-y-3">
              {scenario.transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{transaction.title}</p>
                    <span className="text-sm text-white/42">
                      {transaction.amount}
                    </span>
                  </div>
                  <Badge
                    className="mt-4"
                    variant={
                      transaction.status === "confirmed"
                        ? "emerald"
                        : transaction.status === "routing"
                          ? "cyan"
                          : "violet"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5" glow="violet">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-cyan-200 uppercase">
                  Demo timeline controls
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Presentation pacing
                </h2>
              </div>
              <Clock3 className="h-5 w-5 text-cyan-100" />
            </div>
            <div className="space-y-3">
              {scenario.timeline.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                    index === step
                      ? "border-cyan-300/18 bg-cyan-400/[0.08]"
                      : index < step || isComplete
                        ? "border-emerald-300/10 bg-emerald-400/[0.04]"
                        : "border-white/8 bg-white/[0.04] hover:bg-white/[0.07]"
                  }`}
                >
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="mt-2 text-sm text-white/48">{item.detail}</p>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        <AnimatePresence>
          {isComplete ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <GlassCard className="p-6" glow="emerald">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <Badge variant="emerald">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Workflow successfully executed
                    </Badge>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-white">
                      The autonomous workflow reached a successful governed outcome
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-white/56">
                      Execution finished with stable coordination, treasury settlement
                      readiness, and operator approvals completed across the demo path.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                    {[
                      {
                        label: "Execution confidence",
                        value: `${executionConfidence}%`,
                      },
                      {
                        label: "Treasury settled",
                        value: `$${new Intl.NumberFormat("en-US").format(
                          scenario.telemetry.treasuryMovementUsd,
                        )}`,
                      },
                      {
                        label: "Coordination success",
                        value: `${coordinationSuccess}%`,
                      },
                      {
                        label: "Operator approvals",
                        value: `${approvalsCompleted}/${scenario.timeline.length}`,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3"
                      >
                        <p className="text-[11px] tracking-[0.16em] text-white/34 uppercase">
                          {item.label}
                        </p>
                        <p className="mt-2 text-xl font-semibold text-white">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
