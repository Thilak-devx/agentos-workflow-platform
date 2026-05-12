import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-center text-sm leading-tight font-medium transition-all duration-300 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-white/10 bg-[linear-gradient(135deg,rgba(209,250,255,0.96),rgba(125,211,252,0.94),rgba(110,231,183,0.96))] px-5 text-primary-foreground shadow-[0_20px_50px_rgba(56,189,248,0.2)] hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(56,189,248,0.3)]",
        secondary:
          "border border-white/10 bg-white/[0.06] px-5 text-white shadow-[0_16px_44px_rgba(2,6,23,0.22)] hover:-translate-y-0.5 hover:border-cyan-300/24 hover:bg-white/[0.1] hover:shadow-[0_18px_50px_rgba(8,15,30,0.32)]",
        ghost:
          "px-4 text-white/72 hover:bg-white/[0.08] hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
      },
      size: {
        default: "h-11 px-5",
        xl: "h-12 px-6 text-[0.95rem]",
        icon: "h-11 w-11 rounded-2xl",
        sm: "h-9 px-4 text-[0.82rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(!asChild ? { type: type ?? "button" } : {})}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
