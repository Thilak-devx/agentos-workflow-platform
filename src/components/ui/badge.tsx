import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl",
  {
    variants: {
      variant: {
        cyan: "border-cyan-400/18 bg-cyan-400/10 text-cyan-100",
        emerald: "border-emerald-400/18 bg-emerald-400/10 text-emerald-100",
        violet: "border-fuchsia-400/16 bg-fuchsia-400/10 text-fuchsia-100",
      },
    },
    defaultVariants: {
      variant: "cyan",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
