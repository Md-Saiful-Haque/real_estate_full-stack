import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";
import type { ReviewDoc, PropertyDoc } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ items: [] });
    const uid = new ObjectId(session.user.id);
    const reviews = await db
      .collection<ReviewDoc>(COLLECTIONS.reviews)
      .find({ userId: uid })
      .sort({ createdAt: -1 })
      .toArray();
    const propIds = [...new Set(reviews.map((r) => r.propertyId.toString()))].map(
      (id) => new ObjectId(id),
    );
    const props = await db
      .collection<PropertyDoc>(COLLECTIONS.properties)
      .find({ _id: { $in: propIds } })
      .toArray();
    const slugById = new Map(props.map((p) => [p._id.toString(), p.slug]));

    return NextResponse.json({
      items: reviews.map((r) => ({
        id: r._id.toString(),
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        propertyId: r.propertyId.toString(),
        propertySlug: slugById.get(r.propertyId.toString()) ?? "",
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
