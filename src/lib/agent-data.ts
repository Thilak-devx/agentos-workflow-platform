import { Tone } from "@/lib/mock-data";

export type AgentProfile = {
  slug: string;
  name: string;
  type:
    | "Research Agent"
    | "Developer Agent"
    | "Treasury Agent"
    | "Marketing Agent"
    | "Security Agent"
    | "Community Agent";
  role: string;
  status: "Active" | "Learning" | "Monitoring" | "Coordinating";
  currentTask: string;
  successRate: string;
  confidence: string;
  walletPermissions: string;
  memoryState: string;
  treasuryAccessLevel: string;
  linkedWorkflows: string[];
  telemetry: {
    executions24h: string;
    avgLatency: string;
    collaborationLoad: string;
  };
  tone: Tone;
  summary: string;
  executionHistory: Array<{
    id: string;
    title: string;
    result: string;
    time: string;
    tone: Tone;
  }>;
  reasoningLogs: Array<{
    id: string;
    summary: string;
    confidence: string;
  }>;
  memorySnapshots: Array<{
    id: string;
    title: string;
    detail: string;
  }>;
  communicationFeed: Array<{
    id: string;
    title: string;
    detail: string;
    time: string;
    tone: Tone;
  }>;
};

export const agentProfiles: AgentProfile[] = [
  {
    slug: "research-agent",
    name: "Research Agent",
    type: "Research Agent",
    role: "Discovers signal, synthesizes context, and produces strategy briefs.",
    status: "Active",
    currentTask: "Mapping creator demand signals for the NFT launch narrative.",
    successRate: "96.4%",
    confidence: "0.94",
    walletPermissions: "Read-only treasury visibility",
    memoryState: "Long-horizon market memory loaded",
    treasuryAccessLevel: "Observational",
    linkedWorkflows: ["Research Swarm", "Launch Pipeline", "Growth Campaign"],
    telemetry: {
      executions24h: "1284 tasks",
      avgLatency: "210ms",
      collaborationLoad: "12 live threads",
    },
    tone: "cyan",
    summary:
      "The Research Agent acts as the strategic sensing layer, turning noisy external signals into actionable operating intelligence.",
    executionHistory: [
      {
        id: "research-execution-market-brief",
        title: "Market brief compiled",
        result: "Identified three high-conviction audience segments.",
        time: "07m ago",
        tone: "cyan",
      },
      {
        id: "research-execution-campaign-signal-sweep",
        title: "Campaign signal sweep",
        result:
          "Correlated creator behavior with treasury allocation pressure.",
        time: "19m ago",
        tone: "emerald",
      },
    ],
    reasoningLogs: [
      {
        id: "research-reasoning-creator-demand",
        summary:
          "Confidence increased after matching creator demand with low-friction wallet conversion cohorts.",
        confidence: "0.94",
      },
      {
        id: "research-reasoning-campaign-angle",
        summary:
          "The strongest campaign angle is scarcity plus contributor storytelling, not generic reward positioning.",
        confidence: "0.91",
      },
    ],
    memorySnapshots: [
      {
        id: "research-memory-creator-segment",
        title: "High-conviction creator segment",
        detail:
          "Saved after creator overlap rose across launch and community datasets.",
      },
      {
        id: "research-memory-launch-channel-map",
        title: "Launch channel signal map",
        detail:
          "Retained from prior campaign rehearsal with improved conversion routing.",
      },
    ],
    communicationFeed: [
      {
        id: "research-comm-demand-map",
        title: "Shared demand map with Marketing Agent",
        detail:
          "Pushed ranked audience priorities into the growth execution graph.",
        time: "02m",
        tone: "cyan",
      },
      {
        id: "research-comm-budget-elasticity",
        title: "Requested treasury budget elasticity",
        detail:
          "Asked Treasury Agent for upper and lower spend envelopes by segment.",
        time: "11m",
        tone: "violet",
      },
    ],
  },
  {
    slug: "developer-agent",
    name: "Developer Agent",
    type: "Developer Agent",
    role: "Implements product changes, validates code paths, and prepares releases.",
    status: "Coordinating",
    currentTask:
      "Preparing a guarded deploy sequence for the contributor workflow engine.",
    successRate: "93.8%",
    confidence: "0.9",
    walletPermissions: "No direct transfer permissions",
    memoryState: "Release patterns and rollback playbooks active",
    treasuryAccessLevel: "None",
    linkedWorkflows: [
      "Launch Pipeline",
      "Protocol Upgrade",
      "DAO Contributor Workflow",
    ],
    telemetry: {
      executions24h: "312 builds",
      avgLatency: "380ms",
      collaborationLoad: "8 release paths",
    },
    tone: "violet",
    summary:
      "The Developer Agent is the execution layer for product and protocol changes, optimized for guarded velocity and rollback-aware deployment.",
    executionHistory: [
      {
        id: "developer-execution-release-candidate",
        title: "Release candidate stabilized",
        result: "Resolved queue contention before rollout approval.",
        time: "05m ago",
        tone: "emerald",
      },
      {
        id: "developer-execution-schema-diff",
        title: "Schema diff reviewed",
        result: "Flagged migration risk for contributor access controls.",
        time: "28m ago",
        tone: "violet",
      },
    ],
    reasoningLogs: [
      {
        id: "developer-reasoning-release-path",
        summary:
          "Current release path is safe if deployment remains inside the lower-latency pool.",
        confidence: "0.90",
      },
      {
        id: "developer-reasoning-phased-rollout",
        summary:
          "The contributor workflow engine needs a phased rollout because agent permissions changed.",
        confidence: "0.88",
      },
    ],
    memorySnapshots: [
      {
        id: "developer-memory-rollback-safe-queue",
        title: "Rollback-safe queue configuration",
        detail:
          "Captured after successful deploy reroute without customer interruption.",
      },
      {
        id: "developer-memory-contributor-permission-diff",
        title: "Contributor permission diff",
        detail:
          "Stored for future release validation across shared workflow state.",
      },
    ],
    communicationFeed: [
      {
        id: "developer-comm-rollout-envelope",
        title: "Synced rollout envelope with Security Agent",
        detail:
          "Shared deploy preview to validate access and runtime guardrails.",
        time: "03m",
        tone: "emerald",
      },
      {
        id: "developer-comm-launch-timing",
        title: "Requested launch timing from Community Agent",
        detail: "Aligned deploy window with contributor communication cadence.",
        time: "14m",
        tone: "cyan",
      },
    ],
  },
  {
    slug: "treasury-agent",
    name: "Treasury Agent",
    type: "Treasury Agent",
    role: "Routes capital, enforces policy, and monitors financial execution risk.",
    status: "Monitoring",
    currentTask:
      "Simulating contributor payout lanes for the DAO operations sprint.",
    successRate: "97.2%",
    confidence: "0.97",
    walletPermissions: "Protected transfer authority",
    memoryState: "Treasury safety rails and payout history active",
    treasuryAccessLevel: "Guarded execution",
    linkedWorkflows: [
      "Treasury Guardrail",
      "Audit Payment Batch",
      "Growth Spend Allocation",
    ],
    telemetry: {
      executions24h: "74 settlement actions",
      avgLatency: "190ms",
      collaborationLoad: "4 guarded vaults",
    },
    tone: "emerald",
    summary:
      "The Treasury Agent is the financial operating layer for autonomous execution, balancing speed with policy-aware control.",
    executionHistory: [
      {
        id: "treasury-execution-payout-simulation",
        title: "Payout simulation validated",
        result:
          "Approved three contributor disbursement lanes without policy drift.",
        time: "08m ago",
        tone: "emerald",
      },
      {
        id: "treasury-execution-anomaly-watch",
        title: "Anomaly watch resolved",
        result:
          "Closed a false-positive routing alert after wallet verification.",
        time: "34m ago",
        tone: "cyan",
      },
    ],
    reasoningLogs: [
      {
        id: "treasury-reasoning-spend-safe",
        summary:
          "Spend is safe to expand if contributor payouts stay under the forecasted launch envelope.",
        confidence: "0.97",
      },
      {
        id: "treasury-reasoning-guarded-routing",
        summary:
          "The current routing path should remain guarded because one destination wallet is newly scoped.",
        confidence: "0.95",
      },
    ],
    memorySnapshots: [
      {
        id: "treasury-memory-safe-path-payout",
        title: "Safe-path payout lane",
        detail:
          "Persisted after three consecutive routing approvals without manual escalation.",
      },
      {
        id: "treasury-memory-vault-rebalance-envelope",
        title: "Vault rebalance envelope",
        detail:
          "Stored from the last reserve rebalance for future spend allocation planning.",
      },
    ],
    communicationFeed: [
      {
        id: "treasury-comm-budget-envelope",
        title: "Budget envelope shared with Marketing Agent",
        detail: "Aligned spend bounds with growth campaign acceleration paths.",
        time: "04m",
        tone: "emerald",
      },
      {
        id: "treasury-comm-audit-release-timing",
        title: "Requested audit release timing",
        detail:
          "Asked Security Agent to confirm delivery window before payout unlock.",
        time: "17m",
        tone: "violet",
      },
    ],
  },
  {
    slug: "marketing-agent",
    name: "Marketing Agent",
    type: "Marketing Agent",
    role: "Designs campaigns, routes messaging, and coordinates growth execution.",
    status: "Active",
    currentTask:
      "Constructing channel sequencing for the next growth campaign.",
    successRate: "91.6%",
    confidence: "0.89",
    walletPermissions: "Budget-request visibility only",
    memoryState: "Channel performance memory hot",
    treasuryAccessLevel: "Requested spend only",
    linkedWorkflows: [
      "Growth Campaign",
      "NFT Launch",
      "Community Activation Sprint",
    ],
    telemetry: {
      executions24h: "492 actions",
      avgLatency: "260ms",
      collaborationLoad: "9 launch surfaces",
    },
    tone: "violet",
    summary:
      "The Marketing Agent translates insights into channel operations, coordinating demand generation without losing control of pacing or budget.",
    executionHistory: [
      {
        id: "marketing-execution-narrative-sequence",
        title: "Narrative sequence refined",
        result:
          "Improved launch message ordering across creator and community lanes.",
        time: "12m ago",
        tone: "violet",
      },
      {
        id: "marketing-execution-spend-envelope",
        title: "Spend envelope tuned",
        result: "Reduced campaign waste by narrowing audience overlap.",
        time: "31m ago",
        tone: "emerald",
      },
    ],
    reasoningLogs: [
      {
        id: "marketing-reasoning-proof-of-progress",
        summary:
          "The campaign should open with proof-of-progress rather than hype because operator trust is the main conversion driver.",
        confidence: "0.89",
      },
      {
        id: "marketing-reasoning-community-first",
        summary:
          "Channel sequencing benefits from community-first activation before paid expansion.",
        confidence: "0.86",
      },
    ],
    memorySnapshots: [
      {
        id: "marketing-memory-community-funnel",
        title: "High-efficiency community funnel",
        detail:
          "Saved after creator conversion outperformed paid top-of-funnel traffic.",
      },
      {
        id: "marketing-memory-narrative-resonance",
        title: "Narrative resonance map",
        detail: "Persisted from the previous multi-agent launch campaign.",
      },
    ],
    communicationFeed: [
      {
        id: "marketing-comm-priority-segments",
        title: "Received priority segments from Research Agent",
        detail:
          "Updated channel plan around highest-likelihood conversion clusters.",
        time: "06m",
        tone: "cyan",
      },
      {
        id: "marketing-comm-spend-request",
        title: "Shared spend request with Treasury Agent",
        detail: "Submitted staged budget proposal for community amplification.",
        time: "16m",
        tone: "emerald",
      },
    ],
  },
  {
    slug: "security-agent",
    name: "Security Agent",
    type: "Security Agent",
    role: "Validates access, reviews operational risk, and protects execution boundaries.",
    status: "Coordinating",
    currentTask:
      "Reviewing smart contract audit coordination paths before release approval.",
    successRate: "98.8%",
    confidence: "0.98",
    walletPermissions: "Policy review only",
    memoryState: "Incident signatures and access patterns loaded",
    treasuryAccessLevel: "Approval review",
    linkedWorkflows: [
      "Smart Contract Audit",
      "Protocol Upgrade",
      "Treasury Guardrail",
    ],
    telemetry: {
      executions24h: "86 validation runs",
      avgLatency: "170ms",
      collaborationLoad: "6 active guardrails",
    },
    tone: "emerald",
    summary:
      "The Security Agent keeps autonomous execution inside acceptable risk boundaries by validating policy, access, and deployment posture.",
    executionHistory: [
      {
        id: "security-execution-contract-review",
        title: "Contract review lane synchronized",
        result: "Confirmed audit dependencies before payout unlock.",
        time: "09m ago",
        tone: "emerald",
      },
      {
        id: "security-execution-access-anomaly",
        title: "Access anomaly suppressed",
        result:
          "Closed a low-confidence permissions alert after runtime verification.",
        time: "23m ago",
        tone: "cyan",
      },
    ],
    reasoningLogs: [
      {
        id: "security-reasoning-release-approval",
        summary:
          "Release approval should wait until treasury disbursement routes and audit findings are reconciled.",
        confidence: "0.98",
      },
      {
        id: "security-reasoning-guarded-rollout",
        summary:
          "No direct compromise risk detected, but access changes justify continued guarded rollout.",
        confidence: "0.95",
      },
    ],
    memorySnapshots: [
      {
        id: "security-memory-guarded-rollout-standard",
        title: "Guarded rollout standard",
        detail:
          "Retained from the last protocol upgrade after staged validation prevented misconfiguration.",
      },
      {
        id: "security-memory-contributor-permission-risk",
        title: "Contributor permission risk profile",
        detail: "Stored for future audit coordination and policy review logic.",
      },
    ],
    communicationFeed: [
      {
        id: "security-comm-approval-hold",
        title: "Posted approval hold to Developer Agent",
        detail:
          "Requested final verification on contributor permission scopes.",
        time: "05m",
        tone: "violet",
      },
      {
        id: "security-comm-payout-dependency",
        title: "Synced payout dependency with Treasury Agent",
        detail:
          "Aligned audit completion with release-linked treasury disbursement.",
        time: "13m",
        tone: "emerald",
      },
    ],
  },
  {
    slug: "community-agent",
    name: "Community Agent",
    type: "Community Agent",
    role: "Coordinates contributor energy, trust surfaces, and real-time member operations.",
    status: "Learning",
    currentTask:
      "Preparing the contributor activation layer for the DAO workflow launch.",
    successRate: "89.7%",
    confidence: "0.87",
    walletPermissions: "Contributor payout visibility",
    memoryState: "Contributor sentiment memory adapting",
    treasuryAccessLevel: "Observed payout state",
    linkedWorkflows: [
      "DAO Contributor Workflow",
      "Community Activation Sprint",
      "Growth Campaign",
    ],
    telemetry: {
      executions24h: "612 coordination actions",
      avgLatency: "290ms",
      collaborationLoad: "19 contributor clusters",
    },
    tone: "cyan",
    summary:
      "The Community Agent manages trust, activation, and contributor alignment so the organization feels directed rather than fragmented.",
    executionHistory: [
      {
        id: "community-execution-contributor-routing",
        title: "Contributor routing plan refreshed",
        result:
          "Matched communication cadence to payout timing and task readiness.",
        time: "10m ago",
        tone: "cyan",
      },
      {
        id: "community-execution-sentiment-signal",
        title: "Sentiment signal recalibrated",
        result:
          "Lowered escalation pressure after participation confidence recovered.",
        time: "42m ago",
        tone: "violet",
      },
    ],
    reasoningLogs: [
      {
        id: "community-reasoning-payout-visibility",
        summary:
          "Contributor morale improves when payout visibility is paired with clearer execution sequencing.",
        confidence: "0.87",
      },
      {
        id: "community-reasoning-phased-invite",
        summary:
          "A phased invite path is safer than full rollout because readiness varies by contributor cluster.",
        confidence: "0.84",
      },
    ],
    memorySnapshots: [
      {
        id: "community-memory-trust-trigger",
        title: "Contributor trust trigger",
        detail:
          "Stored after trust recovered quickly when execution status became transparent.",
      },
      {
        id: "community-memory-activation-pacing",
        title: "Activation pacing guide",
        detail:
          "Captured from the last community sprint with better retention outcomes.",
      },
    ],
    communicationFeed: [
      {
        id: "community-comm-rollout-timing",
        title: "Received rollout timing from Developer Agent",
        detail:
          "Updated contributor launch pacing around deploy window confidence.",
        time: "07m",
        tone: "emerald",
      },
      {
        id: "community-comm-payout-transparency",
        title: "Requested payout transparency snapshot",
        detail:
          "Asked Treasury Agent for contributor-safe settlement visibility.",
        time: "15m",
        tone: "cyan",
      },
    ],
  },
];

export function getAgentProfile(slug: string) {
  return agentProfiles.find((agent) => agent.slug === slug);
}
