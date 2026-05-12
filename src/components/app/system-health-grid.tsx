import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

type HealthMetric = {
  label: string;
  value: string;
  tone: "cyan" | "emerald" | "violet";
};

type SystemHealthGridProps = {
  metrics: HealthMetric[];
};

function toneMeta(tone: HealthMetric["tone"]) {
  if (tone === "emerald") {
    return {
      dot: "bg-emerald-300/80",
      label: "Healthy",
    };
  }

  if (tone === "violet") {
    return {
      dot: "bg-amber-300/80",
      label: "Watching",
    };
  }

  return {
    dot: "bg-cyan-300/80",
    label: "Live",
  };
}

export function SystemHealthGrid({ metrics }: SystemHealthGridProps) {
  return (
    <GlassCard className="min-w-0 p-5 sm:p-6" glow="none">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Treasury intelligence</h2>
          <p className="mt-1 text-sm leading-6 text-white/46">
            Drift detection, latency diagnostics, and vault confidence across active settlement lanes.
          </p>
        </div>
        <span className="text-xs text-white/38">Monitoring layer</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {metrics.map((metric, index) => {
          const meta = toneMeta(metric.tone);

          return (
            <motion.div
              key={metric.label}
              layout
              className="min-w-0 rounded-[22px] border border-white/6 bg-white/[0.03] p-4 transition duration-200 hover:border-white/10 hover:bg-white/[0.045]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs break-words text-white/36">{metric.label}</p>
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.08, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.1 + index * 0.12,
                      ease: "easeInOut",
                    }}
                    className={`h-2.5 w-2.5 rounded-full ${meta.dot}`}
                  />
                  <span className="text-[11px] text-white/32">{meta.label}</span>
                </div>
              </div>
              <p className="mt-3 min-w-0 text-2xl font-semibold tracking-[-0.05em] break-words text-white">
                {metric.value}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  className={`h-full rounded-full ${meta.dot}`}
                  animate={{ width: ["34%", `${72 - index * 6}%`, "48%"] }}
                  transition={{ repeat: Infinity, duration: 4 + index * 0.3, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
