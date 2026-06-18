import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Package, Heart, MessageSquare, Star, Settings } from "lucide-react";
import { SectionShell, type NavItem } from "@/components/section-shell";

const items: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/listings", label: "My Listings", icon: Package },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/reviews", label: "Reviews", icon: Star },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/dashboard")({
  component: () => <SectionShell title="Dashboard" items={items}><Outlet /></SectionShell>,
});
