"use client";

import { useState } from "react";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Login failed");
      }

      window.location.href = "/dashboard";
    } catch (submitError) {
      setError(submitError.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(235,240,246,0.94)_45%,_rgba(214,223,234,0.92))] px-4 py-6 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center">
        <div className="w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_30px_80px_rgba(148,163,184,0.28)] backdrop-blur-2xl">
          <div className="border-b border-slate-200/80 px-5 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-slate-500">Protected Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Menu admin</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">White glassmorphism mobile login for menu pricing and user management.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Username</span>
              <input
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                className="w-full rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400"
                placeholder="Enter username"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-400"
                placeholder="Enter password"
              />
            </label>

            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Open dashboard"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
