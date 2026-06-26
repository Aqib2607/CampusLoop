import React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  badge,
  className,
  size = "md",
  animate = true,
}: PageHeaderProps) {
  const titleSizes = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
  };

  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: [0, 0, 0.2, 1] as const },
      }
    : {};

  return (
    <Wrapper className={cn("mb-6", className)} {...(wrapperProps as object)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3"
        >
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.label}>
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 opacity-50" />}
              {crumb.href && i < breadcrumbs.length - 1 ? (
                <Link
                  to={crumb.href}
                  className="hover:text-foreground transition-colors capitalize"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "capitalize truncate max-w-[160px]",
                    i === breadcrumbs.length - 1 && "text-foreground font-medium",
                  )}
                >
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1
              className={cn(
                "font-bold tracking-tight text-foreground leading-tight",
                titleSizes[size],
              )}
            >
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </Wrapper>
  );
}
