import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Package, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({ component: AdminOverview });

function AdminOverview() {
  const stats = [
    { label: "Total Users", value: "12,438", icon: Users, color: "text-primary bg-accent" },
    { label: "Listings", value: "3,481", icon: Package, color: "text-success bg-success/10" },
    { label: "Messages", value: "184k", icon: MessageSquare, color: "text-warning bg-warning/10" },
    { label: "Reviews", value: "9,712", icon: Star, color: "text-chart-5 bg-chart-5/10" },
  ];
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">Admin Overview</h1>
      <p className="text-muted-foreground mt-1">Platform-wide metrics and shortcuts.</p>
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border p-5">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-2xl font-black">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Link to="/admin/reports" className="rounded-2xl bg-card border border-border p-5 hover:border-primary transition">
          <div className="font-semibold">Open Reports</div>
          <div className="text-3xl font-black mt-1">12</div>
          <Button variant="ghost" size="sm" className="mt-2 -ml-3">Review →</Button>
        </Link>
        <Link to="/admin/api-keys" className="rounded-2xl bg-card border border-border p-5 hover:border-primary transition">
          <div className="font-semibold">API Keys</div>
          <div className="text-3xl font-black mt-1">3</div>
          <Button variant="ghost" size="sm" className="mt-2 -ml-3">Manage →</Button>
        </Link>
        <Link to="/admin/analytics" className="rounded-2xl bg-card border border-border p-5 hover:border-primary transition">
          <div className="font-semibold">Analytics</div>
          <div className="text-3xl font-black mt-1">↑ 18%</div>
          <Button variant="ghost" size="sm" className="mt-2 -ml-3">View →</Button>
        </Link>
      </div>
    </div>
  );
}
