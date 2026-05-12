"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type StatusPulseCardProps = {
  title: string;
  subtitle: string;
  status: string;
  value: string;
  glow?: "cyan" | "emerald" | "violet";
};

export function StatusPulseCard({
  title,
  subtitle,
  status,
  value,
  glow = "cyan",
}: StatusPulseCardProps) {
  return (
    <GlassCard glow={glow} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
            {title}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
            {value}
          </p>
          <p className="mt-2 text-sm text-white/48">{subtitle}</p>
        </div>
        <div className="relative mt-1">
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-300/25 blur-md"
            animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0.18, 0.45] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          />
          <div className="relative h-3 w-3 rounded-full bg-cyan-200" />
        </div>
      </div>
      <Badge
        className="mt-5"
        variant={
          glow === "emerald" ? "emerald" : glow === "violet" ? "violet" : "cyan"
        }
      >
        {status}
      </Badge>
    </GlassCard>
  );
}
