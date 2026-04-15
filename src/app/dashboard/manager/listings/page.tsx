import Link from "next/link";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import type { PropertyDoc } from "@/types";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Team listings" };

export default async function ManagerListingsPage() {
  const db = await getDb();
  let items: Pick<PropertyDoc, "title" | "slug" | "city" | "price" | "featured">[] = [];
  if (db) {
    const raw = await db
      .collection<PropertyDoc>(COLLECTIONS.properties)
      .find({})
      .project({ title: 1, slug: 1, city: 1, price: 1, featured: 1 })
      .sort({ listedAt: -1 })
      .limit(50)
      .toArray();
    items = raw.map((doc) => ({
      title: doc.title,
      slug: doc.slug,
      city: doc.city,
      price: doc.price,
      featured: doc.featured,
    }));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Team listings</h1>
      <p className="mt-2 text-sm text-muted">Cross-check pricing and staging before weekend open houses.</p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-card-border">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-card text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Listing</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.slug} className="border-t border-card-border">
                <td className="px-4 py-3">
                  <Link href={`/properties/${p.slug}`} className="font-medium text-primary hover:underline">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{p.city}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">{p.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
