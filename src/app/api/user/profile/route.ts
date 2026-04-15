import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";
import { profileSchema } from "@/lib/validators";
import type { UserDoc } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    const user = await db
      .collection<UserDoc>(COLLECTIONS.users)
      .findOne({ _id: new ObjectId(session.user.id) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      image: user.image ?? "",
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
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
    await db.collection<UserDoc>(COLLECTIONS.users).updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          name: parsed.data.name.trim(),
          phone: parsed.data.phone?.trim() || undefined,
          bio: parsed.data.bio?.trim() || undefined,
        },
      },
    );
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
