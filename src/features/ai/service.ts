import { AiCommandContext, AiCommandResult, AiIntent } from "@/features/ai/types";

const fallbackActions: Record<AiIntent, string[]> = {
  generate_workflow: ["Open Workflows", "Save workflow plan", "Review agent assignments"],
  analyze_treasury_risk: ["Open treasury activity", "Inspect payout previews", "Raise approval threshold"],
  summarize_activity: ["Open dashboard", "Review live activity stream", "Archive summary"],
  recommend_payout_routing: ["Inspect settlement queue", "Open treasury preview", "Review wallet policies"],
  detect_operational_anomalies: ["Open system health", "Review reasoning feed", "Pause unsafe routing"],
};

const fallbackTitles: Record<AiIntent, string> = {
  generate_workflow: "Workflow intelligence summary",
  analyze_treasury_risk: "Treasury risk overview",
  summarize_activity: "Operational activity summary",
  recommend_payout_routing: "Payout routing recommendation",
  detect_operational_anomalies: "Operational anomaly review",
};

export function buildAiFallbackResult(
  intent: AiIntent,
  prompt: string,
  context?: AiCommandContext,
): AiCommandResult {
  const workspace = context?.workspaceName ?? "the current workspace";
  const operator = context?.operatorName ?? "the operator";
  const activity = context?.recentActivity?.slice(0, 2).join(" ") || "Recent execution remains stable.";

  const summaryByIntent: Record<AiIntent, string> = {
    generate_workflow: `A structured execution plan can be generated for "${prompt}" with staged approvals, agent ownership, and treasury checkpoints across ${workspace}.`,
    analyze_treasury_risk: `Treasury posture appears controlled for ${workspace}. Review high-value payout lanes and keep operator approval active for disbursements above the current threshold.`,
    summarize_activity: `${operator} can review a concise activity summary now. ${activity}`,
    recommend_payout_routing: `Recommended payout routing keeps low-risk internal transfers on the fast lane while guarded approvals remain in place for external treasury movements.`,
    detect_operational_anomalies: `No critical anomaly is implied by the current command. Prioritize review of new notifications, workflow retries, and execution drift before irreversible actions.`,
  };

  return {
    title: fallbackTitles[intent],
    summary: summaryByIntent[intent],
    recommendations: [
      "Keep human approval on irreversible treasury actions.",
      "Route execution changes through the active workflow review surface.",
      "Preserve recent activity context for the next operator cycle.",
    ],
    suggestedActions: fallbackActions[intent],
    confidence: "0.88",
  };
}

export function buildAiSystemPrompt(intent: AiIntent, context?: AiCommandContext) {
  return `
You are AgentOS, an AI operations copilot for a production SaaS platform.

Intent: ${intent}
Workspace: ${context?.workspaceName ?? "Unknown workspace"}
Operator: ${context?.operatorName ?? "Unknown operator"}
Route: ${context?.route ?? "Unknown route"}

Respond with JSON only in this exact shape:
{
  "title": string,
  "summary": string,
  "recommendations": string[],
  "suggestedActions": string[],
  "confidence": string
}

Rules:
- Be concise, operational, and trustworthy.
- Never mention internal provider errors, quotas, stack traces, or tool failures.
- Use premium SaaS language, not sci-fi theatrics.
- Recommendations must be immediately useful to an operator.
`.trim();
}

