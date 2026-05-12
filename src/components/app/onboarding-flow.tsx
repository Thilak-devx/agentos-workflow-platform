"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Sparkles } from "lucide-react";
import { onboardingSteps } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useUiStore } from "@/store/ui-store";

export function OnboardingFlow() {
  const onboardingDismissed = useUiStore((state) => state.onboardingDismissed);
  const dismissOnboarding = useUiStore((state) => state.dismissOnboarding);

  if (onboardingDismissed) {
    return null;
  }

  return (
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[#02040db3] backdrop-blur-lg" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(780px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 outline-none">
          <GlassCard className="p-6 sm:p-7" glow="violet">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-400/[0.08] px-3 py-1 text-[11px] tracking-[0.18em] text-cyan-100 uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  Investor-grade onboarding
                </div>
                <Dialog.Title asChild>
                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-white">
                    Start with the three surfaces that make AgentOS click
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p className="mt-3 text-sm leading-7 text-white/56">
                    This onboarding flow is intentionally light. It gives
                    first-time operators the right mental model without slowing
                    down demo or evaluation momentum.
                  </p>
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <Button onClick={dismissOnboarding}>
                  Enter AgentOS
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Dialog.Close>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {onboardingSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[24px] border border-white/8 bg-white/[0.04] p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/12 text-cyan-100">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/52">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
