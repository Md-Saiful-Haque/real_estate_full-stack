"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function ProfileForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/user/profile");
      if (!res.ok) return;
      const data = await res.json();
      setName(data.name ?? "");
      setPhone(data.phone ?? "");
      setBio(data.bio ?? "");
      setImageUrl(data.image ?? "");
    }
    loadProfile();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, bio }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "err", text: data.error ?? "Could not save." });
        return;
      }
      await update({ name });
      setMsg({ type: "ok", text: data.message ?? "Saved." });
    } catch {
      setMsg({ type: "err", text: "Network error." });
    } finally {
      setLoading(false);
    }
  }

  async function saveAvatar(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setAvatarLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: imageUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "err", text: data.error ?? "Invalid image URL." });
        return;
      }
      await update({});
      setMsg({ type: "ok", text: data.message ?? "Photo updated." });
    } catch {
      setMsg({ type: "err", text: "Network error." });
    } finally {
      setAvatarLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={saveAvatar} className="rounded-2xl border border-card-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Profile photo</h2>
        <p className="mt-1 text-sm text-muted">Paste an HTTPS link to a square image (for example from Unsplash).</p>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="mt-4 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={avatarLoading}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-card-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {avatarLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Update avatar
        </button>
      </form>

      <form onSubmit={saveProfile} className="rounded-2xl border border-card-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Account details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="p-name">
              Display name
            </label>
            <input
              id="p-name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted" htmlFor="p-email">
              Email
            </label>
            <input
              id="p-email"
              value={initialEmail}
              disabled
              className="mt-1 w-full rounded-xl border border-card-border bg-card-border/30 px-3 py-2.5 text-sm text-muted"
            />
            <p className="mt-1 text-xs text-muted">Email changes require support today.</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="p-phone">
              Phone (optional)
            </label>
            <input
              id="p-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="p-bio">
              Short bio (optional)
            </label>
            <textarea
              id="p-bio"
              rows={3}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-sm"
            />
          </div>
        </div>
        {msg && (
          <p className={`mt-4 text-sm ${msg.type === "ok" ? "text-primary" : "text-accent"}`} role="status">
            {msg.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save profile
        </button>
      </form>
    </div>
  );
}
