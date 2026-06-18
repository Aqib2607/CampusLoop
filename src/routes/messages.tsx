import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Paperclip,
  Send,
  Mic,
  Image as ImageIcon,
  FileText,
  Check,
  CheckCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagingService } from "@/services/messaging.service";
import { useAuthStore } from "@/stores";
import { Skeleton } from "@/components/ui/skeleton";
import echo from "@/lib/echo";

export const Route = createFileRoute("/messages")({ component: MessagesPage });

function MessagesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [active, setActive] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const { data: convData, isPending: isConvPending } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => messagingService.getConversations(),
  });
  const conversations = convData?.data || [];

  const { data: msgData, isPending: isMsgPending } = useQuery({
    queryKey: ["messages", active],
    queryFn: () => (active ? messagingService.getMessages(active) : Promise.resolve({ data: [] })),
    enabled: !!active,
  });
  const msgs = msgData?.data || [];
  // Backend returns messages descending (newest first). Let's reverse them for display.
  const displayMsgs = [...msgs].reverse();

  const sendMutation = useMutation({
    mutationFn: () => messagingService.sendMessage(active!, draft),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["messages", active] });
    },
  });

  useEffect(() => {
    if (!active) return;

    const channelName = `conversation.${active}`;
    const channel = echo.private(channelName).listen(".message.sent", () => {
      queryClient.invalidateQueries({ queryKey: ["messages", active] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    return () => {
      echo.leave(channelName);
    };
  }, [active, queryClient]);

  const conv = active ? conversations.find((c) => c.id === active) : null;

  const send = () => {
    if (!draft.trim() || !active) return;
    sendMutation.mutate();
  };

  return (
    <div className="mx-auto max-w-7xl h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] grid md:grid-cols-[320px_1fr]">
      {/* Conversation list */}
      <aside className="border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-lg mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-9 h-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isConvPending ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 border-b border-border">
                <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : (
            conversations.map((c) => {
              const otherUser = c.buyer_id === user?.id ? c.seller : c.buyer;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`w-full flex items-center gap-3 p-4 border-b border-border text-left hover:bg-muted/50 ${active === c.id ? "bg-accent" : ""}`}
                >
                  <img
                    src={otherUser?.avatar || "https://via.placeholder.com/150"}
                    alt=""
                    className="h-11 w-11 rounded-full shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <div className="font-semibold truncate">{otherUser?.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground shrink-0">
                        {new Date(c.updated_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{c.listing?.title}</div>
                  </div>
                  {(c.unread_count || 0) > 0 && (
                    <div className="grid h-5 min-w-5 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold px-1.5">
                      {c.unread_count}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Chat window */}
      <section className="flex flex-col bg-background">
        {conv ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
              <img
                src={
                  (conv.buyer_id === user?.id ? conv.seller?.avatar : conv.buyer?.avatar) ||
                  "https://via.placeholder.com/150"
                }
                alt=""
                className="h-10 w-10 rounded-full"
              />
              <div>
                <div className="font-semibold">
                  {conv.buyer_id === user?.id ? conv.seller?.name : conv.buyer?.name}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted" />
                  Offline
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isMsgPending ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                    <Skeleton className="h-10 w-2/3 rounded-2xl" />
                  </div>
                ))
              ) : displayMsgs.length > 0 ? (
                displayMsgs.map((m) => {
                  const isMe = m.sender_id === user?.id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}
                      >
                        <div>{m.content}</div>
                        <div
                          className={`text-[10px] mt-1 flex items-center gap-1 ${isMe ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"}`}
                        >
                          {new Date(m.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isMe && <CheckCheck className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Say hi! 👋
                </div>
              )}
            </div>

            <div className="border-t border-border bg-card p-3">
              <div className="flex items-center gap-1 mb-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type a message…"
                  className="h-11"
                  disabled={sendMutation.isPending}
                />
                <Button onClick={send} disabled={sendMutation.isPending} size="lg" className="px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation
          </div>
        )}
      </section>
    </div>
  );
}

export { Check };
