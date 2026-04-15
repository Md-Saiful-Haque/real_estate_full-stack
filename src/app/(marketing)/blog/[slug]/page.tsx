import Link from "next/link";
import { notFound } from "next/navigation";

const articles: Record<
  string,
  { title: string; date: string; body: string[] }
> = {
  "offers-in-competitive-markets": {
    title: "Structuring offers when inventory is tight",
    date: "March 18, 2026",
    body: [
      "When multiple buyers target the same ZIP code, price is only part of the story. Listing agents look for certainty: deposits that survive inspection, lenders who answer the phone, and timelines that align with the seller’s next move.",
      "Start with a pre-approval letter that names the loan product and down payment percentage—avoid generic letters that merely restate a maximum purchase price. Pair it with proof of funds for the earnest money deposit so the seller knows cash is ready if the deal progresses.",
      "Appraisal gaps deserve math, not vibes. Calculate the maximum gap you can cover in cash without draining reserves needed for closing costs and moving expenses. Put that number in the offer explicitly rather than promising to ‘work something out’ later.",
      "Rent-backs help when sellers need extra days after closing. Specify a daily rate, insurance expectations, and a firm move-out time so disputes do not end up in small claims court.",
    ],
  },
  "reading-inspection-reports": {
    title: "How to read an inspection report without drowning in jargon",
    date: "March 10, 2026",
    body: [
      "Inspection software often highlights dozens of items. Focus first on safety: handrails, GFCI outlets, furnace venting, and anything involving water intrusion. Cosmetic issues can wait until you know whether the seller will negotiate.",
      "Photos matter. If the inspector flags roof flashing, ask for a zoomed image and compare it to the summary paragraph—sometimes the narrative overstates what the photo shows.",
      "Request digital copies of invoices if the seller claims recent HVAC or roof work. Match permit numbers with the city portal when structural work is mentioned.",
      "If the report reads like a novel, hire a specialist—roofers for roof sections, electricians for subpanels—to give bids before you remove contingencies.",
    ],
  },
  "financing-checklist": {
    title: "A financing checklist before you tour your tenth house",
    date: "March 2, 2026",
    body: [
      "Pull credit from all three bureaus and resolve errors before lenders run hard inquiries. Even small score swings can change the APR bucket you land in.",
      "Ask each lender for a Loan Estimate on the same day so you compare apples to apples—note section A (origination) versus section B (services you cannot shop).",
      "Lock timelines strategically: shorter locks cost less but expire faster. If you are still negotiating repairs, confirm whether your lender allows a lock extension without repricing.",
      "Budget closing costs at 2–5% of the loan amount depending on location and transfer taxes. Under-estimating here is the fastest way to torpedo an otherwise solid offer.",
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = articles[slug];
  if (!post) return { title: "Article not found" };
  return { title: post.title };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = articles[slug];
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{post.date}</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">{post.title}</h1>
      <div className="prose prose-stone mt-8 max-w-none space-y-4 dark:prose-invert">
        {post.body.map((p) => (
          <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-muted">
            {p}
          </p>
        ))}
      </div>
      <p className="mt-10 text-sm">
        <Link href="/blog" className="font-semibold text-primary hover:underline">
          ← Back to journal
        </Link>
      </p>
    </article>
  );
}
