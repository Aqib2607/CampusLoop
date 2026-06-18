import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, Package, Flag, Key, BarChart3 } from "lucide-react";
import { SectionShell, type NavItem } from "@/components/section-shell";

const items: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/listings", label: "Listings", icon: Package },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/api-keys", label: "API Keys", icon: Key },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export const Route = createFileRoute("/admin")({
  component: () => <SectionShell title="Admin" items={items}><Outlet /></SectionShell>,
});
