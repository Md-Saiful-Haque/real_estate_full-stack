import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";
import { inquirySchema } from "@/lib/validators";
import type { InquiryDoc, PropertyDoc } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDb();
    if (!db) return NextResponse.json({ items: [] });
    const isStaff =
      session.user.role === "admin" || session.user.role === "manager";
    const filter = isStaff
      ? {}
      : { userId: new ObjectId(session.user.id) };
    const items = await db
      .collection<InquiryDoc>(COLLECTIONS.inquiries)
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return NextResponse.json({
      items: items.map((i) => ({
        ...i,
        _id: i._id.toString(),
        userId: i.userId.toString(),
        propertyId: i.propertyId.toString(),
        createdAt: i.createdAt.toISOString(),
        scheduledAt: i.scheduledAt?.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to schedule a viewing." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    const pCol = db.collection<PropertyDoc>(COLLECTIONS.properties);
    let prop = await pCol.findOne({ slug: parsed.data.propertyId });
    if (!prop && ObjectId.isValid(parsed.data.propertyId)) {
      prop = await pCol.findOne({ _id: new ObjectId(parsed.data.propertyId) });
    }
    if (!prop) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    await db.collection<InquiryDoc>(COLLECTIONS.inquiries).insertOne({
      _id: new ObjectId(),
      userId: new ObjectId(session.user.id),
      propertyId: prop._id,
      propertyTitle: prop.title,
      message: parsed.data.message.trim(),
      status: "pending",
      scheduledAt: parsed.data.scheduledAt
        ? new Date(parsed.data.scheduledAt)
        : undefined,
      createdAt: new Date(),
    });
    return NextResponse.json({
      success: true,
      message: "Your viewing request was sent. An agent will contact you shortly.",
    });
  } catch {
    return NextResponse.json({ error: "Could not submit request" }, { status: 500 });
  }
}
