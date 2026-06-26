import { Link, useRouterState } from "@tanstack/react-router";
import {
  Search,
  Heart,
  MessageSquare,
  Bell,
  Home,
  Plus,
  LogIn,
  Moon,
  Sun,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Settings,
  Shield,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/stores";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/stores";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ---------- Dark mode hook ---------- */
function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = () => {
    const isDark = !dark;
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  };
  return { dark, toggle };
}

/* ---------- App Shell ---------- */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hide = pathname === "/login" || pathname === "/register";

  if (hide) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-foreground">
      <button
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("main-content");
          if (main) {
            main.tabIndex = -1;
            main.focus();
          }
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-md"
      >
        Skip to main content
      </button>

      {/* Decorative ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10" />
      </div>

      <TopBar />

      {/* Page Transitions Wrapper */}
      <main id="main-content" className="flex-1 pb-20 md:pb-0 relative z-10 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

/* ---------- Top Bar ---------- */
function TopBar() {
  const unread = useNotificationStore((s) => s.unread);
  const { user, logout } = useAuthStore();
  const { dark, toggle } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [userMenuOpen]);

  return (
    <header className="sticky top-0 z-40 glass-nav">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          aria-label="CampusLoop home"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-white font-black shadow-[var(--shadow-glow-primary)] group-hover:scale-105 transition-transform">
            <Command className="h-4 w-4" />
          </div>
          <span className="text-[17px] font-bold tracking-tight hidden sm:block">
            Campus<span className="text-primary">Loop</span>
          </span>
        </Link>

        {/* Global Search Bar (CMD+K style) */}
        <div className="relative flex-1 max-w-lg hidden md:block ml-4">
          <motion.div
            animate={{ width: searchFocused ? "100%" : "280px" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="relative"
          >
            <Search
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors",
                searchFocused ? "text-primary" : "text-muted-foreground",
              )}
            />
            <input
              id="global-search"
              name="q"
              type="search"
              aria-label="Search marketplace"
              placeholder="Search marketplace..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                "w-full h-9 rounded-full bg-muted/60 border border-transparent pl-9 pr-14 text-sm text-foreground shadow-sm",
                "placeholder:text-muted-foreground/60 placeholder:font-medium",
                "transition-all duration-300",
                "hover:bg-muted hover:border-border/50",
                "focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[var(--shadow-glow-primary)] outline-none",
              )}
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 pointer-events-none">
              <kbd className="inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-[9px]">⌘</span>K
              </kbd>
            </div>
          </motion.div>
        </div>

        {/* Right Nav */}
        <nav className="ml-auto flex items-center gap-1.5" aria-label="Main navigation">
          <Link to="/listings" className="hidden lg:block relative group">
            <div className="px-3 py-1.5 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Browse
            </div>
            {pathname.startsWith("/listings") && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-muted/80 rounded-full -z-10"
              />
            )}
          </Link>

          <div className="w-[1px] h-4 bg-border mx-1 hidden lg:block" />

          {/* Quick Actions */}
          <Link to="/favorites" className="hidden md:inline-flex relative group">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/80">
              <Heart className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
            </Button>
          </Link>

          <Link to="/messages" className="hidden md:inline-flex relative group">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/80">
              <MessageSquare className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
            </Button>
          </Link>

          <Link to="/notifications" className="relative hidden md:inline-flex group">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/80">
              <Bell className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
            </Button>
            <AnimatePresence>
              {unread > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-background"
                >
                  {unread > 9 ? "9+" : unread}
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Theme */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-muted/80 hidden sm:inline-flex"
            onClick={toggle}
          >
            <AnimatePresence mode="wait">
              {dark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-[18px] w-[18px] text-muted-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-[18px] w-[18px] text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <div className="w-[1px] h-4 bg-border mx-1 hidden md:block" />

          {/* Auth State */}
          {user ? (
            <div
              className="relative hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen((v) => !v);
              }}
            >
              <button
                className={cn(
                  "flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-sm font-medium transition-all hover:bg-muted/80 border border-transparent hover:border-border",
                  userMenuOpen && "bg-muted/80 border-border",
                )}
              >
                <div className="h-7 w-7 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[80px] truncate hidden lg:block">{user.name}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform duration-300",
                    userMenuOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-3 w-56 rounded-[var(--radius-xl)] border border-border glass-panel shadow-[var(--shadow-elevation-3)] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 bg-muted/30">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium capitalize mt-0.5">
                        {(user as { role?: string }).role ?? "Student"} Account
                      </div>
                    </div>
                    <div className="p-1.5">
                      <UserMenuItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                      {((user as { role?: string }).role === "admin" ||
                        (user as { role?: string }).role === "moderator") && (
                        <UserMenuItem to="/admin" icon={Shield} label="Admin Panel" />
                      )}
                      <UserMenuItem to="/dashboard/settings" icon={Settings} label="Settings" />
                    </div>
                    <div className="p-1.5 border-t border-border">
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm" className="rounded-full font-medium h-9 px-4">
                Sign in
              </Button>
            </Link>
          )}

          {/* Primary CTA */}
          <Link to="/dashboard/listings">
            <Button
              variant="premium"
              size="sm"
              className="rounded-full ml-2 font-semibold h-9 px-4 hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Sell Item
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function UserMenuItem({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

/* ---------- Mobile Navigation ---------- */
function MobileNav() {
  const { user } = useAuthStore();
  const unread = useNotificationStore((s) => s.unread);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/listings", icon: Search, label: "Browse" },
    { to: "/messages", icon: MessageSquare, label: "Chats", badge: 0 },
    { to: "/notifications", icon: Bell, label: "Alerts", badge: unread },
    user
      ? { to: "/dashboard", icon: User, label: "Me" }
      : { to: "/login", icon: LogIn, label: "Sign in" },
  ] as const;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/80 backdrop-blur-xl pb-safe"
      aria-label="Mobile navigation"
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <Link to="/dashboard/listings">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="h-12 w-12 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow-primary)] border-4 border-background"
          >
            <Plus className="h-5 w-5 text-white" />
          </motion.div>
        </Link>
      </div>
      <div className="grid grid-cols-5 h-[64px]">
        {items.map((item) => {
          const isActive =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to as string);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors"
            >
              <div className="relative">
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive ? "text-primary scale-110" : "text-muted-foreground",
                  )}
                />
                {"badge" in item && (item as { badge?: number }).badge! > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-[9px] font-bold text-white ring-2 ring-background">
                    {(item as { badge?: number }).badge! > 9
                      ? "9+"
                      : (item as { badge?: number }).badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary font-bold" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] shadow-sm">
              <Command className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Campus<span className="text-primary">Loop</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
            A premium student marketplace designed for speed, trust, and connection. Buy, sell, and
            trade within your verified campus ecosystem.
          </p>
          <div className="flex gap-4 text-muted-foreground">
            <div className="text-xs font-mono font-medium tracking-wide">ACADEMIC DEMO</div>
          </div>
        </div>
        <FooterCol
          title="Marketplace"
          links={[
            { label: "Browse Products", href: "/listings" },
            { label: "Sell an Item", href: "/dashboard/listings" },
            { label: "Saved Items", href: "/favorites" },
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            { label: "Your Dashboard", href: "/dashboard" },
            { label: "Settings", href: "/dashboard/settings" },
            { label: "Sign In", href: "/login" },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { label: "Terms of Service", href: "/" },
            { label: "Privacy Policy", href: "/" },
            { label: "Trust & Safety", href: "/" },
          ]}
        />
      </div>
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground">
          <p>© {new Date().getFullYear()} CampusLoop Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> AI Moderated Platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-5 text-foreground">{title}</h3>
      <ul className="space-y-3.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.href}
              className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
