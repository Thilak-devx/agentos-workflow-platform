"use client";

import {
  buildWorkflowPersistenceArtifacts,
  createSeedPlatformSnapshot,
  createSeedPlatformState,
} from "@/features/platform/seed";
import { getSupabaseBrowserClientOrNull } from "@/features/platform/supabase";
import {
  NotificationPreferenceKey,
  OperatorIdentity,
  OperatorSettings,
  PlatformActivityLog,
  PlatformAgentRecord,
  PlatformMemorySnapshot,
  PlatformNotification,
  PlatformSnapshot,
  PlatformState,
  WorkflowRunRecord,
  WorkspaceRecord,
  WorkflowPersistenceInput,
} from "@/features/platform/types";
import { PLATFORM_TABLES, type PlatformTableName } from "@/features/platform/schema";
import { createStableKey } from "@/lib/react-keys";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const PLATFORM_STORAGE_KEY = "agentos-platform-state";
const missingPlatformTables = new Set<PlatformTableName>();

type PersistedPlatformState = PlatformState;

function canUseStorage() {
  return typeof window !== "undefined";
}

function readLocalState() {
  if (!canUseStorage()) {
    return createSeedPlatformState();
  }

  try {
    const raw = window.localStorage.getItem(PLATFORM_STORAGE_KEY);
    if (!raw) {
      const seeded = createSeedPlatformState();
      writeLocalState(seeded);
      return seeded;
    }

    return {
      ...createSeedPlatformState(),
      ...(JSON.parse(raw) as PersistedPlatformState),
    };
  } catch {
    return createSeedPlatformState();
  }
}

function writeLocalState(nextState: PlatformState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PLATFORM_STORAGE_KEY, JSON.stringify(nextState));
}

function markPlatformTableMissing(table: PlatformTableName) {
  missingPlatformTables.add(table);
}

export function hasKnownMissingPlatformTables() {
  return missingPlatformTables.size > 0;
}

type SupabaseRow = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : typeof value === "string" && value.trim() && !Number.isNaN(Number(value))
      ? Number(value)
      : fallback;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function asTimestamp(row: SupabaseRow, camelKey: string) {
  const camelValue = row[camelKey];
  if (typeof camelValue === "string" && camelValue) {
    return camelValue;
  }

  const snakeKey = camelKey.replace(/[A-Z]/g, (character) => `_${character.toLowerCase()}`);
  const snakeValue = row[snakeKey];
  return typeof snakeValue === "string" && snakeValue ? snakeValue : new Date().toISOString();
}

function normalizeNotification(row: SupabaseRow): PlatformNotification {
  return {
    id: asString(row.id),
    title: asString(row.title),
    detail: asString(row.detail),
    tone: (asString(row.tone, "cyan") as PlatformNotification["tone"]),
    source: (asString(row.source, "system") as PlatformNotification["source"]),
    createdAt: asTimestamp(row, "createdAt"),
  };
}

function normalizeActivityLog(row: SupabaseRow): PlatformActivityLog {
  return {
    id: asString(row.id),
    title: asString(row.title),
    detail: asString(row.detail),
    time: asString(row.time, "Just now"),
    tone: (asString(row.tone, "cyan") as PlatformActivityLog["tone"]),
    source: (asString(row.source, "system") as PlatformActivityLog["source"]),
    createdAt: asTimestamp(row, "createdAt"),
  };
}

function normalizeMemorySnapshot(row: SupabaseRow): PlatformMemorySnapshot {
  return {
    id: asString(row.id),
    title: asString(row.title),
    detail: asString(row.detail),
    category: (asString(row.category, "Workflow") as PlatformMemorySnapshot["category"]),
    timestamp: asString(row.timestamp, "Just now"),
    searchableText: asString(row.searchableText ?? row["searchableText"]),
    createdAt: asTimestamp(row, "createdAt"),
    updatedAt: asTimestamp(row, "updatedAt"),
  };
}

function normalizeWorkflowRun(row: SupabaseRow): WorkflowRunRecord {
  return {
    id: asString(row.id),
    name: asString(row.name),
    cadence: asString(row.cadence, "On demand"),
    status: (asString(row.status, "queued") as WorkflowRunRecord["status"]),
    lastRun: asString(row.lastRun ?? row["lastRun"], "Just now"),
    prompt: asString(row.prompt),
    createdAt: asTimestamp(row, "createdAt"),
    updatedAt: asTimestamp(row, "updatedAt"),
    assignedAgents: asStringArray(row.assignedAgents ?? row["assignedAgents"]),
    stageCount: asNumber(row.stageCount ?? row["stageCount"]),
    estimatedCostUsd: asNumber(row.estimatedCostUsd ?? row["estimatedCostUsd"]),
  };
}

function normalizeSavedWorkflow(row: SupabaseRow) {
  return {
    id: asString(row.id),
    prompt: asString(row.prompt),
    createdAt: asTimestamp(row, "createdAt"),
    workflow: (row.workflow ?? {}) as PlatformState["savedWorkflows"][number]["workflow"],
  };
}

function normalizeOperatorSettings(
  row: SupabaseRow,
  fallback: OperatorSettings,
): OperatorSettings {
  const notificationPrefs =
    row.notificationPrefs ?? row["notificationPrefs"];

  return {
    notificationPrefs:
      notificationPrefs &&
      typeof notificationPrefs === "object" &&
      !Array.isArray(notificationPrefs)
        ? {
            incident: Boolean((notificationPrefs as Record<string, unknown>).incident),
            digest: Boolean((notificationPrefs as Record<string, unknown>).digest),
            review: Boolean((notificationPrefs as Record<string, unknown>).review),
          }
        : fallback.notificationPrefs,
    workspaceMode: (asString(
      row.workspaceMode ?? row["workspaceMode"],
      fallback.workspaceMode,
    ) as OperatorSettings["workspaceMode"]),
    approvalThreshold: asNumber(
      row.approvalThreshold ?? row["approvalThreshold"],
      fallback.approvalThreshold,
    ),
    theme: "dark",
    commandHintsEnabled: asBoolean(
      row.commandHintsEnabled ?? row["commandHintsEnabled"],
      fallback.commandHintsEnabled,
    ),
  };
}

function normalizeAgent(row: SupabaseRow): PlatformAgentRecord {
  return {
    id: asString(row.id),
    slug: asString(row.slug),
    name: asString(row.name),
    type: asString(row.type) as PlatformAgentRecord["type"],
    role: asString(row.role),
    status: asString(row.status) as PlatformAgentRecord["status"],
    currentTask: asString(row.currentTask ?? row["currentTask"]),
    successRate: asString(row.successRate ?? row["successRate"]),
    confidence: asString(row.confidence),
    walletPermissions: asString(row.walletPermissions ?? row["walletPermissions"]),
    memoryState: asString(row.memoryState ?? row["memoryState"]),
    treasuryAccessLevel: asString(
      row.treasuryAccessLevel ?? row["treasuryAccessLevel"],
    ),
    linkedWorkflows: asStringArray(row.linkedWorkflows ?? row["linkedWorkflows"]),
    telemetry:
      row.telemetry && typeof row.telemetry === "object" && !Array.isArray(row.telemetry)
        ? {
            executions24h: asString(
              (row.telemetry as Record<string, unknown>).executions24h,
            ),
            avgLatency: asString(
              (row.telemetry as Record<string, unknown>).avgLatency,
            ),
            collaborationLoad: asString(
              (row.telemetry as Record<string, unknown>).collaborationLoad,
            ),
          }
        : {
            executions24h: "",
            avgLatency: "",
            collaborationLoad: "",
          },
    tone: asString(row.tone, "cyan") as PlatformAgentRecord["tone"],
    summary: asString(row.summary),
    executionHistory: Array.isArray(row.executionHistory ?? row["executionHistory"])
      ? ((row.executionHistory ?? row["executionHistory"]) as PlatformAgentRecord["executionHistory"])
      : [],
    reasoningLogs: Array.isArray(row.reasoningLogs ?? row["reasoningLogs"])
      ? ((row.reasoningLogs ?? row["reasoningLogs"]) as PlatformAgentRecord["reasoningLogs"])
      : [],
    memorySnapshots: Array.isArray(row.memorySnapshots ?? row["memorySnapshots"])
      ? ((row.memorySnapshots ?? row["memorySnapshots"]) as PlatformAgentRecord["memorySnapshots"])
      : [],
    communicationFeed: Array.isArray(
      row.communicationFeed ?? row["communicationFeed"],
    )
      ? ((row.communicationFeed ?? row["communicationFeed"]) as PlatformAgentRecord["communicationFeed"])
      : [],
    createdAt: asTimestamp(row, "createdAt"),
    updatedAt: asTimestamp(row, "updatedAt"),
    online: asBoolean(row.online, true),
  };
}

async function safeSupabaseFetch<T>(
  table: PlatformTableName,
  query: () => PromiseLike<{ data: T | null; error: unknown }>,
) {
  if (missingPlatformTables.has(table)) {
    return null;
  }

  try {
    const result = await query();
    if (result.error) {
      if (isMissingRelationError(result.error)) {
        markPlatformTableMissing(table);
      }
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

function isMissingRelationError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const candidate = error as {
    code?: string;
    status?: number;
    statusCode?: number;
    message?: string;
    hint?: string | null;
    details?: string | null;
  };
  const text =
    `${candidate.message ?? ""} ${candidate.details ?? ""} ${candidate.hint ?? ""}`.toLowerCase();

  return (
    candidate.code === "PGRST205" ||
    candidate.code === "42P01" ||
    candidate.status === 404 ||
    candidate.statusCode === 404 ||
    text.includes("could not find the table") ||
    (text.includes("relation") && text.includes("does not exist")) ||
    (text.includes("not found") && text.includes("table")) ||
    text.includes("schema cache")
  );
}

async function hydrateFromSupabase(localState: PlatformState) {
  const client = getSupabaseBrowserClientOrNull();
  if (!client) return localState;

  const [
    notifications,
    activityLogs,
    memorySnapshots,
    workflowRuns,
    savedWorkflows,
    agents,
    settingsRows,
  ] = await Promise.all([
    safeSupabaseFetch(PLATFORM_TABLES.notifications, () => client.from(PLATFORM_TABLES.notifications).select("*").order("created_at", { ascending: false }).limit(12)),
    safeSupabaseFetch(PLATFORM_TABLES.activityLogs, () => client.from(PLATFORM_TABLES.activityLogs).select("*").order("created_at", { ascending: false }).limit(12)),
    safeSupabaseFetch(PLATFORM_TABLES.memorySnapshots, () => client.from(PLATFORM_TABLES.memorySnapshots).select("*").order("created_at", { ascending: false }).limit(12)),
    safeSupabaseFetch(PLATFORM_TABLES.workflowRuns, () => client.from(PLATFORM_TABLES.workflowRuns).select("*").order("updated_at", { ascending: false }).limit(12)),
    safeSupabaseFetch(PLATFORM_TABLES.savedWorkflows, () => client.from(PLATFORM_TABLES.savedWorkflows).select("*").order("created_at", { ascending: false }).limit(12)),
    safeSupabaseFetch(PLATFORM_TABLES.agents, () => client.from(PLATFORM_TABLES.agents).select("*").order("updated_at", { ascending: false }).limit(20)),
    safeSupabaseFetch(PLATFORM_TABLES.operatorSettings, () => client.from(PLATFORM_TABLES.operatorSettings).select("*").limit(1).maybeSingle()),
  ]);

  return {
    ...localState,
    notifications:
      Array.isArray(notifications) && notifications.length
        ? notifications.map((item) =>
            normalizeNotification(item as SupabaseRow),
          )
        : localState.notifications,
    activityLogs:
      Array.isArray(activityLogs) && activityLogs.length
        ? activityLogs.map((item) =>
            normalizeActivityLog(item as SupabaseRow),
          )
        : localState.activityLogs,
    memorySnapshots:
      Array.isArray(memorySnapshots) && memorySnapshots.length
        ? memorySnapshots.map((item) =>
            normalizeMemorySnapshot(item as SupabaseRow),
          )
        : localState.memorySnapshots,
    workflowRuns:
      Array.isArray(workflowRuns) && workflowRuns.length
        ? workflowRuns.map((item) => normalizeWorkflowRun(item as SupabaseRow))
        : localState.workflowRuns,
    savedWorkflows:
      Array.isArray(savedWorkflows) && savedWorkflows.length
        ? savedWorkflows.map((item) => normalizeSavedWorkflow(item as SupabaseRow))
        : localState.savedWorkflows,
    agents:
      Array.isArray(agents) && agents.length
        ? agents.map((item) => normalizeAgent(item as SupabaseRow))
        : localState.agents,
    settings:
      settingsRows && typeof settingsRows === "object"
        ? normalizeOperatorSettings(settingsRows as SupabaseRow, localState.settings)
        : localState.settings,
  };
}

async function syncTable(
  table: PlatformTableName,
  payload: Record<string, unknown>,
) {
  const client = getSupabaseBrowserClientOrNull();
  if (!client) return;
  if (missingPlatformTables.has(table)) return;

  try {
    const result = await client.from(table).upsert(payload);
    if (result.error && isMissingRelationError(result.error)) {
      markPlatformTableMissing(table);
    }
  } catch (error) {
    if (isMissingRelationError(error)) {
      markPlatformTableMissing(table);
    }
    // Local state remains the source of truth when Supabase is unavailable.
  }
}

export async function getPlatformSnapshot(
  operator?: OperatorIdentity,
): Promise<PlatformSnapshot> {
  const localState = readLocalState();
  const syncedState = isSupabaseConfigured()
    ? await hydrateFromSupabase(localState)
    : localState;

  if (syncedState !== localState) {
    writeLocalState(syncedState);
  }

  return {
    ...createSeedPlatformSnapshot(operator),
    ...syncedState,
    operator: operator ?? createSeedPlatformSnapshot().operator,
  };
}

export async function updateOperatorSettings(
  nextSettings: Partial<OperatorSettings>,
) {
  const current = readLocalState();
  const updatedSettings = {
    ...current.settings,
    ...nextSettings,
  };
  const nextState = {
    ...current,
    settings: updatedSettings,
  };

  writeLocalState(nextState);
  await syncTable(PLATFORM_TABLES.operatorSettings, {
    id: "primary",
    ...updatedSettings,
  });

  return updatedSettings;
}

export async function updateNotificationPreference(
  key: NotificationPreferenceKey,
  value: boolean,
) {
  const current = readLocalState();
  return updateOperatorSettings({
    notificationPrefs: {
      ...current.settings.notificationPrefs,
      [key]: value,
    },
  });
}

export async function persistWorkflowArtifacts(
  artifacts: ReturnType<typeof buildWorkflowPersistenceArtifacts>,
) {
  const current = readLocalState();
  const nextState: PlatformState = {
    ...current,
    savedWorkflows: [
      artifacts.savedWorkflow,
      ...current.savedWorkflows.filter(
        (item) => item.id !== artifacts.savedWorkflow.id,
      ),
    ].slice(0, 12),
    workflowRuns: [
      artifacts.workflowRun,
      ...current.workflowRuns.filter((item) => item.id !== artifacts.workflowRun.id),
    ].slice(0, 12),
    activityLogs: [artifacts.activity, ...current.activityLogs].slice(0, 12),
    notifications: [artifacts.notification, ...current.notifications].slice(0, 12),
    memorySnapshots: [artifacts.memorySnapshot, ...current.memorySnapshots].slice(0, 12),
  };

  writeLocalState(nextState);

  await Promise.all([
    syncTable(PLATFORM_TABLES.savedWorkflows, artifacts.savedWorkflow as unknown as Record<string, unknown>),
    syncTable(PLATFORM_TABLES.workflowRuns, artifacts.workflowRun as unknown as Record<string, unknown>),
    syncTable(PLATFORM_TABLES.activityLogs, artifacts.activity as unknown as Record<string, unknown>),
    syncTable(PLATFORM_TABLES.notifications, artifacts.notification as unknown as Record<string, unknown>),
    syncTable(PLATFORM_TABLES.memorySnapshots, artifacts.memorySnapshot as unknown as Record<string, unknown>),
  ]);

  return nextState;
}

export async function saveGeneratedWorkflow(input: WorkflowPersistenceInput) {
  return persistWorkflowArtifacts(buildWorkflowPersistenceArtifacts(input));
}

export async function createAgentRecord(agent: PlatformState["agents"][number]) {
  const current = readLocalState();
  const createdAt = agent.createdAt || new Date().toISOString();
  const nextAgent = {
    ...agent,
    createdAt,
    updatedAt: new Date().toISOString(),
  };

  const nextState = {
    ...current,
    agents: [
      nextAgent,
      ...current.agents.filter((item) => item.slug !== nextAgent.slug),
    ],
  };

  writeLocalState(nextState);
  await syncTable(PLATFORM_TABLES.agents, nextAgent as unknown as Record<string, unknown>);

  return nextAgent;
}

export async function revokeOtherSessions() {
  const current = readLocalState();
  const nextState = {
    ...current,
    sessions: current.sessions.map((session, index) =>
      index === 0
        ? session
        : {
            ...session,
            status: "revoked" as const,
            activity: "Revoked just now",
          },
    ),
    notifications: [
      {
        id: createStableKey("notification", "session-revoke", Date.now().toString()),
        title: "Operator sessions revoked",
        detail: "Idle sessions were revoked from the active workspace.",
        tone: "emerald" as const,
        createdAt: new Date().toISOString(),
        source: "system" as const,
      },
      ...current.notifications,
    ].slice(0, 12),
  };

  writeLocalState(nextState);
  return nextState.sessions;
}

export async function resetOrchestrationMemory() {
  const current = readLocalState();
  const nextState = {
    ...current,
    memorySnapshots: [],
  };
  writeLocalState(nextState);
  return nextState.memorySnapshots;
}

export async function switchWorkspace(workspace: WorkspaceRecord) {
  const client = getSupabaseBrowserClientOrNull();

  if (client) {
    try {
      await client.auth.updateUser({
        data: {
          workspace_name: workspace.name,
          workspace_id: workspace.id,
          role: workspace.role,
        },
      });
    } catch {
      // local UI still updates through auth refresh fallback
    }
  }

  return workspace;
}
