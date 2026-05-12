"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";

type LiveMetric = {
  label: string;
  base: number;
  suffix?: string;
  liveValue?: number;
  prefix?: string;
  tone?: "emerald" | "amber" | "cyan";
  detail?: string;
};

type LiveMetricsStripProps = {
  metrics: LiveMetric[];
};

export function LiveMetricsStrip({ metrics }: LiveMetricsStripProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    function handleTick() {
      if (document.visibilityState === "visible") {
        setTick((value) => value + 1);
      }
    }

    const timer = window.setInterval(handleTick, 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const adjustment = ((tick + index) % 5) - 2;
        const value = metric.liveValue ?? metric.base + adjustment;

        return (
          <motion.div
            key={metric.label}
            layout
            className="min-w-0 rounded-[24px] border border-white/6 bg-white/[0.03] px-4 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs break-words text-white/38">{metric.label}</p>
              <motion.span
                animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className={
                  metric.tone === "amber"
                    ? "h-2 w-2 shrink-0 rounded-full bg-amber-300/85"
                    : metric.tone === "emerald"
                      ? "h-2 w-2 shrink-0 rounded-full bg-emerald-300/85"
                      : "h-2 w-2 shrink-0 rounded-full bg-cyan-300/85"
                }
              />
            </div>
            <motion.div
              key={`${metric.label}-${value}`}
              initial={{ opacity: 0.4, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mt-2 text-2xl font-semibold tracking-[-0.04em] break-words text-white"
            >
              <AnimatedCounter
                value={value}
                prefix={metric.prefix}
                suffix={metric.suffix}
              />
            </motion.div>
            {metric.detail ? (
              <p className="mt-2 text-xs leading-5 text-white/34">{metric.detail}</p>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
