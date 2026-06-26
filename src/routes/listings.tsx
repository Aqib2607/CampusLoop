import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, LayoutGrid, List, X, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ListingCard } from "@/components/listing-card";
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/listings")({ component: ListingsLayout });

function ListingsLayout() {
  const matches = useMatches();
  const isDetailPage = matches.some((match) => match.routeId === "/listings/$id");
  if (isDetailPage) return <Outlet />;
  return <ListingsPage />;
}

const conditions = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariant: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
};

function ListingsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<number | undefined>();
  const [condition, setCondition] = useState<string | undefined>();
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: listingsData, isPending: isListingsPending } = useQuery({
    queryKey: ["listings", { q, category, condition, priceMin, priceMax, page, sort }],
    queryFn: () =>
      listingService.getListings({
        category,
        condition,
        price_min: priceMin ? Number(priceMin) : undefined,
        price_max: priceMax ? Number(priceMax) : undefined,
        page,
      }),
  });

  const { data: categoriesData, isPending: isCategoriesPending } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listingService.getCategories(),
  });

  const listings = listingsData?.data || [];
  const meta = listingsData?.meta;
  const categories = categoriesData?.data || [];

  // Active filter chips
  const activeFilters: { key: string; label: string }[] = [];
  if (q) activeFilters.push({ key: "q", label: `"${q}"` });
  if (category) {
    const cat = categories.find((c) => c.id === category);
    if (cat) activeFilters.push({ key: "category", label: cat.name });
  }
  if (condition) activeFilters.push({ key: "condition", label: condition.replace("_", " ") });
  if (priceMin) activeFilters.push({ key: "priceMin", label: `From $${priceMin}` });
  if (priceMax) activeFilters.push({ key: "priceMax", label: `Up to $${priceMax}` });

  const clearFilter = (key: string) => {
    setPage(1);
    if (key === "q") setQ("");
    if (key === "category") setCategory(undefined);
    if (key === "condition") setCondition(undefined);
    if (key === "priceMin") setPriceMin("");
    if (key === "priceMax") setPriceMax("");
  };

  const clearAll = () => {
    setQ("");
    setCategory(undefined);
    setCondition(undefined);
    setPriceMin("");
    setPriceMax("");
    setPage(1);
  };

  const FilterPanel = (
    <div className="space-y-8">
      <FilterGroup title="Category">
        {isCategoriesPending
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-8 rounded-[var(--radius-lg)] mb-1" />
            ))
          : categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCategory(category === c.id ? undefined : c.id);
                  setPage(1);
                }}
                className={cn(
                  "w-full flex items-center justify-between rounded-[var(--radius-lg)] px-3 py-2 text-sm transition-all duration-200 group mb-1",
                  category === c.id
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "hover:bg-muted text-foreground font-medium",
                )}
              >
                <span className="capitalize">{c.name}</span>
                {category === c.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-border group-hover:border-primary/50 transition-colors" />
                )}
              </button>
            ))}
      </FilterGroup>

      <FilterGroup title="Condition">
        {conditions.map((c) => (
          <button
            key={c.value}
            onClick={() => {
              setCondition(condition === c.value ? undefined : c.value);
              setPage(1);
            }}
            className={cn(
              "w-full flex items-center justify-between rounded-[var(--radius-lg)] px-3 py-2 text-sm transition-all duration-200 group mb-1",
              condition === c.value
                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                : "hover:bg-muted text-foreground font-medium",
            )}
          >
            {c.label}
            {condition === c.value ? (
              <Check className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4 rounded-full border border-border group-hover:border-primary/50 transition-colors" />
            )}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              $
            </span>
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => {
                setPriceMin(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 rounded-[var(--radius-xl)] border border-input bg-card pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              min={0}
            />
          </div>
          <span className="text-muted-foreground/50 font-bold">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              $
            </span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => {
                setPriceMax(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 rounded-[var(--radius-xl)] border border-input bg-card pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              min={0}
            />
          </div>
        </div>
      </FilterGroup>

      {activeFilters.length > 0 && (
        <Button
          variant="outline"
          onClick={clearAll}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 font-bold rounded-[var(--radius-xl)]"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Immersive Header */}
      <div className="relative bg-muted/30 border-b border-border/50 py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-50" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Marketplace
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            Discover thousands of items listed by verified students across your campus.
          </p>

          {/* Search + Controls Bar inside Header */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-4xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search for textbooks, electronics, furniture..."
                className="pl-12 h-14 rounded-[var(--radius-2xl)] text-base shadow-sm border-border/50 bg-card/80 backdrop-blur-md"
              />
              {q && (
                <button
                  onClick={() => {
                    setQ("");
                    setPage(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 bg-muted rounded-full"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              {/* Mobile filter drawer */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-[var(--radius-2xl)] lg:hidden bg-card/80 backdrop-blur-md border-border/50"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">{FilterPanel}</div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header & Active Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {isListingsPending
                ? "Searching..."
                : `${(meta?.total ?? listings.length).toLocaleString()} results found`}
            </span>

            <div className="flex items-center gap-3">
              <Select
                value={sort}
                onValueChange={(v) => {
                  setSort(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-44 h-10 rounded-[var(--radius-xl)] bg-transparent border-transparent hover:bg-muted font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most recent</SelectItem>
                  <SelectItem value="price-asc">Price: low → high</SelectItem>
                  <SelectItem value="price-desc">Price: high → low</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex border border-border rounded-[var(--radius-xl)] overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex h-10 w-11 items-center justify-center transition-colors",
                    viewMode === "grid"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50",
                  )}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex h-10 w-11 items-center justify-center transition-colors",
                    viewMode === "list"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50",
                  )}
                  title="List view"
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap gap-2"
              >
                {activeFilters.map((f) => (
                  <motion.button
                    key={f.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => clearFilter(f.key)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                  >
                    {f.label}
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-6">
                Refine Search
              </h3>
              {FilterPanel}
            </div>
          </aside>

          {/* Results */}
          <div>
            {isListingsPending ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                )}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <EmptyState
                variant="search"
                title="No listings found"
                description="Try adjusting your filters or search query."
                action={{ label: "Clear filters", onClick: clearAll }}
              />
            ) : (
              <motion.div
                key={`${q}-${category}-${condition}-${page}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                )}
              >
                {listings.map((l) => (
                  <motion.div key={l.id} variants={cardVariant}>
                    <ListingCard listing={l} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                <Button
                  variant="outline"
                  disabled={meta.current_page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-[var(--radius-xl)] font-bold shadow-sm"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1 mx-2">
                  <span className="text-sm font-bold text-foreground">{meta.current_page}</span>
                  <span className="text-sm text-muted-foreground font-medium">/</span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {meta.last_page}
                  </span>
                </div>
                <Button
                  variant="outline"
                  disabled={meta.current_page === meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-[var(--radius-xl)] font-bold shadow-sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between mb-4 text-sm font-bold text-foreground hover:text-primary transition-colors group"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:text-primary",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
