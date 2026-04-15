import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";
import type { InquiryDoc, PropertyDoc } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "manager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({
        users: 0,
        properties: 0,
        inquiries: 0,
        inventoryValue: 0,
        monthlyInquiries: [],
        categoryBreakdown: [],
      });
    }
    const users = await db.collection(COLLECTIONS.users).countDocuments();
    const properties = await db
      .collection<PropertyDoc>(COLLECTIONS.properties)
      .countDocuments();
    const inquiries = await db
      .collection<InquiryDoc>(COLLECTIONS.inquiries)
      .countDocuments();
    const invAgg = await db
      .collection<PropertyDoc>(COLLECTIONS.properties)
      .aggregate<{ total: number }>([
        { $group: { _id: null, total: { $sum: "$price" } } },
      ])
      .toArray();
    const inventoryValue = invAgg[0]?.total ?? 0;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRaw = await db
      .collection<InquiryDoc>(COLLECTIONS.inquiries)
      .aggregate<{ _id: { y: number; m: number }; c: number }>([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
            },
            c: { $sum: 1 },
          },
        },
        { $sort: { "_id.y": 1, "_id.m": 1 } },
      ])
      .toArray();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyInquiries = monthlyRaw.map((r) => ({
      name: `${monthNames[r._id.m - 1]} ${r._id.y}`,
      inquiries: r.c,
    }));

    const catRaw = await db
      .collection<PropertyDoc>(COLLECTIONS.properties)
      .aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ])
      .toArray();
    const categoryBreakdown = catRaw.map((c) => ({
      name: c._id,
      value: c.count,
    }));

    return NextResponse.json({
      users,
      properties,
      inquiries,
      inventoryValue,
      monthlyInquiries,
      categoryBreakdown,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
