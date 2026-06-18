import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ListingCard } from "@/components/listing-card";
import { useListingStore } from "@/stores";
import { categories } from "@/lib/mock-data";

export const Route = createFileRoute("/listings")({ component: ListingsPage });

function ListingsPage() {
  const listings = useListingStore((s) => s.listings);
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [conds, setConds] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("recent");

  const filtered = useMemo(() => {
    let r = listings.filter((l) => {
      if (q && !l.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (cats.length && !cats.includes(l.category)) return false;
      if (conds.length && !conds.includes(l.condition)) return false;
      if (l.price < price[0] || l.price > price[1]) return false;
      if (l.seller.rating < minRating) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.seller.rating - a.seller.rating);
    return r;
  }, [listings, q, cats, conds, price, minRating, sort]);

  const Sidebar = (
    <div className="space-y-6">
      <FilterGroup title="Category">
        {categories.map((c) => (
          <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={cats.includes(c.id)}
              onCheckedChange={(v) => setCats(v ? [...cats, c.id] : cats.filter((x) => x !== c.id))}
            />
            <span>{c.icon} {c.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">{c.count}</span>
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Condition">
        {["New", "Like New", "Good", "Fair"].map((c) => (
          <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={conds.includes(c)}
              onCheckedChange={(v) => setConds(v ? [...conds, c] : conds.filter((x) => x !== c))}
            />
            {c}
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title={`Price: $${price[0]} – $${price[1]}`}>
        <Slider min={0} max={1000} step={10} value={price} onValueChange={(v) => setPrice(v as [number, number])} />
      </FilterGroup>
      <FilterGroup title="Minimum Seller Rating">
        <div className="flex gap-1">
          {[0, 3, 4, 4.5].map((r) => (
            <Button key={r} size="sm" variant={minRating === r ? "default" : "outline"} onClick={() => setMinRating(r)} className="gap-1">
              {r === 0 ? "Any" : <><Star className="h-3 w-3 fill-warning text-warning" />{r}+</>}
            </Button>
          ))}
        </div>
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
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search listings…" className="pl-10 h-11" />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="lg:hidden gap-2"><SlidersHorizontal className="h-4 w-4" />Filters</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
              <div className="mt-6">{Sidebar}</div>
            </SheetContent>
          </Sheet>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-44 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most recent</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl bg-card border border-border p-5">{Sidebar}</div>
        </aside>
        <div>
          <div className="mb-4 text-sm text-muted-foreground">{filtered.length} results</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
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
