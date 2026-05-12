import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  pulse?: string;
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  pulse,
}: MetricCardProps) {
  return (
    <GlassCard className="group p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-white/36 uppercase">
            {label}
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-white">
            {value}
          </p>
          <p className="mt-2 text-sm text-white/48">{detail}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {pulse ? (
        <Badge className="mt-5" variant="cyan">
          {pulse}
        </Badge>
      ) : null}
    </GlassCard>
  );
}
