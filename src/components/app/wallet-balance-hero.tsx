"use client";

import { motion } from "framer-motion";
import { CheckCircle2, LockKeyhole, ShieldCheck, Wallet2, Waves } from "lucide-react";
import { useTreasuryPlatform } from "@/features/treasury/hooks";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { formatSol, shortenAddress } from "@/lib/wallet";

function toneDot(tone: "cyan" | "emerald" | "violet") {
  if (tone === "emerald") return "bg-emerald-300/85";
  if (tone === "violet") return "bg-amber-300/80";
  return "bg-cyan-300/80";
}

export function WalletBalanceHero() {
  const {
    connected,
    address,
    balanceSol,
    walletName,
    isLoading,
    snapshot,
    network,
    readiness,
  } = useTreasuryPlatform();

  return (
    <GlassCard className="p-5 sm:p-6" glow="cyan">
      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="min-w-0 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="cyan">Treasury activation</Badge>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <motion.span
                animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={connected ? "h-2 w-2 rounded-full bg-emerald-300/85" : "h-2 w-2 rounded-full bg-cyan-300/75"}
              />
              {connected ? "Treasury lanes initializing" : "Dormant vault systems"}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl">
                {connected ? `${formatSol(balanceSol ?? 0)} SOL` : "Treasury not yet scoped"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                {connected
                  ? `${shortenAddress(address)} • ${walletName} • ${network}${isLoading ? " • refreshing readiness" : ""}`
                  : "Connect Phantom or Solflare to unlock live vault state, signature validation, settlement windows, and protected payout routing."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                  Treasury balance
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                  {snapshot ? snapshot.overview[0]?.formattedValue : "Syncing"}
                </p>
              </div>
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                  Protected rails
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                  {snapshot ? snapshot.overview[1]?.formattedValue : "Syncing"}
                </p>
              </div>
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                  Transfer cadence
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                  {snapshot ? `${snapshot.transferCadencePerHour}/hr` : "Syncing"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {readiness.map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-white/7 bg-black/10 px-4 py-3.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                    {item.label}
                  </p>
                  <motion.span
                    animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.06, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={`h-2 w-2 rounded-full ${toneDot(item.tone)}`}
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-white">{item.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">
                  Capital lanes
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.05em] text-white">
                  Protected vault activation
                </h3>
              </div>
              <ShieldCheck className="h-5 w-5 text-cyan-100" />
            </div>
            <div className="mt-5 space-y-3">
              {[
                {
                  icon: Wallet2,
                  label: "Operating vault",
                  detail: connected ? "Settlement lane ready" : "Locked until wallet scope",
                },
                {
                  icon: LockKeyhole,
                  label: "Approval vault",
                  detail: connected ? "Signature batch verified" : "Dormant policy rails",
                },
                {
                  icon: Waves,
                  label: "Liquidity buffer",
                  detail: connected ? "Adaptive routing available" : "Previewing treasury paths",
                },
              ].map((lane, index) => {
                const Icon = lane.icon;
                return (
                  <div
                    key={lane.label}
                    className="rounded-[20px] border border-white/7 bg-black/10 px-4 py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06] text-cyan-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-white">{lane.label}</p>
                          <CheckCircle2 className="h-4 w-4 text-white/28" />
                        </div>
                        <p className="mt-1 text-sm text-white/42">{lane.detail}</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <motion.div
                        className={connected ? "h-full rounded-full bg-emerald-300/75" : "h-full rounded-full bg-cyan-300/55"}
                        animate={{ width: connected ? ["36%", `${72 + index * 6}%`, "58%"] : ["18%", "28%", "18%"] }}
                        transition={{ repeat: Infinity, duration: 4 + index * 0.4, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">
              Treasury posture
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                connected ? "Wallet verified" : "Wallet required",
                snapshot ? `${snapshot.policyConfidence.toFixed(0)}% policy confidence` : "Policy syncing",
                connected ? "Settlement window open" : "Preview mode",
              ].map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/42"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
