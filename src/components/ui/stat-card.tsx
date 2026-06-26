import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  prefix?: string;
  suffix?: string;
  animate?: boolean;
  className?: string;
  description?: string;
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = prefix + Math.round(v).toLocaleString() + suffix;
      }
    });
    return unsubscribe;
  }, [spring, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  prefix = "",
  suffix = "",
  animate = true,
  className,
  description,
}: StatCardProps) {
  const DeltaIcon =
    deltaType === "positive" ? TrendingUp : deltaType === "negative" ? TrendingDown : Minus;

  const deltaColorClass =
    deltaType === "positive"
      ? "text-success"
      : deltaType === "negative"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      className={cn(
        "relative rounded-2xl border border-border bg-card p-5 overflow-hidden",
        "shadow-[var(--shadow-elevation-1)]",
        "transition-all duration-200 hover:shadow-[var(--shadow-elevation-2)] hover:-translate-y-0.5",
        className,
      )}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <div
          className={cn("flex h-11 w-11 items-center justify-center rounded-xl shrink-0", iconBg)}
        >
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>

        {delta && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              deltaType === "positive" && "bg-success/10 text-success",
              deltaType === "negative" && "bg-destructive/10 text-destructive",
              deltaType === "neutral" && "bg-muted text-muted-foreground",
            )}
          >
            <DeltaIcon className="h-3 w-3" />
            {delta}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl font-black tracking-tight text-foreground">
          {animate && typeof value === "number" ? (
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          ) : (
            <span>
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value}
              {suffix}
            </span>
          )}
        </div>
        <div className="mt-1 text-sm text-muted-foreground font-medium">{label}</div>
        {description && (
          <div className="mt-0.5 text-xs text-muted-foreground/70">{description}</div>
        )}
      </div>
    </motion.div>
  );
}
