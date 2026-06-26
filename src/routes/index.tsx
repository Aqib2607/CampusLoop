import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView, type Variants } from "framer-motion";
import {
  ArrowRight,
  Search,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
  TrendingUp,
  ChevronRight,
  Monitor,
  BookOpen,
  Armchair,
  Briefcase,
  Gamepad2,
  Tag,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { useQuery } from "@tanstack/react-query";
import { listingService } from "@/services/listing.service";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Homepage,
});

/* ─────────────────────────────────────────────── */
/* HOMEPAGE WRAPPER                                */
/* ─────────────────────────────────────────────── */
function Homepage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <HeroSection />
      <div className="relative bg-background z-10">
        <CategoriesSection />
        <FeaturedListingsSection />
        <HowItWorksSection />
        <StatsBanner />
        <TestimonialsSection />
        <CtaBanner />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/* HERO SECTION                                    */
/* ─────────────────────────────────────────────── */
function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-32 overflow-hidden border-b border-border/50">
      {/* Immersive Background */}
      <div className="absolute inset-0 bg-background -z-20" />
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-70 -z-10" />

      {/* Ambient Orbs */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[140px] pointer-events-none -z-10"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none -z-10"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left: Typography & Actions */}
          <div className="flex flex-col items-start max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-8 hover:bg-primary/15 transition-colors cursor-pointer">
                <Sparkles className="h-4 w-4" />
                <span className="tracking-wide">CAMPUSLOOP V2 IS LIVE</span>
                <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-foreground text-balance"
            >
              Trade securely <br />
              <span className="text-gradient pb-2 block">within your campus.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg font-medium"
            >
              The premium marketplace for university students. Buy, sell, and connect instantly with
              verified peers on your campus.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/listings" className="w-full sm:w-auto">
                <Button
                  variant="premium"
                  size="xl"
                  className="w-full sm:w-auto text-base rounded-full gap-2"
                >
                  Explore Marketplace <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard/listings" className="w-full sm:w-auto">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto text-base rounded-full bg-background/50 backdrop-blur-sm border-border hover:bg-muted"
                >
                  Sell an Item
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 flex items-center gap-8"
            >
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tight text-foreground">12k+</span>
                <span className="text-sm font-medium text-muted-foreground mt-1">
                  Verified Students
                </span>
              </div>
              <div className="w-[1px] h-10 bg-border" />
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tight text-foreground">50k+</span>
                <span className="text-sm font-medium text-muted-foreground mt-1">
                  Successful Trades
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Abstract UI Presentation */}
          <div className="hidden lg:flex relative h-[600px] w-full items-center justify-center">
            <HeroAbstractVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroAbstractVisual() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };
  const popVariant: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: 10 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: 10 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative w-full h-full perspective-[2000px] transform-style-3d"
    >
      {/* Main Glass Card */}
      <motion.div
        variants={item}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] z-20"
      >
        <div className="glass-panel rounded-[var(--radius-2xl)] p-5 shadow-[var(--shadow-elevation-4)] border border-white/20 dark:border-white/10 animate-float [animation-delay:0s]">
          <div className="w-full h-48 rounded-[var(--radius-xl)] bg-muted overflow-hidden relative mb-4">
            <img
              src="https://picsum.photos/seed/macbook/800/600"
              alt="Macbook"
              className="object-cover w-full h-full"
            />
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Like New
            </div>
          </div>
          <h3 className="font-bold text-lg text-foreground">MacBook Pro M3 Max</h3>
          <p className="text-primary font-black text-xl mt-1">$2,499</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-8 w-8 rounded-full bg-[image:var(--gradient-primary)]" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Alex Chen</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Star className="h-2.5 w-2.5 fill-warning text-warning" /> 5.0 (42)
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Element 1 */}
      <motion.div variants={item} className="absolute left-0 top-[20%] z-30">
        <div className="glass-panel rounded-[var(--radius-xl)] p-3 shadow-[var(--shadow-elevation-3)] flex items-center gap-3 animate-float [animation-delay:1.5s]">
          <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">New Message</div>
            <div className="text-[10px] text-muted-foreground font-medium">
              Is this still available?
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Element 2 */}
      <motion.div variants={item} className="absolute right-0 bottom-[20%] z-10">
        <div className="glass-panel rounded-[var(--radius-xl)] p-3 shadow-[var(--shadow-elevation-3)] flex items-center gap-3 animate-float [animation-delay:0.7s]">
          <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">High Demand</div>
            <div className="text-[10px] text-muted-foreground font-medium">12 people viewing</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────── */
/* CATEGORIES SECTION                              */
/* ─────────────────────────────────────────────── */
function CategoriesSection() {
  const { data: categoriesData, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listingService.getCategories(),
  });

  const categories = categoriesData?.data || [];

  const categoryIcons: Record<string, React.ElementType> = {
    Electronics: Monitor,
    Textbooks: BookOpen,
    Furniture: Armchair,
    Services: Briefcase,
    Gaming: Gamepad2,
    Other: Tag,
  };

  return (
    <section className="py-24 relative overflow-hidden bg-muted/30 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
              Explore Categories
            </h2>
            <p className="text-muted-foreground text-lg">
              Find exactly what you're looking for, organized for your campus.
            </p>
          </div>
          <Link to="/listings">
            <Button variant="outline" className="rounded-full font-semibold">
              View All Categories
            </Button>
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 snap-x snap-mandatory hide-scrollbar">
          {isPending
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[160px] h-32 skeleton-shimmer rounded-[var(--radius-2xl)]"
                />
              ))
            : categories.slice(0, 6).map((c, i) => {
                const Icon =
                  categoryIcons[c.name] || LucideIcons[c.icon as keyof typeof LucideIcons] || Tag;
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                    className="snap-start min-w-[160px] sm:min-w-0"
                  >
                    <Link
                      to="/listings"
                      className="group flex flex-col items-center justify-center gap-4 h-36 rounded-[var(--radius-2xl)] bg-card border border-border shadow-sm hover:shadow-[var(--shadow-elevation-3)] hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[image:var(--gradient-card-hover)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm text-foreground">
                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      <span className="relative z-10 font-semibold text-sm tracking-tight">
                        {c.name}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────── */
/* FEATURED LISTINGS                               */
/* ─────────────────────────────────────────────── */
function FeaturedListingsSection() {
  const { data: listingsData, isPending } = useQuery({
    queryKey: ["listings", "featured"],
    queryFn: () => listingService.getListings({ page: 1 }),
  });

  const listings = listingsData?.data || [];

  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
              Fresh on Campus
            </h2>
            <p className="text-muted-foreground text-lg">
              The latest high-quality listings from verified students.
            </p>
          </div>
          <Link to="/listings">
            <Button variant="premium" className="rounded-full font-semibold gap-2">
              Browse Marketplace <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Pinterest-style grid layout handled mostly by tailwind columns, or simple grid for premium feel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isPending
            ? Array.from({ length: 8 }).map((_, i) => <ListingCardSkeleton key={i} />)
            : listings.slice(0, 8).map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.05, duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  <ListingCard listing={l} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────── */
/* HOW IT WORKS                                    */
/* ─────────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Discover",
      desc: "Search thousands of listings from verified students at your university with advanced filters.",
    },
    {
      num: "02",
      icon: MessageSquare,
      title: "Connect",
      desc: "Message sellers instantly through our real-time, encrypted chat platform.",
    },
    {
      num: "03",
      icon: ShieldCheck,
      title: "Trade Safely",
      desc: "Meet on campus, inspect the item, and build your reputation through our review system.",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/[0.02] -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">
            How CampusLoop Works
          </h2>
          <p className="text-muted-foreground text-lg">
            A simple, secure, and blazing fast process to get exactly what you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, type: "spring" }}
              className="relative rounded-[var(--radius-2xl)] bg-card border border-border p-8 shadow-[var(--shadow-elevation-2)] hover:shadow-[var(--shadow-elevation-3)] hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="text-[12px] font-black tracking-widest text-muted-foreground/40 mb-6 font-mono">
                {step.num}
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary transition-colors duration-300 mb-6">
                <step.icon className="h-8 w-8 text-foreground group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────── */
/* STATS BANNER                                    */
/* ─────────────────────────────────────────────── */
function StatsBanner() {
  const stats = [
    { value: "12k+", label: "Active Students" },
    { value: "3.4k", label: "Live Listings" },
    { value: "28k+", label: "Messages Sent" },
    { value: "99%", label: "Safe Trades" },
  ];

  return (
    <section className="py-16 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center divide-x divide-background/20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
              <div className="text-sm text-background/70 font-semibold uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────── */
/* TESTIMONIALS                                    */
/* ─────────────────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Emma R.",
      uni: "Stanford",
      text: "Sold my textbooks in a day. So much easier than the campus bookstore. The chat feature made it seamless.",
    },
    {
      name: "Daniel K.",
      uni: "NYU",
      text: "Found a desk and chair for half retail price. Pickup was 5 minutes from my dorm — couldn't be easier.",
    },
    {
      name: "Aisha M.",
      uni: "UCLA",
      text: "The chat feature is fantastic — feels like Messenger but made specifically for campus transactions. Love it.",
    },
  ];

  return (
    <section className="py-24 bg-muted/30 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">
            Trusted by Students
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Here's what the community has to say.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-panel rounded-[var(--radius-2xl)] p-8 shadow-[var(--shadow-elevation-1)]"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground text-lg font-medium leading-relaxed mb-8">"{t.text}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="h-12 w-12 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-white font-bold shadow-sm">
                  {t.name.split(" ")[0][0]}
                  {t.name.split(" ")[1][0]}
                </div>
                <div>
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground font-medium">{t.uni}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────── */
/* CTA BANNER                                      */
/* ─────────────────────────────────────────────── */
function CtaBanner() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
          className="relative overflow-hidden rounded-[var(--radius-3xl)] bg-foreground px-8 py-20 text-center shadow-[var(--shadow-elevation-4)]"
        >
          <div className="absolute inset-0 bg-[image:var(--gradient-primary)] opacity-20" />
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-primary/30 blur-[120px] rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-background tracking-tight mb-6 text-balance">
              Join the marketplace built for your campus.
            </h2>
            <p className="text-lg md:text-xl text-background/80 font-medium mb-10 max-w-2xl mx-auto text-balance">
              Create an account in seconds and start browsing verified listings from students at
              your university.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button
                  size="xl"
                  className="w-full sm:w-auto rounded-full bg-background text-foreground hover:bg-background/90 font-bold shadow-xl"
                >
                  Create Free Account
                </Button>
              </Link>
              <Link to="/listings">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-background/20 text-background hover:bg-background/10 font-bold"
                >
                  Explore Listings
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
