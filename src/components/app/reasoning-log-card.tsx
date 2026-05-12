import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

type ReasoningLog = {
  id: string;
  agent: string;
  summary: string;
  confidence: string;
};

type ReasoningLogCardProps = {
  logs: ReasoningLog[];
};

export function ReasoningLogCard({ logs }: ReasoningLogCardProps) {
  return (
    <GlassCard className="min-w-0 p-5" glow="none">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Agent reasoning layer</h2>
        <div className="flex items-center gap-2 text-xs text-white/38">
          <motion.span
            animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-2 rounded-full bg-cyan-300/80"
          />
          Live analysis
        </div>
      </div>
      <div className="space-y-3">
        {logs.length ? (
          logs.map((log, index) => (
            <motion.div
              key={log.id}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
              className="min-w-0 rounded-[22px] border border-white/6 bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 font-medium break-words text-white">
                  {log.agent}
                </p>
                <span className="shrink-0 text-xs text-white/38">
                  {log.confidence}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/52">
                {log.summary}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="rounded-[22px] border border-white/6 bg-white/[0.03] p-4 text-sm text-white/46">
            No reasoning updates are active right now.
          </div>
        )}
      </div>
    </GlassCard>
  );
}
