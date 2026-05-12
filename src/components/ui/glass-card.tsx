import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: "cyan" | "emerald" | "violet" | "none";
};

const glowStyles = {
  cyan: "before:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_60%)]",
  emerald:
    "before:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_60%)]",
  violet:
    "before:bg-[radial-gradient(circle_at_top,rgba(192,132,252,0.14),transparent_60%)]",
  none: "before:bg-transparent",
};

export function GlassCard({
  className,
  glow = "cyan",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "panel-sheen relative isolate overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(14,18,30,0.9),rgba(10,14,24,0.84))] shadow-[0_18px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl transition duration-200 will-change-transform hover:-translate-y-[1px] hover:border-white/10 hover:shadow-[0_24px_70px_rgba(2,6,23,0.34)] before:pointer-events-none before:absolute before:inset-0 before:opacity-55 after:pointer-events-none after:absolute after:inset-[1px] after:rounded-[28px] after:border after:border-white/5 after:[mask-image:linear-gradient(180deg,black,transparent_55%)]",
        glowStyles[glow],
        className,
      )}
      {...props}
    />
  );
}
