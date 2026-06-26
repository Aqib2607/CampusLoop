import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { StatCard } from "@/components/ui/stat-card";
import { StatCardSkeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Package, MessageSquare, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

const timeRanges = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
];

function AnalyticsPage() {
  const [range, setRange] = useState("30d");

  const { data: statsData, isPending } = useQuery({
    queryKey: ["admin_dashboard"],
    queryFn: () => adminService.getDashboardStats(),
  });

  const stats = statsData?.data;

  const cards = [
    {
      label: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Active Listings",
      value: stats?.listings || 0,
      icon: Package,
      iconColor: "text-success",
      iconBg: "bg-success/10",
    },
    {
      label: "Conversations",
      value: stats?.conversations || 0,
      icon: MessageSquare,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Open Reports",
      value: stats?.open_reports || 0,
      icon: Flag,
      iconColor: "text-destructive",
      iconBg: "bg-destructive/10",
    },
  ];

  const chartData: unknown[] = []; // Not yet supported by backend API

  const tooltipStyle = {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    boxShadow: "var(--shadow-elevation-3)",
    fontSize: 12,
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" subtitle="Platform-wide growth and activity metrics." animate />

      {/* Time range selector */}
      <div className="flex items-center gap-1 self-start">
        {timeRanges.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
              range === r.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : cards.map((c) => (
              <StatCard
                key={c.label}
                label={c.label}
                value={c.value}
                icon={c.icon}
                iconColor={c.iconColor}
                iconBg={c.iconBg}
              />
            ))}
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Chart title="User Growth">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="users"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fill="url(#colorUsers)"
              dot={false}
            />
          </AreaChart>
        </Chart>

        <Chart title="Listing Growth">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="listings"
              stroke="var(--color-success)"
              strokeWidth={2.5}
              fill="url(#colorListings)"
              dot={false}
            />
          </AreaChart>
        </Chart>

        <Chart title="Message Activity">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="messages"
              fill="var(--color-primary)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </Chart>

        <Chart title="Reports Over Time">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="reports"
              fill="var(--color-warning)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </Chart>
      </div>
    </div>
  );
}

function Chart({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-card border border-border shadow-[var(--shadow-elevation-1)] p-5"
    >
      <div className="font-semibold mb-5 text-sm">{title}</div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
