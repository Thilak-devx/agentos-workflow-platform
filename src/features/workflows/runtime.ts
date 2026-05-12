import {
  OrchestrationTaskRecord,
  PlatformActivityLog,
  WorkflowRunRecord,
} from "@/features/platform/types";
import { Tone } from "@/lib/mock-data";
import { WorkflowGenerationResult } from "@/lib/workflow-generation";
import {
  WorkflowActivityEvent,
  WorkflowExecutionStatus,
  WorkflowOrchestrationNode,
  WorkflowParsingStage,
  WorkflowPriority,
  WorkflowRuntimeRecord,
  WorkflowRuntimeTask,
  WorkflowTerminalEntry,
} from "@/features/workflows/types";
import { createRuntimeEntityId } from "@/lib/react-keys";

const parsingStageBlueprint = [
  {
    label: "Parsing objective...",
    detail: "Interpreting scope, outcome, and operational constraints.",
  },
  {
    label: "Identifying execution requirements...",
    detail: "Resolving dependencies, approval paths, and critical systems.",
  },
  {
    label: "Allocating specialized agents...",
    detail: "Matching agent lanes to planning, finance, and execution work.",
  },
  {
    label: "Estimating operational risk...",
    detail: "Scoring treasury sensitivity and fallback pressure.",
  },
  {
    label: "Building orchestration graph...",
    detail: "Preparing execution sequencing and recovery branches.",
  },
] as const;

const cadenceByStatus: Record<WorkflowExecutionStatus, string> = {
  planning: "Planning",
  queued: "Queued",
  running: "Active",
  "awaiting approval": "Awaiting review",
  completed: "Completed",
  rerouting: "Recovery lane",
  failed: "Intervention",
  paused: "Paused",
};

const terminalStatuses = [
  "synced",
  "verified",
  "routed",
  "approved",
] as const;

const activityTemplates = {
  Research: [
    "Research swarm spawned additional validation lane",
    "Signal analysis confirmed the primary execution hypothesis",
  ],
  Treasury: [
    "Treasury guard compressed payout routing",
    "Budget verification stabilized inside the policy envelope",
  ],
  Operations: [
    "Execution rerouted through fallback recovery path",
    "Ops Sentinel synchronized the active dependency chain",
  ],
  Support: [
    "Support Relay narrowed escalation depth before operator review",
    "Escalation lane cleared after confidence recovered",
  ],
  Security: [
    "Security review escalated approval depth",
    "Assurance lane held release pressure below intervention threshold",
  ],
};

function randomId(prefix: string) {
  return createRuntimeEntityId(prefix);
}

function nowIso() {
  return new Date().toISOString();
}

function relativeClock(offsetSeconds = 0) {
  const date = new Date(Date.now() + offsetSeconds * 1000);
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function inferPriority(prompt: string, workflow: WorkflowGenerationResult): WorkflowPriority {
  const lowered = prompt.toLowerCase();

  if (
    lowered.includes("audit") ||
    lowered.includes("security") ||
    lowered.includes("treasury") ||
    workflow.totalEstimatedCostUsd >= 20000
  ) {
    return "Critical";
  }

  if (
    lowered.includes("launch") ||
    lowered.includes("campaign") ||
    workflow.stages.length >= 4
  ) {
    return "Elevated";
  }

  return "Routine";
}

function inferActivityTone(message: string): Tone {
  const lowered = message.toLowerCase();
  if (
    lowered.includes("approval") ||
    lowered.includes("checkpoint") ||
    lowered.includes("review")
  ) {
    return "violet";
  }
  if (
    lowered.includes("treasury") ||
    lowered.includes("compressed") ||
    lowered.includes("budget")
  ) {
    return "emerald";
  }
  return "cyan";
}

function inferNodeRole(agentName: string) {
  if (agentName.toLowerCase().includes("treasury")) return "Treasury";
  if (agentName.toLowerCase().includes("support")) return "Support";
  if (agentName.toLowerCase().includes("security")) return "Security";
  if (agentName.toLowerCase().includes("ops")) return "Operations";
  return "Research";
}

function estimateConfidence(workflow: WorkflowGenerationResult) {
  const signal =
    0.85 +
    Math.min(workflow.suggestedAgents.length, 5) * 0.018 +
    Math.min(workflow.stages.length, 5) * 0.012;
  return Number(Math.min(signal, 0.98).toFixed(2));
}

export function createParsingStages(prompt: string): WorkflowParsingStage[] {
  void prompt;
  return parsingStageBlueprint.map((stage, index) => ({
    id: createRuntimeEntityId("workflow-parse"),
    label: stage.label,
    detail: stage.detail,
    state: index === 0 ? "active" : "pending",
  }));
}

export function advanceParsingStages(
  stages: WorkflowParsingStage[],
  stageIndex: number,
): WorkflowParsingStage[] {
  return stages.map((stage, index) => ({
    ...stage,
    state:
      index < stageIndex
        ? "completed"
        : index === stageIndex
          ? "active"
          : "pending",
  }));
}

export function createOrchestrationNodes(
  workflowId: string,
  workflow: WorkflowGenerationResult,
) {
  return workflow.suggestedAgents.slice(0, 4).map<WorkflowOrchestrationNode>((agent, index) => ({
    id: createRuntimeEntityId("workflow-node"),
    name: agent,
    role: inferNodeRole(agent),
    phase: workflow.stages[index]?.name ?? "Standby lane",
    status: index === 0 ? "active" : "standby",
    queueCount: 2 + index,
    linkedSystems: 3 + ((index + workflow.stages.length) % 4),
    memoryState: index % 2 === 0 ? "syncing" : "stable",
    confidence: Number((0.9 + index * 0.015).toFixed(2)),
    progress: index === 0 ? 18 : 0,
    lastActive: "Just now",
  }));
}

export function createRuntimeTasks(
  workflowId: string,
  workflow: WorkflowGenerationResult,
) {
  return workflow.stages.flatMap<WorkflowRuntimeTask>((stage, stageIndex) =>
    stage.tasks.map((task, taskIndex) => ({
      id: createRuntimeEntityId("workflow-task"),
      workflowId,
      stageName: stage.name,
      dependencyDepth: stageIndex + 1,
      task: task.title,
      owner: task.assignedAgent,
      state:
        stageIndex === 0 && taskIndex === 0
          ? "Executing"
          : stageIndex <= 1
            ? "Queued"
            : "Awaiting review",
      eta: `${Math.max(task.estimatedHours, 1)}h`,
    })),
  );
}

export function createInitialTerminalEntries(
  workflowId: string,
  workflow: WorkflowGenerationResult,
) {
  const objective = workflow.objective || workflow.summary;
  const lines = [
    `Objective interpreted: ${objective}`,
    `Allocated ${workflow.suggestedAgents.length || 3} specialized agents to execution lanes`,
    `Approval depth set to ${workflow.totalEstimatedCostUsd >= 8000 ? "operator review" : "auto-cleared"} for the first release branch`,
  ];

  return lines.map<WorkflowTerminalEntry>((message, index) => ({
    id: createRuntimeEntityId("workflow-terminal"),
    workflowId,
    timestamp: relativeClock(index * 3),
    message,
    tone: inferActivityTone(message),
    agent: workflow.suggestedAgents[index] ?? "Ops Sentinel",
    status: terminalStatuses[index % terminalStatuses.length],
  }));
}

export function createInitialActivity(
  workflowId: string,
  workflow: WorkflowGenerationResult,
  prompt: string,
) {
  const priority = inferPriority(prompt, workflow);
  return [
    {
      id: createRuntimeEntityId("workflow-activity"),
      title: "Workflow planned",
      detail: `${workflow.title} entered the execution registry with ${workflow.stages.length} staged lanes.`,
      time: "Just now",
      tone: "cyan" as const,
      createdAt: nowIso(),
      source: "workflow" as const,
      severity: priority === "Critical" ? "critical" : "info",
    },
  ] satisfies WorkflowActivityEvent[];
}

export function createWorkflowRuntimeRecord(
  prompt: string,
  workflow: WorkflowGenerationResult,
): WorkflowRuntimeRecord {
  const id = randomId("workflow-runtime");
  const nodes = createOrchestrationNodes(id, workflow);
  const tasks = createRuntimeTasks(id, workflow);
  const confidenceScore = estimateConfidence(workflow);
  const priority = inferPriority(prompt, workflow);
  const runtimeStatus: WorkflowExecutionStatus = "planning";
  const initialActivity = createInitialActivity(id, workflow, prompt);
  const initialTerminal = createInitialTerminalEntries(id, workflow);

  return {
    id,
    name: workflow.title,
    cadence: cadenceByStatus[runtimeStatus],
    status: "queued",
    runtimeStatus,
    lastRun: "Just now",
    prompt,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    assignedAgents: workflow.suggestedAgents,
    stageCount: workflow.stages.length,
    estimatedCostUsd: workflow.totalEstimatedCostUsd,
    workflow,
    confidenceScore,
    estimatedDuration: workflow.estimatedTimeline,
    approvalRequirement:
      workflow.totalEstimatedCostUsd >= 15000 ? "Dual approval" : "Single approval",
    priority,
    progress: 12,
    queueCount: tasks.length,
    memoryState: "syncing",
    linkedSystems: nodes.reduce((sum, node) => sum + node.linkedSystems, 0),
    workflowPhase: workflow.stages[0]?.name ?? "Planning",
    lastActive: "Just now",
    telemetry: {
      risk: priority === "Critical" ? 62 : 38,
      pressure: 36 + workflow.stages.length * 8,
      health: 92,
    },
    nodes,
    tasks,
    activity: initialActivity,
    terminal: initialTerminal,
  };
}

function getNextStatus(status: WorkflowExecutionStatus): WorkflowExecutionStatus {
  switch (status) {
    case "planning":
      return "queued";
    case "queued":
      return "running";
    case "running":
      return Math.random() > 0.72 ? "awaiting approval" : "running";
    case "awaiting approval":
      return Math.random() > 0.78 ? "rerouting" : "completed";
    case "rerouting":
      return "running";
    case "paused":
      return "paused";
    case "failed":
      return "failed";
    case "completed":
      return "completed";
    default:
      return status;
  }
}

function buildRuntimeMessage(
  node: WorkflowOrchestrationNode,
  nextStatus: WorkflowExecutionStatus,
) {
  const roleTemplates = activityTemplates[node.role as keyof typeof activityTemplates] ?? activityTemplates.Operations;
  const base = roleTemplates[Math.floor(Math.random() * roleTemplates.length)];

  if (nextStatus === "awaiting approval") {
    return `${base}. Approval checkpoint opened for ${node.name}.`;
  }

  if (nextStatus === "rerouting") {
    return `${base}. Execution rerouted through fallback recovery path.`;
  }

  if (nextStatus === "completed") {
    return `${base}. Workflow checkpoint committed and archived.`;
  }

  return base;
}

function nextTaskState(
  task: WorkflowRuntimeTask,
  nextStatus: WorkflowExecutionStatus,
  activeStageName: string,
) {
  if (nextStatus === "completed") return "Resolved" as const;
  if (nextStatus === "awaiting approval") return "Awaiting review" as const;
  if (nextStatus === "rerouting") return "Monitoring" as const;
  if (task.stageName === activeStageName) return "Executing" as const;
  return "Queued" as const;
}

export function advanceRuntimeRecord(
  record: WorkflowRuntimeRecord,
): WorkflowRuntimeRecord {
  if (record.runtimeStatus === "completed" || record.runtimeStatus === "failed") {
    return record;
  }

  const nextStatus = getNextStatus(record.runtimeStatus);
  const nextProgress =
    nextStatus === "completed"
      ? 100
      : Math.min(record.progress + 16 + (nextStatus === "rerouting" ? 4 : 0), 92);
  const stageIndex = Math.min(
    Math.floor((nextProgress / 100) * record.workflow.stages.length),
    Math.max(record.workflow.stages.length - 1, 0),
  );
  const activeStage = record.workflow.stages[stageIndex]?.name ?? record.workflowPhase;
  const activeNodeIndex = stageIndex % Math.max(record.nodes.length, 1);
  const activeNode = record.nodes[activeNodeIndex] ?? record.nodes[0];
  const message = buildRuntimeMessage(activeNode, nextStatus);
  const tone = inferActivityTone(message);
  const timestamp = relativeClock();

  const nextNodes = record.nodes.map((node, index) => ({
    ...node,
    phase: index <= stageIndex ? activeStage : node.phase,
    status: (
      nextStatus === "completed"
        ? "completed"
        : index === activeNodeIndex
          ? nextStatus === "rerouting"
            ? "rerouting"
            : nextStatus === "awaiting approval"
              ? "waiting"
              : "active"
          : index < activeNodeIndex
            ? "completed"
            : "standby"
    ) as WorkflowOrchestrationNode["status"],
    progress:
      nextStatus === "completed"
        ? 100
        : index < activeNodeIndex
          ? 100
          : index === activeNodeIndex
            ? Math.min(node.progress + 28, 96)
            : Math.max(node.progress, 6),
    queueCount:
      nextStatus === "completed" ? 0 : Math.max(node.queueCount - (index === activeNodeIndex ? 1 : 0), 0),
    memoryState:
      nextStatus === "completed"
        ? "checkpointed"
        : index === activeNodeIndex
          ? "syncing"
          : node.memoryState,
    confidence: Number(
      Math.min(0.99, node.confidence + (index === activeNodeIndex ? 0.01 : 0)).toFixed(2),
    ),
    lastActive: index === activeNodeIndex ? "Just now" : node.lastActive,
  }));

  const nextTasks = record.tasks.map((task) => ({
    ...task,
    state: nextTaskState(task, nextStatus, activeStage),
    eta:
      nextStatus === "completed"
        ? "Done"
        : nextStatus === "awaiting approval"
          ? "Review"
          : task.eta,
  }));

  const nextActivity: WorkflowActivityEvent = {
    id: createRuntimeEntityId("workflow-activity"),
    title:
      nextStatus === "awaiting approval"
        ? "Approval depth updated"
        : nextStatus === "rerouting"
          ? "Recovery lane activated"
          : nextStatus === "completed"
            ? "Workflow completed"
            : "Execution advanced",
    detail: message,
    time: "Just now",
    tone,
    createdAt: nowIso(),
    source: "workflow",
    severity:
      nextStatus === "rerouting"
        ? "watch"
        : nextStatus === "completed"
          ? "info"
          : record.priority === "Critical"
            ? "critical"
            : "info",
  };

  const nextTerminal: WorkflowTerminalEntry = {
    id: createRuntimeEntityId("workflow-terminal"),
    workflowId: record.id,
    timestamp,
    message,
    tone,
    agent: activeNode.name,
    status:
      nextStatus === "rerouting"
        ? "retrying"
        : terminalStatuses[(record.terminal.length + stageIndex) % terminalStatuses.length],
  };

  const workflowStatus: WorkflowRunRecord["status"] =
    nextStatus === "completed"
      ? "completed"
      : nextStatus === "paused"
        ? "paused"
        : nextStatus === "failed"
          ? "failed"
          : nextStatus === "awaiting approval"
            ? "awaiting approval"
            : nextStatus === "planning" || nextStatus === "queued"
              ? "queued"
              : "running";

  return {
    ...record,
    cadence: cadenceByStatus[nextStatus],
    status: workflowStatus,
    runtimeStatus: nextStatus,
    lastRun: nextStatus === "completed" ? "Completed now" : "Just now",
    updatedAt: nowIso(),
    workflowPhase: activeStage,
    progress: nextProgress,
    queueCount:
      nextStatus === "completed" ? 0 : Math.max(record.queueCount - 1, 1),
    memoryState: nextStatus === "completed" ? "checkpointed" : "syncing",
    telemetry: {
      risk:
        nextStatus === "rerouting"
          ? Math.min(record.telemetry.risk + 6, 88)
          : Math.max(record.telemetry.risk - 2, 28),
      pressure:
        nextStatus === "completed"
          ? 18
          : Math.max(24, record.telemetry.pressure + (nextStatus === "awaiting approval" ? 8 : -3)),
      health:
        nextStatus === "rerouting"
          ? Math.max(record.telemetry.health - 4, 82)
          : nextStatus === "completed"
            ? 99
            : Math.min(record.telemetry.health + 1, 97),
    },
    nodes: nextNodes,
    tasks: nextTasks,
    activity: [nextActivity, ...record.activity].slice(0, 10),
    terminal: [...record.terminal, nextTerminal].slice(-12),
  };
}

export function createWorkflowBarsFromRuntime(
  runtimeWorkflows: WorkflowRuntimeRecord[],
) {
  if (!runtimeWorkflows.length) {
    return [
      { label: "Parse", value: 26 },
      { label: "Queue", value: 34 },
      { label: "Run", value: 48 },
      { label: "Review", value: 30 },
      { label: "Reroute", value: 18 },
      { label: "Archive", value: 42 },
    ];
  }

  const counts = {
    Parse: runtimeWorkflows.filter((item) => item.runtimeStatus === "planning").length,
    Queue: runtimeWorkflows.filter((item) => item.runtimeStatus === "queued").length,
    Run: runtimeWorkflows.filter((item) => item.runtimeStatus === "running").length,
    Review: runtimeWorkflows.filter((item) => item.runtimeStatus === "awaiting approval").length,
    Reroute: runtimeWorkflows.filter((item) => item.runtimeStatus === "rerouting").length,
    Archive: runtimeWorkflows.filter((item) => item.runtimeStatus === "completed").length,
  };

  return Object.entries(counts).map(([label, count]) => ({
    label,
    value: Math.min(92, 18 + count * 18),
  }));
}

export function toActivityRows(events: WorkflowActivityEvent[]): PlatformActivityLog[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    detail: event.detail,
    time: event.time,
    tone: event.tone,
    createdAt: event.createdAt,
    source: event.source,
  }));
}

export function toTaskRows(tasks: WorkflowRuntimeTask[]): OrchestrationTaskRecord[] {
  return tasks;
}
