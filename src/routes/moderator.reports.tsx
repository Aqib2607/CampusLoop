import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reports } from "@/lib/mock-data";

export const Route = createFileRoute("/moderator/reports")({ component: ModReports });

function ModReports() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Reports Queue</h1>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.target}</TableCell>
                <TableCell>{r.reason}</TableCell>
                <TableCell><Badge variant={r.status === "open" ? "destructive" : "secondary"}>{r.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">Resolve</Button>
                  <Button size="sm" variant="ghost" className="text-destructive ml-1">Dismiss</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
