import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import type { InquiryDoc, PropertyDoc, ReviewDoc, UserDoc } from "@/types";

export async function getUserDashboardMe(userId: string) {
  const db = await getDb();
  if (!db) {
    return { inquiryCount: 0, reviewCount: 0, memberSince: null as string | null };
  }
  const uid = new ObjectId(userId);
  const inquiryCount = await db
    .collection<InquiryDoc>(COLLECTIONS.inquiries)
    .countDocuments({ userId: uid });
  const reviewCount = await db
    .collection<ReviewDoc>(COLLECTIONS.reviews)
    .countDocuments({ userId: uid });
  const user = await db.collection<UserDoc>(COLLECTIONS.users).findOne({ _id: uid });
  return {
    inquiryCount,
    reviewCount,
    memberSince: user ? user.createdAt.toISOString() : null,
  };
}

export async function getStaffDashboardStats() {
  const db = await getDb();
  if (!db) {
    return {
      users: 0,
      properties: 0,
      inquiries: 0,
      inventoryValue: 0,
      monthlyInquiries: [] as { name: string; inquiries: number }[],
      categoryBreakdown: [] as { name: string; value: number }[],
    };
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
    .aggregate<{ total: number }>([{ $group: { _id: null, total: { $sum: "$price" } } }])
    .toArray();
  const inventoryValue = invAgg[0]?.total ?? 0;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRaw = await db
    .collection<InquiryDoc>(COLLECTIONS.inquiries)
    .aggregate<{ _id: { y: number; m: number }; c: number }>([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } }, c: { $sum: 1 } } },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
    ])
    .toArray();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
  const categoryBreakdown = catRaw.map((c) => ({ name: c._id, value: c.count }));

  return {
    users,
    properties,
    inquiries,
    inventoryValue,
    monthlyInquiries,
    categoryBreakdown,
  };
}
