export const metadata = { title: "Settings" };

export default function DashboardSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-2 text-sm text-muted">
        Notification preferences and security controls will appear here as we roll out SMS alerts and device management.
      </p>
      <div className="mt-8 rounded-2xl border border-card-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Session</h2>
        <p className="mt-2 text-sm text-muted">
          You are signed in with your NestFinder account. Use the profile menu to log out on this device.
        </p>
      </div>
      <div className="mt-6 rounded-2xl border border-card-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Data</h2>
        <p className="mt-2 text-sm text-muted">
          We retain tour requests and reviews to help listing teams coordinate follow-up. Contact privacy@nestfinder.example for data questions.
        </p>
      </div>
    </div>
  );
}
