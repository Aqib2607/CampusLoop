import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ListingCard } from "@/components/listing-card";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { useFavoriteStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";

export const Route = createFileRoute("/favorites")({ component: FavoritesPage });

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariant: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
};

function FavoritesPage() {
  const ids = useFavoriteStore((s) => s.ids);

  const { data: listingsData, isPending } = useQuery({
    queryKey: ["listings", "all"],
    queryFn: () => listingService.getListings({ page: 1 }),
  });

  const listings = (listingsData?.data ?? []).filter((l) => ids.includes(l.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader
        title="Saved Listings"
        subtitle="Your bookmarked items — ready when you are."
        animate
        badge={
          listings.length > 0 ? (
            <Badge variant="secondary" size="lg">
              {listings.length} {listings.length === 1 ? "item" : "items"}
            </Badge>
          ) : undefined
        }
      />

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50">
          <EmptyState
            variant="favorites"
            action={{ label: "Browse listings", href: "/listings" }}
          />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {listings.map((l) => (
            <motion.div key={l.id} variants={cardVariant}>
              <ListingCard listing={l} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
