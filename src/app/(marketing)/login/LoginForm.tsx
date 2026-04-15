"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
export function LoginForm({
  googleOAuth,
  facebookOAuth,
}: {
  googleOAuth: boolean;
  facebookOAuth: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email or password is incorrect.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-card-border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        New to NestFinder?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {error && (
          <p className="text-sm text-accent" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <div className="mt-6 space-y-3">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted">
          Demo accounts
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="flex-1 rounded-xl border border-card-border py-2 text-sm font-medium text-foreground hover:bg-background"
            onClick={() => {
              setEmail("user@nestfinder.demo");
              setPassword("DemoUser123!");
            }}
          >
            User demo
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl border border-card-border py-2 text-sm font-medium text-foreground hover:bg-background"
            onClick={() => {
              setEmail("admin@nestfinder.demo");
              setPassword("AdminDemo123!");
            }}
          >
            Admin demo
          </button>
        </div>
      </div>

      {(googleOAuth || facebookOAuth) && (
        <>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted">Or continue with</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {googleOAuth && (
              <button
                type="button"
                className="w-full rounded-xl border border-card-border py-2.5 text-sm font-semibold text-foreground hover:bg-background"
                onClick={() => signIn("google", { callbackUrl })}
              >
                Google
              </button>
            )}
            {facebookOAuth && (
              <button
                type="button"
                className="w-full rounded-xl border border-card-border py-2.5 text-sm font-semibold text-foreground hover:bg-background"
                onClick={() => signIn("facebook", { callbackUrl })}
              >
                Facebook
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
