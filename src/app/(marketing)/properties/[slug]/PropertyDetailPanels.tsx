"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { PropertyCardData } from "@/components/property/PropertyCard";

type Review = {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export function PropertyDetailPanels({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const { status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [inquiry, setInquiry] = useState("");
  const [inquiryDate, setInquiryDate] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [r, rel] = await Promise.all([
          fetch(`/api/properties/${slug}/reviews`).then((res) => res.json()),
          fetch(`/api/properties/${slug}/related`).then((res) => res.json()),
        ]);
        setReviews(r.items ?? []);
        setRelated(rel.items ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "authenticated") return;
    setReviewSubmitting(true);
    setFormMsg(null);
    try {
      const res = await fetch(`/api/properties/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: slug, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormMsg({ type: "error", text: data.error ?? "Could not post review." });
        return;
      }
      setFormMsg({ type: "success", text: data.message ?? "Posted." });
      setComment("");
      const r = await fetch(`/api/properties/${slug}/reviews`).then((x) => x.json());
      setReviews(r.items ?? []);
    } catch {
      setFormMsg({ type: "error", text: "Network error." });
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "authenticated") return;
    setInquirySubmitting(true);
    setInquiryMsg("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: slug,
          message: inquiry,
          scheduledAt: inquiryDate || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInquiryMsg(data.error ?? "Could not send request.");
        return;
      }
      setInquiryMsg(data.message ?? "Sent.");
      setInquiry("");
      setInquiryDate("");
    } catch {
      setInquiryMsg("Network error.");
    } finally {
      setInquirySubmitting(false);
    }
  }

  async function summarize() {
    if (reviews.length === 0) return;
    setSummaryLoading(true);
    setSummary(null);
    try {
      const res = await fetch("/api/ai/summarize-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews }),
      });
      const data = await res.json();
      setSummary(data.summary ?? null);
    } catch {
      setSummary("Could not generate a summary right now.");
    } finally {
      setSummaryLoading(false);
    }
  }

  return (
    <>
      <section className="mt-16 border-t border-card-border pt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
          {reviews.length > 0 && (
            <button
              type="button"
              onClick={summarize}
              disabled={summaryLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 disabled:opacity-60"
            >
              {summaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Summarize reviews with AI
            </button>
          )}
        </div>
        {summary && (
          <div className="mt-4 rounded-2xl border border-card-border bg-card p-4 text-sm whitespace-pre-line text-foreground">
            {summary}
          </div>
        )}
        {loading ? (
          <p className="mt-6 text-muted">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="mt-6 text-muted">No reviews yet. Be the first to share feedback after a tour.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {reviews.map((rev) => (
              <li key={rev._id} className="rounded-2xl border border-card-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">{rev.userName}</span>
                  <span className="text-sm text-accent">{rev.rating} / 5</span>
                </div>
                <p className="mt-2 text-sm text-muted">{rev.comment}</p>
                <time className="mt-2 block text-xs text-muted" dateTime={rev.createdAt}>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 rounded-2xl border border-card-border bg-background p-6">
          <h3 className="text-lg font-semibold text-foreground">Write a review</h3>
          {status === "loading" ? (
            <p className="mt-2 text-sm text-muted">Checking your session…</p>
          ) : status === "unauthenticated" ? (
            <p className="mt-2 text-sm text-muted">
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>{" "}
              to leave a review for {title}.
            </p>
          ) : (
            <form onSubmit={submitReview} className="mt-4 space-y-4">
              <div>
                <label htmlFor="rating" className="text-sm font-medium text-foreground">
                  Rating
                </label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="mt-1 w-full max-w-xs rounded-xl border border-card-border bg-card px-3 py-2 text-foreground"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="comment" className="text-sm font-medium text-foreground">
                  Comments
                </label>
                <textarea
                  id="comment"
                  required
                  minLength={10}
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share what stood out—layout, light, noise, or communication with the listing team."
                  className="mt-1 w-full rounded-xl border border-card-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {reviewSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Publish review
              </button>
              {formMsg && (
                <p
                  className={`text-sm ${formMsg.type === "error" ? "text-accent" : "text-primary"}`}
                  role="status"
                >
                  {formMsg.text}
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      <section className="mt-16 border-t border-card-border pt-12">
        <h2 className="text-2xl font-bold text-foreground">Request a viewing</h2>
        <p className="mt-2 text-sm text-muted">
          Add timing questions or financing constraints—the listing team receives everything in one thread.
        </p>
        {status === "unauthenticated" ? (
          <p className="mt-4 text-sm">
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>{" "}
            to schedule a tour.
          </p>
        ) : (
          <form onSubmit={submitInquiry} className="mt-6 max-w-xl space-y-4">
            <div>
              <label htmlFor="tour-date" className="text-sm font-medium text-foreground">
                Preferred window (optional)
              </label>
              <input
                id="tour-date"
                type="datetime-local"
                value={inquiryDate}
                onChange={(e) => setInquiryDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-card-border bg-card px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label htmlFor="inquiry-msg" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="inquiry-msg"
                required
                minLength={20}
                rows={4}
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder="Mention schools, commute targets, or offer timelines so the agent prepares comparables."
                className="mt-1 w-full rounded-xl border border-card-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={inquirySubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground disabled:opacity-60"
            >
              {inquirySubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit request
            </button>
            {inquiryMsg && (
              <p className="text-sm text-primary" role="status">
                {inquiryMsg}
              </p>
            )}
          </form>
        )}
      </section>

      <section className="mt-16 border-t border-card-border pt-12">
        <h2 className="text-2xl font-bold text-foreground">Related listings</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
        {related.length === 0 && !loading && (
          <p className="mt-4 text-muted">No similar listings found in this category yet.</p>
        )}
      </section>
    </>
  );
}
