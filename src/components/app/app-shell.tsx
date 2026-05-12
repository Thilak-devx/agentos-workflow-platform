"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  Bot,
  Clock3,
  Cpu,
  LayoutGrid,
  Menu,
  MonitorPlay,
  Search,
  Settings2,
  Wallet2,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Brand } from "@/components/app/brand";
import { CommandPalette } from "@/components/app/command-palette";
import { NotificationCenter } from "@/components/app/notification-center";
import { OnboardingFlow } from "@/components/app/onboarding-flow";
import { OperatorProfileDropdown } from "@/components/app/operator-profile-dropdown";
import { RuntimeSimulation } from "@/components/app/runtime-simulation";
import { ToastCenter } from "@/components/app/toast-center";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { useRuntimeStore } from "@/store/runtime-store";
import { useUiStore } from "@/store/ui-store";

const WalletCommandCenter = dynamic(
  () =>
    import("@/components/app/wallet-command-center").then(
      (module) => module.WalletCommandCenter,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-11 items-center gap-3 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-left text-sm text-white/46">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-white/50">
          <Wallet2 className="h-4 w-4" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-white/60">Wallet loading</p>
          <p className="text-xs text-white/34">Preparing client session</p>
        </div>
      </div>
    ),
  },
);

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/demo", label: "Demo", icon: MonitorPlay },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/workflows", label: "Workflows", icon: Workflow },
  { href: "/treasury", label: "Treasury", icon: Wallet2 },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Command Center",
    subtitle:
      "Monitor autonomous execution, treasury state, and live reasoning.",
  },
  "/demo": {
    title: "Demo Mode",
    subtitle:
      "Presentation-grade simulation for autonomous organization storytelling.",
  },
  "/agents": {
    title: "AI Fleet",
    subtitle:
      "Direct autonomous workers with memory, telemetry, and role clarity.",
  },
  "/workflows": {
    title: "Workflow Studio",
    subtitle: "Generate, monitor, and orchestrate operational systems with AI.",
  },
  "/treasury": {
    title: "Treasury Layer",
    subtitle: "Run programmable finance as part of the operating system.",
  },
  "/settings": {
    title: "System Controls",
    subtitle: "Tune trust, shortcuts, credentials, and operator ergonomics.",
  },
};

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setCommandPaletteOpen } = useUiStore();
  const currentTimeLabel = useRuntimeStore((state) => state.currentTimeLabel);
  const systemStatus = useRuntimeStore((state) => state.systemStatus);
  const agentOnlineCount = useRuntimeStore((state) => state.agentOnlineCount);
  const activeRoute = useRuntimeStore((state) => state.activeRoute);
  const setActiveRoute = useRuntimeStore((state) => state.setActiveRoute);
  const addRecentAction = useRuntimeStore((state) => state.addRecentAction);

  const currentNavPath = useMemo(
    () => pathname ?? activeRoute ?? "/dashboard",
    [activeRoute, pathname],
  );
  const page = pageMeta[currentNavPath] ?? pageMeta["/dashboard"];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    setActiveRoute(pathname);
    addRecentAction({
      label: page.title,
      href: pathname,
      kind: "route",
    });
  }, [addRecentAction, page.title, pathname, setActiveRoute]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingSurface =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (event.key === "/" && !isTypingSurface) {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }

      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCommandPaletteOpen]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CommandPalette />
      <OnboardingFlow />
      <RuntimeSimulation />
      <ToastCenter />
      <div className="ambient-grid absolute inset-0 opacity-14" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.04),transparent_18%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.08),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.08),transparent_20%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1580px] gap-4 overflow-x-clip px-3 py-3 sm:px-5 lg:px-6">
        <aside className="hidden w-[248px] shrink-0 lg:block">
          <GlassCard
            glow="none"
            className="sticky top-3 flex h-[calc(100vh-1.5rem)] flex-col p-4"
          >
            <Brand />

            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="mt-5 flex items-center justify-between rounded-[20px] border border-white/8 bg-white/[0.03] px-3 py-3 text-left transition hover:border-white/12 hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-white/70">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Command</p>
                  <p className="text-xs text-white/40">Jump anywhere</p>
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] tracking-[0.16em] text-white/38 uppercase">
                Cmd K
              </div>
            </button>

            <nav className="mt-5 space-y-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = currentNavPath === item.href;

                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                        active
                          ? "bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                          : "text-white/58 hover:bg-white/[0.04] hover:text-white",
                      )}
                    >
                      {active ? (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 rounded-2xl border border-white/8 bg-[linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]"
                        />
                      ) : null}
                      <div className="relative z-10 flex min-w-0 items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-xl transition",
                            active
                              ? "bg-white/[0.06] text-white"
                              : "bg-transparent text-white/56 group-hover:bg-white/[0.04] group-hover:text-white/88",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="min-w-0 break-words">
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </GlassCard>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <GlassCard
            glow="none"
            className="sticky top-3 z-20 px-4 py-3 sm:px-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMenuOpen((value) => !value)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="lg:hidden">
                  <Brand />
                </div>
                <button
                  type="button"
                  onClick={() => setCommandPaletteOpen(true)}
                  className="hidden items-center gap-3 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white/50 transition hover:border-white/12 hover:text-white md:flex"
                >
                  <Search className="h-4 w-4" />
                  Search command palette
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] tracking-[0.16em] uppercase">
                    Cmd K
                  </span>
                </button>
              </div>

              <div className="flex min-w-0 flex-wrap items-center justify-end gap-3 self-end lg:self-auto">
                <div className="hidden min-w-0 xl:block">
                  <p className="truncate text-sm font-medium text-white">
                    {page.title}
                  </p>
                  <p className="truncate text-xs text-white/42">
                    {page.subtitle}
                  </p>
                </div>
                <div className="hidden items-center gap-3 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-white/46 xl:flex">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5 text-cyan-200" />
                    {agentOnlineCount} agents online
                  </div>
                  <span className="h-3 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-3.5 w-3.5 text-cyan-200" />
                    {mounted ? currentTimeLabel : "--:--:--"}
                  </div>
                  <span className="h-3 w-px bg-white/10" />
                  <span>{systemStatus}</span>
                </div>
                <NotificationCenter />
                <OperatorProfileDropdown />
                <WalletCommandCenter />
              </div>
            </div>

            {menuOpen ? (
              <div className="mt-4 grid gap-2 lg:hidden">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                        currentNavPath === item.href
                          ? "bg-white/[0.06] text-white"
                          : "text-white/58 hover:bg-white/[0.04] hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="min-w-0 break-words">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </GlassCard>

          <div className="min-w-0 flex-1 pb-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentNavPath}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="min-w-0"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
