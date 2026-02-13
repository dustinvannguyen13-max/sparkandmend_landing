import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/admin/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getAdminSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
