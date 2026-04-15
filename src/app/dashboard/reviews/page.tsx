import Link from "next/link";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import type { ReviewDoc, PropertyDoc } from "@/types";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "My reviews" };

export default async function MyReviewsPage() {
  const session = await getSession();
  if (!session?.user?.id) return null;
  const db = await getDb();
  let rows: { review: ReviewDoc; slug: string }[] = [];
  if (db) {
    const uid = new ObjectId(session.user.id);
    const reviews = await db
      .collection<ReviewDoc>(COLLECTIONS.reviews)
      .find({ userId: uid })
      .sort({ createdAt: -1 })
      .toArray();
    const ids = reviews.map((r) => r.propertyId);
    const props =
      ids.length > 0
        ? await db
            .collection<PropertyDoc>(COLLECTIONS.properties)
            .find({ _id: { $in: ids } })
            .project({ slug: 1 })
            .toArray()
        : [];
    const slugMap = new Map(props.map((p) => [p._id.toString(), p.slug]));
    rows = reviews.map((review) => ({
      review,
      slug: slugMap.get(review.propertyId.toString()) ?? "",
    }));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Reviews you wrote</h1>
      <p className="mt-1 text-sm text-muted">Transparency helps the next buyer ask sharper questions.</p>
      <ul className="mt-8 space-y-4">
        {rows.length === 0 ? (
          <li className="rounded-2xl border border-card-border bg-card p-6 text-muted">
            You have not published a review yet. After a tour, open the listing and share feedback.{" "}
            <Link href="/explore" className="font-semibold text-primary hover:underline">
              Browse homes
            </Link>
          </li>
        ) : (
          rows.map(({ review, slug }) => (
            <li key={review._id.toString()} className="rounded-2xl border border-card-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/properties/${slug}`} className="font-semibold text-primary hover:underline">
                  View listing
                </Link>
                <span className="text-sm text-muted">{formatDate(review.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-accent">Rating: {review.rating} / 5</p>
              <p className="mt-2 text-sm text-muted">{review.comment}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
