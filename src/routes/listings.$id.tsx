import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  MessageSquare,
  Flag,
  Star,
  Shield,
  MapPin,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Package,
  CheckCircle2,
  Clock,
  ZoomIn,
  ArrowLeft,
  Store,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge, getConditionVariant } from "@/components/ui/badge";
import { useFavoriteStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";
import { toast } from "sonner";
import { ListingCardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { ListingCard } from "@/components/listing-card";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

export const Route = createFileRoute("/listings/$id")({
  component: ListingDetail,
});

function ListingDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => {
      const numericId = parseInt(id, 10);
      return listingService.getListing(numericId);
    },
    enabled: !!id,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["listings", "related", data?.data?.category?.id],
    queryFn: () =>
      listingService.getListings({
        category: data?.data?.category?.id,
        page: 1,
      }),
    enabled: !!data?.data?.category?.id,
  });

  const listing = data?.data;
  const relatedListings = relatedData?.data?.filter((l) => l.id !== listing?.id)?.slice(0, 4) || [];

  const { has, toggle } = useFavoriteStore();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-24 w-24 items-center justify-center rounded-[var(--radius-3xl)] bg-destructive/10 border border-destructive/20 shadow-lg"
        >
          <Package className="h-10 w-10 text-destructive" />
        </motion.div>
        <div className="text-center max-w-sm">
          <h2 className="text-3xl font-black text-foreground mb-2">Listing not found</h2>
          <p className="text-muted-foreground font-medium">
            This listing may have been removed by the seller or is no longer available.
          </p>
        </div>
        <div className="flex gap-4 mt-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.history.back()}
            className="rounded-full shadow-sm font-bold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Go back
          </Button>
          <Link to="/listings">
            <Button size="lg" className="rounded-full shadow-sm font-bold">
              Browse marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !listing) {
    return <LoadingSkeleton />;
  }

  const images =
    listing.images && listing.images.length > 0
      ? listing.images.map((img) => img.url)
      : [FALLBACK_IMAGE];

  const isFavorite = has(listing.id);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: listing.title,
        text: listing.description?.substring(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground mb-10"
          aria-label="Breadcrumb"
        >
          <Link
            to="/listings"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Store className="h-4 w-4" /> Marketplace
          </Link>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <span className="capitalize">{listing.category?.name ?? "Uncategorized"}</span>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <span className="text-foreground truncate max-w-[200px]">{listing.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16">
          {/* ─── Left column: Media & Details ─── */}
          <div className="space-y-10">
            {/* Premium Image Gallery */}
            <ImageGallery
              images={images}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
              onFullscreen={() => setFullscreen(true)}
              title={listing.title}
            />

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-foreground">About this item</h2>
              <div className="glass-panel rounded-[var(--radius-2xl)] p-6 md:p-8 shadow-sm">
                <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-line font-medium">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Details grid */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-foreground">Specifications</h2>
              <div className="glass-panel rounded-[var(--radius-2xl)] p-6 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <DetailItem
                    label="Condition"
                    value={listing.condition?.replace("_", " ")}
                    badge={
                      <Badge
                        variant={getConditionVariant(listing.condition)}
                        size="lg"
                        className="capitalize shadow-sm"
                      >
                        {listing.condition?.replace("_", " ")}
                      </Badge>
                    }
                  />
                  <DetailItem
                    label="Price"
                    value={`$${Number(listing.price).toLocaleString()}`}
                    highlight
                  />
                  <DetailItem
                    label="Location"
                    value={listing.location || "On campus"}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Posted"
                    value={formatDate(listing.created_at)}
                    icon={<Clock className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Views"
                    value={`${listing.view_count} views`}
                    icon={<Eye className="h-4 w-4" />}
                  />
                  <DetailItem
                    label="Negotiable"
                    value={listing.negotiable ? "Yes" : "Fixed price"}
                  />
                </div>
              </div>
            </div>

            {/* Related listings */}
            {relatedListings.length > 0 && (
              <div className="pt-10 border-t border-border/50">
                <h2 className="text-2xl font-black mb-6">Similar Items</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {relatedListings.map((item) => (
                    <ListingCard key={item.id} listing={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right column: Actions & Seller ─── */}
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* Sticky Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="glass-panel rounded-[var(--radius-3xl)] p-8 shadow-[var(--shadow-elevation-3)] border border-primary/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

              <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
                <div className="flex-1 min-w-0">
                  <Badge
                    variant={getConditionVariant(listing.condition)}
                    className="mb-3 capitalize shadow-sm"
                  >
                    {listing.condition?.replace("_", " ")}
                  </Badge>
                  <h1 className="text-3xl font-black leading-tight text-foreground">
                    {listing.title}
                  </h1>
                </div>
                <button
                  onClick={() => {
                    toggle(listing.id);
                    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
                  }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background border border-border shadow-sm hover:border-primary/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none group"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                      isFavorite
                        ? "fill-rose-500 text-rose-500"
                        : "text-muted-foreground group-hover:text-primary",
                    )}
                  />
                </button>
              </div>

              <div className="flex items-baseline gap-3 mb-6 relative z-10">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-[image:var(--gradient-primary)]">
                  ${Number(listing.price).toLocaleString()}
                </div>
                {listing.negotiable && (
                  <Badge variant="outline" className="text-xs font-bold shadow-sm">
                    Negotiable
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground mb-8 pb-8 border-b border-border/50 relative z-10">
                <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <Package className="h-4 w-4" />{" "}
                  <span className="capitalize">{listing.category?.name}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <MapPin className="h-4 w-4" /> {listing.location || "On campus"}
                </span>
                <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <Eye className="h-4 w-4" /> {listing.view_count} views
                </span>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 relative z-10">
                <Link to="/messages">
                  <Button
                    variant="premium"
                    className="w-full gap-2 rounded-[var(--radius-xl)]"
                    size="xl"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Message Seller
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 rounded-[var(--radius-xl)] font-bold shadow-sm bg-background/50 backdrop-blur-md hover:bg-muted"
                    size="lg"
                    onClick={() => {
                      toggle(listing.id);
                      toast.success(isFavorite ? "Removed" : "Saved!");
                    }}
                  >
                    <Heart className={cn("h-4 w-4", isFavorite && "fill-rose-500 text-rose-500")} />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 rounded-[var(--radius-xl)] font-bold shadow-sm bg-background/50 backdrop-blur-md hover:bg-muted"
                    size="lg"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <div className="pt-4 mt-2 border-t border-border/50 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground font-semibold hover:text-destructive hover:bg-destructive/10 rounded-full px-4"
                    onClick={() => toast.info("Report submitted for review")}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    Report this listing
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Seller card */}
            <SellerCard user={listing.user} />

            {/* Trust & Safety */}
            <div className="glass-panel rounded-[var(--radius-2xl)] p-6 shadow-sm">
              <div className="flex items-center gap-2 font-black mb-4 text-sm text-foreground">
                <div className="h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                </div>
                Trust &amp; Safety Tips
              </div>
              <ul className="space-y-3 text-xs font-medium text-muted-foreground">
                {[
                  "Meet in public campus locations",
                  "Inspect items before purchasing",
                  "Use secure payment methods",
                  "Report suspicious activity immediately",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50 mt-1 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Fullscreen gallery */}
        <AnimatePresence>
          {fullscreen && (
            <FullscreenGallery
              images={images}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
              onClose={() => setFullscreen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Image Gallery ── */
function ImageGallery({
  images,
  activeImage,
  setActiveImage,
  onFullscreen,
  title,
}: {
  images: string[];
  activeImage: number;
  setActiveImage: (i: number) => void;
  onFullscreen: () => void;
  title: string;
}) {
  const next = () => setActiveImage((activeImage + 1) % images.length);
  const prev = () => setActiveImage((activeImage - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      {/* Main Hero Image */}
      <div className="relative overflow-hidden rounded-[var(--radius-3xl)] bg-muted border border-border group aspect-[4/3] shadow-[var(--shadow-elevation-2)]">
        <button
          className="absolute inset-0 w-full h-full cursor-zoom-in focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary outline-none z-0"
          onClick={onFullscreen}
          aria-label="Open fullscreen gallery"
        />
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={images[activeImage]}
            alt={`${title} — image ${activeImage + 1}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          />
        </AnimatePresence>

        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-md px-3 py-1.5 text-foreground text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-sm border border-border">
          <ZoomIn className="h-4 w-4" />
          Zoom
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-md shadow-lg hover:bg-background hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10 border border-border"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-md shadow-lg hover:bg-background hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10 border border-border"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-foreground" />
            </button>

            {/* Pagination dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-background/50 backdrop-blur-md px-3 py-2 rounded-full border border-border/50">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(i);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === activeImage
                      ? "w-6 bg-primary"
                      : "w-2 bg-foreground/30 hover:bg-foreground/50",
                  )}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={cn(
                "overflow-hidden rounded-[var(--radius-xl)] border-2 transition-all duration-300 relative",
                "aspect-square",
                activeImage === i
                  ? "border-primary shadow-[var(--shadow-glow-primary)] scale-105 z-10"
                  : "border-transparent hover:border-border hover:scale-105 opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-black/20 transition-opacity",
                  activeImage === i ? "opacity-0" : "opacity-100",
                )}
              />
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Fullscreen Gallery ── */
function FullscreenGallery({
  images,
  activeImage,
  setActiveImage,
  onClose,
}: {
  images: string[];
  activeImage: number;
  setActiveImage: (i: number) => void;
  onClose: () => void;
}) {
  const next = () => setActiveImage((activeImage + 1) % images.length);
  const prev = () => setActiveImage((activeImage - 1 + images.length) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image fullscreen viewer"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
        title="Close"
        aria-label="Close"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      <AnimatePresence mode="wait">
        <motion.img
          key={activeImage}
          src={images[activeImage]}
          alt=""
          className="max-h-[90vh] max-w-[90vw] object-contain select-none"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Previous image"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Next image"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === activeImage ? "w-8 bg-white" : "w-2 bg-white/30",
                )}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

/* ── Seller Card ── */
function SellerCard({
  user,
}: {
  user?: Partial<{ id: number; name: string; avatar: string | null }>;
}) {
  if (!user) return null;

  const avatarUrl =
    user.avatar ||
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%234f46e5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='white'%3E${encodeURIComponent((user.name?.[0] ?? "U").toUpperCase())}%3C/text%3E%3C/svg%3E`;

  return (
    <div className="glass-panel rounded-[var(--radius-2xl)] p-6 shadow-sm border-t-[3px] border-t-primary">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mb-4 flex items-center justify-between">
        Seller Profile
        <Badge
          variant="outline"
          className="bg-success/5 text-success border-success/20 font-bold gap-1"
        >
          <Shield className="h-3 w-3" /> Verified
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={user.name ?? "Seller"}
            className="h-14 w-14 rounded-full border-2 border-background shadow-md object-cover"
          />
          <div className="absolute bottom-0 right-0 h-4 w-4 bg-success border-2 border-background rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-lg truncate text-foreground">
            {user.name ?? "Unknown"}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground mt-0.5">
            <div className="flex text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-warning" />
              ))}
            </div>
            <span>5.0 (42 reviews)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 py-4 border-y border-border/50 text-center mb-6">
        {[
          { label: "Active Items", value: "3" },
          { label: "Joined", value: "2023" },
          { label: "Response", value: "< 1h" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-lg font-black text-foreground">{s.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full font-bold rounded-full border-border/50 bg-background/50"
      >
        View Full Profile
      </Button>
    </div>
  );
}

/* ── Detail Item ── */
function DetailItem({
  label,
  value,
  badge,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  badge?: React.ReactNode;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] bg-muted/40 p-4 border border-border/30 hover:bg-muted/60 transition-colors">
      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      {badge ?? (
        <div
          className={cn(
            "text-base font-bold capitalize",
            highlight ? "text-primary text-xl font-black" : "text-foreground",
          )}
        >
          {value}
        </div>
      )}
    </div>
  );
}

/* ── Loading Skeleton ── */
function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 bg-background">
      <Skeleton className="h-4 w-64 mb-8 rounded-lg" />
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
        <div className="space-y-6">
          <Skeleton className="aspect-[4/3] w-full rounded-[var(--radius-3xl)]" />
          <div className="grid grid-cols-6 gap-2">
            <Skeleton className="aspect-square rounded-xl" />
          </div>
          <Skeleton className="h-40 w-full rounded-[var(--radius-2xl)]" />
          <Skeleton className="h-32 w-full rounded-[var(--radius-2xl)]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-[var(--radius-3xl)]" />
          <Skeleton className="h-52 w-full rounded-[var(--radius-2xl)]" />
        </div>
      </div>
    </div>
  );
}

/* ── Date formatter ── */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return date.toLocaleDateString();
}
