export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Terms & Conditions</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        By accessing NestFinder you agree to use the platform for lawful real-estate research and transactions in compliance with local brokerage regulations. Listings are provided by participating brokers; NestFinder does not guarantee availability, pricing, or the accuracy of third-party content.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify hello@nestfinder.example immediately if you suspect unauthorized access.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Reviews must reflect genuine experiences. We may remove content that is defamatory, discriminatory, or promotional spam. Repeated violations can lead to account suspension.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        These terms may change as we add features. Continued use after updates constitutes acceptance of the revised terms.
      </p>
    </div>
  );
}
