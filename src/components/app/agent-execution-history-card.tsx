import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Tone } from "@/lib/mock-data";

type AgentExecutionHistoryCardProps = {
  items: Array<{
    id: string;
    title: string;
    result: string;
    time: string;
    tone: Tone;
  }>;
};

export function AgentExecutionHistoryCard({
  items,
}: AgentExecutionHistoryCardProps) {
  return (
    <GlassCard className="p-5" glow="violet">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Execution history</h2>
        <Badge variant="violet">Operational log</Badge>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-white">{item.title}</p>
              <span className="text-xs text-white/38">{item.time}</span>
            </div>
            <p className="mt-2 text-sm text-white/52">{item.result}</p>
            <Badge className="mt-4" variant={item.tone}>
              Recorded
            </Badge>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
