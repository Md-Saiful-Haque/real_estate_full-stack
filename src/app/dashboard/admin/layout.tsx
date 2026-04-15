import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.user.role !== "admin") {
    redirect("/dashboard");
  }
  return children;
}
