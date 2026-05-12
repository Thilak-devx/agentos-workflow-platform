import {
  ContributorAssignment,
  TimelinePhase,
  TreasuryEstimate,
  WorkflowGenerationResult,
  WorkflowStage,
  WorkflowTask,
} from "@/lib/workflow-generation";

type WorkflowIntent =
  | "nft-campaign"
  | "treasury-risk"
  | "governance-vote"
  | "community-incentive"
  | "security-audit"
  | "general-ops";

type StageBlueprint = {
  name: string;
  goal: string;
  taskLabels: string[];
};

type IntentConfig = {
  intent: WorkflowIntent;
  title: string;
  summaryLead: string;
  objectiveLead: string;
  agents: string[];
  stageBlueprints: StageBlueprint[];
  treasuryCategories: string[];
  recommendations: string[];
  confidenceFloor: number;
};

const intentConfigs: IntentConfig[] = [
  {
    intent: "nft-campaign",
    title: "NFT launch orchestration",
    summaryLead: "Coordinate launch readiness, creative activation, treasury controls, and recovery coverage for a timed NFT release.",
    objectiveLead: "Launch an NFT campaign with coordinated distribution, treasury gating, and live execution monitoring.",
    agents: ["Research Agent", "Marketing Agent", "Treasury Guard", "Ops Sentinel", "Support Relay"],
    stageBlueprints: [
      {
        name: "Campaign framing",
        goal: "Lock narrative, supply assumptions, and go-to-market criteria.",
        taskLabels: ["Audience segmentation", "Drop thesis validation", "Launch KPI framing"],
      },
      {
        name: "Treasury and approvals",
        goal: "Validate funding, approval depth, and payout routing for launch spend.",
        taskLabels: ["Budget envelope review", "Creator payout routing", "Treasury release checkpoint"],
      },
      {
        name: "Execution rollout",
        goal: "Activate launch systems, monitor participation, and recover from pressure spikes.",
        taskLabels: ["Mint page release", "Realtime sentiment watch", "Support escalation lane"],
      },
    ],
    treasuryCategories: ["Creative production", "Growth deployment", "Treasury reserve"],
    recommendations: [
      "Hold one operator checkpoint before irreversible treasury release.",
      "Pin a fallback mint lane before public traffic expands.",
      "Route creator payouts through the guarded settlement path.",
    ],
    confidenceFloor: 0.9,
  },
  {
    intent: "treasury-risk",
    title: "Treasury risk review",
    summaryLead: "Evaluate treasury pressure, routing policy, settlement drift, and protective controls across active vault lanes.",
    objectiveLead: "Analyze treasury risk and produce an executable mitigation workflow.",
    agents: ["Treasury Guard", "Risk Monitor", "Ops Sentinel", "Security Agent"],
    stageBlueprints: [
      {
        name: "Exposure mapping",
        goal: "Surface concentration, payout velocity, and policy-sensitive vault behavior.",
        taskLabels: ["Vault exposure scan", "Settlement path classification", "Risk lane prioritization"],
      },
      {
        name: "Policy hardening",
        goal: "Tighten approvals, rate limits, and fallback paths for sensitive treasury lanes.",
        taskLabels: ["Approval depth adjustment", "Anomaly routing rules", "Fallback settlement preparation"],
      },
      {
        name: "Continuous watch",
        goal: "Deploy live monitoring and archive new confidence baselines.",
        taskLabels: ["Latency drift watch", "Runtime treasury alerting", "Confidence checkpoint archive"],
      },
    ],
    treasuryCategories: ["Guardrail enforcement", "Settlement assurance", "Monitoring reserve"],
    recommendations: [
      "Escalate outbound approvals if vault concentration rises above the modeled threshold.",
      "Archive the current confidence baseline before rebalancing active rails.",
      "Keep fallback settlement routing warm for operator review windows.",
    ],
    confidenceFloor: 0.93,
  },
  {
    intent: "governance-vote",
    title: "Governance vote execution",
    summaryLead: "Coordinate proposal framing, stakeholder preparation, treasury impact review, and vote-day operations.",
    objectiveLead: "Coordinate a governance vote with execution sequencing, approvals, and treasury awareness.",
    agents: ["Research Agent", "Community Agent", "Treasury Guard", "Support Relay"],
    stageBlueprints: [
      {
        name: "Proposal preparation",
        goal: "Frame the proposal, supporting evidence, and success conditions.",
        taskLabels: ["Proposal synthesis", "Treasury impact memo", "Stakeholder question mapping"],
      },
      {
        name: "Coordination window",
        goal: "Prepare contributors, communication cadence, and approval conditions.",
        taskLabels: ["Voting timeline setup", "Operator approval routing", "Community briefing orchestration"],
      },
      {
        name: "Vote execution",
        goal: "Monitor turnout, capture escalations, and archive decisions for follow-through.",
        taskLabels: ["Turnout telemetry watch", "Escalation recovery lane", "Decision archive commit"],
      },
    ],
    treasuryCategories: ["Governance operations", "Community coordination", "Contingency reserve"],
    recommendations: [
      "Prepare a treasury impact summary before the first review checkpoint.",
      "Keep escalation handling active during the final voting window.",
      "Archive contributor objections into the workflow memory layer for post-vote follow-through.",
    ],
    confidenceFloor: 0.91,
  },
  {
    intent: "community-incentive",
    title: "Community incentive deployment",
    summaryLead: "Coordinate incentive design, treasury readiness, fraud checks, and staged rollout for contributor participation.",
    objectiveLead: "Deploy a community incentive program with treasury controls and execution monitoring.",
    agents: ["Community Agent", "Research Agent", "Treasury Guard", "Support Relay", "Ops Sentinel"],
    stageBlueprints: [
      {
        name: "Program design",
        goal: "Shape incentive structure, audience targeting, and success telemetry.",
        taskLabels: ["Incentive cohort design", "Abuse-risk validation", "Success metric calibration"],
      },
      {
        name: "Treasury release planning",
        goal: "Validate release tranches, approval policy, and payout routing depth.",
        taskLabels: ["Payout tranche review", "Treasury control routing", "Approval checkpoint planning"],
      },
      {
        name: "Operational rollout",
        goal: "Launch the program, monitor participation, and recover from routing anomalies.",
        taskLabels: ["Launch dispatch", "Participation health watch", "Recovery escalation path"],
      },
    ],
    treasuryCategories: ["Contributor payouts", "Abuse prevention", "Operator reserve"],
    recommendations: [
      "Keep a small reserve lane isolated from the primary payout path.",
      "Stage operator approval for the first tranche before widening routing.",
      "Pin anomaly response messaging for contributor-facing recovery events.",
    ],
    confidenceFloor: 0.89,
  },
  {
    intent: "security-audit",
    title: "Security coordination workflow",
    summaryLead: "Coordinate audit intake, treasury sensitivity review, engineering validation, and release gating.",
    objectiveLead: "Coordinate a security-critical workflow with approvals, validation, and recovery logic.",
    agents: ["Security Agent", "Developer Agent", "Ops Sentinel", "Treasury Guard", "Support Relay"],
    stageBlueprints: [
      {
        name: "Scope analysis",
        goal: "Define attack surface, treasury exposure, and validation scope.",
        taskLabels: ["Threat surface review", "Treasury sensitivity audit", "Validation scope lock"],
      },
      {
        name: "Mitigation sequencing",
        goal: "Assign fixes, route approvals, and prepare rollback coverage.",
        taskLabels: ["Mitigation ownership routing", "Rollback plan rehearsal", "Release approval checkpoint"],
      },
      {
        name: "Controlled release",
        goal: "Monitor deployment, capture escalations, and archive recovery knowledge.",
        taskLabels: ["Protected deployment watch", "Escalation relay", "Recovery memory archive"],
      },
    ],
    treasuryCategories: ["Security remediation", "Release assurance", "Incident reserve"],
    recommendations: [
      "Keep treasury-sensitive changes behind a dual-approval lane.",
      "Warm rollback dependencies before the release checkpoint opens.",
      "Archive recovered mitigations into the operational memory graph immediately after release.",
    ],
    confidenceFloor: 0.94,
  },
  {
    intent: "general-ops",
    title: "Autonomous operations workflow",
    summaryLead: "Translate the objective into a coordinated operational plan spanning research, execution, treasury, and recovery.",
    objectiveLead: "Coordinate an autonomous operational workflow with execution readiness and live recovery coverage.",
    agents: ["Research Agent", "Ops Sentinel", "Treasury Guard", "Support Relay"],
    stageBlueprints: [
      {
        name: "Objective interpretation",
        goal: "Interpret the request, dependencies, and success states.",
        taskLabels: ["Constraint parsing", "Success state mapping", "Execution requirement capture"],
      },
      {
        name: "Operational sequencing",
        goal: "Assign owners, shape approvals, and align execution dependencies.",
        taskLabels: ["Agent lane assignment", "Approval path setup", "Dependency graph preparation"],
      },
      {
        name: "Execution watch",
        goal: "Run the plan, monitor pressure, and preserve recovery knowledge.",
        taskLabels: ["Execution dispatch", "Health telemetry watch", "Checkpoint archive"],
      },
    ],
    treasuryCategories: ["Operational execution", "Approval routing", "Recovery reserve"],
    recommendations: [
      "Open one operator checkpoint before the highest-risk transition.",
      "Keep a fallback recovery lane available for the first execution cycle.",
      "Archive any approval escalations into the memory layer after completion.",
    ],
    confidenceFloor: 0.88,
  },
];

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function createSeededRandom(seed: string) {
  let value = hashString(seed) || 1;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function sentenceCase(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

function detectIntent(prompt: string): IntentConfig {
  const lowered = prompt.toLowerCase();

  if (lowered.includes("nft") || lowered.includes("campaign")) {
    return intentConfigs[0];
  }
  if (lowered.includes("treasury") || lowered.includes("risk")) {
    return intentConfigs[1];
  }
  if (lowered.includes("governance") || lowered.includes("vote")) {
    return intentConfigs[2];
  }
  if (
    lowered.includes("community") ||
    lowered.includes("incentive") ||
    lowered.includes("contributor")
  ) {
    return intentConfigs[3];
  }
  if (lowered.includes("audit") || lowered.includes("security")) {
    return intentConfigs[4];
  }
  return intentConfigs[5];
}

function pickDuration(hours: number) {
  if (hours >= 16) return "2-3 days";
  if (hours >= 10) return "1-2 days";
  return "4-8 hours";
}

function makeTask(
  label: string,
  stageGoal: string,
  assignedAgent: string,
  random: () => number,
): WorkflowTask {
  const estimatedHours = 3 + Math.round(random() * 9);
  const estimatedCostUsd = 450 + Math.round(random() * 2250);
  const contributors = [assignedAgent];

  if (!contributors.includes("Ops Sentinel") && random() > 0.55) {
    contributors.push("Ops Sentinel");
  }
  if (!contributors.includes("Treasury Guard") && random() > 0.68) {
    contributors.push("Treasury Guard");
  }

  return {
    title: label,
    description: `${label} advances ${stageGoal.toLowerCase()} while preserving approvals, telemetry, and recovery coverage.`,
    assignedAgent,
    contributors,
    estimatedHours,
    estimatedCostUsd,
  };
}

export function generateLocalWorkflow(prompt: string): WorkflowGenerationResult {
  const intent = detectIntent(prompt);
  const random = createSeededRandom(prompt);
  const promptLead = sentenceCase(prompt.trim());
  const stageBlueprints =
    random() > 0.62 && intent.stageBlueprints.length > 2
      ? [...intent.stageBlueprints, intent.stageBlueprints[intent.stageBlueprints.length - 1]]
      : intent.stageBlueprints;

  const stages: WorkflowStage[] = stageBlueprints.map((blueprint, stageIndex) => {
    const tasks = blueprint.taskLabels.map((taskLabel, taskIndex) =>
      makeTask(
        taskLabel,
        blueprint.goal,
        intent.agents[(stageIndex + taskIndex) % intent.agents.length],
        random,
      ),
    );

    const totalHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);

    return {
      name: blueprint.name,
      goal: blueprint.goal,
      duration: pickDuration(totalHours),
      tasks,
    };
  });

  const contributorAssignments: ContributorAssignment[] = intent.agents
    .slice(0, 4)
    .map((agent, index) => ({
      role:
        index === 0
          ? "Lead coordination"
          : index === 1
            ? "Execution assurance"
            : index === 2
              ? "Treasury and approvals"
              : "Escalation coverage",
      owner: agent,
      focus:
        index === 0
          ? "Interpret scope and validate execution assumptions."
          : index === 1
            ? "Sequence live execution and protect recovery continuity."
            : index === 2
              ? "Hold budget validation and payout routing confidence."
              : "Capture escalations and operator-facing exceptions.",
    }));

  const timeline: TimelinePhase[] = stages.map((stage, index) => ({
    phase: stage.name,
    duration: stage.duration,
    deliverables: [
      `${stage.name} checkpoint`,
      `${intent.intent === "treasury-risk" ? "Risk" : "Execution"} confidence review`,
      index === stages.length - 1 ? "Archive and handoff" : "Next-stage readiness",
    ],
  }));

  const treasuryEstimates: TreasuryEstimate[] = intent.treasuryCategories.map(
    (category, index) => ({
      category,
      amountUsd:
        1200 +
        Math.round(random() * 4200) +
        stages[index % stages.length].tasks.length * 650,
      rationale:
        index === 0
          ? "Covers the primary execution lane and operator-visible rollout work."
          : index === 1
            ? "Preserves guarded approvals, fallback routing, and live monitoring."
            : "Holds contingency for escalations, retries, and recovery orchestration.",
    }),
  );

  const totalEstimatedCostUsd = treasuryEstimates.reduce(
    (sum, estimate) => sum + estimate.amountUsd,
    0,
  );
  const totalHours = stages.reduce(
    (sum, stage) =>
      sum + stage.tasks.reduce((taskSum, task) => taskSum + task.estimatedHours, 0),
    0,
  );
  const confidence =
    intent.confidenceFloor + Math.min(0.06, (stages.length * 0.01) + (random() * 0.02));
  const estimatedTimeline =
    totalHours >= 72 ? "4-6 days" : totalHours >= 36 ? "2-4 days" : "1-2 days";

  return {
    title: intent.title,
    objective: `${intent.objectiveLead} Prompt focus: ${promptLead}.`,
    summary: `${intent.summaryLead} This plan is tuned for ${prompt.toLowerCase()} and stages the work through approvals, recovery coverage, and agent coordination.`,
    reasoning: `AgentOS interpreted "${prompt}" as a ${intent.intent.replace(/-/g, " ")} objective, weighted treasury sensitivity, assigned the highest-confidence specialist lanes, and built a dependency graph that can pause, reroute, or recover without operator context loss. Expected confidence opens at ${confidence.toFixed(2)} with execution pressure concentrated in ${stages[1]?.name.toLowerCase() ?? "the active mid-graph phase"}.`,
    suggestedAgents: intent.agents,
    operationalRecommendations: [
      ...intent.recommendations,
      `Keep ${intent.agents[0]} and ${intent.agents[intent.agents.length - 1]} linked during the first execution window.`,
    ],
    stages,
    contributorAssignments,
    timeline,
    treasuryEstimates,
    totalEstimatedCostUsd,
    estimatedTimeline,
  };
}

export function buildLocalWorkflowNarrative(
  prompt: string,
  workflow: WorkflowGenerationResult,
) {
  const intent = detectIntent(prompt);
  const stageNames = workflow.stages.map((stage) => stage.name);
  const leadAgents = workflow.suggestedAgents.slice(0, 4);

  const lines = [
    `Objective interpreted: ${workflow.objective}`,
    `${leadAgents[0] ?? "Research Agent"} opened the ${stageNames[0].toLowerCase()} lane and verified execution assumptions.`,
    `${leadAgents[1] ?? "Ops Sentinel"} staged ${workflow.stages.length} dependency chains for the first orchestration cycle.`,
    `${leadAgents[2] ?? "Treasury Guard"} set ${workflow.totalEstimatedCostUsd >= 10000 ? "operator approval" : "guarded auto-clearance"} for treasury-sensitive transitions.`,
    `${leadAgents[3] ?? "Support Relay"} prepared escalation coverage for ${intent.intent.replace(/-/g, " ")} recovery branches.`,
    `Projected duration settled at ${workflow.estimatedTimeline} with ${workflow.suggestedAgents.length} active agent lanes.`,
  ];

  return {
    statusMessages: [
      "Parsing objective locally",
      "Planning orchestration graph",
      "Simulating execution lanes",
      "Workflow ready",
    ],
    lines,
  };
}
