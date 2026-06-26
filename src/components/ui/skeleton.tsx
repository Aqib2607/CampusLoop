import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-xl", className)}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  );
}

/** Pre-composed skeleton for a listing card */
function ListingCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-5 w-1/3 rounded-lg" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-1/4 rounded-md" />
          <Skeleton className="h-3 w-1/4 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/** Pre-composed skeleton for a stat card */
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
      <Skeleton className="h-3 w-24 rounded-md" />
    </div>
  );
}

/** Pre-composed skeleton for a table row */
function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  const gridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };
  return (
    <div className={cn("grid gap-4 p-4", gridCols[cols] || "grid-cols-4")}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 rounded-md" />
      ))}
    </div>
  );
}

/** Pre-composed skeleton for a conversation item */
function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Skeleton className="h-11 w-11 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
      </div>
      <Skeleton className="h-3 w-10 rounded-md shrink-0" />
    </div>
  );
}

/** Pre-composed skeleton for a notification item */
function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4">
      <Skeleton className="h-9 w-9 rounded-full shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <Skeleton className="h-3 w-4/5 rounded-md" />
      </div>
      <Skeleton className="h-3 w-12 rounded-md shrink-0" />
    </div>
  );
}

export {
  Skeleton,
  ListingCardSkeleton,
  StatCardSkeleton,
  TableRowSkeleton,
  ConversationSkeleton,
  NotificationSkeleton,
};
