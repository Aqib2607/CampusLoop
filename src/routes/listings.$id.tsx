import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageSquare, Flag, Star, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavoriteStore, useListingStore } from "@/stores";
import { toast } from "sonner";

export const Route = createFileRoute("/listings/$id")({
  component: ListingDetail,
  notFoundComponent: () => <div className="p-10 text-center">Listing not found.</div>,
});

function ListingDetail() {
  const { id } = Route.useParams();
  const listing = useListingStore((s) => s.listings.find((l) => l.id === id));
  const { has, toggle } = useFavoriteStore();
  const [active, setActive] = useState(0);
  if (!listing) throw notFound();
  const gallery = listing.images || [listing.image];
  const fav = has(listing.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="text-sm text-muted-foreground mb-4">
        <Link to="/listings" className="hover:text-foreground">Listings</Link> / <span className="capitalize">{listing.category}</span>
      </div>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-card border border-border">
            <img src={gallery[active]} alt={listing.title} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setActive(i)} className={`aspect-square overflow-hidden rounded-lg border-2 ${active === i ? "border-primary" : "border-border"}`}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="secondary" className="mb-2">{listing.condition}</Badge>
                <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
              </div>
              <button onClick={() => toggle(listing.id)} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted">
                <Heart className={`h-5 w-5 ${fav ? "fill-destructive text-destructive" : ""}`} />
              </button>
            </div>
            <div className="mt-4 text-4xl font-black text-primary">${listing.price}</div>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="capitalize">📦 {listing.category}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> On campus</span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-foreground/80">{listing.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Link to="/messages">
                <Button className="w-full gap-2"><MessageSquare className="h-4 w-4" />Chat seller</Button>
              </Link>
              <Button variant="outline" className="gap-2" onClick={() => { toggle(listing.id); toast.success(fav ? "Removed from favorites" : "Saved!"); }}>
                <Heart className="h-4 w-4" />{fav ? "Saved" : "Save"}
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="mt-2 w-full gap-2 text-muted-foreground" onClick={() => toast("Report submitted")}>
              <Flag className="h-4 w-4" />Report listing
            </Button>
          </div>

          {/* Seller */}
          <div className="mt-4 rounded-2xl bg-card border border-border p-6">
            <div className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Seller</div>
            <div className="flex items-center gap-3">
              <img src={listing.seller.avatar} alt="" className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <div className="font-semibold">{listing.seller.name}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {listing.seller.rating} · 42 sales
                </div>
              </div>
              <Shield className="h-5 w-5 text-success" />
            </div>
            <Button variant="outline" className="w-full mt-4">View profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
