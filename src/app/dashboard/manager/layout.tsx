import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function ManagerSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.user.role !== "manager") {
    redirect("/dashboard");
  }
  return children;
}
