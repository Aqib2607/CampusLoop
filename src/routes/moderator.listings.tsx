import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useListingStore } from "@/stores";

export const Route = createFileRoute("/moderator/listings")({ component: ModListings });

function ModListings() {
  const listings = useListingStore((s) => s.listings).slice(0, 8);
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
                    <img src={l.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-medium">{l.title}</div>
                      <div className="text-xs text-muted-foreground">${l.price} · {l.condition}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{l.seller.name}</TableCell>
                <TableCell>{i % 3 === 0 ? <Badge variant="destructive">AI flagged</Badge> : <Badge variant="secondary">Pending</Badge>}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">Approve</Button>
                  <Button size="sm" variant="ghost" className="text-destructive ml-1">Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
