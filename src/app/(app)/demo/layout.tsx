import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Mode",
};

export default function DemoRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
