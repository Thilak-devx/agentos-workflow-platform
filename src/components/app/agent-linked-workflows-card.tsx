import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type AgentLinkedWorkflowsCardProps = {
  workflows: string[];
};

export function AgentLinkedWorkflowsCard({
  workflows,
}: AgentLinkedWorkflowsCardProps) {
  return (
    <GlassCard className="p-5" glow="cyan">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Linked workflows</h2>
        <Badge variant="cyan">{workflows.length} active</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {workflows.map((workflow) => (
          <Badge key={workflow} variant="cyan">
            {workflow}
          </Badge>
        ))}
      </div>
    </GlassCard>
  );
}
