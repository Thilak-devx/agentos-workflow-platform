"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { TreasuryPreviewItem } from "@/features/treasury/types";

type TransactionPreviewCardProps = {
  previews: TreasuryPreviewItem[];
};

function lifecycleWidth(status: string) {
  const lowered = status.toLowerCase();
  if (lowered.includes("approval")) return "42%";
  if (lowered.includes("signature")) return "68%";
  return "84%";
}

export function TransactionPreviewCard({ previews }: TransactionPreviewCardProps) {
  return (
    <GlassCard className="p-5 sm:p-6" glow="emerald">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">On-chain transaction previews</h2>
          <p className="mt-1 text-sm leading-6 text-white/46">
            Preflight lifecycle, signature batching, and policy-aware settlement readiness.
          </p>
        </div>
        <Badge variant="emerald">Preflight</Badge>
      </div>
      <div className="space-y-3">
        {previews.map((preview, index) => (
          <motion.div
            key={preview.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
            className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium text-white">{preview.title}</p>
              <span className="text-sm text-white/40">{preview.amount}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/50">{preview.detail}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={preview.status.toLowerCase().includes("approval") ? "violet" : "cyan"}>
                {preview.status}
              </Badge>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                Policy-aware
              </span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                Routed depth {index + 2}
              </span>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-[11px] text-white/34">
                <span>Lifecycle</span>
                <span>{preview.status}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  className="h-full rounded-full bg-emerald-300/75"
                  animate={{ width: ["24%", lifecycleWidth(preview.status), "56%"] }}
                  transition={{ repeat: Infinity, duration: 4.2 + index * 0.3, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
