import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentos.app"),
  title: {
    default: "AgentOS",
    template: "%s | AgentOS",
  },
  description:
    "A premium command center for autonomous agents, workflows, and onchain treasury operations.",
  applicationName: "AgentOS",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "AgentOS",
    description:
      "A premium command center for autonomous agents, workflows, and onchain treasury operations.",
    url: "https://agentos.app",
    siteName: "AgentOS",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AgentOS command center preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentOS",
    description:
      "A premium command center for autonomous agents, workflows, and onchain treasury operations.",
    images: ["/opengraph-image"],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="dark h-full antialiased"
    >
      <body className="bg-background text-foreground min-h-full font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
