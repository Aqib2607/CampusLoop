import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { useNotificationStore } from "@/stores";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/notifications")({ component: NotificationsPage });

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-7 w-7 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto gap-2" 
          onClick={() => markAllMutation.mutate()}
          disabled={markAllMutation.isPending || notifications.length === 0}
        >
          <Check className="h-4 w-4" />
          Mark all read
        </Button>
      </div>

      <div className="space-y-6">
        {isPending ? (
           <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-4">
                  <Skeleton className="h-2 w-2 rounded-full mt-1.5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
           </div>
        ) : notifications.length > 0 ? (
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            {notifications.map((n) => (
              <div key={n.id} className={`flex gap-3 p-4 ${n.read_at ? '' : 'bg-muted/10'}`}>
                <div
                  className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${!n.read_at ? "bg-primary" : "bg-transparent"}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold capitalize">{n.type.split('\\').pop()?.replace('Event', '')}</div>
                  <div className="text-sm text-muted-foreground">{n.data?.message || 'You have a new notification.'}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            You're all caught up! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
