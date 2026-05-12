import { AgentProfile } from "@/lib/agent-data";
import { Tone } from "@/lib/mock-data";
import { SavedWorkflow, WorkflowGenerationResult } from "@/lib/workflow-generation";

export type OperatorIdentity = {
  id: string;
  fullName: string;
  email: string;
  workspaceName: string;
  workspaceId: string;
  avatarLabel: string;
  role: string;
  authSource: "supabase" | "local";
  sessionState: "authenticated" | "guest" | "loading";
};

export type OperatorRole = "Owner" | "Admin" | "Operator" | "Viewer";

export type WorkspaceRecord = {
  id: string;
  name: string;
  slug: string;
  role: OperatorRole;
  isActive: boolean;
};

export type OperatorSessionRecord = {
  id: string;
  label: string;
  meta: string;
  activity: string;
  status: "active" | "recent" | "revoked";
  createdAt: string;
};

export type NotificationPreferenceKey = "incident" | "digest" | "review";

export type OperatorSettings = {
  notificationPrefs: Record<NotificationPreferenceKey, boolean>;
  workspaceMode: "Focused" | "Balanced" | "All alerts";
  approvalThreshold: number;
  theme: "dark";
  commandHintsEnabled: boolean;
};

export type PlatformNotification = {
  id: string;
  title: string;
  detail: string;
  tone: Tone;
  createdAt: string;
  source: "runtime" | "workflow" | "treasury" | "system";
};

export type PlatformActivityLog = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: Tone;
  createdAt: string;
  source: "agents" | "workflow" | "treasury" | "system";
};

export type PlatformMemorySnapshot = {
  id: string;
  title: string;
  detail: string;
  category: "Recovery" | "Treasury" | "Support" | "Workflow";
  timestamp: string;
  searchableText: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowRunState =
  | "queued"
  | "running"
  | "awaiting approval"
  | "completed"
  | "failed"
  | "paused";

export type WorkflowRunRecord = {
  id: string;
  name: string;
  cadence: string;
  status: WorkflowRunState;
  lastRun: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  assignedAgents: string[];
  stageCount: number;
  estimatedCostUsd: number;
};

export type OrchestrationTaskRecord = {
  id: string;
  task: string;
  owner: string;
  state: "Executing" | "Monitoring" | "Resolved" | "Queued" | "Awaiting review";
  eta: string;
};

export type PersistedWorkflowRecord = SavedWorkflow;

export type PlatformAgentRecord = AgentProfile & {
  id?: string;
  createdAt: string;
  updatedAt: string;
  online: boolean;
};

export type PlatformState = {
  notifications: PlatformNotification[];
  activityLogs: PlatformActivityLog[];
  memorySnapshots: PlatformMemorySnapshot[];
  sessions: OperatorSessionRecord[];
  settings: OperatorSettings;
  savedWorkflows: PersistedWorkflowRecord[];
  workflowRuns: WorkflowRunRecord[];
  orchestrationTasks: OrchestrationTaskRecord[];
  agents: PlatformAgentRecord[];
};

export type PlatformSnapshot = PlatformState & {
  operator: OperatorIdentity;
  workspaces: WorkspaceRecord[];
  providerStatus: Array<{
    name: string;
    detail: string;
    status: string;
  }>;
  apiKeys: Array<{
    name: string;
    value: string;
    scope: string;
    lastRotated: string;
  }>;
  accessScopes: string[];
};

export type WorkflowPersistenceInput = {
  prompt: string;
  workflow: WorkflowGenerationResult;
};
