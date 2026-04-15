export const metadata = { title: "Admin settings" };

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Platform settings</h1>
      <p className="mt-2 text-sm text-muted">
        Operational controls for featured placements, API keys, and webhook endpoints will live here in production builds.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-muted">
        <li>Connect CRM webhooks for automatic tour routing.</li>
        <li>Rotate MLS feed credentials on a quarterly schedule.</li>
        <li>Require re-authentication for admin sessions every twelve hours.</li>
      </ul>
    </div>
  );
}
