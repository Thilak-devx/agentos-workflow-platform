import {
  OrchestrationTaskRecord,
  PlatformActivityLog,
  WorkflowRunRecord,
} from "@/features/platform/types";
import { Tone } from "@/lib/mock-data";
import { WorkflowGenerationResult } from "@/lib/workflow-generation";

export type WorkflowExecutionStatus =
  | "planning"
  | "queued"
  | "running"
  | "awaiting approval"
  | "completed"
  | "rerouting"
  | "failed"
  | "paused";

export type WorkflowPriority = "Routine" | "Elevated" | "Critical";

export type ParsingStageState = "pending" | "active" | "completed";

export type WorkflowParsingStage = {
  id: string;
  label: string;
  detail: string;
  state: ParsingStageState;
};

export type WorkflowActivityEvent = PlatformActivityLog & {
  severity: "info" | "watch" | "critical";
};

export type WorkflowTerminalEntry = {
  id: string;
  workflowId: string;
  timestamp: string;
  message: string;
  tone: Tone;
  agent: string;
  status: "synced" | "verified" | "routed" | "approved" | "retrying";
};

export type WorkflowOrchestrationNode = {
  id: string;
  name: string;
  role: string;
  phase: string;
  status: "standby" | "active" | "waiting" | "rerouting" | "completed";
  queueCount: number;
  linkedSystems: number;
  memoryState: "stable" | "syncing" | "checkpointed";
  confidence: number;
  progress: number;
  lastActive: string;
};

export type WorkflowRuntimeTask = OrchestrationTaskRecord & {
  workflowId: string;
  stageName: string;
  dependencyDepth: number;
};

export type WorkflowRuntimeRecord = WorkflowRunRecord & {
  runtimeStatus: WorkflowExecutionStatus;
  workflow: WorkflowGenerationResult;
  confidenceScore: number;
  estimatedDuration: string;
  approvalRequirement: string;
  priority: WorkflowPriority;
  progress: number;
  queueCount: number;
  memoryState: "stable" | "syncing" | "checkpointed";
  linkedSystems: number;
  workflowPhase: string;
  lastActive: string;
  telemetry: {
    risk: number;
    pressure: number;
    health: number;
  };
  nodes: WorkflowOrchestrationNode[];
  tasks: WorkflowRuntimeTask[];
  activity: WorkflowActivityEvent[];
  terminal: WorkflowTerminalEntry[];
};

