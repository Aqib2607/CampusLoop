import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Paperclip, Send, Mic, Image as ImageIcon, FileText, Check, CheckCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { conversations, messages as initialMsgs } from "@/lib/mock-data";

export const Route = createFileRoute("/messages")({ component: MessagesPage });

function MessagesPage() {
  const [active, setActive] = useState(conversations[0].id);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState(initialMsgs);
  const conv = conversations.find((c) => c.id === active)!;

  const send = () => {
    if (!draft.trim()) return;
    setMsgs([...msgs, { id: `${Date.now()}`, from: "me", text: draft, time: "now" }]);
    setDraft("");
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
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`w-full flex items-center gap-3 p-4 border-b border-border text-left hover:bg-muted/50 ${active === c.id ? "bg-accent" : ""}`}
            >
              <img src={c.avatar} alt="" className="h-11 w-11 rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-baseline gap-2">
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground shrink-0">{c.time}</div>
                </div>
                <div className="text-sm text-muted-foreground truncate">{c.last}</div>
              </div>
              {c.unread > 0 && (
                <div className="grid h-5 min-w-5 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold px-1.5">
                  {c.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat window */}
      <section className="flex flex-col bg-background">
        <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
          <img src={conv.avatar} alt="" className="h-10 w-10 rounded-full" />
          <div>
            <div className="font-semibold">{conv.name}</div>
            <div className="text-xs text-success flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />Online · typing…
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "me" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
                <div>{m.text}</div>
                <div className={`text-[10px] mt-1 flex items-center gap-1 ${m.from === "me" ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"}`}>
                  {m.time}
                  {m.from === "me" && <CheckCheck className="h-3 w-3" />}
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:.3s]" />
            </span>
            {conv.name} is typing
          </div>
        </div>

        <div className="border-t border-border bg-card p-3">
          <div className="flex items-center gap-1 mb-2">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ImageIcon className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><FileText className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Mic className="h-4 w-4" /></Button>
          </div>
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="h-11"
            />
            <Button onClick={send} size="lg" className="px-4"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export { Check };
