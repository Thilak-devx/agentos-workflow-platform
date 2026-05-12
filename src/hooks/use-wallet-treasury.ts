"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createRuntimeEntityId } from "@/lib/react-keys";
import { solanaRpcUrl } from "@/lib/solana";
import { lamportsToSol } from "@/lib/wallet";

type WalletSignature = {
  id: string;
  signature: string;
  slot: number;
  time: string;
  status: "confirmed" | "failed";
};

type WalletReadinessState = {
  label: string;
  status: string;
  tone: "cyan" | "emerald" | "violet";
};

export function useWalletTreasury() {
  const { connection } = useConnection();
  const { publicKey, connected, wallet, disconnect } = useWallet();
  const [balanceSol, setBalanceSol] = useState<number | null>(null);
  const [signatures, setSignatures] = useState<WalletSignature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadWalletState() {
      if (!publicKey || !connected) {
        setBalanceSol(null);
        setSignatures([]);
        setHasError(false);
        return;
      }

      setIsLoading(true);

      try {
        setHasError(false);
        const [balanceLamports, signatureInfos] = await Promise.all([
          connection.getBalance(publicKey),
          connection.getSignaturesForAddress(publicKey, { limit: 6 }),
        ]);

        if (cancelled) return;

        setBalanceSol(lamportsToSol(balanceLamports));
        setSignatures(
          signatureInfos.map((item) => ({
            id: createRuntimeEntityId("wallet-signature"),
            signature: item.signature,
            slot: item.slot,
            time: item.blockTime
              ? new Date(item.blockTime * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Pending",
            status: item.err ? "failed" : "confirmed",
          })),
        );
      } catch {
        if (!cancelled) {
          setBalanceSol(null);
          setSignatures([]);
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadWalletState();

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }
      void loadWalletState();
    }, 20_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [connection, publicKey, connected]);

  const readiness: WalletReadinessState[] = connected
    ? [
        {
          label: "Network verification",
          status: "Devnet verified",
          tone: "emerald",
        },
        {
          label: "Vault activation",
          status: isLoading ? "Initializing lanes" : "Protected rails active",
          tone: isLoading ? "cyan" : "emerald",
        },
        {
          label: "Signature validation",
          status: hasError
            ? "Revalidating signatures"
            : signatures.some((signature) => signature.status === "failed")
              ? "Reviewing one failed signature"
              : "Batch signatures healthy",
          tone: hasError
            ? "violet"
            : signatures.some((signature) => signature.status === "failed")
              ? "violet"
              : "cyan",
        },
        {
          label: "Settlement readiness",
          status:
            balanceSol && balanceSol > 0 ? "Settlement window open" : "Awaiting treasury balance",
          tone: balanceSol && balanceSol > 0 ? "emerald" : "cyan",
        },
      ]
    : [
        {
          label: "Wallet readiness",
          status: "Awaiting connection",
          tone: "violet",
        },
        {
          label: "Protected vaults",
          status: "Dormant until wallet scope",
          tone: "cyan",
        },
        {
          label: "Signature validation",
          status: "Locked behind wallet activation",
          tone: "violet",
        },
        {
          label: "Settlement readiness",
          status: "Preview only",
          tone: "cyan",
        },
      ];

  return {
    address: publicKey?.toBase58() ?? null,
    connected,
    walletName: wallet?.adapter.name ?? "No wallet",
    network:
      solanaRpcUrl.includes("devnet")
        ? "Solana Devnet"
        : solanaRpcUrl.includes("testnet")
          ? "Solana Testnet"
          : "Solana Mainnet",
    balanceSol,
    signatures,
    isLoading,
    hasError,
    readiness,
    disconnect,
  };
}
