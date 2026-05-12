import Link from "next/link";
import { Orbit, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

type AuthShellProps = {
  title: string;
  description: string;
  asideTitle: string;
  asideDescription: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({
  title,
  description,
  asideTitle,
  asideDescription,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="ambient-grid absolute inset-0 opacity-16" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(99,102,241,0.12),transparent_22%),radial-gradient(circle_at_50%_86%,rgba(52,211,153,0.08),transparent_20%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1320px] items-center px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid w-full gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <GlassCard className="flex flex-col justify-between p-7 sm:p-8" glow="violet">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[16px] bg-white/[0.06] text-cyan-100">
                  <Orbit className="h-4 w-4" />
                </div>
                AgentOS
              </Link>

              <Badge variant="cyan" className="mt-6">
                <Sparkles className="h-3.5 w-3.5" />
                Production-grade operator access
              </Badge>

              <h1 className="mt-6 max-w-[14ch] text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/58 sm:text-base">
                {description}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-cyan-100">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{asideTitle}</p>
                    <p className="mt-1 text-sm leading-6 text-white/48">
                      {asideDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Session", "Supabase Auth"],
                  ["Roles", "Owner to Viewer"],
                  ["Treasury", "Wallet-aware access"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[20px] border border-white/8 bg-white/[0.035] px-4 py-3"
                  >
                    <p className="text-[11px] tracking-[0.16em] text-white/34 uppercase">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8" glow="none">
            {children}
            {footer ? <div className="mt-6">{footer}</div> : null}
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
