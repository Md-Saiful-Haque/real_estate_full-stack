export const metadata = { title: "About NestFinder" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">About NestFinder</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        NestFinder began when a small team of agents and engineers grew tired of fragmented listing data—PDFs that disagreed with MLS, missing HOA fees, and review spam that hid real issues. We built a marketplace where every property uses the same card layout, the same specification block, and the same review rules so buyers can compare apples to apples before they ever schedule a tour.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Today we partner with brokerages who want transparent analytics: how long tours take to confirm, which neighborhoods convert, and where buyers stall. Our roadmap focuses on deeper school-boundary verification, integrated rate quotes, and tools that keep renters and owners on the same timeline during lease-to-own transitions.
      </p>
      <h2 className="mt-10 text-xl font-semibold text-foreground">What we believe</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
        <li>Buyers deserve machine-readable data, not scanned flyers.</li>
        <li>Agents deserve fewer repetitive emails—context should travel with the tour request.</li>
        <li>Markets work better when reviews are tied to verified activity.</li>
      </ul>
    </div>
  );
}
