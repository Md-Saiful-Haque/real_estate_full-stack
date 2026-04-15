"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Row = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export function AdminUsersTable() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    items: Row[];
    total: number;
    totalPages: number;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (q) params.set("q", q);
    if (role) params.set("role", role);
    const res = await fetch(`/api/admin/users?${params}`);
    const json = await res.json();
    setData({
      items: json.items ?? [],
      total: json.total ?? 0,
      totalPages: json.totalPages ?? 1,
    });
    setLoading(false);
  }, [q, role, page]);

  /* eslint-disable react-hooks/set-state-in-effect -- data fetch on dependency change */
  useEffect(() => {
    void load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="user-q" className="text-sm font-medium text-foreground">
            Search name or email
          </label>
          <input
            id="user-q"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-sm"
            placeholder="Filter…"
          />
        </div>
        <div>
          <label htmlFor="user-role" className="text-sm font-medium text-foreground">
            Role
          </label>
          <select
            id="user-role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-sm sm:w-40"
          >
            <option value="">All</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-card-border">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading users…
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-card text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((u) => (
                <tr key={u.id} className="border-t border-card-border">
                  <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page <= 1}
            className="rounded-lg border border-card-border px-3 py-1 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-muted">
            Page {page} of {data.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= data.totalPages}
            className="rounded-lg border border-card-border px-3 py-1 disabled:opacity-40"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
