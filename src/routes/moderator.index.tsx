import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Flag, Sparkles, ShieldAlert, ArrowRight, ShieldHalf } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/moderator/")({ component: ModOverview });

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const quickLinks = [
  {
    label: "Review listing queue",
    to: "/moderator/listings",
    desc: "Approve or reject pending listings",
    icon: Package,
  },
  {
    label: "Handle open reports",
    to: "/moderator/reports",
    desc: "Review flagged content and users",
    icon: Flag,
  },
];

function ModOverview() {
  const cards = [
    {
      label: "Pending Listings",
      value: 24,
      icon: Package,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      delta: "Needs review",
      deltaType: "negative" as const,
    },
    {
      label: "Open Reports",
      value: 12,
      icon: Flag,
      iconColor: "text-destructive",
      iconBg: "bg-destructive/10",
      delta: "Priority",
      deltaType: "negative" as const,
    },
    {
      label: "AI Flags",
      value: 7,
      icon: Sparkles,
      iconColor: "text-warning",
      iconBg: "bg-warning/10",
    },
    {
      label: "User Violations",
      value: 3,
      icon: ShieldAlert,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-50 dark:bg-violet-950/30",
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
              <ShieldHalf className="h-3.5 w-3.5 text-white" /> Moderator Mode
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
              Moderation Desk
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Keep the CampusLoop community safe, trusted, and clean.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-white/20 text-white bg-white/10 px-4 py-2 text-sm font-bold shadow-lg rounded-full backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-success mr-2 animate-pulse" />
              Systems Operational
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {cards.map((c) => (
          <motion.div key={c.label} variants={itemVariants}>
            <StatCard
              label={c.label}
              value={c.value}
              icon={c.icon}
              iconColor={c.iconColor}
              iconBg={c.iconBg}
              delta={c.delta}
              deltaType={c.deltaType}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick action cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-foreground px-1">Moderator Tasks</h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {quickLinks.map((ql) => (
            <Link
              key={ql.to}
              to={ql.to}
              className="group flex items-center justify-between rounded-[var(--radius-2xl)] glass-panel border border-border/50 hover:border-primary/40 p-6 shadow-sm hover:shadow-[var(--shadow-elevation-2)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ql.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {ql.label}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mt-0.5">{ql.desc}</div>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-background/50 border border-border flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all">
                <ArrowRight
                  className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
