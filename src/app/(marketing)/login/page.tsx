import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  const googleOAuth = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  const facebookOAuth = Boolean(
    process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center text-muted">Loading…</div>}>
        <LoginForm googleOAuth={googleOAuth} facebookOAuth={facebookOAuth} />
      </Suspense>
    </div>
  );
}
