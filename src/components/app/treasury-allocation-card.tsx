import { TreasuryAllocationChart } from "@/components/charts/treasury-allocation-chart";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { TreasuryAllocationSlice } from "@/features/treasury/types";

type TreasuryAllocationCardProps = {
  allocations: TreasuryAllocationSlice[];
};

export function TreasuryAllocationCard({ allocations }: TreasuryAllocationCardProps) {
  return (
    <GlassCard className="p-5 sm:p-6" glow="violet">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Treasury intelligence allocation</h2>
          <p className="mt-1 text-sm leading-6 text-white/46">
            AI-assisted budget weighting across contributor rewards, risk controls, growth, and operations reserve.
          </p>
        </div>
        <Badge variant="violet">Forecasted</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-[190px_1fr] lg:items-center">
        <TreasuryAllocationChart data={allocations} />
        <div className="space-y-3">
          {allocations.map((slice) => (
            <div
              key={slice.label}
              className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4 transition duration-200 hover:border-white/12 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-white">{slice.label}</p>
                <span className="text-sm text-white/40">{slice.share}%</span>
              </div>
              <p className="mt-2 text-sm text-white/50">
                ${slice.amountUsd.toLocaleString()}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-violet-300/70"
                  style={{ width: `${Math.max(slice.share, 8)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
