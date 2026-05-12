"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Bot,
  Command,
  CornerDownLeft,
  History,
  LoaderCircle,
  Search,
  ShieldAlert,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { usePlatformSnapshot } from "@/features/platform/hooks";
import { AiCommandResult, AiIntent } from "@/features/ai/types";
import { createRuntimeEntityId, createStableKey } from "@/lib/react-keys";
import { commandActions, keyboardShortcuts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useRuntimeStore } from "@/store/runtime-store";
import { useUiStore } from "@/store/ui-store";

const STORAGE_KEY = "agentos-command-session";

const aiSuggestions = [
  {
    label: "Generate workflow",
    prompt: "Generate workflow for a DAO contributor activation sprint",
    intent: "generate_workflow" as const,
  },
  {
    label: "Analyze treasury risk",
    prompt: "Analyze treasury risk for the current payout queue",
    intent: "analyze_treasury_risk" as const,
  },
  {
    label: "Summarize activity",
    prompt: "Summarize recent operator and agent activity",
    intent: "summarize_activity" as const,
  },
  {
    label: "Recommend payout routing",
    prompt: "Recommend payout routing for contributor settlements on devnet",
    intent: "recommend_payout_routing" as const,
  },
  {
    label: "Detect anomalies",
    prompt: "Detect operational anomalies across workflows and treasury activity",
    intent: "detect_operational_anomalies" as const,
  },
  {
    label: "Restart workflow",
    prompt: "Restart workflow and review any blocked execution stages",
    intent: "generate_workflow" as const,
  },
  {
    label: "Open treasury review",
    prompt: "Summarize the treasury review queue and payout blockers",
    intent: "analyze_treasury_risk" as const,
  },
  {
    label: "Inspect agent memory",
    prompt: "Inspect agent memory snapshots and recent retained context",
    intent: "summarize_activity" as const,
  },
  {
    label: "View settlement queue",
    prompt: "View settlement queue health and pending treasury actions",
    intent: "recommend_payout_routing" as const,
  },
  {
    label: "Open orchestration graph",
    prompt: "Summarize the orchestration graph and active coordination load",
    intent: "detect_operational_anomalies" as const,
  },
] as const;

type AssistantState = {
  lifecycle:
    | "idle"
    | "connecting"
    | "generating"
    | "streaming"
    | "completed"
    | "retrying"
    | "unavailable";
  statusMessage: string;
  streamingText: string;
  result: AiCommandResult | null;
};

type CommandItem =
  | RouteCommandItem
  | {
      id: string;
      type: "recent";
      label: string;
      prompt: string;
      meta: string;
    }
  | {
      id: string;
      type: "suggestion";
      label: string;
      prompt: string;
      intent: AiIntent;
      meta: string;
    }
  | {
      id: string;
      type: "agent";
      label: string;
      prompt: string;
      meta: string;
    }
  | {
      id: string;
      type: "notification";
      label: string;
      prompt: string;
      meta: string;
    };

type RouteCommandItem = {
  id: string;
  type: "route";
  label: string;
  href: string;
  shortcut: string;
  meta: string;
};

const initialAssistantState: AssistantState = {
  lifecycle: "idle",
  statusMessage: "AI command center standing by.",
  streamingText: "",
  result: null,
};

type CommandHistoryItem = {
  id: string;
  prompt: string;
  intent: AiIntent;
  createdAt: string;
};

function highlightQuery(label: string, query: string) {
  if (!query.trim()) return label;
  const lowerLabel = label.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const start = lowerLabel.indexOf(lowerQuery);

  if (start === -1) return label;

  const end = start + query.length;

  return (
    <>
      {label.slice(0, start)}
      <span className="text-cyan-100">{label.slice(start, end)}</span>
      {label.slice(end)}
    </>
  );
}

export function CommandPalette() {
  const router = useRouter();
  const { operator } = useOperatorSession();
  const platformQuery = usePlatformSnapshot(operator);
  const { commandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const recentActions = useRuntimeStore((state) => state.recentActions);
  const addRecentAction = useRuntimeStore((state) => state.addRecentAction);
  const pushToast = useRuntimeStore((state) => state.pushToast);
  const [query, setQuery] = useState("");
  const [assistant, setAssistant] = useState<AssistantState>(
    initialAssistantState,
  );
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }

      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved) as CommandHistoryItem[]);
      }
    } catch {
      // ignore session persistence failures
    }
  }, []);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [commandPaletteOpen]);

  useEffect(() => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history.slice(0, 6)),
    );
  }, [history]);

  const routeResults = useMemo<RouteCommandItem[]>(() => {
    const lowered = query.trim().toLowerCase();

    return commandActions.flatMap((group) =>
      group.items
        .filter((item) =>
          lowered ? item.label.toLowerCase().includes(lowered) : true,
        )
        .map(
          (item): RouteCommandItem => ({
            id: createStableKey("route", item.href, item.label),
            type: "route",
            label: item.label,
            href: item.href,
            shortcut: item.shortcut,
            meta: group.group,
          }),
        ),
    );
  }, [query]);

  const quickActions = useMemo<CommandItem[]>(
    () =>
      aiSuggestions
        .filter((item) =>
          query.trim()
            ? `${item.label} ${item.prompt}`
                .toLowerCase()
                .includes(query.trim().toLowerCase())
            : true,
        )
        .map((item) => ({
          id: createStableKey("suggestion", item.label),
          type: "suggestion",
          label: item.label,
          prompt: item.prompt,
          intent: item.intent,
          meta: "AI action",
        })),
    [query],
  );

  const agentResults = useMemo<CommandItem[]>(
    () =>
      (platformQuery.data?.agents ?? [])
        .filter((agent) =>
          query.trim()
            ? `${agent.name} ${agent.currentTask} ${agent.role}`
                .toLowerCase()
                .includes(query.trim().toLowerCase())
            : true,
        )
        .slice(0, 4)
        .map((agent) => ({
          id: createStableKey("agent", agent.slug),
          type: "agent" as const,
          label: agent.name,
          prompt: `Summarize ${agent.name} status and current execution risk`,
          meta: "Agent",
        })),
    [platformQuery.data?.agents, query],
  );

  const notificationResults = useMemo<CommandItem[]>(
    () =>
      (platformQuery.data?.notifications ?? [])
        .filter((notification) =>
          query.trim()
            ? `${notification.title} ${notification.detail}`
                .toLowerCase()
                .includes(query.trim().toLowerCase())
            : true,
        )
        .slice(0, 4)
        .map((notification) => ({
          id: createStableKey("notification", notification.id),
          type: "notification" as const,
          label: notification.title,
          prompt: `Summarize this alert: ${notification.title}. ${notification.detail}`,
          meta: "Notification",
        })),
    [platformQuery.data?.notifications, query],
  );

  const recentCommandItems = useMemo<CommandItem[]>(
    () =>
      recentActions.slice(0, 4).map((item) => ({
        id: createStableKey("recent-action", item.id),
        type: "recent",
        label: item.label,
        prompt: item.label,
        meta: item.kind === "route" ? "Recent route" : "Recent action",
      })),
    [recentActions],
  );

  const selectableItems = useMemo(
    () => [
      ...routeResults,
      ...quickActions,
      ...agentResults,
      ...notificationResults,
      ...recentCommandItems,
    ],
    [agentResults, notificationResults, quickActions, recentCommandItems, routeResults],
  );

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, selectableItems.length]);

  function inferIntent(prompt: string): AiIntent {
    const normalized = prompt.toLowerCase();

    if (normalized.includes("workflow")) return "generate_workflow";
    if (normalized.includes("payout") || normalized.includes("routing")) {
      return "recommend_payout_routing";
    }
    if (normalized.includes("risk") || normalized.includes("treasury")) {
      return "analyze_treasury_risk";
    }
    if (normalized.includes("anomal")) return "detect_operational_anomalies";
    return "summarize_activity";
  }

  async function runAiCommand(nextPrompt?: string, forcedIntent?: AiIntent) {
    const prompt = (nextPrompt ?? query).trim();
    if (!prompt) return;
    const intent = forcedIntent ?? inferIntent(prompt);

    setAssistant({
      lifecycle: "generating",
      statusMessage: "Generating AI operational response",
      streamingText: "",
      result: null,
    });

    setHistory((current) => [
      {
        id: createRuntimeEntityId("history"),
        prompt,
        intent,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    addRecentAction({
      label: prompt,
      kind: "action",
    });

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          prompt,
          context: {
            route: recentActions[0]?.href,
            operatorName: operator.fullName,
            workspaceName: operator.workspaceName,
            agents: (platformQuery.data?.agents ?? [])
              .slice(0, 4)
              .map((agent) => agent.name),
            notifications: (platformQuery.data?.notifications ?? [])
              .slice(0, 4)
              .map((item) => item.title),
            recentActivity: (platformQuery.data?.activityLogs ?? [])
              .slice(0, 4)
              .map((item) => item.title),
          },
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("no_stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const payload = JSON.parse(line) as
            | {
                type: "status";
                phase: AssistantState["lifecycle"];
                message: string;
              }
            | { type: "delta"; delta: string }
            | { type: "result"; result: AiCommandResult }
            | { type: "done" };

          if (payload.type === "status") {
            setAssistant((current) => ({
              ...current,
              lifecycle: payload.phase,
              statusMessage: payload.message,
            }));
          }

          if (payload.type === "delta") {
            setAssistant((current) => ({
              ...current,
              lifecycle: "streaming",
              streamingText: `${current.streamingText}${payload.delta}`,
            }));
          }

          if (payload.type === "result") {
            setAssistant((current) => ({
              ...current,
              lifecycle: "completed",
              result: payload.result,
            }));
          }
        }
      }
    } catch {
      setAssistant({
        lifecycle: "unavailable",
        statusMessage: "Workflow intelligence reconnecting.",
        streamingText: "",
        result: {
          title: "AI command response unavailable",
          summary:
            "Generation paused. Retry the command to refresh the operational response.",
          recommendations: [
            "Review the relevant product surface directly.",
            "Retry the command after the response pipeline recovers.",
          ],
          suggestedActions: ["Open dashboard", "Open workflows", "Open treasury"],
          confidence: "0.76",
        },
      });
    }
  }

  function handleSelectItem(item: CommandItem) {
    if (item.type === "route") {
      addRecentAction({
        label: item.label,
        href: item.href,
        kind: "route",
      });
      pushToast({
        title: item.label,
        detail: `Opening ${item.href}`,
        tone: "cyan",
      });
      setCommandPaletteOpen(false);
      router.push(item.href);
      return;
    }

    setQuery(item.prompt);
    void runAiCommand(
      item.prompt,
      item.type === "suggestion" ? item.intent : undefined,
    );
  }

  const highlightedItem = selectableItems[highlightedIndex];

  return (
    <Dialog.Root open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#02040dcc] backdrop-blur-xl"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-[12vh] left-1/2 z-50 w-[min(760px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,22,0.96),rgba(7,10,20,0.94))] shadow-[0_40px_120px_rgba(2,6,23,0.55)] outline-none"
          >
            <Dialog.Title className="sr-only">Command palette</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search routes, actions, system surfaces, and treasury AI commands.
            </Dialog.Description>

            <div className="border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setHighlightedIndex((current) =>
                        selectableItems.length
                          ? (current + 1) % selectableItems.length
                          : 0,
                      );
                    }

                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setHighlightedIndex((current) =>
                        selectableItems.length
                          ? (current - 1 + selectableItems.length) %
                            selectableItems.length
                          : 0,
                      );
                    }

                    if (event.key === "Enter") {
                      event.preventDefault();
                      if (highlightedItem) {
                        handleSelectItem(highlightedItem);
                      } else {
                        void runAiCommand();
                      }
                    }
                  }}
                  placeholder='Search routes, agents, alerts, or ask "Analyze treasury risk"'
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/32"
                />
                <button
                  type="button"
                  onClick={() =>
                    highlightedItem
                      ? handleSelectItem(highlightedItem)
                      : void runAiCommand()
                  }
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] tracking-[0.18em] text-white/40 uppercase transition hover:bg-white/[0.08] hover:text-white"
                >
                  Run
                </button>
                <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] tracking-[0.18em] text-white/40 uppercase">
                  <Command className="h-3 w-3" />K
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {aiSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion.prompt);
                      void runAiCommand(suggestion.prompt, suggestion.intent);
                    }}
                    className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-white/54 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[72vh] overflow-y-auto p-4">
              <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 px-2 text-[11px] tracking-[0.18em] text-cyan-200/70 uppercase">
                      <Sparkles className="h-3.5 w-3.5" />
                      Results
                    </div>
                    <div className="space-y-2">
                      {selectableItems.length ? (
                        selectableItems.map((item) => {
                          const active = highlightedItem?.id === item.id;
                          const metaIcon =
                            item.type === "agent" ? (
                              <Bot className="h-3.5 w-3.5" />
                            ) : item.type === "notification" ? (
                              <Bell className="h-3.5 w-3.5" />
                            ) : item.type === "suggestion" ? (
                              <Sparkles className="h-3.5 w-3.5" />
                            ) : (
                              <CornerDownLeft className="h-3.5 w-3.5" />
                            );

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectItem(item)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                                active
                                  ? "border-cyan-300/24 bg-cyan-400/[0.08]"
                                  : "border-white/8 bg-white/[0.04] hover:border-cyan-300/20 hover:bg-cyan-400/[0.06]",
                              )}
                              >
                              <div>
                                <span className="text-sm font-medium text-white">
                                  {highlightQuery(item.label, query)}
                                </span>
                                <p className="mt-1 text-xs text-white/34">
                                  {item.meta}
                                </p>
                              </div>
                              <span className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/38 uppercase">
                                {"shortcut" in item ? item.shortcut : item.type}
                                {metaIcon}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-5">
                          <p className="text-sm font-medium text-white">
                            No route results found
                          </p>
                          <p className="mt-2 text-sm text-white/46">
                            Run the AI command center or try a route, agent, or notification.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                    <div className="mb-3 flex items-center gap-2 text-[11px] tracking-[0.18em] text-cyan-200/70 uppercase">
                      <History className="h-3.5 w-3.5" />
                      Recent actions
                    </div>
                    <div className="space-y-2">
                      {recentCommandItems.length ? (
                        recentCommandItems.map((item) => {
                          const active = highlightedItem?.id === item.id;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectItem(item)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition",
                                active
                                  ? "bg-white/[0.08]"
                                  : "bg-black/10 hover:bg-white/[0.05]",
                              )}
                            >
                              <span className="text-sm text-white/72">
                                {item.label}
                              </span>
                              <span className="text-xs text-white/32">
                                {item.meta}
                              </span>
                            </button>
                          );
                        })
                      ) : history.length ? (
                        history.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setQuery(item.prompt);
                              void runAiCommand(item.prompt, item.intent);
                            }}
                            className="flex w-full items-center justify-between rounded-2xl bg-black/10 px-3 py-2 text-left transition hover:bg-white/[0.05]"
                          >
                            <span className="text-sm text-white/72">
                              {item.prompt}
                            </span>
                            <span className="text-xs text-white/32">
                              {new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-white/42">
                          No AI commands run in this session yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/8 bg-white/[0.035] p-4">
                  <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        AI command center
                      </p>
                      <p className="mt-1 text-xs text-white/38">
                        {assistant.statusMessage}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/36 uppercase">
                      {assistant.lifecycle === "generating" ||
                      assistant.lifecycle === "streaming" ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ShieldAlert className="h-3.5 w-3.5" />
                      )}
                      {assistant.lifecycle}
                    </div>
                  </div>

                  <div className="min-h-[320px] space-y-4 pt-4">
                    <AnimatePresence mode="wait">
                      {assistant.streamingText && !assistant.result ? (
                        <motion.div
                          key="streaming"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-[20px] border border-white/8 bg-black/10 px-4 py-3"
                        >
                          <p className="text-sm leading-7 text-white/58">
                            {assistant.streamingText}
                            <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-sm bg-white/45 align-middle" />
                          </p>
                        </motion.div>
                      ) : assistant.result ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="space-y-4"
                        >
                          <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-base font-semibold text-white">
                                {assistant.result.title}
                              </p>
                              <span className="rounded-full border border-white/8 bg-white/[0.05] px-3 py-1 text-[11px] text-white/42">
                                {assistant.result.confidence} confidence
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-white/54">
                              {assistant.result.summary}
                            </p>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
                              <div className="mb-3 flex items-center gap-2 text-[11px] tracking-[0.18em] text-cyan-200/70 uppercase">
                                <Workflow className="h-3.5 w-3.5" />
                                Recommendations
                              </div>
                              <div className="space-y-2">
                                {assistant.result.recommendations.map(
                                  (item) => (
                                    <p
                                      key={item}
                                      className="text-sm leading-7 text-white/56"
                                    >
                                      {item}
                                    </p>
                                  ),
                                )}
                              </div>
                            </div>

                            <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
                              <div className="mb-3 flex items-center gap-2 text-[11px] tracking-[0.18em] text-cyan-200/70 uppercase">
                                <Sparkles className="h-3.5 w-3.5" />
                                Suggested actions
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {assistant.result.suggestedActions.map(
                                  (item) => (
                                    <button
                                      key={item}
                                      type="button"
                                      onClick={() => {
                                        setQuery(item);
                                        void runAiCommand(item);
                                      }}
                                      className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-white/58 transition hover:bg-white/[0.08] hover:text-white"
                                    >
                                      {item}
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-[20px] border border-dashed border-white/8 bg-black/10 p-4"
                        >
                          <p className="text-sm font-medium text-white">
                            AI command center ready
                          </p>
                          <p className="mt-2 text-sm leading-7 text-white/46">
                            Ask for workflow generation, treasury analysis, activity summaries, payout routing, or anomaly detection.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!query.trim() ? (
                      <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
                        <div className="mb-3 flex items-center gap-2 text-[11px] tracking-[0.18em] text-cyan-200/70 uppercase">
                          <Command className="h-3.5 w-3.5" />
                          Keyboard shortcuts
                        </div>
                        <div className="space-y-2">
                          {keyboardShortcuts.slice(0, 4).map((shortcut) => (
                            <div
                              key={shortcut.key}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-white/58">
                                {shortcut.action}
                              </span>
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] tracking-[0.18em] text-white/40 uppercase">
                                {shortcut.key}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
