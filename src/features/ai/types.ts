export type AiIntent =
  | "generate_workflow"
  | "analyze_treasury_risk"
  | "summarize_activity"
  | "recommend_payout_routing"
  | "detect_operational_anomalies";

export type AiCommandContext = {
  route?: string;
  operatorName?: string;
  workspaceName?: string;
  agents?: string[];
  notifications?: string[];
  recentActivity?: string[];
};

export type AiCommandResult = {
  title: string;
  summary: string;
  recommendations: string[];
  suggestedActions: string[];
  confidence: string;
};

