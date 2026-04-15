"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ ok: false, text: data.error ?? "Could not send." });
        return;
      }
      setFeedback({ ok: true, text: data.message });
      setMessage("");
    } catch {
      setFeedback({ ok: false, text: "Network error." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-card-border bg-card p-6 shadow-sm">
      <div>
        <label htmlFor="c-name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="c-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label htmlFor="c-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="c-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label htmlFor="c-topic" className="text-sm font-medium text-foreground">
          Topic
        </label>
        <input
          id="c-topic"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Press, partnerships, product feedback"
          className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label htmlFor="c-msg" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="c-msg"
          required
          minLength={20}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm"
        />
      </div>
      {feedback && (
        <p className={`text-sm ${feedback.ok ? "text-primary" : "text-accent"}`} role="status">
          {feedback.text}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Send message
      </button>
    </form>
  );
}
