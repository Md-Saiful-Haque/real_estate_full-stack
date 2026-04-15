import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Invalid email" },
        { status: 400 },
      );
    }
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { success: true, message: "Thanks — you are on the list." },
        { status: 200 },
      );
    }
    const col = db.collection(COLLECTIONS.newsletter);
    const email = parsed.data.email.toLowerCase();
    const exists = await col.findOne({ email });
    if (!exists) {
      await col.insertOne({
        _id: new ObjectId(),
        email,
        createdAt: new Date(),
      });
    }
    return NextResponse.json({
      success: true,
      message: "Thanks — watch your inbox for market snapshots and new listings.",
    });
  } catch {
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 500 });
  }
}
