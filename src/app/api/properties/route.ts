import { NextResponse } from "next/server";
import type { Filter } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import type { PropertyDoc, PropertyCategory } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const category = searchParams.get("category") as PropertyCategory | "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const city = searchParams.get("city")?.trim() ?? "";
    const sort = searchParams.get("sort") ?? "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      24,
      Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)),
    );

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        {
          items: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
          error: "Database not configured. Add MONGODB_URI in the project environment.",
        },
        { status: 503 },
      );
    }

    const filter: Filter<PropertyDoc> = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { shortDescription: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
      ];
    }
    if (category && ["house", "condo", "townhome", "land", "commercial"].includes(category)) {
      filter.category = category;
    }
    const priceRange: { $gte?: number; $lte?: number } = {};
    if (minPrice) priceRange.$gte = Number(minPrice);
    if (maxPrice) priceRange.$lte = Number(maxPrice);
    if (Object.keys(priceRange).length > 0) {
      filter.price = priceRange;
    }
    if (minRating) {
      filter.ratingAvg = { $gte: Number(minRating) };
    }
    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    let sortSpec: Record<string, 1 | -1> = { listedAt: -1 };
    if (sort === "price-asc") sortSpec = { price: 1 };
    else if (sort === "price-desc") sortSpec = { price: -1 };
    else if (sort === "rating") sortSpec = { ratingAvg: -1 };

    const col = db.collection<PropertyDoc>(COLLECTIONS.properties);
    const total = await col.countDocuments(filter);
    const skip = (page - 1) * limit;
    const items = await col
      .find(filter)
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .toArray();

    const serialized = items.map((p) => ({
      ...p,
      _id: p._id.toString(),
      listedAt: p.listedAt.toISOString(),
    }));

    return NextResponse.json({
      items: serialized,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load properties" },
      { status: 500 },
    );
  }
}
