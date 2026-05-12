import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: {
    default: "Operator Console",
    template: "%s | AgentOS",
  },
  description:
    "Monitor AI execution, treasury movement, and operational trust from the AgentOS dashboard.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    if (
      user.user_metadata?.onboarding_completed !== true &&
      typeof window === "undefined"
    ) {
      redirect("/onboarding");
    }
  }

  return <AppShell>{children}</AppShell>;
}
