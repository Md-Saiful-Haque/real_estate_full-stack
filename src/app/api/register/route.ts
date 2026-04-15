import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { registerSchema } from "@/lib/validators";
import type { UserDoc } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fields: msg },
        { status: 400 },
      );
    }
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database is not configured. Set MONGODB_URI." },
        { status: 503 },
      );
    }
    const { name, email, password } = parsed.data;
    const existing = await db
      .collection<UserDoc>(COLLECTIONS.users)
      .findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await db.collection<UserDoc>(COLLECTIONS.users).insertOne({
      _id: new ObjectId(),
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
      createdAt: new Date(),
    });
    return NextResponse.json({
      success: true,
      message: "Your account was created. You can sign in now.",
    });
  } catch {
    return NextResponse.json(
      { error: "Registration could not be completed." },
      { status: 500 },
    );
  }
}
