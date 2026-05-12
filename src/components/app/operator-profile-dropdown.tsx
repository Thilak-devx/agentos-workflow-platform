"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckCircle2, ChevronDown, LogOut, RefreshCw, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOperatorSession } from "@/components/providers/operator-provider";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlatformActions, usePlatformSnapshot } from "@/features/platform/hooks";
import { getSupabaseBrowserClientOrNull } from "@/features/platform/supabase";
import { useRuntimeStore } from "@/store/runtime-store";

export function OperatorProfileDropdown() {
  const router = useRouter();
  const { operator, isLoading, refresh } = useOperatorSession();
  const platformQuery = usePlatformSnapshot(operator);
  const platformActions = usePlatformActions(operator);
  const pushToast = useRuntimeStore((state) => state.pushToast);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleRefresh() {
    await refresh();
    pushToast({
      title: "Operator session refreshed",
      detail: "Profile and workspace session state were synchronized.",
      tone: "emerald",
    });
  }

  async function handleSwitchWorkspace(workspaceId: string) {
    const target = platformQuery.data?.workspaces.find(
      (workspace) => workspace.id === workspaceId,
    );
    if (!target) return;

    await platformActions.switchWorkspaceMutation.mutateAsync(target);
    await refresh();
    pushToast({
      title: "Workspace switched",
      detail: `Now operating inside ${target.name}.`,
      tone: "cyan",
    });
    router.refresh();
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClientOrNull();
    setIsSigningOut(true);

    try {
      const { error } = (await supabase?.auth.signOut()) ?? { error: null };

      if (error) {
        pushToast({
          title: "Sign-out paused",
          detail: "Operator session could not be closed right now.",
          tone: "violet",
        });
        return;
      }

      pushToast({
        title: "Signed out",
        detail: "Your operator session has been closed securely.",
        tone: "cyan",
      });
      await refresh();
      router.push("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Open operator profile"
          className="group flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 pr-3.5 text-left text-white/70 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/18 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300/40 focus-visible:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold tracking-[0.12em] text-cyan-100 uppercase">
            {operator.avatarLabel}
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-medium text-white">
              {operator.fullName}
            </p>
            <p className="truncate text-xs text-white/38">
              {isLoading ? "Loading session" : operator.workspaceName}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-white/42 transition duration-200 group-hover:text-white/70" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 w-[min(320px,calc(100vw-24px))] rounded-[28px] border border-white/10 bg-[#08111df2] p-3 shadow-[0_26px_110px_rgba(2,6,23,0.5)] backdrop-blur-2xl"
        >
          <GlassCard className="p-4" glow="none">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {operator.fullName}
                </p>
                <p className="mt-1 truncate text-xs text-white/42">
                  {operator.email}
                </p>
              </div>
              <Badge
                variant={operator.sessionState === "authenticated" ? "emerald" : "violet"}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {operator.role}
              </Badge>
            </div>

            <div className="mt-4 rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/32 uppercase">
                Workspace
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                {operator.workspaceName}
              </p>
              <p className="mt-1 text-xs text-white/42">{operator.role}</p>
            </div>

            {platformQuery.data?.workspaces?.length ? (
              <div className="mt-4 rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[11px] tracking-[0.16em] text-white/32 uppercase">
                  Workspaces
                </p>
                <div className="mt-3 space-y-2">
                  {platformQuery.data.workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      type="button"
                      onClick={() => void handleSwitchWorkspace(workspace.id)}
                      className="flex w-full items-center justify-between rounded-[16px] bg-black/10 px-3 py-2.5 text-left text-sm transition hover:bg-white/[0.05]"
                    >
                      <span className="text-white/72">{workspace.name}</span>
                      <span className="text-xs text-white/34">
                        {workspace.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => void handleRefresh()}
                className="flex items-center justify-between rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/68 transition duration-200 hover:bg-white/[0.06] hover:text-white"
              >
                Refresh session
                <RefreshCw className="h-4 w-4" />
              </button>

              <DropdownMenu.Item asChild>
                <Link
                  href="/settings"
                  className="flex items-center justify-between rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/68 outline-none transition duration-200 hover:bg-white/[0.06] hover:text-white focus:bg-white/[0.06] focus:text-white"
                >
                  Open settings
                  <Settings2 className="h-4 w-4" />
                </Link>
              </DropdownMenu.Item>

              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={isSigningOut}
                className="flex items-center justify-between rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/68 transition duration-200 hover:bg-white/[0.06] hover:text-white"
              >
                {isSigningOut ? "Signing out" : "Sign out"}
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </GlassCard>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
