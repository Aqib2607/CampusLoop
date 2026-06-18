import { createFileRoute } from "@tanstack/react-router";
import { Package, MessageSquare, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useListingStore } from "@/stores";

export const Route = createFileRoute("/dashboard/")({ component: Overview });

function Overview() {
  const listings = useListingStore((s) => s.listings).slice(0, 5);
  const stats = [
    { label: "Active Listings", value: 12, icon: Package, color: "text-primary bg-accent" },
    { label: "Sold", value: 38, icon: TrendingUp, color: "text-success bg-success/10" },
    { label: "Messages", value: 6, icon: MessageSquare, color: "text-warning bg-warning/10" },
    { label: "Reviews", value: "4.9", icon: Star, color: "text-warning bg-warning/10" },
  ];
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Jordan 👋</h1>
      <p className="text-muted-foreground mt-1">Here's what's happening with your listings today.</p>
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
      <div className="mt-8 rounded-2xl bg-card border border-border p-5">
        <div className="font-semibold mb-4">Recent listings</div>
        <div className="space-y-3">
          {listings.map((l) => (
            <div key={l.id} className="flex items-center gap-3">
              <img src={l.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{l.title}</div>
                <div className="text-xs text-muted-foreground">${l.price} · {l.condition}</div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
