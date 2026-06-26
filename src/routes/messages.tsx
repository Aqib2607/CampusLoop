import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Send,
  Mic,
  Image as ImageIcon,
  FileText,
  Paperclip,
  CheckCheck,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagingService } from "@/services/messaging.service";
import { useAuthStore } from "@/stores";
import { ConversationSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import echo from "@/lib/echo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages")({ component: MessagesPage });

function MessagesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [active, setActive] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: convData, isPending: isConvPending } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => messagingService.getConversations(),
  });
  const conversations = convData?.data || [];

  const { data: msgData, isPending: isMsgPending } = useQuery({
    queryKey: ["messages", active],
    queryFn: () => messagingService.getMessages(active!),
    enabled: !!active,
  });
  const msgs = msgData?.data || [];
  const displayMsgs = [...msgs].reverse();

  const sendMutation = useMutation({
    mutationFn: () => messagingService.sendMessage(active!, draft),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["messages", active] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMsgs.length]);

  useEffect(() => {
    if (!active) return;
    const channelName = `conversation.${active}`;
    echo.private(channelName).listen(".message.sent", () => {
      queryClient.invalidateQueries({ queryKey: ["messages", active] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });
    return () => {
      echo.leave(channelName);
    };
  }, [active, queryClient]);

  const conv = active ? conversations.find((c) => c.id === active) : null;
  const otherUser = conv ? (conv.buyer_id === user?.id ? conv.seller : conv.buyer) : null;

  const send = () => {
    if (!draft.trim() || !active) return;
    sendMutation.mutate();
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQ) return true;
    const other = c.buyer_id === user?.id ? c.seller : c.buyer;
    return (
      other?.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
      c.listing?.title?.toLowerCase().includes(searchQ.toLowerCase())
    );
  });

  const avatarUrl = (name?: string) =>
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Crect width='44' height='44' fill='%234f46e5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='17' font-weight='bold' fill='white'%3E${encodeURIComponent((name?.[0] ?? "U").toUpperCase())}%3C/text%3E%3C/svg%3E`;

  return (
    <div
      className="mx-auto max-w-[1400px] h-[calc(100vh-73px)] p-4 md:p-6 lg:p-8"
      role="main"
      aria-label="Messages"
    >
      <div className="flex h-full rounded-[var(--radius-3xl)] overflow-hidden glass-panel border border-border shadow-[var(--shadow-elevation-3)]">
        {/* ── Conversation List (Sidebar) ── */}
        <aside className="w-[340px] shrink-0 border-r border-border/50 bg-card/50 flex flex-col hidden md:flex">
          {/* Header */}
          <div className="px-5 pt-6 pb-4 border-b border-border/50 bg-muted/20">
            <h1 className="font-black text-2xl mb-4 text-foreground">Inbox</h1>
            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Search messages…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="pl-10 h-10 rounded-[var(--radius-xl)] bg-background border-border shadow-sm focus:border-primary focus:ring-primary/20"
                aria-label="Search conversations"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {isConvPending ? (
              Array.from({ length: 6 }).map((_, i) => <ConversationSkeleton key={i} />)
            ) : filteredConversations.length === 0 ? (
              <div className="mt-8">
                <EmptyState variant="messages" size="sm" />
              </div>
            ) : (
              filteredConversations.map((c) => {
                const other = c.buyer_id === user?.id ? c.seller : c.buyer;
                const isActive = active === c.id;
                const hasUnread = (c.unread_count || 0) > 0;

                return (
                  <motion.button
                    key={c.id}
                    onClick={() => setActive(c.id)}
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-[var(--radius-2xl)] text-left transition-all duration-200 border",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md border-primary/20"
                        : "hover:bg-muted/60 bg-transparent border-transparent text-foreground hover:border-border",
                    )}
                    aria-selected={isActive}
                    aria-label={`Conversation with ${other?.name ?? "Unknown"}`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={other?.avatar || avatarUrl(other?.name)}
                        alt={other?.name ?? "User"}
                        className="h-12 w-12 rounded-full object-cover border-2 border-background/50 shadow-sm"
                      />
                      {/* Online indicator */}
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2",
                          isActive ? "bg-white border-primary" : "bg-success border-card",
                        )}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={cn(
                            "text-sm truncate",
                            hasUnread ? "font-black" : "font-bold",
                            isActive ? "text-primary-foreground" : "text-foreground",
                          )}
                        >
                          {other?.name ?? "Unknown"}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-bold shrink-0",
                            isActive ? "text-primary-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {new Date(c.updated_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-xs truncate font-medium",
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                          )}
                        >
                          {c.listing?.title ?? "Direct message"}
                        </span>
                        {hasUnread && !isActive && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 shrink-0 shadow-sm">
                            {c.unread_count! > 9 ? "9+" : c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Chat Window ── */}
        <section className="flex-1 flex flex-col bg-background/50 relative">
          {conv && otherUser ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-border/50 bg-card/80 backdrop-blur-md shadow-sm z-10">
                <div className="relative">
                  <img
                    src={otherUser.avatar || avatarUrl(otherUser.name)}
                    alt={otherUser.name ?? "User"}
                    className="h-11 w-11 rounded-full object-cover shadow-sm border border-border"
                  />
                  <span
                    className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-base text-foreground">{otherUser.name}</div>
                  {conv.listing && (
                    <div className="text-xs font-semibold text-muted-foreground truncate flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Re: {conv.listing.title}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Voice call"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Video call"
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="More options"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  {isMsgPending ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}
                      >
                        <div className="skeleton-shimmer h-12 w-2/3 rounded-2xl" />
                      </div>
                    ))
                  ) : displayMsgs.length > 0 ? (
                    displayMsgs.map((m, idx) => {
                      const isMe = m.sender_id === user?.id;
                      const showTime =
                        idx === displayMsgs.length - 1 ||
                        displayMsgs[idx + 1]?.sender_id !== m.sender_id;

                      return (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                          className={cn("flex", isMe ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[75%]",
                              isMe ? "items-end flex flex-col" : "items-start flex flex-col",
                            )}
                          >
                            <div
                              className={cn(
                                "px-5 py-3 text-[15px] font-medium leading-relaxed shadow-sm",
                                isMe
                                  ? "bg-primary text-primary-foreground rounded-[24px] rounded-br-[8px]"
                                  : "bg-card border border-border text-foreground rounded-[24px] rounded-bl-[8px]",
                              )}
                            >
                              {m.content}
                            </div>
                            {showTime && (
                              <div
                                className={cn(
                                  "flex items-center gap-1.5 mt-1.5 px-2 text-[11px] font-bold text-muted-foreground",
                                  isMe ? "justify-end" : "justify-start",
                                )}
                              >
                                {new Date(m.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                {isMe && (
                                  <CheckCheck
                                    className="h-3.5 w-3.5 text-primary"
                                    aria-label="Delivered"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center min-h-[400px]">
                      <div className="text-center p-8 glass-panel rounded-[var(--radius-3xl)] max-w-sm border-dashed border-2 border-border/50">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <MessageSquare className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-black mb-2 text-foreground">Say hi! 👋</h3>
                        <p className="text-sm font-medium text-muted-foreground">
                          Start the conversation by sending a message to {otherUser.name}.
                        </p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              </div>

              {/* Input area */}
              <div className="p-4 bg-card/80 backdrop-blur-md border-t border-border/50 z-10">
                <div className="flex items-center gap-3 bg-background rounded-full p-2 border border-border shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-1 pl-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                      aria-label="Attach file"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 hidden sm:flex"
                      aria-label="Send image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder="Message..."
                    className="flex-1 h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 px-2 text-[15px] font-medium"
                    disabled={sendMutation.isPending}
                    aria-label="Message input"
                  />

                  <div className="pr-1 flex items-center gap-2">
                    {draft.trim() ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Button
                          onClick={send}
                          disabled={sendMutation.isPending}
                          size="icon"
                          className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95"
                          aria-label="Send message"
                        >
                          <Send className="h-4 w-4 ml-0.5" />
                        </Button>
                      </motion.div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80"
                        aria-label="Voice message"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/10 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
              <EmptyState
                variant="messages"
                title="Your Inbox"
                description="Select a conversation from the sidebar to view your messages."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
