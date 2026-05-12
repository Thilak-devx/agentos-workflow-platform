"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { createRuntimeEntityId } from "@/lib/react-keys";

type TerminalStreamCardProps = {
  title: string;
  lines: string[];
};

const cadenceStates = ["active", "synced", "verified", "approved"] as const;

export function TerminalStreamCard({ title, lines }: TerminalStreamCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(1);
  const [typedLine, setTypedLine] = useState("");
  const [lineEntries, setLineEntries] = useState(() =>
    lines.map((line) => ({
      id: createRuntimeEntityId("terminal-line"),
      line,
    })),
  );

  const activeLine =
    lineEntries[Math.min(visibleCount - 1, lineEntries.length - 1)]?.line ?? "";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLineEntries(
        lines.map((line) => ({
          id: createRuntimeEntityId("terminal-line"),
          line,
        })),
      );
      setVisibleCount(1);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [lines]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTypedLine("");
    });
    let index = 0;

    const typer = window.setInterval(() => {
      index += 1;
      setTypedLine(activeLine.slice(0, index));

      if (index >= activeLine.length) {
        window.clearInterval(typer);
      }
    }, reduceMotion ? 1 : 18);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(typer);
    };
  }, [activeLine, reduceMotion]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisibleCount((count) => (count >= lineEntries.length ? 1 : count + 1));
    }, reduceMotion ? 3200 : 2200);

    return () => window.clearInterval(timer);
  }, [lineEntries.length, reduceMotion]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    node.scrollTo({
      top: node.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion, typedLine, visibleCount]);

  const visibleLines = useMemo(
    () =>
      lineEntries.slice(0, visibleCount).map((entry, index) => ({
        id: entry.id,
        line: index === visibleCount - 1 ? typedLine : entry.line,
        timestamp: `0${8 + index}:1${index}`,
        status: cadenceStates[index % cadenceStates.length],
      })),
    [lineEntries, typedLine, visibleCount],
  );

  return (
    <GlassCard glow="violet" className="min-w-0 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">{title}</p>
          <p className="mt-2 text-sm text-white/42">Live operator updates with review-aware execution timing.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/38">
          <motion.span
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.42, 1, 0.42], scale: [1, 1.06, 1] }
            }
            transition={
              reduceMotion
                ? undefined
                : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
            className="h-2 w-2 rounded-full bg-emerald-300/85"
          />
          Live
        </div>
      </div>

      <div className="rounded-[24px] border border-white/7 bg-[#090e17]/95 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/90" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-white/28">
              Live updates
            </span>
            <motion.span
              animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
              transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-cyan-200/85"
            />
          </div>
        </div>

        <div
          ref={containerRef}
          className="max-h-[280px] min-h-[220px] space-y-3 overflow-y-auto pr-1"
        >
          {visibleLines.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.24, delay: reduceMotion ? 0 : index * 0.03 }}
              className="grid gap-2 rounded-[18px] border border-white/6 bg-white/[0.025] px-3 py-2.5 sm:grid-cols-[auto_1fr_auto]"
            >
              <span className="font-mono text-[11px] text-white/28">{entry.timestamp}</span>
              <p className="text-sm leading-6 text-white/76">{entry.line}</p>
              <span className="justify-self-start rounded-full border border-white/7 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/34 sm:justify-self-end">
                {entry.status}
              </span>
            </motion.div>
          ))}

          <div className="flex items-center gap-2 pl-1">
            <span className="font-mono text-[11px] text-white/26">cmd</span>
            <motion.span
              animate={reduceMotion ? undefined : { opacity: [0, 1, 0] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }
              className="inline-block h-4 w-2 rounded-[2px] bg-cyan-200/80"
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
