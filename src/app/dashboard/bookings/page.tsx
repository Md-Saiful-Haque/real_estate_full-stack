import Link from "next/link";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/session";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import type { InquiryDoc, PropertyDoc } from "@/types";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "My viewings" };

export default async function BookingsPage() {
  const session = await getSession();
  if (!session?.user?.id) return null;
  const db = await getDb();
  let items: InquiryDoc[] = [];
  const slugByPropertyId = new Map<string, string>();
  if (db) {
    items = await db
      .collection<InquiryDoc>(COLLECTIONS.inquiries)
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .toArray();
    const ids = items.map((i) => i.propertyId);
    if (ids.length) {
      const props = await db
        .collection<PropertyDoc>(COLLECTIONS.properties)
        .find({ _id: { $in: ids } })
        .project({ slug: 1 })
        .toArray();
      for (const p of props) {
        slugByPropertyId.set(p._id.toString(), p.slug);
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">My viewing requests</h1>
      <p className="mt-1 text-sm text-muted">Track tours you have scheduled with listing teams.</p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-card-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-card text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Requested</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted">
                  No viewing requests yet.{" "}
                  <Link href="/explore" className="font-semibold text-primary hover:underline">
                    Explore listings
                  </Link>
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row._id.toString()} className="border-t border-card-border">
                  <td className="px-4 py-3">
                    <Link
                      href={`/properties/${slugByPropertyId.get(row.propertyId.toString()) ?? row.propertyId.toString()}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {row.propertyTitle}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{row.message}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{row.status}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
