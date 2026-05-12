export function shortenAddress(address?: string | null) {
  if (!address) return "Disconnected";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function lamportsToSol(lamports: number) {
  return lamports / 1_000_000_000;
}

export function formatSol(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(value);
}
