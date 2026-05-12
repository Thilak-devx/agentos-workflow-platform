"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  LoaderCircle,
  LogOut,
  Wallet2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useWalletTreasury } from "@/hooks/use-wallet-treasury";
import { formatSol, shortenAddress } from "@/lib/wallet";

const INSTALL_LINKS: Record<string, string> = {
  Phantom: "https://phantom.app/download",
  Solflare: "https://solflare.com/download",
};

type WalletCommandCenterProps = {
  surface?: "shell" | "hero";
};

type WalletToast = {
  tone: "success" | "error";
  message: string;
} | null;

function getWalletInstallLabel(walletName: string) {
  if (walletName === "Phantom") return "Install Phantom";
  if (walletName === "Solflare") return "Install Solflare extension";
  return `Install ${walletName}`;
}

function getWalletStatusLabel(readyState: WalletReadyState) {
  return readyState === WalletReadyState.Installed
    ? "Installed"
    : "Not installed";
}

function getWalletStatusTone(readyState: WalletReadyState) {
  return readyState === WalletReadyState.Installed
    ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
    : "border-white/10 bg-white/[0.04] text-white/46";
}

function getErrorMessage(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Wallet connection failed.";

  if (/reject|decline|denied|cancel/i.test(message)) {
    return "Connection request was rejected.";
  }

  if (/not ready|not detected|not found/i.test(message)) {
    return "Wallet extension was not detected.";
  }

  return message;
}

function WalletToastBanner({
  toast,
  onDismiss,
}: {
  toast: WalletToast;
  onDismiss: () => void;
}) {
  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed top-5 right-5 z-[90] w-[min(360px,calc(100vw-24px))]">
      <div
        className={`pointer-events-auto flex items-start gap-3 rounded-[22px] border px-4 py-3 shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl ${
          toast.tone === "success"
            ? "border-emerald-300/18 bg-[rgba(7,18,14,0.92)] text-emerald-50"
            : "border-rose-300/18 bg-[rgba(24,10,14,0.92)] text-rose-50"
        }`}
      >
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            toast.tone === "success" ? "bg-emerald-400/14" : "bg-rose-400/14"
          }`}
        >
          {toast.tone === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
        </div>
        <p className="min-w-0 flex-1 text-sm leading-6">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-1 text-white/60 transition hover:bg-white/[0.06] hover:text-white"
          aria-label="Dismiss wallet message"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function WalletCommandCenter({
  surface = "shell",
}: WalletCommandCenterProps) {
  const {
    wallets,
    wallet,
    select,
    connect,
    connecting,
    disconnect,
    disconnecting,
  } = useWallet();
  const { address, connected, walletName, balanceSol, isLoading } =
    useWalletTreasury();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [requestedWalletName, setRequestedWalletName] =
    useState<WalletName | null>(null);
  const [toast, setToast] = useState<WalletToast>(null);
  const attemptRef = useRef(false);
  const copiedResetRef = useRef<number | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(
    () => () => {
      if (copiedResetRef.current) {
        window.clearTimeout(copiedResetRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (
      !requestedWalletName ||
      !wallet ||
      wallet.adapter.name !== requestedWalletName ||
      connected ||
      connecting ||
      attemptRef.current
    ) {
      return;
    }

    attemptRef.current = true;

    void connect()
      .then(() => {
        setDialogOpen(false);
        setToast({
          tone: "success",
          message: `${requestedWalletName} connected successfully.`,
        });
      })
      .catch((error) => {
        setToast({ tone: "error", message: getErrorMessage(error) });
      })
      .finally(() => {
        attemptRef.current = false;
        setRequestedWalletName(null);
      });
  }, [connect, connected, connecting, requestedWalletName, wallet]);

  async function handleCopyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setToast({ tone: "success", message: "Wallet address copied." });
    if (copiedResetRef.current) {
      window.clearTimeout(copiedResetRef.current);
    }
    copiedResetRef.current = window.setTimeout(() => {
      setCopied(false);
      copiedResetRef.current = null;
    }, 1600);
  }

  async function handleDisconnect() {
    try {
      await disconnect();
      setToast({ tone: "success", message: "Wallet disconnected." });
    } catch (error) {
      setToast({ tone: "error", message: getErrorMessage(error) });
    }
  }

  function handleWalletSelect(targetWalletName: WalletName) {
    const target = wallets.find(
      (item) => item.adapter.name === targetWalletName,
    );
    if (!target) return;

    if (target.readyState !== WalletReadyState.Installed) {
      const href = INSTALL_LINKS[targetWalletName];
      setToast({
        tone: "error",
        message: `${targetWalletName} extension is not installed.`,
      });
      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
      return;
    }

    setRequestedWalletName(targetWalletName);
    select(targetWalletName);
  }

  const pendingLabel = requestedWalletName ?? wallet?.adapter.name ?? "Wallet";
  const buttonClass =
    surface === "hero"
      ? "h-11 px-5 shadow-[var(--shadow-ambient)]"
      : "shadow-[var(--shadow-ambient)]";

  return (
    <>
      <WalletToastBanner toast={toast} onDismiss={() => setToast(null)} />

      {!connected ? (
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger asChild>
            <Button
              className={buttonClass}
              disabled={connecting || disconnecting}
            >
              {connecting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet2 className="h-4 w-4" />
              )}
              {connecting ? `Connecting ${pendingLabel}` : "Connect wallet"}
            </Button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[70] bg-[rgba(3,7,16,0.72)] backdrop-blur-md" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-[80] w-[min(460px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2">
              <GlassCard className="overflow-hidden p-5 sm:p-6" glow="none">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="text-xl font-semibold tracking-[-0.04em] text-white">
                      Connect a wallet
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm leading-6 text-white/52">
                      Choose a wallet provider to enter the AgentOS treasury and
                      execution layer.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-white/54 transition hover:bg-white/[0.06] hover:text-white"
                      aria-label="Close wallet modal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="mt-5 space-y-3">
                  {wallets.map((availableWallet) => {
                    const isInstalled =
                      availableWallet.readyState === WalletReadyState.Installed;
                    const isPending =
                      connecting &&
                      (requestedWalletName === availableWallet.adapter.name ||
                        wallet?.adapter.name === availableWallet.adapter.name);

                    return (
                      <div
                        key={availableWallet.adapter.name}
                        className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05]">
                              <Image
                                src={availableWallet.adapter.icon}
                                alt={availableWallet.adapter.name}
                                width={28}
                                height={28}
                                unoptimized
                                className="h-7 w-7 rounded-md object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">
                                {availableWallet.adapter.name}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[11px] ${getWalletStatusTone(
                                    availableWallet.readyState,
                                  )}`}
                                >
                                  {getWalletStatusLabel(
                                    availableWallet.readyState,
                                  )}
                                </span>
                                {wallet?.adapter.name ===
                                availableWallet.adapter.name ? (
                                  <span className="rounded-full border border-cyan-300/18 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-100">
                                    Selected
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          {isInstalled ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleWalletSelect(availableWallet.adapter.name)
                              }
                              disabled={connecting || disconnecting}
                              className="sm:min-w-[120px]"
                            >
                              {isPending ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              {isPending ? "Connecting" : "Connect"}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                handleWalletSelect(availableWallet.adapter.name)
                              }
                              className="sm:min-w-[170px]"
                            >
                              <ExternalLink className="h-4 w-4" />
                              {getWalletInstallLabel(
                                availableWallet.adapter.name,
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/46">
                  Phantom and Solflare are checked before connection so users
                  stay inside a premium onboarding flow instead of being thrown
                  into external wallet screens unexpectedly.
                </div>
              </GlassCard>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ) : (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex min-w-0 items-center gap-3 rounded-full border border-emerald-300/16 bg-emerald-400/[0.08] px-3 py-2 text-left shadow-[0_16px_44px_rgba(16,185,129,0.12)] transition hover:border-emerald-300/24 hover:bg-emerald-400/[0.12]"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-100">
                <Wallet2 className="h-4 w-4" />
                <span className="absolute right-1.5 bottom-1.5 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-medium text-white">
                  {shortenAddress(address)}
                </p>
                <p className="truncate text-xs text-white/42">
                  {isLoading
                    ? "Refreshing balance"
                    : `${formatSol(balanceSol ?? 0)} SOL / ${walletName}`}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-white/42" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={10}
              align="end"
              className="z-50 w-[320px] rounded-[28px] border border-white/10 bg-[#07111ddd] p-3 shadow-[0_30px_120px_rgba(2,6,23,0.52)] backdrop-blur-2xl"
            >
              <GlassCard className="p-4" glow="none">
                <p className="text-[11px] tracking-[0.12em] text-white/34 uppercase">
                  Connected wallet
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {shortenAddress(address)}
                </p>
                <p className="mt-2 text-sm text-white/48">{walletName}</p>
                <p className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-white">
                  {formatSol(balanceSol ?? 0)} SOL
                </p>
                <p className="mt-2 text-xs text-white/36">
                  Connected treasury rail with live balance sync
                </p>
              </GlassCard>

              <div className="mt-3 space-y-2">
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="flex w-full items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/72 transition outline-none hover:bg-white/[0.08]"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Wallet copied" : "Copy wallet address"}
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link
                    href="/treasury"
                    className="flex w-full items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/72 transition outline-none hover:bg-white/[0.08]"
                  >
                    <Wallet2 className="h-4 w-4" />
                    Open treasury surface
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    onClick={() => void handleDisconnect()}
                    disabled={disconnecting}
                    className="flex w-full items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/72 transition outline-none hover:bg-white/[0.08] disabled:opacity-60"
                  >
                    {disconnecting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    {disconnecting ? "Disconnecting" : "Disconnect wallet"}
                  </button>
                </DropdownMenu.Item>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </>
  );
}
