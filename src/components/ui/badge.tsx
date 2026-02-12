import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        secondary:
          "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
        destructive:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        success:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        warning:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        outline:
          "border border-zinc-200 dark:border-zinc-800",
        // Technology-specific
        react: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
        javascript: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        typescript: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        python: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        nodejs: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
