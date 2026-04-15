import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import type { PropertyDoc } from "@/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ items: [] });
    }
    const col = db.collection<PropertyDoc>(COLLECTIONS.properties);
    let current = await col.findOne({ slug });
    if (!current && ObjectId.isValid(slug)) {
      current = await col.findOne({ _id: new ObjectId(slug) });
    }
    if (!current) {
      return NextResponse.json({ items: [] });
    }
    const items = await col
      .find({
        _id: { $ne: current._id },
        category: current.category,
        city: current.city,
      })
      .limit(4)
      .toArray();
    if (items.length < 4) {
      const more = await col
        .find({
          _id: { $ne: current._id, $nin: items.map((i) => i._id) },
          category: current.category,
        })
        .limit(4 - items.length)
        .toArray();
      items.push(...more);
    }
    const serialized = items.map((p) => ({
      ...p,
      _id: p._id.toString(),
      listedAt: p.listedAt.toISOString(),
    }));
    return NextResponse.json({ items: serialized });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
