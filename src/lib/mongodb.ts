import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, { maxPoolSize: 10 });
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db | null> {
  if (!uri) return null;
  try {
    const p = getClientPromise();
    if (!p) return null;
    const client = await p;
    return client.db(process.env.MONGODB_DB_NAME ?? "real_estate");
  } catch {
    return null;
  }
}

export const COLLECTIONS = {
  users: "users",
  properties: "properties",
  reviews: "reviews",
  inquiries: "inquiries",
  newsletter: "newsletter_subscribers",
} as const;
