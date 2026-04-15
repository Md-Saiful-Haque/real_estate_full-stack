import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import type { PropertyDoc, PropertySerialized } from "@/types";

export async function getFeaturedProperties(limit = 8): Promise<PropertySerialized[]> {
  const db = await getDb();
  if (!db) return [];
  const items = await db
    .collection<PropertyDoc>(COLLECTIONS.properties)
    .find({ featured: true })
    .sort({ listedAt: -1 })
    .limit(limit)
    .toArray();
  return items.map((p) => ({
    ...p,
    _id: p._id.toString(),
    listedAt: p.listedAt.toISOString(),
  }));
}

export async function getHomeStats() {
  const db = await getDb();
  if (!db) {
    return { listings: 0, cities: 0, avgRating: 0, toursBooked: 0 };
  }
  const listings = await db.collection(COLLECTIONS.properties).countDocuments();
  const citiesAgg = await db
    .collection(COLLECTIONS.properties)
    .distinct("city");
  const ratingAgg = await db
    .collection(COLLECTIONS.properties)
    .aggregate<{ avg: number }>([
      { $group: { _id: null, avg: { $avg: "$ratingAvg" } } },
    ])
    .toArray();
  const toursBooked = await db.collection(COLLECTIONS.inquiries).countDocuments();
  return {
    listings,
    cities: citiesAgg.length,
    avgRating: ratingAgg[0]?.avg ? Math.round(ratingAgg[0].avg * 10) / 10 : 0,
    toursBooked,
  };
}

export async function getPropertyBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const col = db.collection<PropertyDoc>(COLLECTIONS.properties);
  let doc = await col.findOne({ slug });
  if (!doc && ObjectId.isValid(slug)) {
    doc = await col.findOne({ _id: new ObjectId(slug) });
  }
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    listedAt: doc.listedAt.toISOString(),
  };
}
