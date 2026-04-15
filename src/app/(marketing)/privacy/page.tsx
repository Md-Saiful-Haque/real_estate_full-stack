export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        NestFinder collects account details (name, email, optional phone), tour requests, and reviews you submit. We use this information to operate the marketplace, route messages to listing teams, and improve search relevance. We do not sell personal information to data brokers.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        When you authenticate with Google or Facebook, we receive profile basics according to those providers’ consent screens. You may disconnect OAuth apps from your provider settings at any time; doing so may limit sign-in options on NestFinder.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Analytics charts for administrators aggregate inquiry counts and listing categories—they do not expose individual buyer messages in exports. Contact privacy@nestfinder.example to request data deletion where applicable law provides that right.
      </p>
    </div>
  );
}
