import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, Package, Flag, Key, BarChart3 } from "lucide-react";
import { SectionShell, type NavItem } from "@/components/section-shell";
import { useAuthStore } from "@/stores";
import { useEffect, useMemo } from "react";

const allItems: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/listings", label: "Listings", icon: Package },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/api-keys", label: "API Keys", icon: Key },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const isAllowed = isAuthenticated && (user?.role === "admin" || user?.role === "moderator");

  useEffect(() => {
    if (!isAllowed) {
      navigate({ to: "/" });
    }
  }, [isAllowed, navigate]);

  const items = useMemo(() => {
    if (user?.role === "admin") return allItems;
    // Moderators only get a subset of admin routes
    return allItems.filter(i => 
      ["Overview", "Listings", "Reports", "API Keys"].includes(i.label)
    );
  }, [user?.role]);

  if (!isAllowed) {
    return null; // Prevent flashing while redirecting
  }

  return (
    <SectionShell title="Admin" items={items}>
      <Outlet />
    </SectionShell>
  );
}
