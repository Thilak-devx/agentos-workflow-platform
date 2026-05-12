import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type TimelineItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone?: "cyan" | "emerald" | "violet";
};

type TimelineCardProps = {
  title: string;
  items: TimelineItem[];
};

export function TimelineCard({ title, items }: TimelineCardProps) {
  return (
    <GlassCard glow="emerald" className="p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <Badge variant="emerald">Live stream</Badge>
      </div>
      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative rounded-[26px] border border-white/8 bg-white/[0.04] p-4"
          >
            <div className="absolute top-4 bottom-4 left-4 w-px bg-white/8" />
            <div className="relative pl-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-white">{item.title}</p>
                <span className="text-xs text-white/40">{item.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/52">
                {item.detail}
              </p>
              <Badge
                variant={item.tone ?? (index === 0 ? "cyan" : "violet")}
                className="mt-4"
              >
                Routed
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
