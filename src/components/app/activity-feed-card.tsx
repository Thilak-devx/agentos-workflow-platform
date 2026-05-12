import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

type FeedItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone?: "cyan" | "emerald" | "violet";
};

type ActivityFeedCardProps = {
  title: string;
  items: FeedItem[];
};

export function ActivityFeedCard({ title, items }: ActivityFeedCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <GlassCard className="min-w-0 p-5" glow="none">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2 text-xs text-white/38">
          <motion.span
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.45, 1, 0.45], scale: [1, 1.06, 1] }
            }
            transition={
              reduceMotion
                ? undefined
                : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
            className="h-2 w-2 rounded-full bg-emerald-300/85"
          />
          Streaming
        </div>
      </div>
      <div className="space-y-3">
        {items.length ? (
          items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              transition={{
                duration: 0.2,
                delay: index * 0.04,
                ease: "easeOut",
              }}
              className="min-w-0 rounded-[22px] border border-white/6 bg-white/[0.03] p-4 transition duration-200 hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 font-medium break-words text-white">
                  {item.title}
                </p>
                <span className="shrink-0 text-xs text-white/38">
                  {item.time}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/52">
                {item.detail}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <motion.span
                  animate={
                    reduceMotion
                      ? undefined
                      : { opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 2.1, repeat: Infinity, ease: "easeInOut" }
                  }
                  className="h-2 w-2 shrink-0 rounded-full bg-emerald-300/80"
                />
                <span className="text-xs text-white/36">Active</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-[22px] border border-white/6 bg-white/[0.03] p-4 text-sm text-white/46">
            No live activity yet. The next execution cycle will appear here
            automatically.
          </div>
        )}
      </div>
    </GlassCard>
  );
}
