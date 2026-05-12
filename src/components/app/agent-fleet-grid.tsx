"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, ChevronRight, Cpu, Shield, Wallet2 } from "lucide-react";
import { AgentProfile } from "@/lib/agent-data";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type AgentFleetGridProps = {
  agents: AgentProfile[];
};

export function AgentFleetGrid({ agents }: AgentFleetGridProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {agents.map((agent, index) => (
        <motion.div
          key={agent.slug}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: index * 0.04 }}
        >
          <Link href={`/agents/${agent.slug}`}>
            <GlassCard
              className="group h-full p-5 transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300/18"
              glow={agent.tone}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant={agent.tone}>{agent.type}</Badge>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">
                    {agent.name}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-white/52">
                    {agent.role}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/40">
                  {agent.status}
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
                <p className="text-[11px] tracking-[0.18em] text-white/34 uppercase">
                  Current task
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {agent.currentTask}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] border border-white/8 bg-black/10 p-3">
                  <BrainCircuit className="h-4 w-4 text-cyan-100" />
                  <p className="mt-2 text-xs text-white/36 uppercase">
                    Confidence
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {agent.confidence}
                  </p>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-black/10 p-3">
                  <Cpu className="h-4 w-4 text-cyan-100" />
                  <p className="mt-2 text-xs text-white/36 uppercase">
                    Success
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {agent.successRate}
                  </p>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-black/10 p-3">
                  <Wallet2 className="h-4 w-4 text-cyan-100" />
                  <p className="mt-2 text-xs text-white/36 uppercase">
                    Treasury
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {agent.treasuryAccessLevel}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-white/56">
                  <Shield className="h-4 w-4 text-cyan-100" />
                  {agent.walletPermissions}
                </div>
                <ChevronRight className="h-4 w-4 text-white/38 transition group-hover:translate-x-1" />
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
