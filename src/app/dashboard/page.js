"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import AdminDashboard from "../../components/admin/AdminDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const sessionRes = await fetch(`${API_BASE}/api/admin/session`);
        if (!sessionRes.ok) throw new Error("No session");
        const sessionData = await sessionRes.json();
        
        const bootstrapRes = await fetch(`${API_BASE}/api/admin/bootstrap`);
        if (!bootstrapRes.ok) throw new Error("No bootstrap");
        const bootstrapData = await bootstrapRes.json();
        
        setSessionUser(sessionData.user);
        setInitialData(bootstrapData.data);
      } catch (err) {
        router.push("/dashboard/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] text-stone-400 font-bold text-xs uppercase tracking-widest">Loading...</div>;
  if (!sessionUser || !initialData) return null;

  return <AdminDashboard initialData={initialData} sessionUser={sessionUser} />;
}
