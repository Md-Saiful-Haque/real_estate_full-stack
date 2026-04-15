import { AdminUsersTable } from "./AdminUsersTable";

export const metadata = { title: "Manage users" };

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Users</h1>
      <p className="mt-1 text-sm text-muted">Search and filter accounts registered on NestFinder.</p>
      <div className="mt-8">
        <AdminUsersTable />
      </div>
    </div>
  );
}
