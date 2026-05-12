import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents",
};

export default function AgentsRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
