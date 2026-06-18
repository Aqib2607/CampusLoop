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

export const Route = createFileRoute("/moderator/listings")({ component: ModListings });

function ModListings() {
  const { data } = useQuery({
    queryKey: ["mod_listings"],
    queryFn: () => listingService.getListings(),
  });
  const listings = data?.data || [];
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Listings Queue</h1>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((l, i) => (
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
                        ${l.price} · {l.condition.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{l.user?.name || "Unknown"}</TableCell>
                <TableCell>
                  {i % 3 === 0 ? (
                    <Badge variant="destructive">AI flagged</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive ml-1">
                    Reject
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
