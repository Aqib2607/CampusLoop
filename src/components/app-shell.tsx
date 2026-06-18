import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Heart, MessageSquare, Bell, User, Home, Plus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/stores";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hide = pathname === "/login" || pathname === "/register";

  if (hide) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}

function TopBar() {
  const unread = useNotificationStore((s) => s.unread);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-black">
            C
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block">CampusLoop</span>
        </Link>

        <div className="relative flex-1 max-w-xl hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search listings, sellers, categories…"
            className="w-full h-10 rounded-full bg-muted pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <nav className="ml-auto flex items-center gap-1">
          <Link to="/listings" className="hidden md:block">
            <Button variant="ghost" size="sm">Browse</Button>
          </Link>
          <Link to="/favorites" className="hidden md:inline-flex">
            <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
          </Link>
          <Link to="/messages" className="hidden md:inline-flex">
            <Button variant="ghost" size="icon"><MessageSquare className="h-5 w-5" /></Button>
          </Link>
          <Link to="/notifications" className="relative hidden md:inline-flex">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            {unread > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-destructive text-destructive-foreground">
                {unread}
              </Badge>
            )}
          </Link>
          <Link to="/dashboard" className="hidden md:inline-flex">
            <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
          </Link>
          <Link to="/dashboard/listings">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Sell</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MobileNav() {
  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/listings", icon: Search, label: "Browse" },
    { to: "/favorites", icon: Heart, label: "Saved" },
    { to: "/messages", icon: MessageSquare, label: "Chats" },
    { to: "/dashboard", icon: User, label: "Me" },
  ] as const;
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card">
      <div className="grid grid-cols-5">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="flex flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground [&.active]:text-primary"
            activeProps={{ className: "active" }}
            activeOptions={{ exact: it.to === "/" }}
          >
            <it.icon className="h-5 w-5" />
            <span>{it.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-black">C</div>
            <span className="font-bold">CampusLoop</span>
          </div>
          <p className="text-sm text-muted-foreground">Buy, sell & connect across campus.</p>
        </div>
        <FooterCol title="Marketplace" links={["Browse", "Categories", "Featured", "Create Listing"]} />
        <FooterCol title="Company" links={["About", "Careers", "Press", "Contact"]} />
        <FooterCol title="Legal" links={["Terms", "Privacy", "Safety", "Guidelines"]} />
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CampusLoop — Built for students.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="font-semibold mb-3 text-sm">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l) => <li key={l} className="hover:text-foreground cursor-pointer">{l}</li>)}
      </ul>
    </div>
  );
}

export { LogIn };
