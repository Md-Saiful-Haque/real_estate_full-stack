"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data.fields === "object"
            ? Object.fromEntries(
                Object.entries(data.fields).map(([k, v]) => [
                  k,
                  Array.isArray(v) ? v[0] : String(v),
                ]),
              )
            : { _form: data.error ?? "Registration failed." },
        );
        return;
      }
      setSuccess(data.message ?? "Account created.");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError({ _form: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-card-border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-foreground">Create account</h1>
      <p className="mt-2 text-sm text-muted">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full name
          </label>
          <input
            id="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {error?.name && <p className="mt-1 text-sm text-accent">{error.name}</p>}
        </div>
        <div>
          <label htmlFor="reg-email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {error?.email && <p className="mt-1 text-sm text-accent">{error.email}</p>}
        </div>
        <div>
          <label htmlFor="reg-password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="mt-1 text-xs text-muted">
            At least 8 characters with one uppercase letter and one number.
          </p>
          {error?.password && <p className="mt-1 text-sm text-accent">{error.password}</p>}
        </div>
        {error?._form && (
          <p className="text-sm text-accent" role="alert">
            {error._form}
          </p>
        )}
        {success && (
          <p className="text-sm text-primary" role="status">
            {success}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Register
        </button>
      </form>
    </div>
  );
}
