import { AdminPropertiesTable } from "./AdminPropertiesTable";

export const metadata = { title: "Manage listings" };

export default function AdminPropertiesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Listings</h1>
      <p className="mt-1 text-sm text-muted">Toggle featured placements on the home page carousel.</p>
      <div className="mt-8">
        <AdminPropertiesTable />
      </div>
    </div>
  );
}
