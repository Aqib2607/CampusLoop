import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Plus, Pencil, Trash2, ImageIcon, Package, Settings, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/listings")({ component: MyListings });

function MyListings() {
  const { user } = useAuthStore();
  const { data: listingsData, isPending: isListingsPending } = useQuery({
    queryKey: ["listings", { user_id: user?.id }],
    queryFn: () => listingService.getListings({ user_id: user?.id }),
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
    negotiable: false,
    location: "",
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Immersive Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="relative overflow-hidden rounded-[var(--radius-2xl)] bg-foreground text-background p-8 lg:p-10 shadow-[var(--shadow-elevation-3)]"
      >
        <div className="absolute inset-0 bg-[image:var(--gradient-primary)] opacity-20 mix-blend-multiply" />
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/40 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white mb-4 border border-white/20">
              <Package className="h-3.5 w-3.5 text-white" /> Seller Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
              My Listings
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Manage your active inventory or create a new listing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-white/20 text-white bg-white/10 px-4 py-2 text-sm font-bold shadow-lg rounded-full backdrop-blur-md"
            >
              {listings.length} Active Items
            </Badge>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-8 bg-muted/50 p-1.5 rounded-full shadow-sm max-w-fit mx-auto md:mx-0 flex">
          <TabsTrigger
            value="active"
            className="rounded-full px-6 text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Active ({listings.length})
          </TabsTrigger>
          <TabsTrigger
            value="sold"
            className="rounded-full px-6 text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Sold (0)
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="gap-2 rounded-full px-6 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create new
          </TabsTrigger>
        </TabsList>

        {/* ── Active tab ── */}
        <TabsContent value="active">
          {isListingsPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-[var(--radius-3xl)] overflow-hidden shadow-sm"
            >
              <EmptyState
                variant="listings"
                title="No active listings"
                description="Turn your unwanted items into cash by creating your first listing."
                action={{
                  label: "Create a listing",
                  onClick: () => {
                    const trigger = document.querySelector(
                      '[data-value="create"]',
                    ) as HTMLButtonElement;
                    if (trigger) trigger.click();
                  },
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {listings.map((l, i) => (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                    className="relative group"
                  >
                    <ListingCard listing={l} />
                    {/* Owner actions overlay */}
                    {user?.id === l.user_id && (
                      <div className="absolute top-4 right-4 hidden group-hover:flex gap-2 z-20">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full shadow-lg bg-background/90 backdrop-blur-md hover:bg-background border border-border"
                          onClick={() => toast.info("Edit listing")}
                          aria-label="Edit listing"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="rounded-full shadow-lg border border-destructive/20 hover:scale-110 transition-transform"
                          onClick={() => toast.error("Delete listing")}
                          aria-label="Delete listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </TabsContent>

        {/* ── Sold tab ── */}
        <TabsContent value="sold">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-[var(--radius-3xl)] overflow-hidden shadow-sm"
          >
            <EmptyState
              variant="listings"
              title="No sold items yet"
              description="When you successfully complete a sale, it will be moved to this archive."
            />
          </motion.div>
        </TabsContent>

        {/* ── Create tab ── */}
        <TabsContent value="create">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-[1fr_380px] gap-8"
          >
            {/* Form */}
            <form
              className="glass-panel rounded-[var(--radius-3xl)] shadow-[var(--shadow-elevation-2)] border border-primary/10 overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Listing published! Pending moderator review.");
              }}
            >
              <div className="px-8 py-6 border-b border-border/50 bg-muted/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />
                <div className="font-black text-2xl text-foreground relative z-10">
                  Create Listing
                </div>
                <div className="text-sm text-muted-foreground mt-1 font-medium relative z-10">
                  Fill in the details below to publish your item to the marketplace.
                </div>
              </div>

              <div className="p-8 space-y-8">
                <FormSection
                  title="Basic Information"
                  icon={<Pencil className="h-4 w-4 text-primary" />}
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-bold">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="What are you selling?"
                        className="h-12 rounded-[var(--radius-xl)] bg-background/50 border-border shadow-sm text-base"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="font-bold">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={form.desc}
                        onChange={(e) => setForm({ ...form, desc: e.target.value })}
                        placeholder="Tell buyers about the item — condition, accessories included, reason for selling…"
                        rows={5}
                        className="rounded-[var(--radius-xl)] bg-background/50 border-border shadow-sm text-base resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="font-bold">
                          Category
                        </Label>
                        <Select
                          value={form.category}
                          onValueChange={(v) => setForm({ ...form, category: v })}
                        >
                          <SelectTrigger
                            id="category"
                            className="h-12 rounded-[var(--radius-xl)] bg-background/50 border-border shadow-sm"
                          >
                            <SelectValue placeholder="Select category…" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem
                                key={c.id}
                                value={c.id.toString()}
                                className="font-medium"
                              >
                                {c.icon ?? "📁"} {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="font-bold">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          placeholder="e.g. Main campus, Library..."
                          className="h-12 rounded-[var(--radius-xl)] bg-background/50 border-border shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  title="Pricing & Condition"
                  icon={<Settings className="h-4 w-4 text-primary" />}
                >
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="font-bold">
                        Price ($)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                          $
                        </span>
                        <Input
                          id="price"
                          type="number"
                          min={0}
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          placeholder="0.00"
                          className="h-12 pl-8 rounded-[var(--radius-xl)] bg-background/50 border-border shadow-sm font-bold text-lg"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition" className="font-bold">
                        Condition
                      </Label>
                      <Select
                        value={form.condition}
                        onValueChange={(v) => setForm({ ...form, condition: v })}
                      >
                        <SelectTrigger
                          id="condition"
                          className="h-12 rounded-[var(--radius-xl)] bg-background/50 border-border shadow-sm"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["new", "like_new", "good", "fair", "poor"].map((c) => (
                            <SelectItem key={c} value={c} className="capitalize font-medium">
                              {c.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 bg-muted/30 p-4 rounded-[var(--radius-xl)] border border-border/50">
                    <input
                      aria-label="Price is negotiable"
                      id="negotiable"
                      type="checkbox"
                      checked={form.negotiable}
                      onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
                      className="h-5 w-5 rounded-md border-input accent-primary cursor-pointer"
                    />
                    <Label htmlFor="negotiable" className="text-sm font-bold cursor-pointer">
                      Price is negotiable (Or Best Offer)
                    </Label>
                  </div>
                </FormSection>

                <FormSection title="Media" icon={<ImageIcon className="h-4 w-4 text-primary" />}>
                  <label
                    htmlFor="image-upload"
                    className="group flex flex-col items-center gap-4 rounded-[var(--radius-2xl)] border-2 border-dashed border-border hover:border-primary/50 bg-background/30 hover:bg-primary/5 transition-all duration-300 p-10 text-center cursor-pointer shadow-sm"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-inner group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                      <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-foreground">
                        Click to upload photos
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 font-medium">
                        Drag and drop supported. Max 8 photos (5MB each).
                      </div>
                    </div>
                    <input
                      aria-label="Upload photos"
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                </FormSection>

                <div className="pt-6 border-t border-border/50">
                  <Button
                    type="submit"
                    variant="premium"
                    size="xl"
                    className="w-full text-lg rounded-full"
                  >
                    Publish to Marketplace
                  </Button>
                </div>
              </div>
            </form>

            {/* Live preview */}
            <aside className="lg:sticky lg:top-28 lg:self-start space-y-6">
              <div className="glass-panel rounded-[var(--radius-2xl)] border border-primary/10 overflow-hidden shadow-[var(--shadow-elevation-2)] relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />
                <div className="flex items-center gap-2 px-6 py-4 border-b border-border/50 bg-muted/20">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest text-foreground">
                    Live Preview
                  </span>
                </div>

                <div className="p-6">
                  <div className="rounded-[var(--radius-xl)] border border-border bg-card overflow-hidden shadow-sm group">
                    <div className="aspect-[4/3] bg-muted flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <ImageIcon className="h-10 w-10 text-muted-foreground/30 relative z-10" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest relative z-10">
                        Thumbnail
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary capitalize">
                          {form.category || "Category"}
                        </div>
                        <Badge
                          variant="outline"
                          size="sm"
                          className="capitalize text-[10px] bg-background"
                        >
                          {form.condition.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="font-bold text-base text-foreground truncate mb-3">
                        {form.title || "Your listing title..."}
                      </div>
                      <div className="flex items-end justify-between mt-auto">
                        <span className="text-2xl font-black text-foreground">
                          ${form.price || "0"}
                        </span>
                        {form.negotiable && (
                          <Badge
                            variant="outline"
                            size="sm"
                            className="font-bold bg-muted/50 border-border/50 shadow-sm"
                          >
                            OBO
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-[var(--radius-2xl)] p-6 shadow-sm">
                <div className="font-black text-foreground mb-4 text-sm flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" /> Success Tips
                </div>
                <ul className="space-y-3">
                  {[
                    "Use clear, natural-light photos",
                    "Be honest about item condition",
                    "Include all accessories & manuals",
                    "Set a fair, competitive price",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2.5 text-sm font-medium text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-base font-black text-foreground mb-5 pb-3 border-b border-border/50">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
