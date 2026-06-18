import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Package, Flag } from "lucide-react";
import { SectionShell, type NavItem } from "@/components/section-shell";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";

const items: NavItem[] = [
  { to: "/moderator", label: "Overview", icon: LayoutDashboard },
  { to: "/moderator/listings", label: "Listings Queue", icon: Package },
  { to: "/moderator/reports", label: "Reports", icon: Flag },
];

export const Route = createFileRoute("/moderator")({
  component: ModeratorLayout,
});

function ModeratorLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const isAllowed = isAuthenticated && (user?.role === "admin" || user?.role === "moderator");

  useEffect(() => {
    if (!isAllowed) {
      navigate({ to: "/" });
    }
  }, [isAllowed, navigate]);

  if (!isAllowed) {
    return null; // Prevent flashing
  }

  return (
    <SectionShell title="Moderator" items={items}>
      <Outlet />
    </SectionShell>
  );
}
