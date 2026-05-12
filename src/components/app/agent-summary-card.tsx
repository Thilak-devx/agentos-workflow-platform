import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { AgentProfile } from "@/lib/agent-data";

type AgentSummaryCardProps = {
  agent: AgentProfile;
};

export function AgentSummaryCard({ agent }: AgentSummaryCardProps) {
  return (
    <GlassCard className="p-6" glow={agent.tone}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant={agent.tone}>{agent.type}</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.065em] text-white">
            {agent.name}
          </h1>
          <p className="mt-4 text-sm leading-8 text-white/56">
            {agent.summary}
          </p>
        </div>
        <div className="grid gap-2 text-right">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/42">
            {agent.status}
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/42">
            Success {agent.successRate}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Current task
          </p>
          <p className="mt-2 text-sm text-white/72">{agent.currentTask}</p>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Wallet permissions
          </p>
          <p className="mt-2 text-sm text-white/72">
            {agent.walletPermissions}
          </p>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Memory state
          </p>
          <p className="mt-2 text-sm text-white/72">{agent.memoryState}</p>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Treasury access
          </p>
          <p className="mt-2 text-sm text-white/72">
            {agent.treasuryAccessLevel}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
