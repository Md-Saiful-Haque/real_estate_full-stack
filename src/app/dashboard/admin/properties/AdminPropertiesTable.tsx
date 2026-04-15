"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Row = {
  id: string;
  slug: string;
  title: string;
  city: string;
  price: number;
  featured: boolean;
  listedAt: string;
};

export function AdminPropertiesTable() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    items: Row[];
    totalPages: number;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/properties?${params}`);
    const json = await res.json();
    setData({
      items: json.items ?? [],
      totalPages: json.totalPages ?? 1,
    });
    setLoading(false);
  }, [q, page]);

  /* eslint-disable react-hooks/set-state-in-effect -- data fetch on dependency change */
  useEffect(() => {
    void load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function toggleFeatured(id: string, featured: boolean) {
    await fetch("/api/admin/properties", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, featured: !featured }),
    });
    load();
  }

  return (
    <div>
      <div>
        <label htmlFor="prop-q" className="text-sm font-medium text-foreground">
          Search title or city
        </label>
        <input
          id="prop-q"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="mt-1 w-full max-w-md rounded-xl border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-card-border">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading…
          </div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-card text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Listing</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Featured</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((p) => (
                <tr key={p.id} className="border-t border-card-border">
                  <td className="px-4 py-3">
                    <Link href={`/properties/${p.slug}`} className="font-medium text-primary hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{p.city}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(p.id, p.featured)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.featured ? "bg-primary text-primary-foreground" : "bg-card-border text-foreground"
                      }`}
                    >
                      {p.featured ? "Featured" : "Not featured"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {data && data.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1}
            className="rounded-lg border border-card-border px-3 py-1 text-sm disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= data.totalPages}
            className="rounded-lg border border-card-border px-3 py-1 text-sm disabled:opacity-40"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
