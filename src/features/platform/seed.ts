import { agentProfiles } from "@/lib/agent-data";
import {
  activityStream,
  memorySnapshots,
  orchestrationTasks,
  systemNotifications,
  workflows,
} from "@/lib/mock-data";
import { createStableKey } from "@/lib/react-keys";
import { WorkflowGenerationResult } from "@/lib/workflow-generation";
import {
  OperatorIdentity,
  OperatorSettings,
  PlatformSnapshot,
  PlatformState,
  WorkflowPersistenceInput,
} from "@/features/platform/types";

export const defaultOperatorIdentity: OperatorIdentity = {
  id: "operator-local-primary",
  fullName: "Aarav Shah",
  email: "ops@agentos.ai",
  workspaceName: "AgentOS Core",
  workspaceId: "workspace-agentos-core",
  avatarLabel: "AS",
  role: "Workspace owner",
  authSource: "local",
  sessionState: "guest",
};

export const workspaceSeed = [
  {
    id: "workspace-agentos-core",
    name: "AgentOS Core",
    slug: "agentos-core",
    role: "Owner" as const,
    isActive: true,
  },
  {
    id: "workspace-growth-lab",
    name: "Growth Lab",
    slug: "growth-lab",
    role: "Operator" as const,
    isActive: false,
  },
];

export const defaultOperatorSettings: OperatorSettings = {
  notificationPrefs: {
    incident: true,
    digest: true,
    review: false,
  },
  workspaceMode: "Balanced",
  approvalThreshold: 72,
  theme: "dark",
  commandHintsEnabled: true,
};

export const providerStatusSeed = [
  {
    name: "Local workflow engine",
    detail: "Primary orchestration intelligence",
    status: "Connected",
  },
  {
    name: "Supabase workspace",
    detail: "Session and operator data",
    status: "Standby sync",
  },
  {
    name: "Solana treasury rail",
    detail: "Wallet-scoped execution access",
    status: "Guarded",
  },
];

export const apiKeysSeed = [
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
];

export const accessScopesSeed = [
  "Workflow execution",
  "Treasury policies",
  "Wallet routing",
  "Notification rules",
];

function isoMinutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function buildWorkflowSummaryLine(workflow: WorkflowGenerationResult) {
  return workflow.summary || workflow.objective;
}

export function createSeedPlatformState(): PlatformState {
  const seededAgents = agentProfiles.map((agent, index) => ({
    ...agent,
    createdAt: isoMinutesAgo(index * 11 + 18),
    updatedAt: isoMinutesAgo(index * 4 + 2),
    online: true,
  }));

  return {
    notifications: systemNotifications.map((notification, index) => ({
      ...notification,
      createdAt: notification.createdAt ?? isoMinutesAgo(index * 18 + 8),
      source: "system",
    })),
    activityLogs: activityStream.map((item, index) => ({
      id: createStableKey("activity-seed", item.title, String(index)),
      title: item.title,
      detail: item.detail,
      time: item.time,
      tone: item.tone,
      createdAt: isoMinutesAgo(index * 14 + 4),
      source: index === 1 ? "treasury" : "workflow",
    })),
    memorySnapshots: memorySnapshots.map((snapshot, index) => ({
      id: createStableKey("memory-seed", snapshot.title, String(index)),
      title: snapshot.title,
      detail: snapshot.detail,
      category:
        index === 0 ? "Recovery" : index === 1 ? "Treasury" : "Support",
      timestamp: `${index * 2 + 1}h ago`,
      searchableText: `${snapshot.title} ${snapshot.detail}`.toLowerCase(),
      createdAt: isoMinutesAgo(index * 24 + 10),
      updatedAt: isoMinutesAgo(index * 12 + 3),
    })),
    sessions: [
      {
        id: "session-primary",
        label: "Primary operator session",
        meta: "Chrome on macOS · Bengaluru",
        activity: "Active now",
        status: "active",
        createdAt: isoMinutesAgo(2),
      },
      {
        id: "session-audit",
        label: "Audit review session",
        meta: "Arc on macOS · Remote",
        activity: "Seen 18m ago",
        status: "recent",
        createdAt: isoMinutesAgo(18),
      },
      {
        id: "session-mobile",
        label: "Mobile treasury check",
        meta: "Safari on iPhone · Secure relay",
        activity: "Seen 2h ago",
        status: "recent",
        createdAt: isoMinutesAgo(120),
      },
    ],
    settings: defaultOperatorSettings,
    savedWorkflows: [],
    workflowRuns: workflows.map((workflow, index) => ({
      id: createStableKey("workflow-run-seed", workflow.name),
      name: workflow.name,
      cadence: workflow.cadence,
      status:
        workflow.status === "Paused"
          ? "paused"
          : index === 0
            ? "running"
            : index === 1
              ? "awaiting approval"
              : "completed",
      lastRun: workflow.lastRun,
      prompt: workflow.name,
      createdAt: isoMinutesAgo(index * 32 + 12),
      updatedAt: isoMinutesAgo(index * 12 + 3),
      assignedAgents:
        index === 0
          ? ["Automation Controller", "AI Support Operator"]
          : index === 1
            ? ["Treasury Analyst", "Risk Monitoring Agent"]
            : ["Automation Controller"],
      stageCount: 3 + (index % 3),
      estimatedCostUsd: 2400 + index * 1800,
    })),
    orchestrationTasks: orchestrationTasks.map((task) => ({
      id: createStableKey("orchestration-task-seed", task.task),
      ...task,
      state: task.state as
        | "Executing"
        | "Monitoring"
        | "Resolved"
        | "Queued"
        | "Awaiting review",
    })),
    agents: [
      ...seededAgents,
      {
        ...seededAgents[0],
        slug: "ai-support-operator",
        name: "AI Support Operator",
        type: "Community Agent",
        role: "Routes customer escalations, compresses issue context, and prepares operator approvals.",
        status: "Active",
        currentTask: "Reducing churn-risk escalations across the review queue.",
        linkedWorkflows: ["Customer Recovery", "Growth Campaign"],
        createdAt: isoMinutesAgo(22),
        updatedAt: isoMinutesAgo(4),
        online: true,
      },
      {
        ...seededAgents[2],
        slug: "treasury-analyst-agent",
        name: "Treasury Analyst Agent",
        type: "Treasury Agent",
        role: "Analyzes treasury posture, budget allocation, and payout risk before execution.",
        status: "Monitoring",
        currentTask: "Reviewing vault allocation drift after the latest devnet settlement cycle.",
        linkedWorkflows: ["Treasury Guardrail", "Growth Spend Allocation"],
        createdAt: isoMinutesAgo(44),
        updatedAt: isoMinutesAgo(6),
        online: true,
      },
      {
        ...seededAgents[4],
        slug: "risk-monitoring-agent",
        name: "Risk Monitoring Agent",
        type: "Security Agent",
        role: "Tracks access drift, payout anomalies, and execution risk across autonomous workflows.",
        status: "Coordinating",
        currentTask: "Monitoring payout confidence before irreversible routing.",
        linkedWorkflows: ["Smart Contract Audit", "Treasury Guardrail"],
        createdAt: isoMinutesAgo(61),
        updatedAt: isoMinutesAgo(9),
        online: true,
      },
      {
        ...seededAgents[1],
        slug: "automation-controller",
        name: "Automation Controller",
        type: "Developer Agent",
        role: "Sequences multi-step execution pipelines and resolves workflow retries automatically.",
        status: "Coordinating",
        currentTask: "Supervising multi-step task pipelines across launch and treasury workflows.",
        linkedWorkflows: ["Launch Pipeline", "DAO Contributor Workflow"],
        createdAt: isoMinutesAgo(35),
        updatedAt: isoMinutesAgo(5),
        online: true,
      },
    ],
  };
}

export function createSeedPlatformSnapshot(
  operator: OperatorIdentity = defaultOperatorIdentity,
): PlatformSnapshot {
  return {
    operator,
    ...createSeedPlatformState(),
    workspaces: workspaceSeed.map((workspace) => ({
      ...workspace,
      isActive: workspace.id === operator.workspaceId,
      role:
        workspace.id === operator.workspaceId
          ? ((operator.role === "Workspace owner"
              ? "Owner"
              : operator.role) as "Owner" | "Admin" | "Operator" | "Viewer")
          : workspace.role,
    })),
    providerStatus: providerStatusSeed,
    apiKeys: apiKeysSeed,
    accessScopes: accessScopesSeed,
  };
}

export function buildWorkflowPersistenceArtifacts({
  prompt,
  workflow,
}: WorkflowPersistenceInput) {
  const createdAt = new Date().toISOString();

  return {
    savedWorkflow: {
      id: createStableKey("saved-workflow", workflow.title, createdAt),
      prompt,
      createdAt,
      workflow,
    },
    workflowRun: {
      id: createStableKey("workflow-run", workflow.title, createdAt),
      name: workflow.title,
      cadence: "On demand",
      status: "completed" as const,
      lastRun: "Just now",
      prompt,
      createdAt,
      updatedAt: createdAt,
      assignedAgents: workflow.suggestedAgents,
      stageCount: workflow.stages.length,
      estimatedCostUsd: workflow.totalEstimatedCostUsd,
    },
    activity: {
      id: createStableKey("activity", workflow.title, createdAt),
      title: `${workflow.title} generated`,
      detail: buildWorkflowSummaryLine(workflow),
      time: "Just now",
      tone: "cyan" as const,
      createdAt,
      source: "workflow" as const,
    },
    notification: {
      id: createStableKey("notification", workflow.title, createdAt),
      title: "Workflow intelligence updated",
      detail: `${workflow.title} is ready with ${workflow.stages.length} stages and ${workflow.suggestedAgents.length} assigned agents.`,
      tone: "emerald" as const,
      createdAt,
      source: "workflow" as const,
    },
    memorySnapshot: {
      id: createStableKey("memory", workflow.title, createdAt),
      title: workflow.title,
      detail: workflow.reasoning,
      category: "Workflow" as const,
      timestamp: "Just now",
      searchableText: `${workflow.title} ${workflow.reasoning}`.toLowerCase(),
      createdAt,
      updatedAt: createdAt,
    },
  };
}
