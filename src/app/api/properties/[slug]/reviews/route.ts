import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";
import { reviewSchema } from "@/lib/validators";
import type { PropertyDoc, ReviewDoc } from "@/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const db = await getDb();
    if (!db) return NextResponse.json({ items: [] });
    const pCol = db.collection<PropertyDoc>(COLLECTIONS.properties);
    let prop = await pCol.findOne({ slug });
    if (!prop && ObjectId.isValid(slug)) {
      prop = await pCol.findOne({ _id: new ObjectId(slug) });
    }
    if (!prop) return NextResponse.json({ items: [] });
    const items = await db
      .collection<ReviewDoc>(COLLECTIONS.reviews)
      .find({ propertyId: prop._id })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({
      items: items.map((r) => ({
        ...r,
        _id: r._id.toString(),
        propertyId: r.propertyId.toString(),
        userId: r.userId.toString(),
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to leave a review." }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const body = await req.json();
    const parsed = reviewSchema.safeParse({ ...body, propertyId: slug });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid review", fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    const pCol = db.collection<PropertyDoc>(COLLECTIONS.properties);
    let prop = await pCol.findOne({ slug });
    if (!prop && ObjectId.isValid(slug)) {
      prop = await pCol.findOne({ _id: new ObjectId(slug) });
    }
    if (!prop) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    const userId = new ObjectId(session.user.id);
    const existing = await db.collection(COLLECTIONS.reviews).findOne({
      propertyId: prop._id,
      userId,
    });
    if (existing) {
      return NextResponse.json(
        { error: "You already reviewed this listing." },
        { status: 409 },
      );
    }
    const rCol = db.collection<ReviewDoc>(COLLECTIONS.reviews);
    await rCol.insertOne({
      _id: new ObjectId(),
      propertyId: prop._id,
      userId,
      userName: session.user.name ?? "Member",
      rating: parsed.data.rating,
      comment: parsed.data.comment.trim(),
      createdAt: new Date(),
    });
    const stats = await rCol
      .aggregate<{ _id: null; avg: number; count: number }>([
        { $match: { propertyId: prop._id } },
        {
          $group: {
            _id: null,
            avg: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();
    const row = stats[0];
    await pCol.updateOne(
      { _id: prop._id },
      {
        $set: {
          ratingAvg: row ? Math.round(row.avg * 10) / 10 : parsed.data.rating,
          reviewCount: row?.count ?? 1,
        },
      },
    );
    return NextResponse.json({
      success: true,
      message: "Thank you. Your review was published.",
    });
  } catch {
    return NextResponse.json({ error: "Could not save review" }, { status: 500 });
  }
}
