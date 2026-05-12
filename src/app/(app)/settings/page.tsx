"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Copy,
  Fingerprint,
  Globe2,
  KeyRound,
  Laptop2,
  LoaderCircle,
  LogOut,
  Orbit,
  RotateCcw,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  Wallet2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { defaultOperatorSettings } from "@/features/platform/seed";
import { usePlatformActions, usePlatformSnapshot } from "@/features/platform/hooks";
import { PlatformMemorySnapshot } from "@/features/platform/types";
import { useWalletTreasury } from "@/hooks/use-wallet-treasury";
import { memorySnapshots } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { formatSol, shortenAddress } from "@/lib/wallet";

const fallbackSessionRows = [
  {
    id: "session-primary",
    label: "Primary operator session",
    meta: "Chrome on macOS · Bengaluru",
    activity: "Active now",
    status: "active",
  },
  {
    id: "session-audit",
    label: "Audit review session",
    meta: "Arc on macOS · Remote",
    activity: "Seen 18m ago",
    status: "recent",
  },
  {
    id: "session-mobile",
    label: "Mobile treasury check",
    meta: "Safari on iPhone · Secure relay",
    activity: "Seen 2h ago",
    status: "recent",
  },
] as const;

const fallbackProviderRows = [
  {
    name: "Local workflow engine",
    detail: "Primary orchestration intelligence",
    status: "Connected",
  },
  {
    name: "Supabase workspace",
    detail: "Session and operator data",
    status: "Healthy",
  },
  {
    name: "Solana treasury rail",
    detail: "Wallet-scoped execution access",
    status: "Guarded",
  },
] as const;

const fallbackApiKeys = [
  {
    name: "Primary orchestration key",
    value: "env:OPENAI_API_KEY",
    scope: "Workflow generation",
    lastRotated: "2 days ago",
  },
  {
    name: "Treasury approval key",
    value: "env:TREASURY_APPROVAL_KEY",
    scope: "Treasury policies",
    lastRotated: "6 days ago",
  },
] as const;

const fallbackAccessScopes = [
  "Workflow execution",
  "Treasury policies",
  "Wallet routing",
  "Notification rules",
] as const;

const notificationOptions = [
  {
    key: "incident",
    label: "Critical incident routing",
    detail: "Immediate alerts for runtime, treasury, and approval anomalies.",
  },
  {
    key: "digest",
    label: "Shift digest",
    detail: "Condensed summary for every completed execution cycle.",
  },
  {
    key: "review",
    label: "Review queue updates",
    detail: "Signals when operators or agents require human approval.",
  },
] as const;

const snapshotCategories = ["All", "Recovery", "Treasury", "Support", "Workflow"] as const;

type NotificationKey = (typeof notificationOptions)[number]["key"];
type SaveState = "idle" | "saving" | "saved";
type DeleteFeedback = {
  tone: "success" | "error";
  message: string;
} | null;

const fallbackEnrichedSnapshots: Array<
  PlatformMemorySnapshot & {
    confidence: string;
    lineage: string;
    rollback: string;
    executionRef: string;
  }
> = [
  {
    id: "memory-recovery-1",
    title: memorySnapshots[0]?.title ?? "Launch rollback protocol",
    detail:
      memorySnapshots[0]?.detail ??
      "Stored after queue saturation recovery succeeded without human intervention.",
    category: "Recovery",
    timestamp: "11m ago",
    searchableText: "rollback recovery queue saturation launch protocol",
    createdAt: "2026-05-12T03:49:00.000Z",
    updatedAt: "2026-05-12T03:55:00.000Z",
    confidence: "0.96",
    lineage: "Inherited from launch recovery lane",
    rollback: "Rollback eligible",
    executionRef: "exec/recovery-4821",
  },
  {
    id: "memory-treasury-1",
    title: memorySnapshots[1]?.title ?? "Treasury safe-path routing",
    detail:
      memorySnapshots[1]?.detail ??
      "Saved when capital transfer confidence exceeded policy thresholds across three vaults.",
    category: "Treasury",
    timestamp: "42m ago",
    searchableText: "treasury routing policy vault confidence settlement",
    createdAt: "2026-05-12T03:18:00.000Z",
    updatedAt: "2026-05-12T03:42:00.000Z",
    confidence: "0.98",
    lineage: "Inherited from treasury guardrail",
    rollback: "Protected archive",
    executionRef: "exec/treasury-1942",
  },
  {
    id: "memory-support-1",
    title: memorySnapshots[2]?.title ?? "High-value customer save playbook",
    detail:
      memorySnapshots[2]?.detail ??
      "Learned from the support swarm after churn risk dropped by 42 percent in one cycle.",
    category: "Support",
    timestamp: "3h ago",
    searchableText: "support memory customer playbook churn escalation",
    createdAt: "2026-05-12T00:00:00.000Z",
    updatedAt: "2026-05-12T01:00:00.000Z",
    confidence: "0.91",
    lineage: "Linked to operator escalation lane",
    rollback: "Archive only",
    executionRef: "exec/support-2280",
  },
];

function toneDot(tone: "cyan" | "emerald" | "violet") {
  if (tone === "emerald") return "bg-emerald-300/85";
  if (tone === "violet") return "bg-amber-300/85";
  return "bg-cyan-300/85";
}

function CompactSignal({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.035] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-white/40">{detail}</p>
    </div>
  );
}

function PreferenceToggle({
  label,
  detail,
  checked,
  syncing,
  onChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  syncing: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-sm leading-6 text-white/44">{detail}</p>
      </div>
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-1 h-7 w-12 shrink-0 rounded-full transition duration-300",
          checked ? "bg-cyan-300/70 shadow-[0_0_20px_rgba(147,231,255,0.18)]" : "bg-white/10",
        )}
      >
        <motion.span
          layout
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_4px_14px_rgba(15,23,42,0.4)]",
            checked ? "left-6" : "left-1",
          )}
        />
        {syncing ? (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-cyan-300/30"
          />
        ) : null}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { operator } = useOperatorSession();
  const platformQuery = usePlatformSnapshot(operator);
  const platformActions = usePlatformActions(operator);
  const { address, connected, walletName, balanceSol, readiness } = useWalletTreasury();
  const [notificationPrefs, setNotificationPrefs] = useState<Record<NotificationKey, boolean>>(
    defaultOperatorSettings.notificationPrefs,
  );
  const [workspaceMode, setWorkspaceMode] = useState<"Focused" | "Balanced" | "All alerts">(
    defaultOperatorSettings.workspaceMode,
  );
  const [approvalThreshold, setApprovalThreshold] = useState(
    defaultOperatorSettings.approvalThreshold,
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [controlFeedback, setControlFeedback] = useState(
    "Approval threshold enforced at 72 percent.",
  );
  const [snapshotSearch, setSnapshotSearch] = useState("");
  const [snapshotCategory, setSnapshotCategory] =
    useState<(typeof snapshotCategories)[number]>("All");
  const [expandedSnapshotId, setExpandedSnapshotId] = useState<string | null>(
    fallbackEnrichedSnapshots[0]?.id ?? null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState<DeleteFeedback>(null);
  const [dangerActionState, setDangerActionState] = useState("");
  const [dangerActionLoading, setDangerActionLoading] = useState<
    "logout" | "memory" | null
  >(null);

  const settings = platformQuery.data?.settings ?? defaultOperatorSettings;
  const sessionRows = platformQuery.data?.sessions ?? fallbackSessionRows;
  const providerRows = platformQuery.data?.providerStatus ?? fallbackProviderRows;
  const apiKeys = platformQuery.data?.apiKeys ?? fallbackApiKeys;
  const accessScopes = platformQuery.data?.accessScopes ?? fallbackAccessScopes;
  const snapshotSource =
    platformQuery.data?.memorySnapshots.length
      ? platformQuery.data.memorySnapshots.map((snapshot, index) => ({
          ...snapshot,
          confidence: `0.${96 - Math.min(index, 4)}`,
          lineage:
            snapshot.category === "Treasury"
              ? "Inherited from treasury routing layer"
              : snapshot.category === "Recovery"
                ? "Inherited from recovery lane"
                : "Inherited from operational context",
          rollback:
            snapshot.category === "Recovery" ? "Rollback eligible" : "Archive only",
          executionRef: `exec/${snapshot.category.toLowerCase()}-${3200 + index * 87}`,
        }))
      : fallbackEnrichedSnapshots;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setNotificationPrefs(settings.notificationPrefs);
      setWorkspaceMode(settings.workspaceMode);
      setApprovalThreshold(settings.approvalThreshold);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [settings]);

  const filteredSnapshots = useMemo(() => {
    return snapshotSource.filter((snapshot) => {
      const matchesCategory =
        snapshotCategory === "All" || snapshot.category === snapshotCategory;
      const query = snapshotSearch.toLowerCase();
      const haystack = `${snapshot.title} ${snapshot.detail} ${snapshot.searchableText}`.toLowerCase();
      return matchesCategory && haystack.includes(query);
    });
  }, [snapshotCategory, snapshotSearch, snapshotSource]);

  const trustScore = `${94 + (sessionRows.length % 4)}%`;
  const sessionIntegrity = sessionRows.some((session) => session.status === "active")
    ? "Verified"
    : "Reconciling";
  const timeoutRefs = useRef<number[]>([]);

  useEffect(
    () => () => {
      timeoutRefs.current.forEach((timer) => window.clearTimeout(timer));
      timeoutRefs.current = [];
    },
    [],
  );

  function scheduleTimeout(callback: () => void, delay: number) {
    const timer = window.setTimeout(() => {
      timeoutRefs.current = timeoutRefs.current.filter((value) => value !== timer);
      callback();
    }, delay);
    timeoutRefs.current = [...timeoutRefs.current, timer];
    return timer;
  }

  function waitFor(delay: number) {
    return new Promise<void>((resolve) => {
      scheduleTimeout(resolve, delay);
    });
  }

  function persistSaveFeedback() {
    setSaveState("saving");
    scheduleTimeout(() => setSaveState("saved"), 420);
    scheduleTimeout(() => setSaveState("idle"), 1500);
  }

  function updateNotificationPref(key: NotificationKey, nextValue: boolean) {
    setNotificationPrefs((current) => ({ ...current, [key]: nextValue }));
    void platformActions.updateNotificationPreferenceMutation.mutateAsync({
      key,
      value: nextValue,
    });
    persistSaveFeedback();
  }

  function updateWorkspaceMode(mode: "Focused" | "Balanced" | "All alerts") {
    setWorkspaceMode(mode);
    setControlFeedback(`Workspace mode shifted to ${mode.toLowerCase()}.`);
    void platformActions.updateSettingsMutation.mutateAsync({
      workspaceMode: mode,
    });
    persistSaveFeedback();
  }

  function updateThreshold(nextValue: number) {
    setApprovalThreshold(nextValue);
    setControlFeedback(`Approval threshold enforced at ${nextValue} percent.`);
    void platformActions.updateSettingsMutation.mutateAsync({
      approvalThreshold: nextValue,
    });
    persistSaveFeedback();
  }

  function triggerCommandFeedback(message: string) {
    setControlFeedback(message);
    persistSaveFeedback();
  }

  function runDangerAction(message: string) {
    setDangerActionState(message);
    scheduleTimeout(() => setDangerActionState(""), 1600);
  }

  function clearLocalProductState() {
    ["agentos-ui-state", "agentos-platform-state", "agentos-treasury-state", "agentos-workflow-studio"].forEach((key) =>
      window.localStorage.removeItem(key),
    );
    window.sessionStorage.removeItem("agentos-command-session");
  }

  async function handleLogoutEverywhere() {
    setDangerActionLoading("logout");
    await waitFor(900);
    await platformActions.revokeSessionsMutation.mutateAsync();
    clearLocalProductState();
    setDangerActionLoading(null);
    setDeleteFeedback({
      tone: "success",
      message: "All sessions cleared. Redirecting to the workspace entry point.",
    });
    scheduleTimeout(() => router.push("/"), 700);
  }

  async function handleResetOrchestrationMemory() {
    setDangerActionLoading("memory");
    await waitFor(850);
    await platformActions.resetMemoryMutation.mutateAsync();
    window.localStorage.removeItem("agentos-workflow-studio");
    setExpandedSnapshotId(null);
    setSnapshotSearch("");
    setSnapshotCategory("All");
    setDangerActionLoading(null);
    runDangerAction("Orchestration memory reset successfully.");
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") return;

    setIsDeleting(true);
    setDeleteFeedback(null);
    await waitFor(1100);
    clearLocalProductState();
    setNotificationPrefs({ incident: false, digest: false, review: false });
    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setDeleteInput("");
    setDeleteFeedback({
      tone: "success",
      message: "Account deletion confirmed. Clearing local workspace state and redirecting.",
    });
    scheduleTimeout(() => router.push("/"), 700);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governance controls"
        title="Autonomous operations governance"
        description="Configure operator trust, session integrity, policy enforcement, provider health, and retained memory across the AI operating stack."
        badge="Control surface verified"
        insights={[
          { label: "Trust score", value: trustScore },
          { label: "Session integrity", value: sessionIntegrity },
          { label: "Approval threshold", value: `${approvalThreshold}%` },
          { label: "Providers", value: `${providerRows.length} live` },
        ]}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <CompactSignal
          label="Operator trust"
          value={trustScore}
          detail="Authentication depth and session verification remain healthy"
        />
        <CompactSignal
          label="Session integrity"
          value={sessionIntegrity}
          detail={`${sessionRows.length} monitored sessions across secure relays`}
        />
        <CompactSignal
          label="Wallet access"
          value={connected ? formatSol(balanceSol ?? 0) : "Offline"}
          detail={connected ? (walletName ?? "Connected") : "Wallet access disabled"}
        />
        <CompactSignal
          label="Memory archive"
          value={`${snapshotSource.length} retained`}
          detail="Rollback-aware operational context is synchronized"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.14fr_0.86fr]">
        <GlassCard className="p-5 sm:p-6" glow="none">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-[-0.03em] text-white">
                  Operator identity and session trust
                </p>
                <p className="mt-1 text-sm leading-6 text-white/44">
                  Govern operator presence, secure relays, wallet scope, and access confidence across the active organization.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="cyan">Privileged operator</Badge>
                  <Badge variant="emerald">Session verified</Badge>
                  <Badge variant="violet">Relay monitored</Badge>
                </div>
              </div>
            </div>
            <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">Control sync</p>
              <p className="mt-2 flex items-center gap-2">
                {saveState === "saving" ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-cyan-100" />
                ) : saveState === "saved" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                ) : (
                  <Sparkles className="h-4 w-4 text-white/40" />
                )}
                {saveState === "saving"
                  ? "Synchronizing controls"
                  : saveState === "saved"
                    ? "Control state saved"
                    : "Changes sync automatically"}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-3">
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">Operator profile</p>
                    <p className="mt-3 text-base font-semibold text-white">{operator.fullName}</p>
                    <p className="mt-1 text-sm text-white/42">{operator.email}</p>
                  </div>
                  <motion.span
                    animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-2.5 w-2.5 rounded-full bg-emerald-300/85"
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <CompactSignal
                    label="Workspace"
                    value={operator.workspaceName}
                    detail="Primary production environment"
                  />
                  <CompactSignal
                    label="Role"
                    value={operator.role}
                    detail="Escalation tier retained"
                  />
                  <CompactSignal
                    label="Auth source"
                    value={operator.authSource}
                    detail="Identity relay healthy"
                  />
                </div>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">Wallet execution scope</p>
                    <p className="mt-2 text-sm leading-6 text-white/44">
                      Treasury routing, payout previews, and policy checkpoints stay scoped to the attached wallet identity.
                    </p>
                  </div>
                  <Wallet2 className="mt-0.5 h-4 w-4 text-cyan-100" />
                </div>
                <div className="mt-4 rounded-[16px] bg-black/10 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-medium text-white">
                      {connected ? shortenAddress(address) : "No wallet connected"}
                    </span>
                    <span className="text-sm text-white/42">
                      {connected ? `${formatSol(balanceSol ?? 0)} SOL` : "Wallet access disabled"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {readiness.slice(0, 3).map((item) => (
                      <span
                        key={item.label}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40"
                      >
                        {item.status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">Trust boundaries</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      icon: ShieldCheck,
                      label: "Authentication depth",
                      detail: "Multi-layer identity checks remain healthy.",
                      tone: "emerald" as const,
                    },
                    {
                      icon: Globe2,
                      label: "Secure relay",
                      detail: "Geographic session routing stays verified.",
                      tone: "cyan" as const,
                    },
                    {
                      icon: Fingerprint,
                      label: "Device integrity",
                      detail: "Operator fingerprints are reconciled live.",
                      tone: "violet" as const,
                    },
                    {
                      icon: Orbit,
                      label: "Coordination presence",
                      detail: "Operator is visible to the orchestration graph.",
                      tone: "emerald" as const,
                    },
                  ].map((signal) => {
                    const Icon = signal.icon;
                    return (
                      <div
                        key={signal.label}
                        className="rounded-[18px] border border-white/7 bg-black/10 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Icon className="h-4 w-4 text-cyan-100" />
                          <motion.span
                            animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.07, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className={`h-2 w-2 rounded-full ${toneDot(signal.tone)}`}
                          />
                        </div>
                        <p className="mt-3 text-sm font-medium text-white">{signal.label}</p>
                        <p className="mt-1 text-sm leading-6 text-white/44">{signal.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm font-medium text-white">Workspace alert mode</p>
                <p className="mt-1 text-sm leading-6 text-white/44">
                  Control how aggressively the operator is interrupted by treasury, workflow, and security signals.
                </p>
                <div className="mt-4 inline-flex rounded-full border border-white/8 bg-white/[0.03] p-1">
                  {(["Focused", "Balanced", "All alerts"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => updateWorkspaceMode(mode)}
                      className={cn(
                        "rounded-full px-3 py-2 text-sm transition duration-200",
                        workspaceMode === mode
                          ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          : "text-white/46 hover:text-white",
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6" glow="none">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-white">Session intelligence</p>
              <p className="mt-1 text-sm leading-6 text-white/44">
                Monitored operator sessions with integrity, relay, and device awareness.
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => triggerCommandFeedback("Idle sessions revoked successfully.")}>
              <LogOut className="h-4 w-4" />
              Reconcile sessions
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {sessionRows.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
                className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4 transition duration-200 hover:border-white/12 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] text-cyan-100">
                      <Laptop2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-white">{session.label}</p>
                        <Badge variant={session.status === "active" ? "emerald" : "cyan"}>
                          {session.status === "active" ? "Verified" : "Recent"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-white/40">{session.meta}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          index === 0 ? "Device fingerprint matched" : "Secure relay active",
                          index === 1 ? "Geographic review clear" : "Session scope healthy",
                        ].map((detail) => (
                          <span
                            key={detail}
                            className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/34">{session.activity}</p>
                    <motion.div
                      animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.07, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`mt-3 ml-auto h-2 w-2 rounded-full ${session.status === "active" ? "bg-emerald-300/85" : "bg-cyan-300/80"}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-5 sm:p-6" glow="none">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-white">Security and provider layer</p>
              <p className="mt-1 text-sm leading-6 text-white/44">
                Policy enforcement, provider integrity, API key sensitivity, and trust boundaries.
              </p>
            </div>
            <Badge variant="cyan">Infrastructure</Badge>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {providerRows.map((provider, index) => (
                <div
                  key={provider.name}
                  className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <ServerCog className="h-4 w-4 text-cyan-100" />
                    <motion.span
                      animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.07, 1] }}
                      transition={{ duration: 2 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
                      className={`h-2 w-2 rounded-full ${index === 1 ? "bg-emerald-300/85" : index === 2 ? "bg-amber-300/85" : "bg-cyan-300/80"}`}
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-white">{provider.name}</p>
                  <p className="mt-1 text-sm leading-6 text-white/44">{provider.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                      {provider.status}
                    </span>
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                      {index === 0 ? "Latency 214ms" : index === 1 ? "Redundant scope healthy" : "Fallback ready"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">Runtime enforcement and scopes</p>
                <p className="text-xs text-white/36">{controlFeedback}</p>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-[16px] bg-black/10 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">Approval threshold</p>
                  <input
                    type="range"
                    min={40}
                    max={95}
                    value={approvalThreshold}
                    onChange={(event) => updateThreshold(Number(event.target.value))}
                    className="mt-4 w-full accent-cyan-300"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-white/36">
                    <span>40%</span>
                    <span>{approvalThreshold}%</span>
                    <span>95%</span>
                  </div>
                </div>
                <div className="rounded-[16px] bg-black/10 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">Access scopes</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {accessScopes.map((scope) => (
                      <span
                        key={scope}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white">Protected credentials</p>
              <div className="mt-4 space-y-3">
                {apiKeys.map((key) => (
                  <div key={key.name} className="rounded-[16px] bg-black/10 px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <KeyRound className="h-4 w-4 text-cyan-100" />
                          <p className="text-sm font-medium text-white">{key.name}</p>
                        </div>
                        <p className="mt-1 text-xs text-white/40">
                          {key.scope} · Rotated {key.lastRotated}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => triggerCommandFeedback(`${key.name} copied for review.`)}
                      >
                        <Copy className="h-4 w-4" />
                        {key.value}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6" glow="none">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-white">AI memory governance</p>
              <p className="mt-1 text-sm leading-6 text-white/44">
                Search retained operational intelligence, inspect lineage, and verify rollback posture before reusing memory.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {snapshotCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSnapshotCategory(category)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm transition duration-200",
                    snapshotCategory === category
                      ? "bg-white/[0.09] text-white"
                      : "bg-white/[0.03] text-white/46 hover:text-white",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
            <input
              value={snapshotSearch}
              onChange={(event) => setSnapshotSearch(event.target.value)}
              placeholder="Search memory by title, detail, or lineage"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div className="mt-4 space-y-3">
            <AnimatePresence initial={false}>
              {filteredSnapshots.map((snapshot) => {
                const isExpanded = expandedSnapshotId === snapshot.id;

                return (
                  <motion.div
                    key={snapshot.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSnapshotId((current) =>
                          current === snapshot.id ? null : snapshot.id,
                        )
                      }
                      className="flex w-full items-start justify-between gap-3 text-left"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-white">{snapshot.title}</p>
                          <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[10px] text-white/38">
                            {snapshot.category}
                          </span>
                          <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[10px] text-white/38">
                            {snapshot.confidence}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-white/36">{snapshot.timestamp}</p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0 text-white/36 transition duration-200",
                          isExpanded ? "rotate-180" : "",
                        )}
                      />
                    </button>
                    {isExpanded ? (
                      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.9fr]">
                        <div className="rounded-[16px] bg-black/10 px-4 py-3">
                          <p className="text-sm leading-6 text-white/52">{snapshot.detail}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                              {snapshot.lineage}
                            </span>
                            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                              {snapshot.rollback}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-[16px] bg-black/10 px-4 py-3">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/32">Execution reference</p>
                          <p className="mt-2 text-sm font-medium text-white">{snapshot.executionRef}</p>
                          <p className="mt-2 text-sm leading-6 text-white/44">
                            Memory confidence remains linked to orchestration lineage and can be restored into future execution graphs when trust boundaries are satisfied.
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredSnapshots.length === 0 ? (
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-5 text-sm text-white/46">
                No memory snapshots match the current search or category.
              </div>
            ) : null}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
        <GlassCard className="p-5 sm:p-6" glow="none">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-white">Control dispatch center</p>
              <p className="mt-1 text-sm leading-6 text-white/44">
                High-trust actions for provider scope, session discipline, and governance enforcement.
              </p>
            </div>
            <Badge variant="cyan">Command layer</Badge>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              {
                title: "Rotate orchestration key",
                detail: "Validate provider integrity and stage a protected credential rollover.",
              },
              {
                title: "Refresh provider scopes",
                detail: "Reconcile execution scopes, failover paths, and routing permissions.",
              },
              {
                title: "Pause approval compression",
                detail: "Force sensitive actions through slower human review until anomalies clear.",
              },
              {
                title: "Revoke idle sessions",
                detail: "Invalidate recent sessions that are outside the current trust boundary.",
              },
            ].map((action, index) => (
              <motion.button
                key={action.title}
                type="button"
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => triggerCommandFeedback(`${action.title} completed.`)}
                className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4 text-left transition duration-200 hover:border-cyan-300/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">{action.title}</p>
                  <motion.span
                    animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.06, 1] }}
                    transition={{ duration: 2 + index * 0.12, repeat: Infinity, ease: "easeInOut" }}
                    className="h-2 w-2 rounded-full bg-cyan-300/80"
                  />
                </div>
                <p className="mt-2 text-sm leading-6 text-white/46">{action.detail}</p>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6" glow="none">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-white">Danger zone</p>
              <p className="mt-1 text-sm leading-6 text-white/44">
                Protected destructive actions with staged confirmation, security consequences, and irreversible governance warnings.
              </p>
            </div>
            {dangerActionState ? <p className="text-sm text-white/46">{dangerActionState}</p> : null}
          </div>

          <div className="mt-5 rounded-[20px] border border-rose-300/12 bg-rose-400/[0.03] p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 text-rose-100/80" />
              <div>
                <p className="text-sm font-medium text-white">Irreversible governance actions</p>
                <p className="mt-1 text-sm leading-6 text-white/44">
                  These controls affect account identity, provider access, session trust, orchestration memory, and workspace continuity. Every action is treated as system-critical.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => void handleLogoutEverywhere()}
              disabled={dangerActionLoading !== null}
              className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:bg-white/[0.05] disabled:opacity-60"
            >
              <p className="text-sm font-medium text-white">Log out everywhere</p>
              <p className="mt-1 text-sm leading-6 text-white/44">
                Invalidate all operator sessions and clear secure relay continuity.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/36">
                {dangerActionLoading === "logout" ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                {dangerActionLoading === "logout" ? "Clearing sessions" : "Session revoke"}
              </div>
            </button>
            <button
              type="button"
              onClick={() => void handleResetOrchestrationMemory()}
              disabled={dangerActionLoading !== null}
              className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 text-left transition hover:bg-white/[0.05] disabled:opacity-60"
            >
              <p className="text-sm font-medium text-white">Reset orchestration memory</p>
              <p className="mt-1 text-sm leading-6 text-white/44">
                Remove retained workflow context, archive references, and local reasoning traces.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/36">
                {dangerActionLoading === "memory" ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5" />
                )}
                {dangerActionLoading === "memory" ? "Resetting memory" : "Memory reset"}
              </div>
            </button>
            <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="rounded-[18px] border border-rose-300/12 bg-rose-400/[0.03] px-4 py-4 text-left transition hover:bg-rose-400/[0.05]"
                >
                  <p className="text-sm font-medium text-white">Delete account</p>
                  <p className="mt-1 text-sm leading-6 text-white/44">
                    Permanently remove workspace identity, wallets, memory, and orchestration history.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-white/36">
                    <Trash2 className="h-3.5 w-3.5" />
                    Destructive action
                  </div>
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[70] bg-[rgba(3,7,16,0.72)] backdrop-blur-md" />
                <Dialog.Content className="fixed top-1/2 left-1/2 z-[80] w-[min(460px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2">
                  <GlassCard className="p-5 sm:p-6" glow="none">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Dialog.Title className="text-lg font-semibold text-white">
                          Confirm account deletion
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm leading-6 text-white/46">
                          Type <span className="font-medium text-white">DELETE</span> to confirm permanent removal of this account and all operator access.
                        </Dialog.Description>
                      </div>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="rounded-full p-1 text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                          aria-label="Close delete account modal"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="mt-5 rounded-[18px] border border-rose-300/10 bg-rose-400/[0.03] px-4 py-3 text-sm leading-6 text-white/46">
                      This action permanently removes your workspace, orchestration history, connected wallets, operational memory, and provider governance state.
                    </div>

                    <div className="mt-5 grid gap-2">
                      {[
                        "Workspace identity is removed",
                        "Memory archives become unrecoverable",
                        "Wallet-linked treasury access is revoked",
                        "Provider trust mappings are deleted",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-[14px] border border-white/7 bg-black/10 px-3 py-2 text-sm text-white/56"
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    <input
                      value={deleteInput}
                      onChange={(event) => setDeleteInput(event.target.value)}
                      placeholder="Type DELETE"
                      className="mt-5 w-full rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"
                    />

                    <div className="mt-5 flex items-center justify-end gap-3">
                      <Dialog.Close asChild>
                        <Button variant="ghost">Cancel</Button>
                      </Dialog.Close>
                      <Button
                        variant="secondary"
                        disabled={deleteInput !== "DELETE" || isDeleting}
                        onClick={() => void handleDeleteAccount()}
                      >
                        {isDeleting ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        {isDeleting ? "Deleting account" : "Confirm deletion"}
                      </Button>
                    </div>
                  </GlassCard>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </GlassCard>
      </div>

      {deleteFeedback ? (
        <div
          className={cn(
            "rounded-[18px] px-4 py-3 text-sm",
            deleteFeedback.tone === "success"
              ? "border border-emerald-300/12 bg-emerald-400/[0.04] text-emerald-50"
              : "border border-rose-300/12 bg-rose-400/[0.04] text-rose-50",
          )}
        >
          {deleteFeedback.message}
        </div>
      ) : null}

      <GlassCard className="p-5 sm:p-6" glow="none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold tracking-[-0.03em] text-white">Notification and governance preferences</p>
            <p className="mt-1 text-sm leading-6 text-white/44">
              Control the pacing of alerts and the behavioral profile of the operator interface.
            </p>
          </div>
          <Badge variant="violet">Behavioral layer</Badge>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {notificationOptions.map((option) => (
            <PreferenceToggle
              key={option.key}
              label={option.label}
              detail={option.detail}
              checked={notificationPrefs[option.key]}
              syncing={saveState === "saving"}
              onChange={(nextValue) => updateNotificationPref(option.key, nextValue)}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
