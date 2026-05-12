import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflows",
};

export default function WorkflowsRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
