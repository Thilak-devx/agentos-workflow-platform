"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { createStableKey } from "@/lib/react-keys";

type CoordinationNode = {
  name: string;
  status: string;
  load: string;
};

type CoordinationPanelProps = {
  nodes: CoordinationNode[];
};

function toneForStatus(status: string) {
  const lowered = status.toLowerCase();
  if (lowered.includes("guard")) return "emerald";
  if (lowered.includes("adaptive")) return "violet";
  return "cyan";
}

export function CoordinationPanel({ nodes }: CoordinationPanelProps) {
  return (
    <GlassCard className="min-w-0 p-5 sm:p-6" glow="violet">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">
            Shared context
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">Multi-agent coordination</h2>
        </div>
        <Badge variant="violet">Live graph</Badge>
      </div>

      <div className="relative min-h-[360px] overflow-hidden rounded-[24px] border border-white/6 bg-white/[0.025] p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_55%)]" />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M20 22 C 36 28, 44 34, 52 50"
            stroke="rgba(103,232,249,0.18)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3 5"
            animate={{ strokeDashoffset: [0, -24] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M52 50 C 64 52, 72 42, 80 26"
            stroke="rgba(52,211,153,0.2)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3 5"
            animate={{ strokeDashoffset: [0, -18] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M52 50 C 62 60, 72 68, 80 78"
            stroke="rgba(196,181,253,0.2)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3 5"
            animate={{ strokeDashoffset: [0, -18] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M20 78 C 32 72, 42 62, 52 50"
            stroke="rgba(148,163,184,0.16)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3 5"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <div className="relative grid h-full gap-4 sm:grid-cols-2">
          {nodes.map((node, index) => (
            <motion.div
              key={createStableKey(node.name, node.status, node.load)}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.26, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="group relative rounded-[22px] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4"
            >
              <motion.span
                animate={{ opacity: [0.38, 0.85, 0.38], scale: [1, 1.08, 1] }}
                transition={{ duration: 2.1 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-cyan-200/80 shadow-[0_0_18px_rgba(103,232,249,0.35)]"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-white">{node.name}</p>
                <Badge variant={toneForStatus(node.status)}>{node.status}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/50">{node.load}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                  Shared context
                </span>
                <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                  Propagation active
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
