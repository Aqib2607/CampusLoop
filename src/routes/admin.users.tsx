import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { adminUsers } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Users</h1>
        <Input placeholder="Search users…" className="max-w-xs" />
      </div>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </TableCell>
                <TableCell><Badge variant={u.role === "moderator" ? "default" : "secondary"}>{u.role}</Badge></TableCell>
                <TableCell>
                  <Badge variant={u.status === "active" ? "secondary" : "destructive"}>{u.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">Suspend</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
