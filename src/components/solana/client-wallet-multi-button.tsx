"use client";

import dynamic from "next/dynamic";

const WalletCommandCenter = dynamic(
  () =>
    import("@/components/app/wallet-command-center").then(
      (module) => module.WalletCommandCenter,
    ),
  {
    ssr: false,
  },
);

export function ClientWalletMultiButton() {
  return <WalletCommandCenter surface="hero" />;
}
