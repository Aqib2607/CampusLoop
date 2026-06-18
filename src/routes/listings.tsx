import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
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
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/listings")({ component: ListingsPage });

function ListingsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<number | undefined>();
  const [condition, setCondition] = useState<string | undefined>();
  const [price, setPrice] = useState<[number, number]>([0, 1000]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("recent");

  // Fetch Listings passing query params directly to backend
  const { data: listingsData, isPending: isListingsPending } = useQuery({
    queryKey: ["listings", { q, category, condition, price_min: price[0], price_max: price[1], page, sort }],
    queryFn: () =>
      listingService.getListings({
        category,
        condition,
        price_min: price[0] > 0 ? price[0] : undefined,
        price_max: price[1] < 1000 ? price[1] : undefined,
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

  const Sidebar = (
    <div className="space-y-6">
      <FilterGroup title="Category">
        {isCategoriesPending
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full rounded" />
            ))
          : categories.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={category === c.id}
                  onCheckedChange={(v) => {
                    setCategory(v ? c.id : undefined);
                    setPage(1);
                  }}
                />
                <span>
                  {c.icon || "📁"} {c.name}
                </span>
              </label>
            ))}
      </FilterGroup>
      <FilterGroup title="Condition">
        {["new", "like_new", "good", "fair", "poor"].map((c) => (
          <label key={c} className="flex items-center gap-2 text-sm cursor-pointer capitalize">
            <Checkbox
              checked={condition === c}
              onCheckedChange={(v) => {
                setCondition(v ? c : undefined);
                setPage(1);
              }}
            />
            {c}
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title={`Price: $${price[0]} – $${price[1]}`}>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={price}
          onValueChange={(v) => {
            setPrice(v as [number, number]);
            setPage(1);
          }}
        />
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Browse Listings</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search listings (Local mock fallback)…"
              className="pl-10 h-11"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="lg:hidden gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{Sidebar}</div>
            </SheetContent>
          </Sheet>
          <Select value={sort} onValueChange={(val) => { setSort(val); setPage(1); }}>
            <SelectTrigger className="w-44 h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most recent</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl bg-card border border-border p-5">
            {Sidebar}
          </div>
        </aside>
        <div>
          <div className="mb-4 flex justify-between items-center text-sm text-muted-foreground">
            <span>{isListingsPending ? "Loading..." : `${meta?.total || listings.length} results`}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {isListingsPending
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-2xl" />
                ))
              : listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
          {meta && meta.last_page > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={meta.current_page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={meta.current_page === meta.last_page}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-3">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
