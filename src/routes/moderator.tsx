import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Package, Flag } from "lucide-react";
import { SectionShell, type NavItem } from "@/components/section-shell";

const items: NavItem[] = [
  { to: "/moderator", label: "Overview", icon: LayoutDashboard },
  { to: "/moderator/listings", label: "Listings Queue", icon: Package },
  { to: "/moderator/reports", label: "Reports", icon: Flag },
];

export const Route = createFileRoute("/moderator")({
  component: () => <SectionShell title="Moderator" items={items}><Outlet /></SectionShell>,
});
