import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export function SectionShell({
  title,
  items,
  children,
}: {
  title: string;
  items: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid lg:grid-cols-[260px_1fr] gap-8">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[var(--radius-2xl)] border border-border glass-panel overflow-hidden">
          {/* Sidebar header */}
          <div className="px-5 py-4 border-b border-border/50 bg-muted/20">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
              {title}
            </div>
          </div>

          {/* Nav items */}
          <nav
            className="p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto"
            aria-label={`${title} navigation`}
          >
            {items.map((item) => {
              const isActive =
                item.to === pathname ||
                (item.to !== "/" &&
                  pathname.startsWith(item.to) &&
                  (pathname === item.to || pathname[item.to.length] === "/"));

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative flex items-center gap-3 rounded-[var(--radius-xl)] px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isActive
                      ? "text-primary shadow-sm"
                      : "text-foreground hover:bg-muted/80 hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active background indicator */}
                  {isActive && (
                    <motion.div
                      layoutId={`section-nav-bg-${title}`}
                      className="absolute inset-0 rounded-[var(--radius-xl)] bg-background/80 border border-border/50 shadow-sm"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors duration-300",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={cn(
                        "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-sm",
                        isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        className="min-w-0"
      >
        {children}
      </motion.div>
    </div>
  );
}
