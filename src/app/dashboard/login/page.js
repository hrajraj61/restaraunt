import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "../../../components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function DashboardLoginPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  const response = await fetch(`${baseUrl}/api/admin/session`, {
    headers: { cookie: headers().get("cookie") ?? "" },
    cache: "no-store"
  });

  if (response.ok) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
