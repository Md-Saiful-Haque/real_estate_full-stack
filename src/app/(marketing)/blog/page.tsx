import Link from "next/link";

export const metadata = { title: "Field journal" };

const posts = [
  {
    slug: "offers-in-competitive-markets",
    title: "Structuring offers when inventory is tight",
    date: "March 18, 2026",
    excerpt:
      "Earnest money, appraisal gaps, and rent-back clauses explained with scenarios from recent closings in Seattle and Austin.",
  },
  {
    slug: "reading-inspection-reports",
    title: "How to read an inspection report without drowning in jargon",
    date: "March 10, 2026",
    excerpt:
      "Prioritize safety defects, negotiate cosmetic fixes, and know when to walk away with confidence.",
  },
  {
    slug: "financing-checklist",
    title: "A financing checklist before you tour your tenth house",
    date: "March 2, 2026",
    excerpt:
      "Align pre-approval letters, rate locks, and closing cost estimates so your offer matches your budget.",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Field journal</h1>
      <p className="mt-4 text-sm text-muted">
        Long-form guides from NestFinder researchers covering financing, inspections, and negotiation tactics that show up in real offers—not theory.
      </p>
      <ul className="mt-10 space-y-8">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-card-border pb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{post.date}</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">
              <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Continue reading
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
