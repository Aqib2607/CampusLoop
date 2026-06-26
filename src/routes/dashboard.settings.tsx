import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/ui/page-header";
import { useAuthStore } from "@/stores";
import { User, Bell, Lock, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({ component: Settings });

function Settings() {
  const user = useAuthStore((s) => s.user);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, notifications, and account preferences."
        animate
      />

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* ── Profile tab ── */}
        <TabsContent value="profile">
          <SettingsSection title="Profile" subtitle="Update your personal information.">
            {/* Avatar */}
            <div className="flex items-center gap-5 pb-5 border-b border-border">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
                {initials}
              </div>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Photo upload coming soon")}
                >
                  Change photo
                </Button>
                <div className="text-xs text-muted-foreground">JPG, PNG up to 5MB</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 pt-5">
              <div className="space-y-1.5">
                <Label htmlFor="fullname">Full name</Label>
                <Input id="fullname" defaultValue={user?.name ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={(user as { email?: string })?.email ?? ""}
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="university">University</Label>
                <Input id="university" placeholder="Your university name" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="bio">
                  Bio <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <textarea
                  id="bio"
                  rows={3}
                  placeholder="Tell buyers a bit about yourself…"
                  className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={() => toast.success("Profile saved!")}>Save changes</Button>
            </div>
          </SettingsSection>
        </TabsContent>

        {/* ── Notifications tab ── */}
        <TabsContent value="notifications">
          <SettingsSection title="Notifications" subtitle="Choose what notifications you receive.">
            <div className="space-y-0">
              {[
                {
                  title: "New messages",
                  desc: "Email when you receive a new message from a buyer or seller",
                  defaultOn: true,
                },
                {
                  title: "Price drop alerts",
                  desc: "Notify me when a saved listing drops in price",
                  defaultOn: true,
                },
                {
                  title: "Weekly digest",
                  desc: "Weekly roundup of new listings in your saved categories",
                  defaultOn: false,
                },
                {
                  title: "Listing activity",
                  desc: "When someone favorites or views my listing",
                  defaultOn: true,
                },
                {
                  title: "New review",
                  desc: "Email when a buyer leaves me a review",
                  defaultOn: true,
                },
              ].map((item, i) => (
                <div key={item.title}>
                  <div className="flex items-center justify-between py-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                    <Switch
                      defaultChecked={item.defaultOn}
                      onCheckedChange={(v) =>
                        toast.success(`${item.title} ${v ? "enabled" : "disabled"}`)
                      }
                      aria-label={item.title}
                    />
                  </div>
                  {i < 4 && <Separator />}
                </div>
              ))}
            </div>
          </SettingsSection>
        </TabsContent>

        {/* ── Security tab ── */}
        <TabsContent value="security">
          <SettingsSection title="Security" subtitle="Manage your password and account access.">
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="current-pw">Current password</Label>
                <Input id="current-pw" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-pw">New password</Label>
                <Input id="new-pw" type="password" placeholder="At least 8 characters" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-pw">Confirm new password</Label>
                <Input id="confirm-pw" type="password" placeholder="••••••••" />
              </div>
              <Button onClick={() => toast.success("Password updated!")}>Update password</Button>
            </div>
          </SettingsSection>

          {/* Danger zone */}
          <SettingsSection
            title="Danger Zone"
            subtitle="Irreversible actions for your account."
            danger
          >
            <div className="flex items-start gap-3 text-sm text-muted-foreground mb-5">
              <AlertTriangle
                className="h-4 w-4 text-destructive shrink-0 mt-0.5"
                aria-hidden="true"
              />
              Once you delete your account, all your listings, messages, and data will be
              permanently removed. This action cannot be undone.
            </div>
            <Button
              variant="destructive"
              onClick={() => toast.error("Account deletion requires confirmation")}
            >
              Delete account
            </Button>
          </SettingsSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsSection({
  title,
  subtitle,
  children,
  danger,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl bg-card border shadow-[var(--shadow-elevation-1)] p-6 mb-5 ${
        danger ? "border-destructive/40 bg-destructive/3" : "border-border"
      }`}
    >
      <div className="mb-5">
        <div className={`font-semibold ${danger ? "text-destructive" : ""}`}>{title}</div>
        {subtitle && <div className="text-sm text-muted-foreground mt-0.5">{subtitle}</div>}
      </div>
      {children}
    </motion.div>
  );
}
