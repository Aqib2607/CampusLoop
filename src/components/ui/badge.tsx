import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground border-border",
        destructive: "border-transparent bg-destructive/15 text-destructive",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
        info: "border-transparent bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground",
        premium:
          "border-transparent bg-[image:var(--gradient-primary)] text-white shadow-[var(--shadow-glow-primary)]",
        condition_new:
          "border-transparent bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900",
        condition_like_new:
          "border-transparent bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-900",
        condition_good:
          "border-transparent bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30",
        condition_fair:
          "border-transparent bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
        condition_poor:
          "border-transparent bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900",
        role_admin:
          "border-transparent bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-900",
        role_moderator:
          "border-transparent bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-900",
        role_student: "border-transparent bg-primary/10 text-primary border-primary/20",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[10px] leading-4 tracking-wide uppercase font-bold",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "destructive" && "bg-destructive",
            variant === "info" && "bg-primary",
            !["success", "warning", "destructive", "info"].includes(variant as string) &&
              "bg-current",
          )}
        />
      )}
      {children}
    </div>
  );
}

/** Helper — returns the correct badge variant for a listing condition string */
export function getConditionVariant(condition: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    new: "condition_new",
    like_new: "condition_like_new",
    good: "condition_good",
    fair: "condition_fair",
    poor: "condition_poor",
  };
  return map[condition] ?? "secondary";
}

/** Helper — returns the badge variant for a user role */
export function getRoleVariant(role: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    admin: "role_admin",
    moderator: "role_moderator",
    student: "role_student",
    teacher: "role_student",
    staff: "role_student",
  };
  return map[role] ?? "secondary";
}

export { Badge, badgeVariants };
