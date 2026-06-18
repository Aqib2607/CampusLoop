import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { useFavoriteStore, useListingStore } from "@/stores";

export const Route = createFileRoute("/favorites")({ component: FavoritesPage });

function FavoritesPage() {
  const ids = useFavoriteStore((s) => s.ids);
  const listings = useListingStore((s) => s.listings).filter((l) => ids.includes(l.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-7 w-7 text-destructive fill-destructive" />
        <h1 className="text-2xl md:text-3xl font-bold">Favorites</h1>
        <span className="ml-auto text-sm text-muted-foreground">{listings.length} items</span>
      </div>
      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <div className="font-semibold">No favorites yet</div>
          <p className="text-sm text-muted-foreground mt-1">Tap the heart on any listing to save it here.</p>
          <Link to="/listings"><Button className="mt-5">Browse listings</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
