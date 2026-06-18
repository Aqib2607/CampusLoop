import { createFileRoute } from "@tanstack/react-router";
import { Package, MessageSquare, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/dashboard/")({ component: Overview });

function Overview() {
  const user = useAuthStore((s) => s.user);
  const { data: listingsData, isPending } = useQuery({
    queryKey: ["my_listings_preview"],
    queryFn: () => listingService.getListings(), // Using general endpoint for now
  });
  const listings = (listingsData?.data || []).slice(0, 5);

  const stats = [
    { label: "Active Listings", value: 0, icon: Package, color: "text-primary bg-accent" },
    { label: "Sold", value: 0, icon: TrendingUp, color: "text-success bg-success/10" },
    { label: "Messages", value: 0, icon: MessageSquare, color: "text-warning bg-warning/10" },
    { label: "Reviews", value: "0", icon: Star, color: "text-warning bg-warning/10" },
  ];
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name || "Student"} 👋</h1>
      <p className="text-muted-foreground mt-1">
        Here's what's happening with your listings today.
      </p>
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
          {isPending ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))
          ) : (
            listings.map((l) => (
              <div key={l.id} className="flex items-center gap-3">
                <img
                  src={
                    l.images && l.images.length > 0
                      ? l.images[0].image_path
                      : "https://via.placeholder.com/150"
                  }
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    ${l.price} · {l.condition.replace("_", " ")}
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
