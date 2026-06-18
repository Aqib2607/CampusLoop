import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/settings")({ component: Settings });

function Settings() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <Card title="Profile">
          <div className="flex items-center gap-4 mb-5">
            <img src="https://i.pravatar.cc/100?img=8" className="h-16 w-16 rounded-full" alt="" />
            <Button variant="outline" size="sm">
              Change photo
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Full name</Label>
              <Input defaultValue="Jordan Lee" className="mt-1.5" />
            </div>
            <div>
              <Label>Email</Label>
              <Input defaultValue="jordan@uni.edu" className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label>University</Label>
              <Input defaultValue="Stanford University" className="mt-1.5" />
            </div>
          </div>
        </Card>
        <Card title="Notifications">
          {[
            "Email me when I get a new message",
            "Notify me about price drops on saved items",
            "Weekly digest of new listings in my categories",
          ].map((t, i) => (
            <div key={t}>
              <div className="flex items-center justify-between py-3">
                <div className="text-sm">{t}</div>
                <Switch defaultChecked={i !== 2} />
              </div>
              {i < 2 && <Separator />}
            </div>
          ))}
        </Card>
        <Card title="Danger zone">
          <Button variant="destructive">Delete account</Button>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      <div className="font-bold mb-4">{title}</div>
      {children}
    </div>
  );
}
