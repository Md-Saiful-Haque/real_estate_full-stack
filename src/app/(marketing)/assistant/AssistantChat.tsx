"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export function AssistantChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi, I am the NestFinder assistant. Ask me about buying steps, inspections, or how to use filters on the Explore page.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: userMsg }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply ?? "No response." }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "The assistant is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 flex flex-col rounded-2xl border border-card-border bg-card shadow-sm">
      <div className="max-h-[480px] space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground border border-card-border"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="border-t border-card-border p-4">
        <div className="flex gap-2">
          <label htmlFor="ai-input" className="sr-only">
            Message
          </label>
          <input
            id="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about buying or selling…"
            className="min-h-[48px] flex-1 rounded-xl border border-card-border bg-background px-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-60"
            aria-label="Send"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
