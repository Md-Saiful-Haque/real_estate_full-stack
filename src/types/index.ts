import type { ObjectId } from "mongodb";

export type UserRole = "user" | "admin" | "manager";

export interface UserDoc {
  _id: ObjectId;
  email: string;
  name: string;
  passwordHash?: string;
  role: UserRole;
  image?: string;
  phone?: string;
  bio?: string;
  createdAt: Date;
}

export interface PropertyDoc {
  _id: ObjectId;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  category: PropertyCategory;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  ratingAvg: number;
  reviewCount: number;
  listedAt: Date;
  featured: boolean;
}

/** API / UI shape with serialized id and dates */
export type PropertySerialized = Omit<PropertyDoc, "_id" | "listedAt"> & {
  _id: string;
  listedAt: string;
};

export type PropertyCategory =
  | "house"
  | "condo"
  | "townhome"
  | "land"
  | "commercial";

export interface ReviewDoc {
  _id: ObjectId;
  propertyId: ObjectId;
  userId: ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface InquiryDoc {
  _id: ObjectId;
  userId: ObjectId;
  propertyId: ObjectId;
  propertyTitle: string;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  scheduledAt?: Date;
  createdAt: Date;
}

export interface PropertyFilters {
  q?: string;
  category?: PropertyCategory | "";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  city?: string;
  sort?: "price-asc" | "price-desc" | "rating" | "newest";
  page?: number;
  limit?: number;
}
