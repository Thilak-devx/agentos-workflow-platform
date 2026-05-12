import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type AgentReasoningCardProps = {
  logs: Array<{
    id: string;
    summary: string;
    confidence: string;
  }>;
};

export function AgentReasoningCard({ logs }: AgentReasoningCardProps) {
  return (
    <GlassCard className="p-5" glow="emerald">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          AI reasoning visualizations
        </h2>
        <Badge variant="emerald">Confidence</Badge>
      </div>
      <div className="space-y-3">
        {logs.map((log, index) => (
          <div
            key={log.id}
            className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-white">
                Reasoning thread {index + 1}
              </p>
              <span className="text-xs text-white/38">{log.confidence}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/52">
              {log.summary}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
