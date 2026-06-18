import { createFileRoute } from "@tanstack/react-router";
import { Package, Flag, Sparkles, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/moderator/")({ component: ModOverview });

function ModOverview() {
  const cards = [
    { label: "Pending Listings", value: 24, icon: Package, color: "text-primary bg-accent" },
    { label: "Open Reports", value: 12, icon: Flag, color: "text-destructive bg-destructive/10" },
    { label: "AI Flags", value: 7, icon: Sparkles, color: "text-warning bg-warning/10" },
    { label: "User Violations", value: 3, icon: ShieldAlert, color: "text-chart-5 bg-chart-5/10" },
  ];
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">Moderator Overview</h1>
      <p className="text-muted-foreground mt-1">Keep the community safe.</p>
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border p-5">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-2xl font-black">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
