export type WorkflowTask = {
  title: string;
  description: string;
  assignedAgent: string;
  contributors: string[];
  estimatedHours: number;
  estimatedCostUsd: number;
};

export type WorkflowStage = {
  name: string;
  goal: string;
  duration: string;
  tasks: WorkflowTask[];
};

export type ContributorAssignment = {
  role: string;
  owner: string;
  focus: string;
};

export type TimelinePhase = {
  phase: string;
  duration: string;
  deliverables: string[];
};

export type TreasuryEstimate = {
  category: string;
  amountUsd: number;
  rationale: string;
};

export type WorkflowGenerationResult = {
  title: string;
  objective: string;
  summary: string;
  reasoning: string;
  suggestedAgents: string[];
  operationalRecommendations: string[];
  stages: WorkflowStage[];
  contributorAssignments: ContributorAssignment[];
  timeline: TimelinePhase[];
  treasuryEstimates: TreasuryEstimate[];
  totalEstimatedCostUsd: number;
  estimatedTimeline: string;
};

export type SavedWorkflow = {
  id: string;
  prompt: string;
  createdAt: string;
  workflow: WorkflowGenerationResult;
};

export function extractJsonObject(input: string) {
  const fencedMatch = input.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const firstBrace = input.indexOf("{");
  const lastBrace = input.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in model response.");
  }

  return input.slice(firstBrace, lastBrace + 1);
}

function toNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function normalizeWorkflowResult(
  data: unknown,
): WorkflowGenerationResult {
  const raw = (data ?? {}) as Record<string, unknown>;

  const stages = Array.isArray(raw.stages) ? raw.stages : [];
  const assignments = Array.isArray(raw.contributorAssignments)
    ? raw.contributorAssignments
    : [];
  const timeline = Array.isArray(raw.timeline) ? raw.timeline : [];
  const treasuryEstimates = Array.isArray(raw.treasuryEstimates)
    ? raw.treasuryEstimates
    : [];

  return {
    title: typeof raw.title === "string" ? raw.title : "Generated workflow",
    objective:
      typeof raw.objective === "string"
        ? raw.objective
        : "Coordinate execution",
    summary:
      typeof raw.summary === "string"
        ? raw.summary
        : "AI-generated operational workflow.",
    reasoning:
      typeof raw.reasoning === "string"
        ? raw.reasoning
        : "The model generated a structured operating plan.",
    suggestedAgents: toStringArray(raw.suggestedAgents),
    operationalRecommendations: toStringArray(raw.operationalRecommendations),
    stages: stages.map((stage, index) => {
      const current = stage as Record<string, unknown>;
      const tasks = Array.isArray(current.tasks) ? current.tasks : [];

      return {
        name:
          typeof current.name === "string"
            ? current.name
            : `Stage ${index + 1}`,
        goal:
          typeof current.goal === "string"
            ? current.goal
            : "Advance the workflow objective.",
        duration:
          typeof current.duration === "string" ? current.duration : "1-2 days",
        tasks: tasks.map((task, taskIndex) => {
          const currentTask = task as Record<string, unknown>;

          return {
            title:
              typeof currentTask.title === "string"
                ? currentTask.title
                : `Task ${taskIndex + 1}`,
            description:
              typeof currentTask.description === "string"
                ? currentTask.description
                : "Execute the next operational step.",
            assignedAgent:
              typeof currentTask.assignedAgent === "string"
                ? currentTask.assignedAgent
                : "AgentOS Operator",
            contributors: toStringArray(currentTask.contributors),
            estimatedHours: toNumber(currentTask.estimatedHours, 4),
            estimatedCostUsd: toNumber(currentTask.estimatedCostUsd, 500),
          };
        }),
      };
    }),
    contributorAssignments: assignments.map((assignment) => {
      const current = assignment as Record<string, unknown>;

      return {
        role: typeof current.role === "string" ? current.role : "Operator",
        owner: typeof current.owner === "string" ? current.owner : "AgentOS",
        focus:
          typeof current.focus === "string"
            ? current.focus
            : "Cross-functional workflow coverage.",
      };
    }),
    timeline: timeline.map((phase, index) => {
      const current = phase as Record<string, unknown>;

      return {
        phase:
          typeof current.phase === "string"
            ? current.phase
            : `Phase ${index + 1}`,
        duration:
          typeof current.duration === "string" ? current.duration : "1-2 days",
        deliverables: toStringArray(current.deliverables),
      };
    }),
    treasuryEstimates: treasuryEstimates.map((estimate) => {
      const current = estimate as Record<string, unknown>;

      return {
        category:
          typeof current.category === "string"
            ? current.category
            : "Operations",
        amountUsd: toNumber(current.amountUsd, 0),
        rationale:
          typeof current.rationale === "string"
            ? current.rationale
            : "Estimated from generated workflow scope.",
      };
    }),
    totalEstimatedCostUsd: toNumber(raw.totalEstimatedCostUsd, 0),
    estimatedTimeline:
      typeof raw.estimatedTimeline === "string"
        ? raw.estimatedTimeline
        : "1-2 weeks",
  };
}
