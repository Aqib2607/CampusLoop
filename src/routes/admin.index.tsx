import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Package,
  MessageSquare,
  Flag,
  ArrowRight,
  BarChart3,
  Key,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { StatCardSkeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/")({ component: AdminOverview });

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function AdminOverview() {
  const { data: statsData, isPending } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => adminService.getDashboardStats(),
  });

  const rawStats = statsData?.data;

  const stats = [
    {
      label: "Total Users",
      value: rawStats?.users || 0,
      icon: Users,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      delta: "+0%",
      deltaType: "neutral" as const,
    },
    {
      label: "Active Listings",
      value: rawStats?.listings || 0,
      icon: Package,
      iconColor: "text-success",
      iconBg: "bg-success/10",
      delta: "+0%",
      deltaType: "neutral" as const,
    },
    {
      label: "Conversations",
      value: rawStats?.conversations || 0,
      icon: MessageSquare,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Open Reports",
      value: rawStats?.open_reports || 0,
      icon: Flag,
      iconColor: "text-destructive",
      iconBg: "bg-destructive/10",
      delta: rawStats?.open_reports ? "Needs review" : undefined,
      deltaType: rawStats?.open_reports ? ("negative" as const) : undefined,
    },
  ];

  const quickActions = [
    {
      title: "Open Reports",
      value: rawStats?.open_reports || 0,
      desc: "Requires immediate attention",
      to: "/admin/reports",
      icon: Flag,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20 hover:border-destructive/50",
    },
    {
      title: "Manage API Keys",
      value: "Rotate",
      desc: "Monitor AI moderation keys",
      to: "/admin/api-keys",
      icon: Key,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
      border: "border-border hover:border-violet-400/50",
    },
    {
      title: "Analytics",
      value: "View",
      desc: "Platform-wide growth charts",
      to: "/admin/analytics",
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-border hover:border-primary/40",
    },
  ];

  return (
    <div className="space-y-10 pb-8">
      {/* Immersive Header */}
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
              <ShieldCheck className="h-3.5 w-3.5 text-white" /> Administrator Mode
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
              System Overview
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Monitor platform metrics, handle reports, and manage settings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-white/20 text-white bg-white/10 px-4 py-2 text-sm font-bold shadow-lg rounded-full backdrop-blur-md"
            >
              v2.4.1 Stable
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* KPI stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <StatCardSkeleton />
              </motion.div>
            ))
          : stats.map((s) => (
              <motion.div key={s.label} variants={itemVariants}>
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
      </motion.div>

      {/* Quick action cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-foreground px-1">Quick Actions</h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className={`group flex flex-col rounded-[var(--radius-2xl)] glass-panel border ${action.border} p-6 shadow-sm hover:shadow-[var(--shadow-elevation-2)] transition-all duration-300`}
              aria-label={action.title}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-[var(--radius-xl)] ${action.bg} shadow-inner`}
                >
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div className="h-8 w-8 rounded-full bg-background/50 border border-border flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all">
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                {action.title}
              </div>
              <div className="text-3xl font-black mt-2 text-foreground group-hover:text-primary transition-colors">
                {typeof action.value === "number" ? action.value.toLocaleString() : action.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-2">{action.desc}</div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
