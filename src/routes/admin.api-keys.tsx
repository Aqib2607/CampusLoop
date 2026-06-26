import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Key, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
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
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "sonner";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/api-keys")({ component: ApiKeysPage });

type ApiKey = {
  id: string | number;
  provider: string;
  name: string;
  priority: number;
  status: string;
  usage: number;
  failures: number;
  lastUsed: string;
};

const providerColors: Record<string, { text: string; bg: string }> = {
  openai: { text: "text-success", bg: "bg-success/10" },
  anthropic: { text: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30" },
  google: { text: "text-primary", bg: "bg-primary/10" },
};

function ApiKeysPage() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const apiKeys: ApiKey[] = [];

  return (
    <div>
      <PageHeader
        title="API Keys"
        subtitle="Manage AI provider keys, priorities, and automatic failover."
        animate
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add key
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Add API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="provider">Provider</Label>
                  <Select defaultValue="openai">
                    <SelectTrigger id="provider" className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="keyname">Key name</Label>
                  <Input id="keyname" placeholder="e.g., Primary, Backup-1" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="apikey">API key</Label>
                  <Input id="apikey" type="password" placeholder="sk-…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priority">Priority (lower = higher priority)</Label>
                  <Input id="priority" type="number" defaultValue={1} min={1} max={100} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    toast.success("API key added successfully");
                  }}
                >
                  Save key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3.5 flex items-start gap-3 mb-5 text-sm"
      >
        <Key className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-foreground/80">
          Keys are cycled automatically based on priority order. If a key fails, the system falls
          back to the next available key. Only API key hashes are stored.
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="rounded-2xl bg-card border border-border shadow-[var(--shadow-elevation-1)] overflow-hidden"
      >
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
            {apiKeys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    No API keys configured. Add your first key above.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              apiKeys.map((k) => {
                const colors = providerColors[k.provider.toLowerCase()] ?? {
                  text: "text-foreground",
                  bg: "bg-muted",
                };
                const hasFailures = k.failures > 0;

                return (
                  <TableRow key={k.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold capitalize",
                          colors.bg,
                          colors.text,
                        )}
                      >
                        {k.provider}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{k.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" size="sm">
                        #{k.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={k.status === "active" ? "success" : "destructive"}
                        dot
                        className="capitalize"
                      >
                        {k.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{k.usage.toLocaleString()} calls</TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-sm",
                          hasFailures && "text-destructive font-medium",
                        )}
                      >
                        {hasFailures && <AlertTriangle className="h-3.5 w-3.5" />}
                        {k.failures}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{k.lastUsed}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-lg"
                          onClick={() => toast.info("Rotating key...")}
                          aria-label="Rotate key"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-lg text-destructive hover:bg-destructive/5"
                            onClick={() => toast.error("Key deleted")}
                            aria-label="Delete key"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
