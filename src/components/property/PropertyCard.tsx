import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import type { PropertyCategory, PropertySerialized } from "@/types";

export type PropertyCardData = Pick<
  PropertySerialized,
  | "_id"
  | "slug"
  | "title"
  | "shortDescription"
  | "price"
  | "city"
  | "state"
  | "ratingAvg"
  | "reviewCount"
  | "listedAt"
  | "images"
  | "category"
>;

const categoryLabel: Record<PropertyCategory, string> = {
  house: "House",
  condo: "Condo",
  townhome: "Townhome",
  land: "Land",
  commercial: "Commercial",
};

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const img = property.images[0] ?? "/placeholder-property.svg";
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition hover:shadow-md">
      <Link href={`/properties/${property.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-card-border">
        <Image
          src={img}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {categoryLabel[property.category]}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[3rem] text-base font-semibold leading-snug text-foreground">
          <Link href={`/properties/${property.slug}`} className="hover:text-primary">
            {property.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{property.shortDescription}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="font-semibold text-primary">{formatPrice(property.price)}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {property.city}, {property.state}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden />
            {property.ratingAvg.toFixed(1)} ({property.reviewCount})
          </span>
          <span>{formatDate(property.listedAt)}</span>
        </div>
        <Link
          href={`/properties/${property.slug}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
