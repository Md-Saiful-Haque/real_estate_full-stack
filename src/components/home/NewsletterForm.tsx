"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "Subscribed.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again shortly.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="news-email" className="sr-only">
        Email address
      </label>
      <input
        id="news-email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-h-[48px] flex-1 rounded-xl border border-card-border bg-background px-4 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-accent px-6 font-semibold text-accent-foreground hover:opacity-95 disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Subscribe"}
      </button>
      {message && (
        <p
          className={`sm:col-span-2 sm:w-full ${status === "error" ? "text-accent" : "text-primary"}`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
