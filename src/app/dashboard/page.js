import { redirect } from "next/navigation";
import { getDashboardSnapshot } from "../../lib/admin-store";
import { requireAdminPageSession } from "../../lib/admin-auth";
import AdminDashboard from "../../components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireAdminPageSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const initialData = await getDashboardSnapshot();
  return <AdminDashboard initialData={initialData} sessionUser={session} />;
}
