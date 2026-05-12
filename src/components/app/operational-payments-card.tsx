"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, Play, Plus, ShieldCheck, Waves, X } from "lucide-react";
import { useMemo, useState } from "react";
import { payoutTemplates } from "@/features/treasury/constants";
import { useTreasuryPlatform } from "@/features/treasury/hooks";
import { PayoutDraft, SimulatedPaymentStatus } from "@/features/treasury/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

type ExecutionStep = {
  status: SimulatedPaymentStatus;
  approvalState: string;
  title: string;
};

const executionSteps: ExecutionStep[] = [
  {
    status: "queued",
    approvalState: "Queued for treasury review",
    title: "Queued",
  },
  {
    status: "awaiting approval",
    approvalState: "Operator approval threshold satisfied",
    title: "Awaiting approval",
  },
  {
    status: "routing",
    approvalState: "Routing path validated",
    title: "Routing",
  },
  {
    status: "executing",
    approvalState: "Execution dispatched to Solana Devnet",
    title: "Executing",
  },
  {
    status: "completed",
    approvalState: "Execution settled successfully",
    title: "Completed",
  },
];

function statusVariant(status: SimulatedPaymentStatus) {
  if (status === "completed") return "emerald";
  if (status === "failed") return "violet";
  return "cyan";
}

export function OperationalPaymentsCard() {
  const {
    snapshot,
    simulatedPayments,
    createSimulatedPayment,
    updateSimulatedPayment,
    addNotification,
  } = useTreasuryPlatform();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PayoutDraft>(
    payoutTemplates[0],
  );
  const [recipient, setRecipient] = useState(payoutTemplates[0].recipient);
  const [amountUsd, setAmountUsd] = useState(String(payoutTemplates[0].amountUsd));
  const [rail, setRail] = useState(payoutTemplates[0].rail);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedAmount = Number(amountUsd);
  const availableBalance = snapshot?.totalBalanceUsd ?? 0;
  const amountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const balanceValid = parsedAmount <= availableBalance;

  const canSubmit = amountValid && balanceValid && recipient.trim() && rail.trim();

  const activePayments = useMemo(() => simulatedPayments.slice(0, 5), [simulatedPayments]);

  function loadTemplate(template: PayoutDraft) {
    setSelectedTemplate(template);
    setRecipient(template.recipient);
    setAmountUsd(String(template.amountUsd));
    setRail(template.rail);
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    setIsSubmitting(true);

    const paymentId = createSimulatedPayment({
      recipient: recipient.trim(),
      amountUsd: parsedAmount,
      rail: rail.trim(),
      status: "queued",
      approvalState: "Queued for treasury review",
    });

    addNotification({
      title: `Payout queued for ${recipient.trim()}`,
      detail: `Prepared ${parsedAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })} through ${rail.trim()}.`,
      tone: "cyan",
    });

    for (const [index, step] of executionSteps.entries()) {
      await new Promise((resolve) => window.setTimeout(resolve, index === 0 ? 280 : 640));
      updateSimulatedPayment(paymentId, step.status, {
        approvalState: step.approvalState,
      });
    }

    addNotification({
      title: `Settlement completed for ${recipient.trim()}`,
      detail: "The simulated payout completed across the treasury routing layer.",
      tone: "emerald",
    });

    setIsSubmitting(false);
    setDialogOpen(false);
  }

  return (
    <GlassCard className="p-5 sm:p-6" glow="cyan">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Operational payout simulation</h2>
          <p className="mt-1 text-sm leading-6 text-white/46">
            Prepare, approve, route, and settle treasury actions through governed payout lanes.
          </p>
        </div>
        <Badge variant="cyan">{simulatedPayments.length} active</Badge>
      </div>

      <div className="grid gap-3">
        {payoutTemplates.map((template) => (
          <div
            key={template.recipient}
            className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4 transition duration-200 hover:border-white/12 hover:bg-white/[0.05]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">{template.recipient}</p>
                <p className="mt-1 text-sm text-white/46">{template.rail}</p>
              </div>
              <p className="text-sm font-medium text-white">
                {template.amountUsd.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                Approval aware
              </span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/40">
                Settlement lane primed
              </span>
            </div>
            <Button variant="secondary" className="mt-4" onClick={() => loadTemplate(template)}>
              <Plus className="h-4 w-4" />
              Simulate payout
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {activePayments.map((payment) => (
          <div
            key={payment.id}
            className="rounded-[20px] border border-white/8 bg-black/10 px-4 py-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">{payment.recipient}</p>
                <p className="mt-1 text-xs text-white/40">{payment.rail}</p>
                <p className="mt-2 text-xs text-white/34">
                  {payment.approvalState} • {payment.transactionId}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <Badge variant={statusVariant(payment.status)}>{payment.status}</Badge>
                <p className="mt-2 text-sm text-white/68">
                  {payment.amountUsd.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <p className="mt-1 text-xs text-white/34">
                  {new Date(payment.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className={
                  payment.status === "completed"
                    ? "h-full w-[92%] rounded-full bg-emerald-300/80"
                    : payment.status === "executing"
                      ? "h-full w-[72%] rounded-full bg-cyan-300/80"
                      : payment.status === "routing"
                        ? "h-full w-[56%] rounded-full bg-cyan-300/70"
                        : payment.status === "awaiting approval"
                          ? "h-full w-[38%] rounded-full bg-violet-300/65"
                          : "h-full w-[22%] rounded-full bg-white/20"
                }
              />
            </div>
          </div>
        ))}
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-[rgba(3,7,16,0.72)] backdrop-blur-md" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-[80] w-[min(520px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2">
            <GlassCard className="p-5 sm:p-6" glow="none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Dialog.Title className="text-lg font-semibold text-white">
                    Simulate treasury payout
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm leading-6 text-white/46">
                    Validate amount, routing lane, and approval readiness before dispatching a simulated settlement.
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-full p-1 text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                    aria-label="Close payout simulation modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[10px] tracking-[0.16em] text-white/32 uppercase">
                    Template
                  </p>
                  <p className="mt-2 text-sm text-white/66">{selectedTemplate.recipient}</p>
                </div>
                <label className="grid gap-2 text-sm text-white/62">
                  Recipient
                  <input
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-white outline-none"
                  />
                </label>
                <label className="grid gap-2 text-sm text-white/62">
                  Amount in USD
                  <input
                    value={amountUsd}
                    onChange={(event) => setAmountUsd(event.target.value)}
                    inputMode="decimal"
                    className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-white outline-none"
                  />
                </label>
                <label className="grid gap-2 text-sm text-white/62">
                  Routing lane
                  <input
                    value={rail}
                    onChange={(event) => setRail(event.target.value)}
                    className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-white outline-none"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] tracking-[0.16em] text-white/32 uppercase">
                    Execution preview
                  </p>
                  <Waves className="h-4 w-4 text-cyan-100" />
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    "Treasury review queued",
                    "Approval chain verified",
                    "Routing simulation active",
                    "Settlement lane reserved",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[14px] border border-white/7 bg-black/10 px-3 py-2 text-sm text-white/56"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                  <p className="text-[10px] tracking-[0.16em] text-white/32 uppercase">
                    Available treasury
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {availableBalance.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                    })}
                  </p>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
                  <p className="text-[10px] tracking-[0.16em] text-white/32 uppercase">
                    Approval route
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/72">
                    <ShieldCheck className="h-4 w-4 text-emerald-200" />
                    Operator threshold enforced
                  </p>
                </div>
              </div>

              {!amountValid ? (
                <p className="mt-4 text-sm text-rose-100/84">
                  Enter a valid payout amount to continue.
                </p>
              ) : !balanceValid ? (
                <p className="mt-4 text-sm text-rose-100/84">
                  Treasury balance is insufficient for this payout simulation.
                </p>
              ) : null}

              <div className="mt-5 flex items-center justify-end gap-3">
                <Dialog.Close asChild>
                  <Button variant="ghost">Cancel</Button>
                </Dialog.Close>
                <Button
                  variant="secondary"
                  disabled={!canSubmit || isSubmitting}
                  onClick={() => void handleSubmit()}
                >
                  {isSubmitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Executing flow" : "Start simulation"}
                </Button>
              </div>
            </GlassCard>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </GlassCard>
  );
}
