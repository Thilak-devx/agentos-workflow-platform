"use client";

import { motion } from "framer-motion";
import { useTreasuryPlatform } from "@/features/treasury/hooks";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { createStableKey } from "@/lib/react-keys";
import { shortenAddress } from "@/lib/wallet";

export function WalletActivityCard() {
  const { connected, signatures, address, isLoading, hasError } = useTreasuryPlatform();

  return (
    <GlassCard className="p-5 sm:p-6" glow="emerald">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Wallet activity feed</h2>
          <p className="mt-1 text-sm leading-6 text-white/46">
            Signature readiness, settlement confirmations, and wallet-linked treasury movement.
          </p>
        </div>
        <Badge variant={connected ? "emerald" : "violet"}>
          {connected ? "Live wallet scope" : "Awaiting wallet"}
        </Badge>
      </div>
      <div className="space-y-3">
        {isLoading && connected ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={createStableKey("wallet-skeleton", index)}
              className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4"
            >
              <div className="h-4 w-32 rounded-full bg-white/[0.08]" />
              <div className="mt-3 h-3 w-full rounded-full bg-white/[0.06]" />
              <div className="mt-2 h-3 w-24 rounded-full bg-white/[0.05]" />
            </div>
          ))
        ) : connected && signatures.length > 0 ? (
          signatures.map((signature, index) => (
            <motion.div
              key={signature.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
              className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4 transition duration-200 hover:border-white/12 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.08, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={
                        signature.status === "confirmed"
                          ? "h-2 w-2 rounded-full bg-emerald-300/85"
                          : "h-2 w-2 rounded-full bg-amber-300/85"
                      }
                    />
                    <p className="font-medium text-white">
                      {shortenAddress(signature.signature)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Wallet {shortenAddress(address)} cleared treasury review at slot{" "}
                    {signature.slot.toLocaleString()}.
                  </p>
                </div>
                <Badge
                  variant={signature.status === "confirmed" ? "emerald" : "violet"}
                >
                  {signature.status === "confirmed" ? "Confirmed" : "Reviewing"}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                  Signature batch
                </span>
                <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                  {signature.time}
                </span>
              </div>
            </motion.div>
          ))
        ) : hasError ? (
          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4 text-sm leading-6 text-white/46">
            Wallet activity is reconnecting. Recent signature history and settlement confirmations will return automatically.
          </div>
        ) : (
          <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
            <p className="text-sm font-medium text-white">Wallet features staged</p>
            <p className="mt-2 text-sm leading-6 text-white/46">
              Signature batches, settlement confirmations, and wallet-linked treasury telemetry remain available in preview until a wallet is connected.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Protected routing", "Signature validation", "Vault telemetry"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
