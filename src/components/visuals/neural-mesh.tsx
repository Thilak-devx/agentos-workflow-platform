"use client";

import { motion } from "framer-motion";
import { createStableKey } from "@/lib/react-keys";
import { cn } from "@/lib/utils";

type NeuralMeshProps = {
  className?: string;
};

const nodes = [
  { x: "8%", y: "20%", size: "h-2 w-2", delay: 0.1 },
  { x: "28%", y: "48%", size: "h-2.5 w-2.5", delay: 0.3 },
  { x: "48%", y: "18%", size: "h-3 w-3", delay: 0.15 },
  { x: "58%", y: "62%", size: "h-2 w-2", delay: 0.22 },
  { x: "78%", y: "36%", size: "h-2.5 w-2.5", delay: 0.4 },
  { x: "88%", y: "70%", size: "h-2 w-2", delay: 0.5 },
];

export function NeuralMesh({ className }: NeuralMeshProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_60%)]",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-50"
        viewBox="0 0 400 240"
        fill="none"
      >
        <path
          d="M20 48C84 92 120 98 162 76C216 48 238 36 314 62C352 74 374 100 390 140"
          stroke="url(#mesh)"
          strokeWidth="1.4"
          strokeDasharray="6 8"
        />
        <path
          d="M54 180C112 144 158 136 212 158C246 172 276 196 344 184"
          stroke="url(#mesh)"
          strokeWidth="1.4"
          strokeDasharray="6 8"
        />
        <defs>
          <linearGradient id="mesh" x1="0" y1="0" x2="400" y2="240">
            <stop stopColor="rgba(147,231,255,0.1)" />
            <stop offset="0.5" stopColor="rgba(147,231,255,0.9)" />
            <stop offset="1" stopColor="rgba(110,231,183,0.2)" />
          </linearGradient>
        </defs>
      </svg>

      {nodes.map((node) => (
        <motion.div
          key={createStableKey("mesh-node", node.x, node.y, node.size)}
          className={cn(
            "absolute rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(147,231,255,0.8)]",
            node.size,
          )}
          style={{ left: node.x, top: node.y }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, delay: node.delay }}
        />
      ))}
    </div>
  );
}
