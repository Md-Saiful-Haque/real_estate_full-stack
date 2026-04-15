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
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const col = db.collection<PropertyDoc>(COLLECTIONS.properties);
    let doc = await col.findOne({ slug });
    if (!doc && ObjectId.isValid(slug)) {
      doc = await col.findOne({ _id: new ObjectId(slug) });
    }
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...doc,
      _id: doc._id.toString(),
      listedAt: doc.listedAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load property" }, { status: 500 });
  }
}
