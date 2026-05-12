"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, ShieldCheck, Split } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const controls = [
  {
    id: "restart",
    label: "Restart workflow",
    detail: "Replay the current execution path with retained memory.",
    icon: RotateCcw,
  },
  {
    id: "review",
    label: "Open treasury review",
    detail: "Route guarded actions through the financial approval lane.",
    icon: ShieldCheck,
  },
  {
    id: "reroute",
    label: "Trigger reroute",
    detail: "Shift execution into the recovery branch without dropping context.",
    icon: Split,
  },
  {
    id: "dispatch",
    label: "Dispatch runbook",
    detail: "Send the generated workflow into coordinated execution.",
    icon: Play,
  },
] as const;

export function CommandCenterControls() {
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  function triggerControl(controlId: string) {
    setActiveControl(controlId);
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setActiveControl(null);
      resetTimerRef.current = null;
    }, 1200);
  }

  return (
    <GlassCard className="p-5 sm:p-6" glow="cyan">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Interactive command center</h2>
          <p className="mt-1 text-sm leading-6 text-white/46">
            Issue fast operational actions without breaking orchestration context.
          </p>
        </div>
        <Badge variant="cyan">Dispatch layer</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {controls.map((control) => {
          const Icon = control.icon;
          const isActive = activeControl === control.id;

          return (
            <motion.div key={control.id} whileHover={{ y: -1.5 }} transition={{ duration: 0.18 }}>
              <div className="group relative w-full overflow-hidden rounded-[22px] border border-white/8 bg-white/[0.035] p-4 text-left transition duration-200 hover:border-cyan-300/20 hover:bg-white/[0.055]">
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
                  animate={isActive ? { x: ["-120%", "120%"] } : { x: "-120%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <button
                  type="button"
                  onClick={() => triggerControl(control.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      triggerControl(control.id);
                    }
                  }}
                  className="relative block w-full rounded-[18px] text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35"
                  aria-label={`${control.label}. ${control.detail}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.05] text-cyan-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/38">
                      {isActive ? "Dispatching" : "Ready"}
                    </span>
                  </div>
                  <p className="relative mt-4 text-sm font-medium text-white">{control.label}</p>
                  <p className="relative mt-2 text-sm leading-6 text-white/48">{control.detail}</p>
                </button>
                <div className="relative mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    disabled={isActive}
                    onClick={() => triggerControl(control.id)}
                  >
                    {isActive ? "Running" : "Execute"}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
