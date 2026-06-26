import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/reviews")({ component: Reviews });

const reviews = [
  {
    id: 1,
    name: "Priya Shah",
    initials: "PS",
    rating: 5,
    text: "Great communication and fast handover. Highly recommend!",
    date: "2 days ago",
    listingTitle: "MacBook Air M1",
  },
  {
    id: 2,
    name: "Marco Diaz",
    initials: "MD",
    rating: 5,
    text: "Item was even better than described. Will buy again.",
    date: "1 week ago",
    listingTitle: "Calculus Textbook",
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    initials: "YT",
    rating: 4,
    text: "Solid deal. Slight delay on the pickup time but overall great.",
    date: "2 weeks ago",
    listingTitle: "IKEA Desk",
  },
];

const avgRating = 4.9;
const totalReviews = reviews.length;

function Reviews() {
  const breakdowns = [
    { stars: 5, count: 2 },
    { stars: 4, count: 1 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Your reputation as a seller on CampusLoop." animate />

      {/* Rating summary card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl bg-card border border-border shadow-[var(--shadow-elevation-1)] p-6 mb-6"
      >
        <div className="flex items-start gap-8">
          {/* Big score */}
          <div className="text-center shrink-0">
            <div className="text-6xl font-black text-foreground leading-none">{avgRating}</div>
            <div
              className="flex gap-0.5 mt-2 justify-center"
              aria-label={`${avgRating} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < Math.round(avgRating)
                      ? "fill-warning text-warning"
                      : "fill-muted text-muted",
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-1.5">{totalReviews} reviews</div>
          </div>

          {/* Star breakdown */}
          <div className="flex-1 space-y-1.5">
            {breakdowns.map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-2.5">
                <span className="text-xs text-muted-foreground w-3 text-right">{stars}</span>
                <Star className="h-3 w-3 fill-warning text-warning shrink-0" aria-hidden="true" />
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : "0%",
                    }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [] as const }}
                    className="h-full rounded-full bg-warning"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Review cards */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50">
          <EmptyState variant="reviews" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 + 0.2, duration: 0.3 }}
              className="rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] transition-shadow"
            >
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="font-semibold text-sm">{r.name}</div>
                    <span className="text-xs text-muted-foreground shrink-0">{r.date}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">Re: {r.listingTitle}</div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-2.5" aria-label={`${r.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < r.rating ? "fill-warning text-warning" : "fill-muted text-muted",
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">"{r.text}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
