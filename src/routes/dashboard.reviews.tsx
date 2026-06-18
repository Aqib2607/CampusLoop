import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

export const Route = createFileRoute("/dashboard/reviews")({ component: Reviews });

const reviews = [
  {
    id: 1,
    name: "Priya Shah",
    avatar: "https://i.pravatar.cc/100?img=5",
    rating: 5,
    text: "Great communication and fast handover. Highly recommend!",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Marco Diaz",
    avatar: "https://i.pravatar.cc/100?img=12",
    rating: 5,
    text: "Item was even better than described. Will buy again.",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    avatar: "https://i.pravatar.cc/100?img=20",
    rating: 4,
    text: "Solid deal. Slight delay on the pickup time.",
    date: "2 weeks ago",
  },
];

function Reviews() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Reviews</h1>
      <div className="rounded-2xl bg-card border border-border p-6 mb-6 flex items-center gap-6">
        <div>
          <div className="text-5xl font-black">4.9</div>
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-warning text-warning" />
            ))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Based on 47 reviews</div>
      </div>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center gap-3">
              <img src={r.avatar} alt="" className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.date}</div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
