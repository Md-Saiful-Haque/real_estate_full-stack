import { getDb, COLLECTIONS } from "@/lib/mongodb";
import type { InquiryDoc, PropertyDoc } from "@/types";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Manage inquiries" };

export default async function AdminInquiriesPage() {
  const db = await getDb();
  let items: InquiryDoc[] = [];
  if (db) {
    items = await db
      .collection<InquiryDoc>(COLLECTIONS.inquiries)
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
  }
  const ids = items.map((i) => i.propertyId);
  const slugMap = new Map<string, string>();
  if (db && ids.length) {
    const props = await db
      .collection<PropertyDoc>(COLLECTIONS.properties)
      .find({ _id: { $in: ids } })
      .project({ slug: 1 })
      .toArray();
    for (const p of props) slugMap.set(p._id.toString(), p.slug);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
      <p className="mt-1 text-sm text-muted">Latest tour requests across all listings.</p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-card-border">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-card text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No inquiries yet.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row._id.toString()} className="border-t border-card-border">
                  <td className="px-4 py-3">
                    <Link
                      href={`/properties/${slugMap.get(row.propertyId.toString()) ?? ""}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {row.propertyTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{row.status}</td>
                  <td className="px-4 py-3 text-muted line-clamp-2">{row.message}</td>
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
