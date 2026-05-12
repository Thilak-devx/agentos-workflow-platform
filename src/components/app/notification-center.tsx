"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { usePlatformSnapshot } from "@/features/platform/hooks";
import { dedupeById } from "@/lib/react-keys";
import { systemNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useRuntimeStore } from "@/store/runtime-store";
import { useTreasuryStore } from "@/store/treasury-store";
import { useUiStore } from "@/store/ui-store";

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  tone: "cyan" | "emerald" | "violet";
  createdAt: string;
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function NotificationCenter() {
  const { operator } = useOperatorSession();
  const platformQuery = usePlatformSnapshot(operator);
  const treasuryNotifications = useTreasuryStore(
    (state) => state.notifications,
  );
  const runtimeNotifications = useRuntimeStore((state) => state.notifications);
  const pushToast = useRuntimeStore((state) => state.pushToast);
  const readNotificationIds = useUiStore((state) => state.readNotificationIds);
  const markNotificationsRead = useUiStore(
    (state) => state.markNotificationsRead,
  );
  const [open, setOpen] = useState(false);

  const combined = useMemo<NotificationItem[]>(
    () =>
      dedupeById([
        ...(platformQuery.data?.notifications ?? []),
        ...treasuryNotifications,
        ...runtimeNotifications,
        ...systemNotifications,
      ])
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime(),
        )
        .slice(0, 7),
    [platformQuery.data?.notifications, runtimeNotifications, treasuryNotifications],
  );

  const unreadNotifications = combined.filter(
    (notification) => !readNotificationIds.includes(notification.id),
  );
  const unreadCount = unreadNotifications.length;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen && unreadNotifications.length > 0) {
      markNotificationsRead(unreadNotifications.map((item) => item.id));
    }
  }

  function handleMarkAllRead() {
    markNotificationsRead(combined.map((item) => item.id));
    pushToast({
      title: "Notifications cleared",
      detail: "All current operational alerts were marked as read.",
      tone: "emerald",
    });
  }

  const hasNotifications = combined.length > 0;
  const hasUnread = unreadCount > 0;

  return (
    <DropdownMenu.Root open={open} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Open notification center"
          className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/18 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300/40 focus-visible:outline-none"
        >
          <Bell className="h-4 w-4 transition duration-200 group-hover:scale-[1.06] group-hover:-rotate-6" />
          <AnimatePresence>
            {hasUnread ? (
              <motion.span
                key="unread-indicator"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.45 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(147,231,255,0.75)]"
              />
            ) : null}
          </AnimatePresence>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          align="end"
          className="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 w-[min(388px,calc(100vw-24px))] rounded-[28px] border border-white/10 bg-[#08111df2] p-3 shadow-[0_26px_110px_rgba(2,6,23,0.5)] backdrop-blur-2xl"
        >
          <GlassCard className="p-4" glow="none">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  Notification center
                </p>
                <p className="mt-1 text-xs leading-5 text-white/44">
                  Operational alerts, treasury movement, and AI system signals.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {hasUnread ? (
                  <Badge variant="cyan">{unreadCount} unread</Badge>
                ) : (
                  <Badge variant="emerald">All caught up</Badge>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
              <p className="text-xs text-white/36">
                {hasNotifications
                  ? `${combined.length} recent signals`
                  : "No recent signals"}
              </p>
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={!hasUnread}
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-default disabled:opacity-40"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            </div>
          </GlassCard>

          <div className="mt-3 space-y-2">
            {hasNotifications ? (
              combined.map((notification) => {
                const isUnread = !readNotificationIds.includes(notification.id);

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "rounded-[22px] border p-4 transition duration-200",
                      isUnread
                        ? "border-cyan-300/12 bg-cyan-400/[0.05]"
                        : "border-white/8 bg-white/[0.03]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {isUnread ? (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(147,231,255,0.65)]" />
                          ) : null}
                          <p className="min-w-0 font-medium break-words text-white">
                            {notification.title}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/56">
                          {notification.detail}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Badge className="shrink-0" variant={notification.tone}>
                          <Sparkles className="h-3 w-3" />
                          {notification.tone}
                        </Badge>
                        <span
                          className={cn(
                            "text-[11px] leading-none",
                            isUnread ? "text-cyan-100/80" : "text-white/34",
                          )}
                        >
                          {formatTimestamp(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-8 text-center">
                <p className="text-sm font-medium text-white">No new alerts</p>
                <p className="mt-2 text-sm leading-6 text-white/46">
                  The system is quiet right now. New operational activity will
                  appear here.
                </p>
              </div>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
