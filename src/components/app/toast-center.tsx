"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useRuntimeStore } from "@/store/runtime-store";

function toneIcon(tone: "cyan" | "emerald" | "violet") {
  if (tone === "emerald") return CheckCircle2;
  if (tone === "violet") return AlertCircle;
  return Sparkles;
}

export function ToastCenter() {
  const toasts = useRuntimeStore((state) => state.toasts);
  const dismissToast = useRuntimeStore((state) => state.dismissToast);

  useEffect(() => {
    if (!toasts.length) return;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismissToast(toast.id), 3200),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [dismissToast, toasts]);

  return (
    <div className="pointer-events-none fixed top-5 right-5 z-[95] flex w-[min(320px,calc(100vw-24px))] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toneIcon(toast.tone);

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.985, filter: "blur(3px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto rounded-[20px] border border-white/9 bg-[#08111df2] px-3.5 py-3 shadow-[0_18px_44px_rgba(2,6,23,0.28)] backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-white/[0.055] text-cyan-100">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{toast.title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/50">
                    {toast.detail}
                  </p>
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 3.1, ease: "linear" }}
                    className="mt-3 h-px origin-left rounded-full bg-white/12"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
