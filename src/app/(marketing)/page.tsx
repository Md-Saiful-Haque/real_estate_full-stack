import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { PropertyCard } from "@/components/property/PropertyCard";
import { getFeaturedProperties, getHomeStats } from "@/lib/data";
import {
  Building2,
  ClipboardCheck,
  LineChart,
  Shield,
  ChevronDown,
} from "lucide-react";

/** Load listings at request time so production (e.g. Vercel) uses runtime env and MongoDB, not build-time data. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, stats] = await Promise.all([getFeaturedProperties(8), getHomeStats()]);

  return (
    <>
      <Hero />
      <div className="flex justify-center border-b border-card-border bg-background py-2">
        <Link
          href="#market-snapshot"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Continue to market snapshot
          <ChevronDown className="h-4 w-4" />
        </Link>
      </div>

      <section
        id="market-snapshot"
        className="border-b border-card-border bg-card py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-foreground">Market snapshot</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted">
            Real counts from active inventory and scheduled tours on NestFinder—updated as agents and buyers use the platform.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { label: "Live listings", value: stats.listings.toLocaleString() },
              { label: "Cities represented", value: stats.cities.toLocaleString() },
              { label: "Avg. listing rating", value: stats.avgRating ? stats.avgRating.toFixed(1) : "—" },
              { label: "Tours requested", value: stats.toursBooked.toLocaleString() },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-card-border bg-background p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-bold text-primary">{item.value}</p>
                <p className="mt-1 text-sm text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">Why buyers start here</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Every listing uses the same card layout so you can compare facts quickly—price, location, ratings, and dates—without digging through PDFs.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Aligned listing data",
                body: "Square footage, beds and baths, and tax-friendly summaries appear in the same place on every property page.",
                Icon: Building2,
              },
              {
                title: "Verified tour requests",
                body: "Schedule a showing with context—your note routes to the listing team with the home attached.",
                Icon: ClipboardCheck,
              },
              {
                title: "Neighborhood clarity",
                body: "Read reviews from people who toured or bought, then filter by city, category, and price band.",
                Icon: LineChart,
              },
              {
                title: "Privacy-forward accounts",
                body: "Your profile controls what agents see. Two-factor authentication is supported for sign-in providers.",
                Icon: Shield,
              },
            ].map(({ title, body, Icon }) => (
              <div
                key={title}
                className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-6 shadow-sm"
              >
                <Icon className="h-10 w-10 text-primary" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-card-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">Browse by category</h2>
          <p className="mt-2 text-muted">Jump into the inventory that matches your financing plan and lifestyle.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { href: "/explore?category=house", label: "Houses", sub: "Yards, garages, and full basements" },
              { href: "/explore?category=condo", label: "Condos", sub: "Low-maintenance urban living" },
              { href: "/explore?category=townhome", label: "Townhomes", sub: "Multi-level with shared walls" },
              { href: "/explore?category=land", label: "Land", sub: "Build-ready parcels and acreage" },
              { href: "/explore?category=commercial", label: "Commercial", sub: "Retail, office, and flex space" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="flex min-h-[140px] flex-col justify-center rounded-2xl border border-card-border bg-background p-5 transition hover:border-primary"
              >
                <span className="text-lg font-semibold text-foreground">{c.label}</span>
                <span className="mt-1 text-sm text-muted">{c.sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured listings</h2>
              <p className="mt-2 text-muted">Hand-picked homes with strong photography and complete specification sheets.</p>
            </div>
            <Link href="/explore" className="font-semibold text-primary hover:underline">
              View all listings
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.length === 0 ? (
              <p className="col-span-full text-muted">
                Connect MongoDB and run <code className="rounded bg-card-border px-1">npm run seed</code> to load sample homes.
              </p>
            ) : (
              featured.map((p) => <PropertyCard key={p._id} property={p} />)
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-card-border bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">How NestFinder works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Search with filters that mirror lender questions",
                body: "Set price bands, property type, and minimum ratings—the same signals underwriters review early.",
              },
              {
                step: "02",
                title: "Save tours with context",
                body: "Submit a viewing request with questions about schools, HOAs, or offer timelines—attached to the listing automatically.",
              },
              {
                step: "03",
                title: "Close with fewer surprises",
                body: "Review summaries from other buyers highlight recurring praise or concerns before you write an offer.",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-card-border bg-card p-6">
                <span className="text-sm font-bold text-accent">{s.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">What recent clients say</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "The cards made it easy to compare townhomes across two states without rebuilding a spreadsheet every night.",
                name: "Priya Natarajan",
                role: "Relocated from Chicago to Austin",
              },
              {
                quote:
                  "We asked better questions during tours because the listing pages actually included HOA dues and utility averages.",
                name: "Marcus Lee",
                role: "First-time buyer, Seattle",
              },
              {
                quote:
                  "Our agent liked getting tour requests with our financing timeline attached—fewer back-and-forth emails.",
                name: "Elena Rossi",
                role: "Move-up buyer, Boston suburbs",
              },
            ].map((t) => (
              <blockquote
                key={t.name}
                className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-6 shadow-sm"
              >
                <p className="flex-1 text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-primary">{t.name}</footer>
                <cite className="text-xs not-italic text-muted">{t.role}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-card-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">From the field journal</h2>
          <p className="mt-2 text-muted">Practical guides written by NestFinder researchers—not generic syndicated posts.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                href: "/blog/offers-in-competitive-markets",
                title: "Structuring offers when inventory is tight",
                excerpt:
                  "Earnest money, appraisal gaps, and rent-back clauses explained with scenarios from recent closings.",
              },
              {
                href: "/blog/reading-inspection-reports",
                title: "How to read an inspection report without drowning in jargon",
                excerpt:
                  "Prioritize safety defects, negotiate cosmetic fixes, and know when to walk away with confidence.",
              },
              {
                href: "/blog/financing-checklist",
                title: "A financing checklist before you tour your tenth house",
                excerpt:
                  "Align pre-approval letters, rate locks, and closing cost estimates so your offer matches your budget.",
              },
            ].map((post) => (
              <article key={post.href} className="flex h-full flex-col rounded-2xl border border-card-border bg-background p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  <Link href={post.href} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted">{post.excerpt}</p>
                <Link href={post.href} className="mt-4 text-sm font-semibold text-primary hover:underline">
                  Read article
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-foreground">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {[
              {
                q: "Does NestFinder replace my real estate agent?",
                a: "No. We surface listings and buyer tools; licensed professionals still represent you for contracts, disclosures, and negotiations.",
              },
              {
                q: "How do ratings work?",
                a: "Verified account holders who toured or purchased can leave one review per listing. We display averages and full text for transparency.",
              },
              {
                q: "Is my contact information shared?",
                a: "Tour requests route to the listing team with only the details you include. Update communication preferences anytime in your dashboard.",
              },
              {
                q: "Which markets do you cover?",
                a: "Inventory spans multiple U.S. metros today, and we add new cities as brokerages onboard. Use the city filter on Explore to see active coverage.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-card-border bg-card px-5 py-4 open:shadow-md"
              >
                <summary className="cursor-pointer list-none font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-card-border bg-primary/10 py-16 dark:bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">Weekly market notes</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted">
            Short emails with rate context, new inventory highlights, and buyer tips—no spam, unsubscribe anytime.
          </p>
          <NewsletterForm />
        </div>
      </section>

      <section className="bg-secondary py-16 text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Ready to walk through a home this week?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm opacity-90">
            Create a free account to save searches, book tours with notes for the listing agent, and access the AI assistant for financing and inspection questions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground hover:opacity-95"
            >
              Create account
            </Link>
            <Link
              href="/explore"
              className="inline-flex rounded-xl border-2 border-secondary-foreground/40 px-8 py-3 font-semibold hover:bg-secondary-foreground/10"
            >
              Explore listings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
