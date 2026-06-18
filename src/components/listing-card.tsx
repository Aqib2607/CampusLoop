import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useFavoriteStore } from "@/stores";
import type { Listing } from "@/lib/mock-data";

export function ListingCard({ listing }: { listing: Listing }) {
  const { has, toggle } = useFavoriteStore();
  const fav = has(listing.id);
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to="/listings/$id"
        params={{ id: listing.id }}
        className="group block overflow-hidden rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={listing.image}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button
            onClick={(e) => { e.preventDefault(); toggle(listing.id); }}
            className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 backdrop-blur shadow-sm hover:scale-110 transition-transform"
            aria-label="Save"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>
          <Badge variant="secondary" className="absolute top-3 left-3 bg-card/90 backdrop-blur">
            {listing.condition}
          </Badge>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate">{listing.title}</h3>
            <div className="text-base font-bold text-primary shrink-0">${listing.price}</div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="capitalize">{listing.category}</span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {listing.seller.rating}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
