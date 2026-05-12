"use client";

import { useEffect, useRef } from "react";
import { useRuntimeStore } from "@/store/runtime-store";

export function RuntimeSimulation() {
  const tickClock = useRuntimeStore((state) => state.tickClock);
  const runSimulationCycle = useRuntimeStore(
    (state) => state.runSimulationCycle,
  );
  const clockTimerRef = useRef<number | null>(null);
  const simulationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    tickClock();

    function clearTimers() {
      if (clockTimerRef.current) {
        window.clearInterval(clockTimerRef.current);
        clockTimerRef.current = null;
      }
      if (simulationTimerRef.current) {
        window.clearInterval(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }
    }

    function startTimers() {
      if (clockTimerRef.current || simulationTimerRef.current) {
        return;
      }

      clockTimerRef.current = window.setInterval(() => tickClock(), 1000);
      simulationTimerRef.current = window.setInterval(() => {
        if (document.visibilityState === "visible") {
          runSimulationCycle();
        }
      }, 6000);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        tickClock();
        startTimers();
        return;
      }

      clearTimers();
    }

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimers();
    };
  }, [runSimulationCycle, tickClock]);

  return null;
}
