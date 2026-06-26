import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
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
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/reports")({ component: AdminReports });

function AdminReports() {
  const { data: reportsData, isPending } = useQuery({
    queryKey: ["admin_reports"],
    queryFn: () => adminService.getReports(),
  });

  const reports = reportsData?.data || [];
  const openCount = reports.filter((r) => r.status === "open").length;

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle={`${openCount > 0 ? `${openCount} open reports require review` : "No open reports — all clear!"}`}
        animate
        badge={
          openCount > 0 ? (
            <Badge variant="destructive" dot>
              {openCount} open
            </Badge>
          ) : (
            <Badge variant="success" dot>
              All clear
            </Badge>
          )
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
              <TableHead>Target</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <TableRowSkeleton cols={6} />
                  </TableCell>
                </TableRow>
              ))
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState variant="reports" size="sm" />
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {reports.map((r, i) => {
                  const isOpen = r.status === "open";

                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className={cn(
                        "border-b border-border hover:bg-muted/30 transition-colors",
                        isOpen && "bg-destructive/2",
                      )}
                    >
                      <TableCell className="font-medium text-sm py-4">
                        <div className="flex items-center gap-2">
                          {isOpen ? (
                            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-success shrink-0" />
                          )}
                          #{r.target_id}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm max-w-[180px]">
                        <div className="truncate capitalize">{r.reason.replace(/_/g, " ")}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {r.reporter?.name || "Anonymous"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isOpen ? "destructive" : "success"}
                          dot
                          className="capitalize"
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {new Date(r.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info("Opening report detail")}
                          >
                            Review
                          </Button>
                          {isOpen && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-success hover:bg-success/5"
                              onClick={() => toast.success("Report dismissed")}
                            >
                              Dismiss
                            </Button>
                          )}
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
