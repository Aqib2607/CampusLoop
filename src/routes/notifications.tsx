import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/mock-data";
import { useNotificationStore } from "@/stores";

export const Route = createFileRoute("/notifications")({ component: NotificationsPage });

function NotificationsPage() {
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const groups = ["Today", "Yesterday", "Earlier"] as const;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-7 w-7 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
        <Button variant="ghost" size="sm" className="ml-auto gap-2" onClick={markAllRead}>
          <Check className="h-4 w-4" />Mark all read
        </Button>
      </div>
      <div className="space-y-6">
        {groups.map((g) => {
          const items = notifications.filter((n) => n.group === g);
          if (!items.length) return null;
          return (
            <section key={g}>
              <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">{g}</div>
              <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
                {items.map((n) => (
                  <div key={n.id} className="flex gap-3 p-4 hover:bg-muted/40">
                    <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.unread ? "bg-primary" : "bg-transparent"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{n.title}</div>
                      <div className="text-sm text-muted-foreground">{n.desc}</div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">{n.time}</div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
