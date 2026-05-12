import { motion } from "framer-motion";
import { TreasurySparkline } from "@/components/charts/treasury-sparkline";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type Transaction = {
  id: string;
  hash: string;
  action: string;
  amount: string;
  network: string;
  time: string;
  sparkline?: number[];
  status?: string;
};

type TransactionFeedCardProps = {
  transactions: Transaction[];
};

function toneForStatus(status?: string) {
  if (status === "review") return "violet";
  if (status === "queued") return "cyan";
  return "emerald";
}

function secondaryLabel(status?: string) {
  if (status === "review") return "Approval checkpoint";
  if (status === "queued") return "Queue depth rising";
  return "Settlement stable";
}

export function TransactionFeedCard({ transactions }: TransactionFeedCardProps) {
  return (
    <GlassCard className="min-w-0 p-5 sm:p-6" glow="none">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Treasury activity</h2>
          <p className="mt-1 text-sm leading-6 text-white/46">
            Real-time routing, approval compression, and capital movement context.
          </p>
        </div>
        <span className="text-xs text-white/38">Settlement feed</span>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
            className="min-w-0 rounded-[22px] border border-white/6 bg-white/[0.03] p-4 transition duration-200 hover:border-white/12 hover:bg-white/[0.045]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium break-words text-white">{transaction.action}</p>
                  <Badge variant={toneForStatus(transaction.status)}>
                    {transaction.status ?? "stable"}
                  </Badge>
                </div>
                <p className="mt-2 text-xs break-all text-white/34">
                  {transaction.hash} / {transaction.network}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                    {secondaryLabel(transaction.status)}
                  </span>
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                    {transaction.time}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-left sm:text-right">
                {transaction.sparkline?.length ? (
                  <TreasurySparkline values={transaction.sparkline} />
                ) : null}
                <div>
                  <p className="font-medium text-white">{transaction.amount}</p>
                  <p className="mt-1 text-xs text-white/38">
                    {transaction.status === "review"
                      ? "Policy-aware routing"
                      : transaction.status === "queued"
                        ? "Awaiting settlement window"
                        : "Route compressed"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
