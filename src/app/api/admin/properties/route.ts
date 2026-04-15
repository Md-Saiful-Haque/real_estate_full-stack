import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";
import type { PropertyDoc } from "@/types";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") ?? "10", 10)));
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
    }
    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
      ];
    }
    const col = db.collection<PropertyDoc>(COLLECTIONS.properties);
    const total = await col.countDocuments(filter);
    const skip = (page - 1) * limit;
    const items = await col
      .find(filter)
      .sort({ listedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    return NextResponse.json({
      items: items.map((p) => ({
        id: p._id.toString(),
        slug: p.slug,
        title: p.title,
        city: p.city,
        price: p.price,
        featured: p.featured,
        listedAt: p.listedAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const id = body.id as string;
    const featured = Boolean(body.featured);
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    await db.collection(COLLECTIONS.properties).updateOne(
      { _id: new ObjectId(id) },
      { $set: { featured } },
    );
    return NextResponse.json({ success: true, message: "Listing updated." });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
