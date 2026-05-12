"use client";

import { motion } from "framer-motion";
import { TreasuryNotificationItem } from "@/features/treasury/types";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type TreasuryNotificationsCardProps = {
  notifications: TreasuryNotificationItem[];
};

function severityLabel(tone: TreasuryNotificationItem["tone"]) {
  if (tone === "emerald") return "Recovery";
  if (tone === "violet") return "Escalation";
  return "Routing";
}

export function TreasuryNotificationsCard({
  notifications,
}: TreasuryNotificationsCardProps) {
  return (
    <GlassCard className="p-5 sm:p-6" glow="violet">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Treasury notifications</h2>
          <p className="mt-1 text-sm leading-6 text-white/46">
            Policy-triggered alerts, escalations, and recovery confirmations across active settlement lanes.
          </p>
        </div>
        <Badge variant="violet">{notifications.length} alerts</Badge>
      </div>
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
            className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4 transition duration-200 hover:border-white/12 hover:bg-white/[0.05]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.07, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={
                      notification.tone === "emerald"
                        ? "h-2 w-2 rounded-full bg-emerald-300/85"
                        : notification.tone === "violet"
                          ? "h-2 w-2 rounded-full bg-amber-300/85"
                          : "h-2 w-2 rounded-full bg-cyan-300/85"
                    }
                  />
                  <p className="font-medium text-white">{notification.title}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/52">
                  {notification.detail}
                </p>
              </div>
              <Badge variant={notification.tone}>{severityLabel(notification.tone)}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                {new Date(notification.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                Policy event
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
