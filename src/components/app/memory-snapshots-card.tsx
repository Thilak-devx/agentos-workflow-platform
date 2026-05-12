import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type Snapshot = {
  id: string;
  title: string;
  detail: string;
};

type MemorySnapshotsCardProps = {
  snapshots: Snapshot[];
};

export function MemorySnapshotsCard({ snapshots }: MemorySnapshotsCardProps) {
  return (
    <GlassCard className="p-5" glow="cyan">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          AI memory snapshots
        </h2>
        <Badge variant="cyan">Persistent context</Badge>
      </div>
      <div className="space-y-3">
        {snapshots.map((snapshot) => (
          <div
            key={snapshot.id}
            className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
          >
            <p className="font-medium text-white">{snapshot.title}</p>
            <p className="mt-2 text-sm leading-6 text-white/52">
              {snapshot.detail}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
