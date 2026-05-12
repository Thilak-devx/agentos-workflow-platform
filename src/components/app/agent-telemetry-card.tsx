import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { AgentProfile } from "@/lib/agent-data";

type AgentTelemetryCardProps = {
  agent: AgentProfile;
};

export function AgentTelemetryCard({ agent }: AgentTelemetryCardProps) {
  return (
    <GlassCard className="p-5" glow={agent.tone}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Operational telemetry
        </h2>
        <Badge variant={agent.tone}>{agent.status}</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Executions
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {agent.telemetry.executions24h}
          </p>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Latency
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {agent.telemetry.avgLatency}
          </p>
        </div>
        <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            Collaboration load
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {agent.telemetry.collaborationLoad}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
