import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Search, MessageCircle, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { categories, listings } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/60 via-background to-background" />
        <div className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              New: Real-time chat & voice notes
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Buy, Sell & Connect <span className="text-primary">Across Campus</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              The student-only marketplace for textbooks, electronics, furniture, tickets, and everything in between. Safe, fast, and built for university life.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/listings">
                <Button size="lg" className="gap-2">Browse Listings <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to="/dashboard/listings">
                <Button size="lg" variant="outline">Create Listing</Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <Stat n="12k+" label="Students" />
              <Stat n="3.4k" label="Active listings" />
              <Stat n="4.9★" label="Avg rating" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <Section title="Browse by Category" subtitle="Find what you need, fast.">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/listings"
              search={{ category: c.id }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-card border border-border p-4 hover:border-primary hover:shadow-sm transition"
            >
              <div className="text-3xl">{c.icon}</div>
              <div className="text-sm font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.count}</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* FEATURED */}
      <Section
        title="Featured Listings"
        subtitle="Hand-picked deals from verified sellers."
        action={<Link to="/listings"><Button variant="ghost" size="sm">View all →</Button></Link>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {listings.slice(0, 8).map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section title="How It Works" subtitle="Three simple steps.">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Search, title: "Discover", desc: "Search listings from students in your university." },
            { icon: MessageCircle, title: "Chat", desc: "Message sellers in real time, share photos & voice notes." },
            { icon: ShieldCheck, title: "Trade Safely", desc: "Meet on campus, leave a review, build your rating." },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-card border border-border p-6"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary mb-4">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="font-bold text-lg">{s.title}</div>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section title="Loved by students" subtitle="Real reviews from our community.">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "Emma R.", uni: "Stanford", text: "Sold my textbooks in a day. So much easier than the campus bookstore." },
            { name: "Daniel K.", uni: "NYU", text: "Found a desk and chair for half retail. Pickup was 5 minutes away." },
            { name: "Aisha M.", uni: "UCLA", text: "The chat feature is fantastic — feels like Messenger but for campus." },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl bg-card border border-border p-6">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm">"{t.text}"</p>
              <div className="mt-4 text-sm font-semibold">{t.name} <span className="text-muted-foreground font-normal">· {t.uni}</span></div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1 text-sm md:text-base">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-black text-foreground">{n}</div>
      <div className="text-xs uppercase tracking-wider">{label}</div>
    </div>
  );
}
