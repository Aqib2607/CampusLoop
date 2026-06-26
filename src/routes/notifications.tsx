import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, MessageSquare, Package, Star, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { useNotificationStore } from "@/stores";
import { NotificationSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({ component: NotificationsPage });

function getNotificationIcon(type: string) {
  const typeLower = type.toLowerCase();
  if (typeLower.includes("message"))
    return { icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" };
  if (typeLower.includes("listing"))
    return { icon: Package, color: "text-primary", bg: "bg-primary/10" };
  if (typeLower.includes("review"))
    return { icon: Star, color: "text-warning", bg: "bg-warning/10" };
  if (typeLower.includes("report"))
    return { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" };
  return { icon: Bell, color: "text-muted-foreground", bg: "bg-muted" };
}

function NotificationsPage() {
  const queryClient = useQueryClient();
  const markAllReadStore = useNotificationStore((s) => s.markAllRead);

  const { data: notifData, isPending } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getNotifications(),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      markAllReadStore();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = notifData?.data || [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // Group by time
  const now = new Date();
  const today: typeof notifications = [];
  const yesterday: typeof notifications = [];
  const older: typeof notifications = [];

  for (const n of notifications) {
    const date = new Date(n.created_at);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) today.push(n);
    else if (diffDays === 1) yesterday.push(n);
    else older.push(n);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
            : "You're all caught up!"
        }
        animate
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending || notifications.length === 0 || unreadCount === 0}
          >
            <Check className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        }
      />

      {isPending ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border shadow-[var(--shadow-elevation-1)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50">
          <EmptyState
            variant="notifications"
            action={{ label: "Browse listings", href: "/listings" }}
          />
        </div>
      ) : (
        <div className="space-y-5">
          {today.length > 0 && <NotificationGroup label="Today" notifications={today} />}
          {yesterday.length > 0 && (
            <NotificationGroup label="Yesterday" notifications={yesterday} />
          )}
          {older.length > 0 && <NotificationGroup label="Earlier" notifications={older} />}
        </div>
      )}
    </div>
  );
}

function NotificationGroup({
  label,
  notifications,
}: {
  label: string;
  notifications: Array<{
    id: string;
    type: string;
    data?: { message?: string } | null;
    read_at: string | null;
    created_at: string;
  }>;
}) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">
        {label}
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.04 } },
        }}
        className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border shadow-[var(--shadow-elevation-1)]"
      >
        <AnimatePresence>
          {notifications.map((n) => {
            const { icon: Icon, color, bg } = getNotificationIcon(n.type);
            const isUnread = !n.read_at;
            const displayType =
              n.type
                .split("\\")
                .pop()
                ?.replace(/Event|Notification/g, "")
                .replace(/([a-z])([A-Z])/g, "$1 $2") ?? "Notification";

            return (
              <motion.div
                key={n.id}
                variants={{
                  hidden: { opacity: 0, x: -8 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                }}
                className={cn(
                  "flex items-start gap-3.5 px-4 py-4 transition-colors hover:bg-muted/30",
                  isUnread && "bg-primary/3",
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full mt-0.5",
                    bg,
                  )}
                >
                  <Icon className={cn("h-4.5 w-4.5", color)} aria-hidden="true" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm", isUnread ? "font-semibold" : "font-medium")}>
                    {displayType}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {n.data?.message ?? "You have a new notification."}
                  </div>
                </div>

                {/* Time + unread dot */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </span>
                  {isUnread && (
                    <div className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
