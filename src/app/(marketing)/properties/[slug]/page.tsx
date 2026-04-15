import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Star } from "lucide-react";
import { getPropertyBySlug } from "@/lib/data";
import { formatPrice, formatDate } from "@/lib/utils";
import { PropertyDetailPanels } from "./PropertyDetailPanels";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) return { title: "Listing not found" };
  return {
    title: p.title,
    description: p.shortDescription,
  };
}

const categoryLabel = {
  house: "House",
  condo: "Condo",
  townhome: "Townhome",
  land: "Land",
  commercial: "Commercial",
} as const;

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-card-border bg-card-border">
            <Image
              src={p.images[0] ?? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"}
              alt={p.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>
          {p.images.length > 1 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {p.images.slice(1, 5).map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-card-border">
                  <Image src={src} alt="" fill className="object-cover" sizes="200px" />
                </div>
              ))}
            </div>
          )}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-foreground">Overview</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{p.description}</p>
          </section>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              {categoryLabel[p.category]}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-foreground">{p.title}</h1>
            <p className="mt-2 flex items-center gap-1 text-sm text-muted">
              <MapPin className="h-4 w-4 shrink-0" />
              {p.city}, {p.state} {p.zip}
            </p>
            <p className="mt-4 text-3xl font-bold text-primary">{formatPrice(p.price)}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" aria-hidden />
                {p.ratingAvg.toFixed(1)} ({p.reviewCount} reviews)
              </span>
              <span>Listed {formatDate(p.listedAt)}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-card-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Key information</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Bedrooms</dt>
                <dd className="font-medium text-foreground">{p.beds || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Bathrooms</dt>
                <dd className="font-medium text-foreground">{p.baths || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Living area</dt>
                <dd className="font-medium text-foreground">
                  {p.sqft ? `${p.sqft.toLocaleString()} sq ft` : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Category</dt>
                <dd className="font-medium text-foreground">{categoryLabel[p.category]}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <PropertyDetailPanels slug={p.slug} title={p.title} />
    </div>
  );
}
