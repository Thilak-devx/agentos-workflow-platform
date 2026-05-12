import { notFound } from "next/navigation";
import { AgentCommunicationCard } from "@/components/app/agent-communication-card";
import { AgentExecutionHistoryCard } from "@/components/app/agent-execution-history-card";
import { AgentLinkedWorkflowsCard } from "@/components/app/agent-linked-workflows-card";
import { AgentMemoryCard } from "@/components/app/agent-memory-card";
import { AgentReasoningCard } from "@/components/app/agent-reasoning-card";
import { AgentSummaryCard } from "@/components/app/agent-summary-card";
import { AgentTelemetryCard } from "@/components/app/agent-telemetry-card";
import { getAgentProfile } from "@/lib/agent-data";

type AgentDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AgentDetailPage({
  params,
}: AgentDetailPageProps) {
  const { slug } = await params;
  const agent = getAgentProfile(slug);

  if (!agent) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AgentSummaryCard agent={agent} />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <AgentTelemetryCard agent={agent} />
        <AgentLinkedWorkflowsCard workflows={agent.linkedWorkflows} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <AgentExecutionHistoryCard items={agent.executionHistory} />
        <AgentReasoningCard logs={agent.reasoningLogs} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <AgentCommunicationCard items={agent.communicationFeed} />
        <AgentMemoryCard snapshots={agent.memorySnapshots} />
      </div>
    </div>
  );
}
