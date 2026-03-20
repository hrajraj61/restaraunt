"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import LoginForm from "../../../components/admin/LoginForm";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const res = await fetch(`${API_BASE}/api/admin/session`);
        if (res.ok) {
          router.push("/dashboard");
        } else {
          setChecking(false);
        }
      } catch {
        setChecking(false);
      }
    }
    checkSession();
  }, [router]);

  if (checking) return <div className="min-h-screen bg-stone-950"></div>;
  return <LoginForm />;
}
