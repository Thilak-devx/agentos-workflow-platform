"use client";

import { CheckCircle2, LoaderCircle, Orbit, ShieldCheck, Sparkles, Wallet2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClientOrNull } from "@/features/platform/supabase";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const steps = [
  {
    title: "Confirm workspace identity",
    detail: "Verify the workspace name, ownership role, and operator profile before enabling command-center access.",
    icon: Orbit,
  },
  {
    title: "Connect treasury controls",
    detail: "Bring wallet-aware treasury routing online once the operator shell is ready.",
    icon: Wallet2,
  },
  {
    title: "Enable governed automation",
    detail: "Finish onboarding to unlock workflow generation, AI insights, and protected dashboard routes.",
    icon: ShieldCheck,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { operator, refresh } = useOperatorSession();
  const [isCompleting, setIsCompleting] = useState(false);

  async function completeOnboarding() {
    const supabase = getSupabaseBrowserClientOrNull();
    if (!supabase) {
      router.push("/dashboard");
      return;
    }

    setIsCompleting(true);

    await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
      },
    });

    await refresh();
    setIsCompleting(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="ambient-grid absolute inset-0 opacity-16" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(56,189,248,0.16),transparent_20%),radial-gradient(circle_at_84%_12%,rgba(99,102,241,0.12),transparent_22%),radial-gradient(circle_at_54%_84%,rgba(52,211,153,0.08),transparent_22%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1180px] items-center px-6 py-10 sm:px-8">
        <GlassCard className="w-full p-7 sm:p-8 lg:p-10" glow="violet">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-cyan-100">
                <Sparkles className="h-4 w-4" />
                Operator onboarding
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                Finish preparing {operator.workspaceName}
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base">
                Confirm your workspace shell, activate the governed operator model, and continue into the protected AgentOS dashboard.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-4">
              <p className="text-[11px] tracking-[0.16em] text-white/34 uppercase">
                Active operator
              </p>
              <p className="mt-2 text-lg font-medium text-white">{operator.fullName}</p>
              <p className="mt-1 text-sm text-white/44">{operator.email}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-[26px] border border-white/8 bg-white/[0.035] p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-cyan-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-lg font-medium text-white">{step.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/50">{step.detail}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-white/8 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-200" />
              <p className="max-w-2xl text-sm leading-6 text-white/56">
                Completing onboarding marks this workspace as ready and unlocks protected routes, AI workflow generation, and live operational controls.
              </p>
            </div>
            <Button onClick={() => void completeOnboarding()} disabled={isCompleting}>
              {isCompleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isCompleting ? "Completing onboarding" : "Enter dashboard"}
            </Button>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
