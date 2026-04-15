import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";
import type { InquiryDoc, ReviewDoc } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({
        inquiryCount: 0,
        reviewCount: 0,
        memberSince: null,
      });
    }
    const uid = new ObjectId(session.user.id);
    const inquiryCount = await db
      .collection<InquiryDoc>(COLLECTIONS.inquiries)
      .countDocuments({ userId: uid });
    const reviewCount = await db
      .collection<ReviewDoc>(COLLECTIONS.reviews)
      .countDocuments({ userId: uid });
    const user = await db.collection(COLLECTIONS.users).findOne({ _id: uid });
    return NextResponse.json({
      inquiryCount,
      reviewCount,
      memberSince: user ? new Date(user.createdAt).toISOString() : null,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
