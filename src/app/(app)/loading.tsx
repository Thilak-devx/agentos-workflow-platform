import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { createStableKey } from "@/lib/react-keys";

export default function AppLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-80 max-w-full" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <GlassCard
            key={createStableKey("app-loading-card", index)}
            className="p-5"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-5 h-9 w-28" />
            <Skeleton className="mt-3 h-4 w-32" />
          </GlassCard>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="p-6">
          <Skeleton className="mb-5 h-5 w-40" />
          <Skeleton className="h-72 w-full" />
        </GlassCard>
        <GlassCard className="p-6">
          <Skeleton className="mb-5 h-5 w-44" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={createStableKey("app-loading-row", index)}
                className="h-20 w-full"
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
