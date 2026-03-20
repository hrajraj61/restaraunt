import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "../../components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

async function fetchSession(cookieHeader) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  const response = await fetch(`${baseUrl}/api/admin/session`, {
    headers: { cookie: cookieHeader || "" },
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function fetchBootstrap(cookieHeader) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  const response = await fetch(`${baseUrl}/api/admin/bootstrap`, {
    headers: { cookie: cookieHeader || "" },
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.data;
}

export default async function DashboardPage() {
  const cookieHeader = headers().get("cookie") ?? "";
  const sessionPayload = await fetchSession(cookieHeader);
  if (!sessionPayload?.user) {
    redirect("/dashboard/login");
  }

  const initialData = await fetchBootstrap(cookieHeader);
  if (!initialData) {
    redirect("/dashboard/login");
  }

  return <AdminDashboard initialData={initialData} sessionUser={sessionPayload.user} />;
}
