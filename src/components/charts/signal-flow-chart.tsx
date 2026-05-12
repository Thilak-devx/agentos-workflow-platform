"use client";

import { motion } from "framer-motion";
import { createStableKey } from "@/lib/react-keys";

type SignalFlowChartProps = {
  values: number[];
};

export function SignalFlowChart({ values }: SignalFlowChartProps) {
  const stepX = 100 / (values.length - 1);
  const points = values
    .map((value, index) => `${index * stepX},${100 - value}`)
    .join(" ");
  const area = `0,100 ${points} 100,100`;
  const finalX = (values.length - 1) * stepX;
  const finalY = 100 - values[values.length - 1];

  return (
    <div className="relative h-44 overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(9,13,22,0.94),rgba(7,10,18,0.9))] p-4 sm:h-48">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_45%)]" />
      <svg
        viewBox="0 0 100 100"
        className="relative h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="signalStroke" x1="0" y1="0" x2="100" y2="0">
            <stop offset="0%" stopColor="#8be8ff" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#9ff7d1" />
          </linearGradient>
          <linearGradient id="signalFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(139,232,255,0.34)" />
            <stop offset="100%" stopColor="rgba(139,232,255,0)" />
          </linearGradient>
        </defs>

        {Array.from({ length: 5 }).map((_, index) => (
          <line
            key={createStableKey("signal-grid", index)}
            x1="0"
            x2="100"
            y1={index * 25}
            y2={index * 25}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.4"
          />
        ))}

        <motion.polygon
          points={area}
          fill="url(#signalFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.polyline
          points={points}
          fill="none"
          stroke="url(#signalStroke)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.circle
          cx={finalX}
          cy={finalY}
          r="2.6"
          fill="#9ff7d1"
          animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.18, 1] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${finalX}px ${finalY}px` }}
        />
      </svg>
    </div>
  );
}
