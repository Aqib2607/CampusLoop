import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Package,
  Search,
  MessageSquare,
  Bell,
  Heart,
  Star,
  FileText,
  Users,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type EmptyStateVariant =
  | "search"
  | "listings"
  | "messages"
  | "notifications"
  | "favorites"
  | "reviews"
  | "reports"
  | "users"
  | "generic";

const variantConfig: Record<
  EmptyStateVariant,
  {
    icon: LucideIcon;
    color: string;
    bg: string;
    defaultTitle: string;
    defaultDesc: string;
  }
> = {
  search: {
    icon: Search,
    color: "text-muted-foreground",
    bg: "bg-muted",
    defaultTitle: "No results found",
    defaultDesc: "Try adjusting your search or filters to find what you're looking for.",
  },
  listings: {
    icon: Package,
    color: "text-primary",
    bg: "bg-primary/10",
    defaultTitle: "No listings yet",
    defaultDesc: "Be the first to list something on CampusLoop.",
  },
  messages: {
    icon: MessageSquare,
    color: "text-primary",
    bg: "bg-primary/10",
    defaultTitle: "No conversations",
    defaultDesc: "Start a conversation by messaging a seller on any listing.",
  },
  notifications: {
    icon: Bell,
    color: "text-warning",
    bg: "bg-warning/10",
    defaultTitle: "You're all caught up!",
    defaultDesc: "No new notifications. We'll alert you when something happens.",
  },
  favorites: {
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    defaultTitle: "No saved listings",
    defaultDesc: "Tap the heart icon on any listing to save it here for later.",
  },
  reviews: {
    icon: Star,
    color: "text-warning",
    bg: "bg-warning/10",
    defaultTitle: "No reviews yet",
    defaultDesc: "Complete a transaction to leave or receive your first review.",
  },
  reports: {
    icon: FileText,
    color: "text-success",
    bg: "bg-success/10",
    defaultTitle: "All clear!",
    defaultDesc: "There are no pending reports to review.",
  },
  users: {
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    defaultTitle: "No users found",
    defaultDesc: "Try adjusting your search or filter criteria.",
  },
  generic: {
    icon: ShoppingBag,
    color: "text-muted-foreground",
    bg: "bg-muted",
    defaultTitle: "Nothing here yet",
    defaultDesc: "Check back later for updates.",
  },
};

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  variant = "generic",
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayTitle = title ?? config.defaultTitle;
  const displayDesc = description ?? config.defaultDesc;

  const iconSizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  const containerSizes = { sm: "h-14 w-14", md: "h-18 w-18", lg: "h-24 w-24" };
  const paddingY = { sm: "py-8", md: "py-12", lg: "py-16" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
      className={cn("flex flex-col items-center text-center", paddingY[size], className)}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className={cn(
          "flex items-center justify-center rounded-2xl mb-5",
          config.bg,
          containerSizes[size],
          "h-20 w-20",
        )}
      >
        <Icon className={cn(config.color, iconSizes[size])} />
      </motion.div>

      <h3 className="text-lg font-semibold text-foreground text-balance">{displayTitle}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs text-balance leading-relaxed">
        {displayDesc}
      </p>

      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link to={action.href}>
              <Button>{action.label}</Button>
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
