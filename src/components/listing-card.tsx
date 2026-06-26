import React from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Badge, getConditionVariant } from "@/components/ui/badge";
import { useFavoriteStore } from "@/stores";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

export const ListingCard = React.memo(function ListingCard({ listing }: { listing: Listing }) {
  const fav = useFavoriteStore((state) => state.has(listing.id));
  const toggle = useFavoriteStore((state) => state.toggle);

  const imageSrc =
    listing.images && listing.images.length > 0 ? listing.images[0].url : FALLBACK_IMAGE;

  const conditionLabel = listing.condition?.replace("_", " ") ?? "Unknown";

  return (
    <div className="group h-full">
      <Link
        to="/listings/$id"
        params={{ id: listing.id.toString() }}
        className="block h-full overflow-hidden rounded-[var(--radius-2xl)] bg-card border border-border shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-3)] hover:border-primary/40 transition-all duration-300"
        aria-label={`View ${listing.title} — $${listing.price}`}
      >
        {/* Image Area */}
        <div className="relative overflow-hidden bg-muted aspect-[4/3]">
          <img
            src={imageSrc}
            alt={listing.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-[image:var(--gradient-card-hover)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Condition badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant={getConditionVariant(listing.condition)}
              size="sm"
              className="capitalize shadow-sm backdrop-blur-md bg-background/90"
            >
              {conditionLabel}
            </Badge>
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(listing.id);
            }}
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-md shadow-sm hover:scale-110 hover:bg-background transition-all duration-200 border border-border/50"
            aria-label={fav ? `Remove ${listing.title} from saved` : `Save ${listing.title}`}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                fav ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-rose-500",
              )}
            />
          </button>

          {/* Tags */}
          <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
            {listing.negotiable && (
              <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-white shadow-sm">
                OBO
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 relative bg-card group-hover:bg-muted/10 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-primary capitalize">
              {listing.category?.name ?? "General"}
            </div>
          </div>

          <h3 className="font-bold text-base leading-tight line-clamp-2 text-foreground mb-3 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-end justify-between mt-auto">
            <div className="text-xl font-black text-foreground">
              ${Number(listing.price).toLocaleString()}
            </div>

            {/* Seller micro-profile */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                <span className="truncate max-w-[100px]">
                  {listing.user?.name ?? "Verified Student"}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span className="text-[10px] font-bold text-muted-foreground">5.0</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});
