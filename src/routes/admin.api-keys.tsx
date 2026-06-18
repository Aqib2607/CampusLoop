import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";

export const Route = createFileRoute("/admin/api-keys")({ component: ApiKeysPage });

function ApiKeysPage() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const apiKeys: any[] = [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Key className="h-7 w-7" /> API Keys
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage AI provider keys, priorities and failover.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Provider</Label>
                <Select defaultValue="openai">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Key name</Label>
                <Input className="mt-1.5" placeholder="e.g., Primary" />
              </div>
              <div>
                <Label>API key</Label>
                <Input className="mt-1.5" type="password" placeholder="sk-…" />
              </div>
              <div>
                <Label>Priority</Label>
                <Input className="mt-1.5" type="number" defaultValue={1} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  toast.success("API key added");
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Key Name</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Failures</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.length > 0 ? (
              apiKeys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.provider}</TableCell>
                  <TableCell>{k.name}</TableCell>
                  <TableCell>{k.priority}</TableCell>
                  <TableCell>
                    <Badge variant={k.status === "active" ? "secondary" : "destructive"}>
                      {k.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{k.usage.toLocaleString()}</TableCell>
                  <TableCell className={k.failures > 0 ? "text-destructive" : ""}>
                    {k.failures}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{k.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Disable
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No API Keys found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
