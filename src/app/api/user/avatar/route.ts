import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";
import type { UserDoc } from "@/types";

const urlSchema = /^https:\/\/.+/i;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { imageUrl } = await req.json();
    if (typeof imageUrl !== "string" || !urlSchema.test(imageUrl.trim())) {
      return NextResponse.json(
        { error: "Provide a valid HTTPS image URL." },
        { status: 400 },
      );
    }
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    await db.collection<UserDoc>(COLLECTIONS.users).updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { image: imageUrl.trim() } },
    );
    return NextResponse.json({
      success: true,
      message: "Profile photo updated.",
      imageUrl: imageUrl.trim(),
    });
  } catch {
    return NextResponse.json({ error: "Could not update avatar" }, { status: 500 });
  }
}
