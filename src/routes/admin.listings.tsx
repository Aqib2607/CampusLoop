import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useListingStore } from "@/stores";

export const Route = createFileRoute("/admin/listings")({ component: AdminListings });

function AdminListings() {
  const listings = useListingStore((s) => s.listings).slice(0, 10);
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
                    <img src={l.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-medium">{l.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">{l.category}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{l.seller.name}</TableCell>
                <TableCell className="font-semibold">${l.price}</TableCell>
                <TableCell><Badge variant="secondary">Live</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
