import Link from "next/link";
import { Orbit } from "lucide-react";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,rgba(56,189,248,0.16),rgba(255,255,255,0.04))] text-cyan-100 ring-1 ring-cyan-300/25 ring-inset">
        <div className="absolute inset-[6px] rounded-[12px] border border-white/10" />
        <Orbit className="relative h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-[0.26em] text-white uppercase">
          AgentOS
        </p>
        <p className="text-xs text-white/40">Adaptive control plane</p>
      </div>
    </Link>
  );
}
