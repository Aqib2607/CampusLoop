import { createFileRoute } from "@tanstack/react-router";
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
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";

export const Route = createFileRoute("/admin/listings")({ component: AdminListings });

function AdminListings() {
  const { data } = useQuery({
    queryKey: ["admin_listings"],
    queryFn: () => listingService.getListings(),
  });
  const listings = data?.data || [];
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">All Listings</h1>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((l) => (
              <TableRow key={l.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        l.images && l.images.length > 0
                          ? l.images[0].image_path
                          : "https://via.placeholder.com/150"
                      }
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium">{l.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {l.category?.name || "Uncategorized"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{l.user?.name || "Unknown"}</TableCell>
                <TableCell className="font-semibold">${l.price}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Live</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
