import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type EmptyStateCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
};

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  badge,
}: EmptyStateCardProps) {
  return (
    <GlassCard glow="violet" className="p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-fuchsia-100">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-7 text-white/52">
        {description}
      </p>
      {badge ? (
        <Badge variant="violet" className="mt-4">
          {badge}
        </Badge>
      ) : null}
    </GlassCard>
  );
}
