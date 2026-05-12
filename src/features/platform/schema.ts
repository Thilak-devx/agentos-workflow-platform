export const PLATFORM_TABLES = {
  notifications: "notifications",
  activityLogs: "activity_logs",
  memorySnapshots: "memory_snapshots",
  workflowRuns: "workflow_runs",
  savedWorkflows: "saved_workflows",
  operatorSettings: "operator_settings",
  agents: "agents",
} as const;

export const PLATFORM_REALTIME_TABLES = [
  PLATFORM_TABLES.notifications,
  PLATFORM_TABLES.activityLogs,
  PLATFORM_TABLES.workflowRuns,
  PLATFORM_TABLES.agents,
] as const;

export type PlatformTableName =
  (typeof PLATFORM_TABLES)[keyof typeof PLATFORM_TABLES];
