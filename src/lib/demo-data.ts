export type DemoScenario = {
  id: string;
  title: string;
  objective: string;
  durationLabel: string;
  timeline: Array<{
    label: string;
    detail: string;
  }>;
  telemetry: {
    agentConcurrency: number;
    treasuryMovementUsd: number;
    confidence: number;
    workflowPressure: number;
  };
  reasoning: string[];
  transactions: Array<{
    title: string;
    amount: string;
    status: "queued" | "routing" | "confirmed";
  }>;
  coordination: Array<{
    agent: string;
    role: string;
    status: string;
  }>;
};

export const demoScenarios: DemoScenario[] = [
  {
    id: "nft-campaign",
    title: "Launch NFT campaign",
    objective:
      "Coordinate research, launch messaging, treasury pacing, and community activation for a premium NFT release.",
    durationLabel: "06m demo sequence",
    timeline: [
      {
        label: "Signal discovery",
        detail:
          "Research and Marketing agents map audience demand and define launch thesis.",
      },
      {
        label: "Creative orchestration",
        detail:
          "Developer and Community agents align assets, timing, and contributor routing.",
      },
      {
        label: "Treasury activation",
        detail:
          "Treasury agent simulates creator payouts and launch budget release.",
      },
      {
        label: "Go-live",
        detail:
          "Multi-agent swarm executes launch, monitors sentiment, and adapts spend.",
      },
    ],
    telemetry: {
      agentConcurrency: 6,
      treasuryMovementUsd: 84000,
      confidence: 96,
      workflowPressure: 78,
    },
    reasoning: [
      "Launch sequencing prioritizes creator trust over raw awareness because wallet conversion is strongest in warm communities.",
      "Budget should release in two waves so treasury flexibility remains available if community uptake outperforms the first tranche.",
      "Support load remains low enough to keep human approval depth minimal during release.",
    ],
    transactions: [
      {
        title: "Creator incentive reserve",
        amount: "$28,000",
        status: "confirmed",
      },
      {
        title: "Launch operations budget",
        amount: "$36,000",
        status: "routing",
      },
      { title: "Community rewards lane", amount: "$20,000", status: "queued" },
    ],
    coordination: [
      { agent: "Research Agent", role: "Demand mapping", status: "Active" },
      {
        agent: "Marketing Agent",
        role: "Campaign sequencing",
        status: "Active",
      },
      {
        agent: "Treasury Agent",
        role: "Budget enforcement",
        status: "Guarded",
      },
      {
        agent: "Community Agent",
        role: "Launch activation",
        status: "Adaptive",
      },
    ],
  },
  {
    id: "audit",
    title: "Coordinate smart contract audit",
    objective:
      "Run a multi-agent review flow across development, security, treasury, and release controls before protocol launch.",
    durationLabel: "05m demo sequence",
    timeline: [
      {
        label: "Scope handshake",
        detail:
          "Developer and Security agents map review boundaries and critical surfaces.",
      },
      {
        label: "Finding triage",
        detail:
          "Research and Developer agents classify severity and remediation order.",
      },
      {
        label: "Treasury gating",
        detail:
          "Treasury agent locks payout until audit confidence crosses target.",
      },
      {
        label: "Release clearance",
        detail:
          "Security agent clears deployment once findings and budgets align.",
      },
    ],
    telemetry: {
      agentConcurrency: 5,
      treasuryMovementUsd: 120000,
      confidence: 98,
      workflowPressure: 64,
    },
    reasoning: [
      "Protocol launch should remain staged because remediation sequencing matters more than release speed.",
      "Treasury release is safe only after high-severity issues are proven closed and contributor payment milestones are matched to verification.",
      "Approval compression is appropriate for medium-risk fixes once the guarded path is established.",
    ],
    transactions: [
      { title: "Audit retainer", amount: "$60,000", status: "confirmed" },
      {
        title: "Security bonus allocation",
        amount: "$24,000",
        status: "routing",
      },
      { title: "Protocol launch reserve", amount: "$36,000", status: "queued" },
    ],
    coordination: [
      {
        agent: "Developer Agent",
        role: "Remediation execution",
        status: "Coordinating",
      },
      { agent: "Security Agent", role: "Risk validation", status: "Active" },
      { agent: "Treasury Agent", role: "Payout gating", status: "Guarded" },
      {
        agent: "Research Agent",
        role: "Impact synthesis",
        status: "Monitoring",
      },
    ],
  },
  {
    id: "dao-contributors",
    title: "Run DAO contributor program",
    objective:
      "Stand up a contributor workflow with activation, payouts, operational memory, and clear execution visibility.",
    durationLabel: "07m demo sequence",
    timeline: [
      {
        label: "Contributor intake",
        detail:
          "Community agent segments participants by readiness and specialization.",
      },
      {
        label: "Workflow routing",
        detail:
          "Developer and Research agents assign work surfaces and execution lanes.",
      },
      {
        label: "Budget controls",
        detail:
          "Treasury agent allocates safe payout envelopes by contributor pod.",
      },
      {
        label: "Operational playback",
        detail:
          "All agents monitor progress, trust, and delivery quality in one loop.",
      },
    ],
    telemetry: {
      agentConcurrency: 6,
      treasuryMovementUsd: 68000,
      confidence: 92,
      workflowPressure: 72,
    },
    reasoning: [
      "Contributor trust increases when payout visibility is paired with explicit execution milestones.",
      "Community pacing should remain staged so memory stays coherent across pods and feedback loops.",
      "Treasury flexibility improves if payouts are released by verified contribution cluster rather than all at once.",
    ],
    transactions: [
      {
        title: "Contributor starter pool",
        amount: "$18,000",
        status: "confirmed",
      },
      {
        title: "Operations squad payout",
        amount: "$26,000",
        status: "routing",
      },
      {
        title: "Community rewards reserve",
        amount: "$24,000",
        status: "queued",
      },
    ],
    coordination: [
      {
        agent: "Community Agent",
        role: "Contributor activation",
        status: "Learning",
      },
      {
        agent: "Developer Agent",
        role: "Workflow system owner",
        status: "Active",
      },
      { agent: "Treasury Agent", role: "Payout routing", status: "Guarded" },
      {
        agent: "Research Agent",
        role: "Performance synthesis",
        status: "Active",
      },
    ],
  },
  {
    id: "treasury-payout",
    title: "Execute treasury payout workflow",
    objective:
      "Simulate how AgentOS routes capital, evaluates policy, and executes a multi-party operational payout at speed.",
    durationLabel: "04m demo sequence",
    timeline: [
      {
        label: "Payout assembly",
        detail:
          "Treasury agent groups recipients by lane, urgency, and policy profile.",
      },
      {
        label: "Risk evaluation",
        detail:
          "Security and Treasury agents validate wallet scope and payout conditions.",
      },
      {
        label: "Release routing",
        detail:
          "Payments move into safe-path execution with live confidence scoring.",
      },
      {
        label: "Confirmation",
        detail:
          "AgentOS confirms settlement and updates downstream workflow cost baselines.",
      },
    ],
    telemetry: {
      agentConcurrency: 4,
      treasuryMovementUsd: 164000,
      confidence: 97,
      workflowPressure: 58,
    },
    reasoning: [
      "Internal transfers can compress approvals because recipient wallets are pre-scoped and variance is low.",
      "External payouts remain guarded until destination behavior and budget fit are revalidated.",
      "The payout workflow should export updated spend intelligence back into future execution planning.",
    ],
    transactions: [
      {
        title: "Contributor main batch",
        amount: "$84,000",
        status: "confirmed",
      },
      { title: "Audit incentive lane", amount: "$42,000", status: "routing" },
      { title: "Growth reserve release", amount: "$38,000", status: "queued" },
    ],
    coordination: [
      { agent: "Treasury Agent", role: "Capital routing", status: "Active" },
      {
        agent: "Security Agent",
        role: "Policy enforcement",
        status: "Guarded",
      },
      { agent: "Research Agent", role: "Spend context", status: "Monitoring" },
    ],
  },
  {
    id: "growth-campaign",
    title: "Manage growth campaign",
    objective:
      "Coordinate a multi-agent growth push with launch messaging, treasury pacing, analytics, and contributor execution.",
    durationLabel: "05m demo sequence",
    timeline: [
      {
        label: "Narrative calibration",
        detail:
          "Research and Marketing agents align positioning with current demand patterns.",
      },
      {
        label: "Execution setup",
        detail:
          "Community and Developer agents prepare assets, workflows, and feedback loops.",
      },
      {
        label: "Spend release",
        detail: "Treasury agent allocates channel budgets and payout ceilings.",
      },
      {
        label: "Optimization loop",
        detail:
          "AgentOS adapts channel mix and contributor routing in real time.",
      },
    ],
    telemetry: {
      agentConcurrency: 5,
      treasuryMovementUsd: 92000,
      confidence: 93,
      workflowPressure: 74,
    },
    reasoning: [
      "Community-first amplification should come before paid spend because trust compounds campaign efficiency.",
      "Developer automation reduces human drag most when reporting loops are embedded directly into workflow execution.",
      "Treasury pacing should stay elastic until conversion confidence stabilizes.",
    ],
    transactions: [
      {
        title: "Growth experimentation budget",
        amount: "$40,000",
        status: "confirmed",
      },
      {
        title: "Community amplification lane",
        amount: "$22,000",
        status: "routing",
      },
      {
        title: "Contributor media reserve",
        amount: "$30,000",
        status: "queued",
      },
    ],
    coordination: [
      {
        agent: "Marketing Agent",
        role: "Channel operations",
        status: "Active",
      },
      {
        agent: "Community Agent",
        role: "Audience activation",
        status: "Adaptive",
      },
      { agent: "Treasury Agent", role: "Spend control", status: "Guarded" },
      {
        agent: "Research Agent",
        role: "Performance synthesis",
        status: "Active",
      },
    ],
  },
];
