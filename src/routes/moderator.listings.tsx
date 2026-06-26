import { createFileRoute } from "@tanstack/react-router";
import { Check, X, ShieldAlert, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23f1f5f9'/%3E%3C/svg%3E";

export const Route = createFileRoute("/moderator/listings")({ component: ModListings });

function ModListings() {
  const { data, isPending } = useQuery({
    queryKey: ["mod_listings"],
    queryFn: () => listingService.getListings(),
  });
  const listings = data?.data || [];

  return (
    <div>
      <PageHeader
        title="Listings Queue"
        subtitle="Review and moderate new listings before they go live."
        animate
        badge={
          listings.length > 0 ? (
            <Badge variant="secondary" size="lg">
              {listings.length} pending
            </Badge>
          ) : undefined
        }
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
              <TableHead>System Flags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <TableRowSkeleton cols={4} />
                  </TableCell>
                </TableRow>
              ))
            ) : listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState
                    variant="listings"
                    size="sm"
                    title="Queue is empty"
                    description="No new listings require moderation right now."
                  />
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {listings.map((l, i) => {
                  // Simulate AI flagging for demo
                  const isFlagged = i % 3 === 0;

                  return (
                    <motion.tr
                      key={l.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className={cn(
                        "border-b border-border hover:bg-muted/30 transition-colors",
                        isFlagged && "bg-destructive/2",
                      )}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3 py-1">
                          <img
                            src={l.images?.[0]?.url ?? FALLBACK_IMAGE}
                            alt=""
                            className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
                            loading="lazy"
                          />
                          <div>
                            <div className="font-medium text-sm line-clamp-1 max-w-[200px]">
                              {l.title}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize mt-0.5">
                              ${Number(l.price).toLocaleString()} · {l.condition.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{l.user?.name || "Unknown"}</TableCell>
                      <TableCell>
                        {isFlagged ? (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            AI Flagged (Suspicious)
                          </div>
                        ) : (
                          <Badge variant="secondary" size="sm">
                            No flags
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-success hover:bg-success/10 hover:text-success"
                            onClick={() => toast.success("Listing approved")}
                          >
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => toast.error("Listing rejected")}
                          >
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
