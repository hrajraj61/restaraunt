import { redirect } from "next/navigation";
import { requireAdminPageSession } from "../../../lib/admin-auth";
import LoginForm from "../../../components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function DashboardLoginPage() {
  const session = await requireAdminPageSession();

  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
