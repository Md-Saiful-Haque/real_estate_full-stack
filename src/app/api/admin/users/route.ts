import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";
import type { UserDoc, UserRole } from "@/types";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const role = searchParams.get("role") as UserRole | "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") ?? "10", 10)));
    const db = await getDb();
    if (!db) return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 });
    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }
    if (role && ["user", "admin", "manager"].includes(role)) {
      filter.role = role;
    }
    const col = db.collection<UserDoc>(COLLECTIONS.users);
    const total = await col.countDocuments(filter);
    const skip = (page - 1) * limit;
    const items = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    return NextResponse.json({
      items: items.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
