import { cn } from "@/lib/utils";

type GradientOrbProps = {
  className?: string;
};

export function GradientOrb({ className }: GradientOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl",
        className,
      )}
    />
  );
}
