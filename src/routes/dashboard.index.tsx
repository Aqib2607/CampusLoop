import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  MessageSquare,
  Star,
  TrendingUp,
  Plus,
  ArrowRight,
  Heart,
  Bell,
  Settings,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuthStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/dashboard/")({ component: Overview });

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23f1f5f9'/%3E%3C/svg%3E";

function Overview() {
  const user = useAuthStore((s) => s.user);
  const { data: listingsData, isPending } = useQuery({
    queryKey: ["my_listings_preview"],
    queryFn: () => listingService.getListings(),
  });
  const listings = (listingsData?.data || []).slice(0, 5);

  const stats = [
    {
      label: "Active Listings",
      value: listings.length,
      icon: Package,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Total Sold",
      value: 0,
      icon: TrendingUp,
      iconColor: "text-success",
      iconBg: "bg-success/10",
      delta: "+0%",
      deltaType: "neutral" as const,
    },
    {
      label: "Unread Messages",
      value: 0,
      icon: MessageSquare,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Profile Views",
      value: 124,
      icon: Activity,
      iconColor: "text-warning",
      iconBg: "bg-warning/10",
      delta: "+12%",
      deltaType: "positive" as const,
    },
  ];

  return (
    <div className="space-y-10 pb-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="relative overflow-hidden rounded-[var(--radius-2xl)] bg-foreground text-background p-8 lg:p-10 shadow-[var(--shadow-elevation-3)]"
      >
        <div className="absolute inset-0 bg-[image:var(--gradient-primary)] opacity-20 mix-blend-multiply" />
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/40 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white mb-4 border border-white/20">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" /> 5.0 Seller Rating
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
              Welcome back, {user?.name?.split(" ")[0] || "Student"} 👋
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Here's what's happening with your campus listings today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/dashboard/listings">
              <Button
                size="lg"
                className="rounded-full bg-white text-primary hover:bg-white/90 font-bold shadow-lg gap-2"
              >
                <Plus className="h-4 w-4" /> New Listing
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions (Floating Glass Nav) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="glass-panel p-2 rounded-[var(--radius-xl)] inline-flex flex-wrap gap-2 shadow-sm"
      >
        <Link to="/messages">
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4" /> Messages
          </Button>
        </Link>
        <Link to="/favorites">
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground"
          >
            <Heart className="h-4 w-4" /> Saved Items
          </Button>
        </Link>
        <Link to="/notifications">
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" /> Alerts
          </Button>
        </Link>
        <Link to="/dashboard/settings">
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 rounded-lg font-semibold text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4" /> Settings
          </Button>
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
          >
            <StatCard
              label={s.label}
              value={s.value}
              icon={s.icon}
              iconColor={s.iconColor}
              iconBg={s.iconBg}
              delta={s.delta}
              deltaType={s.deltaType}
            />
          </motion.div>
        ))}
      </div>

      {/* Recent Listings */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="glass-panel rounded-[var(--radius-2xl)] border border-border shadow-[var(--shadow-elevation-1)] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-muted/20">
          <div className="font-bold text-lg text-foreground">Recent Listings</div>
          <Link to="/dashboard/listings">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-primary font-bold hover:bg-primary/10 rounded-full"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-border/50">
          {isPending ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-5">
                <Skeleton className="h-14 w-14 rounded-[var(--radius-xl)] shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3 rounded-md" />
                  <Skeleton className="h-3 w-1/4 rounded-md" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))
          ) : listings.length === 0 ? (
            <div className="py-12">
              <EmptyState
                variant="listings"
                size="sm"
                action={{ label: "Create first listing", href: "/dashboard/listings" }}
              />
            </div>
          ) : (
            listings.map((l) => (
              <Link
                key={l.id}
                to="/listings/$id"
                params={{ id: l.id.toString() }}
                className="flex items-center gap-4 p-5 hover:bg-muted/30 transition-colors group"
              >
                <div className="relative overflow-hidden rounded-[var(--radius-xl)] h-14 w-14 shrink-0 border border-border/50 shadow-sm">
                  <img
                    src={l.images?.[0]?.url ?? FALLBACK_IMAGE}
                    alt=""
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate text-base text-foreground group-hover:text-primary transition-colors">
                    {l.title}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize mt-1 font-medium flex items-center gap-1.5">
                    <span className="text-foreground font-bold">${l.price}</span>
                    <span>•</span>
                    <span>{l.condition.replace("_", " ")}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(l.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <Badge variant="success" dot size="sm" className="hidden sm:inline-flex shadow-sm">
                  Active
                </Badge>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
