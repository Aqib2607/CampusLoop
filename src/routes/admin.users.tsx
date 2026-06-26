import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge, getRoleVariant } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
  const [searchQ, setSearchQ] = useState("");

  const { data: usersData, isPending } = useQuery({
    queryKey: ["admin_users"],
    queryFn: () => adminService.getUsers(),
  });

  const adminUsers = (usersData?.data || []).filter((u) => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage all platform users, roles, and account status."
        animate
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users…"
              className="pl-9 h-10 rounded-xl w-60"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              aria-label="Search users"
            />
          </div>
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
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <TableRowSkeleton cols={5} />
                  </TableCell>
                </TableRow>
              ))
            ) : adminUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState variant="users" size="sm" />
                </TableCell>
              </TableRow>
            ) : (
              adminUsers.map((u) => (
                <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleVariant(u.role)} className="capitalize">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.is_suspended ? "destructive" : "success"} dot>
                      {u.is_suspended ? "Suspended" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(u.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info(`Editing ${u.name}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/5"
                        onClick={() => toast.error(`Action taken on ${u.name}`)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        {u.is_suspended ? "Unsuspend" : "Suspend"}
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
