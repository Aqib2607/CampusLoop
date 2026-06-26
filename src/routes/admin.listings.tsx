import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge, getConditionVariant } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";
import { toast } from "sonner";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23f1f5f9'/%3E%3C/svg%3E";

export const Route = createFileRoute("/admin/listings")({ component: AdminListings });

function AdminListings() {
  const { data, isPending } = useQuery({
    queryKey: ["admin_listings"],
    queryFn: () => listingService.getListings(),
  });
  const listings = data?.data || [];

  return (
    <div>
      <PageHeader
        title="All Listings"
        subtitle={`${listings.length.toLocaleString()} listings on the platform.`}
        animate
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl bg-card border border-border shadow-[var(--shadow-elevation-1)] overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <TableRowSkeleton cols={6} />
                  </TableCell>
                </TableRow>
              ))
            ) : listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState variant="listings" size="sm" />
                </TableCell>
              </TableRow>
            ) : (
              listings.map((l) => (
                <TableRow key={l.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={l.images?.[0]?.url ?? FALLBACK_IMAGE}
                        alt=""
                        className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <div className="font-medium text-sm line-clamp-1 max-w-[200px]">
                          {l.title}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {l.category?.name || "Uncategorized"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{l.user?.name || "Unknown"}</TableCell>
                  <TableCell className="font-semibold text-primary text-sm">
                    ${Number(l.price).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getConditionVariant(l.condition)}
                      size="sm"
                      className="capitalize"
                    >
                      {l.condition?.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" dot size="sm">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Link to="/listings/$id" params={{ id: l.id.toString() }}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/5"
                        onClick={() => toast.error(`Removed listing: ${l.title}`)}
                      >
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
