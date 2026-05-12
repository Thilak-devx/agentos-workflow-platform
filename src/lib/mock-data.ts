export type Tone = "cyan" | "emerald" | "violet";

export const dashboardMetrics = [
  {
    label: "Active agents",
    value: "18",
    detail: "+4 deployed in the current cycle",
  },
  {
    label: "Workflow throughput",
    value: "3.4k",
    detail: "orchestrated actions in 24 hours",
  },
  {
    label: "Treasury protected",
    value: "$8.9M",
    detail: "guarded across six vaults",
  },
];

export const agents = [
  {
    name: "Signal Mapper",
    role: "Market intelligence",
    status: "Active",
    model: "GPT-5.5",
    output: "1,284 signals",
  },
  {
    name: "Support Relay",
    role: "Escalation triage",
    status: "Learning",
    model: "GPT-5.4",
    output: "412 tasks closed",
  },
  {
    name: "Ops Sentinel",
    role: "Infrastructure monitor",
    status: "Active",
    model: "GPT-5.5",
    output: "31 incidents prevented",
  },
  {
    name: "Treasury Guard",
    role: "Settlement approval",
    status: "Active",
    model: "GPT-5.5",
    output: "$740k protected",
  },
];

export const workflows = [
  {
    name: "Launch Pipeline",
    cadence: "Continuous",
    status: "Active",
    lastRun: "4m ago",
  },
  {
    name: "Treasury Guardrail",
    cadence: "Every hour",
    status: "Active",
    lastRun: "12m ago",
  },
  {
    name: "Customer Recovery",
    cadence: "Daily",
    status: "Paused",
    lastRun: "18h ago",
  },
  {
    name: "Research Swarm",
    cadence: "On demand",
    status: "Active",
    lastRun: "2m ago",
  },
];

export const treasuryVaults = [
  {
    vault: "Operating Vault",
    network: "Solana Devnet",
    balance: "$4.2M",
    health: "Healthy",
  },
  {
    vault: "Growth Reserve",
    network: "Solana Devnet",
    balance: "$2.7M",
    health: "Healthy",
  },
  {
    vault: "Liquidity Buffer",
    network: "Solana Devnet",
    balance: "$1.9M",
    health: "Monitored",
  },
  {
    vault: "Strategy Reserve",
    network: "Solana Devnet",
    balance: "$620k",
    health: "Healthy",
  },
];

export const signalChart = [26, 34, 28, 48, 42, 56, 68, 62, 80, 74, 88, 94];

export const workflowBars = [
  { label: "Sync", value: 72 },
  { label: "Review", value: 54 },
  { label: "Deploy", value: 86 },
  { label: "Guard", value: 64 },
  { label: "Route", value: 48 },
  { label: "Adapt", value: 78 },
];

export const commandActions = [
  {
    group: "Navigation",
    items: [
      { label: "Open Dashboard", shortcut: "G D", href: "/dashboard" },
      { label: "Open Agents", shortcut: "G A", href: "/agents" },
      { label: "Open Workflows", shortcut: "G W", href: "/workflows" },
      { label: "Open Treasury", shortcut: "G T", href: "/treasury" },
      { label: "Open Settings", shortcut: "G S", href: "/settings" },
    ],
  },
  {
    group: "AI Actions",
    items: [
      { label: "Review agent drift", shortcut: "R D", href: "/agents" },
      {
        label: "Inspect workflow latency",
        shortcut: "I L",
        href: "/workflows",
      },
      { label: "Scan treasury anomalies", shortcut: "S A", href: "/treasury" },
      { label: "Open system controls", shortcut: "O C", href: "/settings" },
    ],
  },
  {
    group: "Operational commands",
    items: [
      { label: "Restart workflow", shortcut: "R W", href: "/workflows" },
      { label: "Open treasury review", shortcut: "T R", href: "/treasury" },
      { label: "Inspect agent memory", shortcut: "I M", href: "/agents" },
      { label: "View settlement queue", shortcut: "V Q", href: "/treasury" },
      { label: "Open orchestration graph", shortcut: "O G", href: "/workflows" },
    ],
  },
];

export const transactionFeed = [
  {
    id: "tx-vendor-settlement-approved",
    hash: "5Qf9...D2ka",
    action: "Vendor settlement approved",
    amount: "$84,000",
    network: "Solana",
    time: "11s ago",
  },
  {
    id: "tx-liquidity-buffer-rebalanced",
    hash: "8Tu3...L9pf",
    action: "Liquidity buffer rebalanced",
    amount: "$240,000",
    network: "Solana",
    time: "43s ago",
  },
  {
    id: "tx-treasury-guard-rollback",
    hash: "2Kd8...Q7am",
    action: "Treasury guard rollback",
    amount: "$18,400",
    network: "Solana",
    time: "2m ago",
  },
  {
    id: "tx-revenue-vault-sweep",
    hash: "9Mx1...V8ne",
    action: "Revenue vault sweep",
    amount: "$126,000",
    network: "Solana",
    time: "7m ago",
  },
];

export const activityStream: Array<{
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: Tone;
}> = [
  {
    id: "activity-research-swarm-formed",
    title: "Research swarm formed around product anomaly",
    detail:
      "Signal Mapper opened a multi-agent brief and invited Ops Sentinel plus Support Relay into the same objective graph.",
    time: "14s",
    tone: "cyan",
  },
  {
    id: "activity-guardrail-compressed",
    title: "Guardrail compressed an approval path",
    detail:
      "The system bypassed human review for a low-risk internal transfer after policy confidence exceeded 0.98.",
    time: "41s",
    tone: "emerald",
  },
  {
    id: "activity-memory-snapshot-committed",
    title: "Memory snapshot committed after incident recovery",
    detail:
      "AgentOS stored a recovery summary so future workflows inherit the successful mitigation path.",
    time: "3m",
    tone: "violet",
  },
];

export const reasoningLogs = [
  {
    id: "reasoning-signal-mapper",
    agent: "Signal Mapper",
    summary:
      "Confidence rose after correlating drop-off behavior with a failed webhook chain in the launch flow.",
    confidence: "0.94",
  },
  {
    id: "reasoning-treasury-guard",
    agent: "Treasury Guard",
    summary:
      "Transaction risk remains low because the destination wallet is pre-scoped and liquidity ratios are healthy.",
    confidence: "0.97",
  },
  {
    id: "reasoning-ops-sentinel",
    agent: "Ops Sentinel",
    summary:
      "Rollback not required. The deployment graph stabilized after rerouting queue pressure to a secondary path.",
    confidence: "0.91",
  },
];

export const orchestrationTasks = [
  {
    task: "Global launch preparation",
    owner: "Research Swarm",
    state: "Executing",
    eta: "08m",
  },
  {
    task: "Treasury anomaly watch",
    owner: "Treasury Guard",
    state: "Monitoring",
    eta: "Live",
  },
  {
    task: "Support escalation recovery",
    owner: "Support Relay",
    state: "Resolved",
    eta: "Done",
  },
];

export const memorySnapshots = [
  {
    id: "memory-launch-rollback-protocol",
    title: "Launch rollback protocol",
    detail:
      "Stored after queue saturation recovery succeeded without human intervention.",
  },
  {
    id: "memory-treasury-safe-path-routing",
    title: "Treasury safe-path routing",
    detail:
      "Saved when capital transfer confidence exceeded policy thresholds across three vaults.",
  },
  {
    id: "memory-high-value-customer-save-playbook",
    title: "High-value customer save playbook",
    detail:
      "Learned from the support swarm after churn risk dropped by 42 percent in one cycle.",
  },
];

export const healthMetrics: Array<{
  label: string;
  value: string;
  tone: Tone;
}> = [
  { label: "Runtime health", value: "99.992%", tone: "emerald" },
  { label: "Agent latency", value: "240ms", tone: "cyan" },
  { label: "Approval drift", value: "Low", tone: "violet" },
  { label: "Treasury risk", value: "Guarded", tone: "emerald" },
];

export const keyboardShortcuts = [
  { key: "Cmd K", action: "Open command palette" },
  { key: "G D", action: "Go to dashboard" },
  { key: "G A", action: "Open agent fleet" },
  { key: "G W", action: "Open workflows" },
  { key: "G T", action: "Open treasury" },
];

export const systemNotifications: Array<{
  id: string;
  title: string;
  detail: string;
  tone: Tone;
  createdAt: string;
}> = [
  {
    id: "system-research-stable",
    title: "Research swarm stabilized",
    detail: "Multi-agent reasoning is holding above 0.94 confidence.",
    tone: "cyan",
    createdAt: "2026-05-10T10:12:00.000Z",
  },
  {
    id: "system-treasury-healthy",
    title: "Treasury policy healthy",
    detail: "All guarded payout lanes remain inside their spend envelopes.",
    tone: "emerald",
    createdAt: "2026-05-10T09:54:00.000Z",
  },
  {
    id: "system-launch-warm",
    title: "Launch workflow warm",
    detail: "The active release path is ready for operator review.",
    tone: "violet",
    createdAt: "2026-05-10T09:21:00.000Z",
  },
];

export const onboardingSteps = [
  {
    title: "Open the command palette",
    detail:
      "Jump across surfaces instantly and trigger operator actions with Cmd/Ctrl + K.",
  },
  {
    title: "Run a workflow prompt",
    detail:
      "Use the workflows page to generate structured operating plans with the local orchestration engine.",
  },
  {
    title: "Connect treasury context",
    detail:
      "Attach a wallet to activate balance, signature, and treasury intelligence views.",
  },
];

export const coordinationNodes = [
  { name: "Research", status: "Connected", load: "12 streams" },
  { name: "Ops", status: "Connected", load: "7 safeguards" },
  { name: "Treasury", status: "Guarded", load: "4 vaults" },
  { name: "Support", status: "Adaptive", load: "19 cases" },
];

export const settingsCards = [
  {
    title: "Workspace security",
    description:
      "Session policy, scoped agent permissions, and approval routing are configured for guarded execution.",
  },
  {
    title: "Access and credentials",
    description:
      "Supabase, Prisma, and Solana configuration are prepared through environment variables and provider wrappers.",
  },
  {
    title: "Notification surfaces",
    description:
      "Execution alerts and treasury thresholds can be routed into focused operational channels.",
  },
];
