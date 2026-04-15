"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/property/PropertyCardSkeleton";

type ApiResponse = {
  items: PropertyCardData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function ExploreClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const minRating = searchParams.get("minRating") ?? "";
  const city = searchParams.get("city") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("minRating", minRating);
    if (city) params.set("city", city);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "12");
    try {
      const res = await fetch(`/api/properties?${params.toString()}`);
      const json = (await res.json()) as ApiResponse & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to load");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load listings.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [q, category, minPrice, maxPrice, minRating, city, sort, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function updateParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    p.set("page", "1");
    router.push(`/explore?${p.toString()}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Explore listings</h1>
      <p className="mt-2 text-muted">
        Search by keyword, narrow with filters, and sort to match how you buy—whether you prioritize monthly payment or school districts.
      </p>

      <div className="mt-8 rounded-2xl border border-card-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label htmlFor="search-q" className="text-sm font-medium text-foreground">
              Search by name or city
            </label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="search-q"
                key={q}
                defaultValue={q}
                placeholder="Try Portland, condo, or waterfront"
                className="w-full rounded-xl border border-card-border bg-background py-2.5 pl-10 pr-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateParam("q", (e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:opacity-95 lg:mb-0.5"
            onClick={() => {
              const el = document.getElementById("search-q") as HTMLInputElement | null;
              updateParam("q", el?.value ?? "");
            }}
          >
            Search
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="filter-cat">
              Category
            </label>
            <select
              id="filter-cat"
              value={category}
              onChange={(e) => updateParam("category", e.target.value)}
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All types</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhome">Townhome</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="min-p">
              Min price
            </label>
            <input
              id="min-p"
              type="number"
              min={0}
              step={10000}
              value={minPrice}
              onChange={(e) => updateParam("minPrice", e.target.value)}
              placeholder="0"
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="max-p">
              Max price
            </label>
            <input
              id="max-p"
              type="number"
              min={0}
              step={50000}
              value={maxPrice}
              onChange={(e) => updateParam("maxPrice", e.target.value)}
              placeholder="No max"
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="min-r">
              Minimum rating
            </label>
            <select
              id="min-r"
              value={minRating}
              onChange={(e) => updateParam("minRating", e.target.value)}
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Any rating</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="city-f">
              City contains
            </label>
            <input
              id="city-f"
              value={city}
              onChange={(e) => updateParam("city", e.target.value)}
              placeholder="e.g. Seattle"
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="sort-f">
              Sort by
            </label>
            <select
              id="sort-f"
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="newest">Newest listed</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Highest rating</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm text-accent" role="alert">
          {error}
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          : data?.items.map((p) => <PropertyCard key={p._id} property={p} />)}
      </div>

      {!loading && data && data.items.length === 0 && (
        <p className="mt-8 text-center text-muted">No listings match those filters. Reset filters or broaden your price range.</p>
      )}

      {!loading && data && data.totalPages > 1 && (
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
          <button
            type="button"
            disabled={page <= 1}
            className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium disabled:opacity-40"
            onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("page", String(page - 1));
              router.push(`/explore?${p.toString()}`);
            }}
          >
            Previous
          </button>
          <span className="px-2 text-sm text-muted">
            Page {data.page} of {data.totalPages} ({data.total} listings)
          </span>
          <button
            type="button"
            disabled={page >= data.totalPages}
            className="rounded-lg border border-card-border px-4 py-2 text-sm font-medium disabled:opacity-40"
            onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("page", String(page + 1));
              router.push(`/explore?${p.toString()}`);
            }}
          >
            Next
          </button>
        </nav>
      )}

      {loading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading listings…
        </div>
      )}
    </div>
  );
}
