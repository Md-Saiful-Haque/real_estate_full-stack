"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#0f766e", "#1e3a5f", "#c2410c", "#78716c", "#a8a29e"];

export function AnalyticsCharts({
  monthly,
  categories,
  totals,
}: {
  monthly: { name: string; inquiries: number }[];
  categories: { name: string; value: number }[];
  totals: { users: number; properties: number; inquiries: number };
}) {
  const lineData = monthly.map((m) => ({ name: m.name, inquiries: m.inquiries }));

  return (
    <div className="mt-8 space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Users", value: totals.users },
          { label: "Listings", value: totals.properties },
          { label: "Inquiries", value: totals.inquiries },
        ].map((t) => (
          <div key={t.label} className="rounded-2xl border border-card-border bg-card p-4">
            <p className="text-sm text-muted">{t.label}</p>
            <p className="text-2xl font-bold text-primary">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-card-border bg-card p-4">
        <h2 className="text-lg font-semibold text-foreground">Inquiries by month</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-card-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--card-border)" }} />
              <Bar dataKey="inquiries" fill="#0f766e" name="Inquiries" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-card p-4">
        <h2 className="text-lg font-semibold text-foreground">Inquiry trend</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-card-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--card-border)" }} />
              <Line type="monotone" dataKey="inquiries" stroke="#1e3a5f" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-card p-4">
        <h2 className="text-lg font-semibold text-foreground">Listings by category</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categories.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--card-border)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
