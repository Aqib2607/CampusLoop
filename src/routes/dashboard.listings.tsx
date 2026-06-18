import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/listing-card";
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores";

export const Route = createFileRoute("/dashboard/listings")({ component: MyListings });

function MyListings() {
  const { user } = useAuthStore();
  const { data: listingsData, isPending: isListingsPending } = useQuery({
    queryKey: ["listings", { user_id: user?.id }],
    queryFn: () => listingService.getListings({ user_id: user?.id }), // Assuming backend can filter by user_id
    enabled: !!user?.id,
  });
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listingService.getCategories(),
  });

  const listings = listingsData?.data || [];
  const categories = categoriesData?.data || [];

  const [form, setForm] = useState({
    title: "",
    desc: "",
    price: "",
    category: "",
    condition: "new",
    days: "14",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Listings</h1>
        <Badge variant="secondary">{listings.length} active</Badge>
      </div>
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
          <TabsTrigger value="create" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Create new
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {isListingsPending
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-2xl" />
                ))
              : listings.map((l) => (
                  <div key={l.id} className="relative group">
                    <ListingCard listing={l} />
                    {/* Ownership check enforced before rendering Edit/Delete actions */}
                    {user?.id === l.user_id && (
                      <div className="absolute top-3 right-3 hidden group-hover:flex gap-2">
                        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-sm" onClick={() => toast.info("Edit mode")}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" className="h-9 w-9 rounded-full shadow-sm" onClick={() => toast.error("Delete mode")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </TabsContent>
        <TabsContent value="sold" className="mt-6">
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            No sold items yet.
          </div>
        </TabsContent>
        <TabsContent value="create" className="mt-6">
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <form
              className="rounded-2xl bg-card border border-border p-6 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Listing created!");
              }}
            >
              <Section title="Basic Information">
                <div className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="What are you selling?"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={form.desc}
                      onChange={(e) => setForm({ ...form, desc: e.target.value })}
                      placeholder="Tell buyers about it…"
                      rows={4}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => setForm({ ...form, category: v })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.icon || "📁"} {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Section>
              <Section title="Pricing & Condition">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Condition</Label>
                    <Select
                      value={form.condition}
                      onValueChange={(v) => setForm({ ...form, condition: v })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["new", "like_new", "good", "fair", "poor"].map((c) => (
                          <SelectItem key={c} value={c} className="capitalize">
                            {c.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Section>
              <Section title="Media">
                <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm font-medium">Drop photos here or click to upload</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Up to 8 photos, max 5MB each
                  </div>
                </div>
              </Section>
              <Section title="Expiration">
                <Select value={form.days} onValueChange={(v) => setForm({ ...form, days: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["7", "14", "30", "60"].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Section>
              <Button type="submit" size="lg" className="w-full">
                Publish listing
              </Button>
            </form>
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Preview
              </div>
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="aspect-square bg-muted grid place-items-center text-muted-foreground text-sm">
                  Image preview
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="font-semibold">{form.title || "Listing title"}</div>
                    <div className="font-bold text-primary">${form.price || "0"}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 capitalize">
                    {form.category} · {form.condition}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-bold mb-3">{title}</div>
      {children}
    </div>
  );
}
