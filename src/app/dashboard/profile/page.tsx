import { ProfileForm } from "./ProfileForm";
import { getSession } from "@/lib/session";

export const metadata = { title: "My profile" };

export default async function ProfilePage() {
  const session = await getSession();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-foreground">My profile</h1>
      <p className="mt-1 text-sm text-muted">Update how your name appears on reviews and tour requests.</p>
      <div className="mt-8">
        <ProfileForm initialName={session?.user?.name ?? ""} initialEmail={session?.user?.email ?? ""} />
      </div>
    </div>
  );
}
