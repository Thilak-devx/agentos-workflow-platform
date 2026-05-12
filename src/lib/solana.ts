export const solanaNetwork =
  process.env.NEXT_PUBLIC_SOLANA_NETWORK?.toLowerCase() ?? "devnet";

export const solanaRpcUrl =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
