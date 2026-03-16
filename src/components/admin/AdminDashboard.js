"use client";

import { useMemo, useState } from "react";
import { LogOut, Plus, RefreshCw, Save, Shield, Soup, Users } from "lucide-react";

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[1.6rem] border border-white/70 bg-white/72 p-4 shadow-[0_14px_40px_rgba(148,163,184,0.16)] backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">{label}</p>
        <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function SectionCard({ title, subtitle, children, right }) {
  return (
    <section className="rounded-[1.8rem] border border-white/75 bg-white/68 p-4 shadow-[0_24px_70px_rgba(148,163,184,0.18)] backdrop-blur-2xl sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboard({ initialData, sessionUser }) {
  const [data, setData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [editingItemId, setEditingItemId] = useState("");
  const [editingUserId, setEditingUserId] = useState("");

  const [categoryForm, setCategoryForm] = useState({ id: "", name: "", type: "all", sortOrder: 0 });
  const [itemForm, setItemForm] = useState({
    id: "",
    categoryId: initialData.categories[0]?.id || "",
    name: "",
    type: "veg",
    description: "",
    imageUrl: "",
    pricingKind: "fixed",
    fixedPrice: "",
    sortOrder: 0,
    variantsText: "[]"
  });
  const [userForm, setUserForm] = useState({ username: "", password: "", role: "admin", isActive: true });

  const sortedCategories = useMemo(() => data.categories, [data.categories]);
  const sortedItems = useMemo(() => data.items, [data.items]);
  const sortedUsers = useMemo(() => data.users, [data.users]);

  async function refreshData(successMessage) {
    const response = await fetch("/api/admin/bootstrap", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Unable to refresh dashboard");
    }
    setData(payload.data);
    if (successMessage) {
      setMessage(successMessage);
    }
  }

  async function submitRequest(url, options, successMessage) {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(url, options);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Action failed");
      }
      await refreshData(successMessage);
    } catch (requestError) {
      setError(requestError.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/dashboard/login";
  }

  function startCategoryEdit(category) {
    setEditingCategoryId(category.id);
    setCategoryForm({
      id: category.id,
      name: category.name,
      type: category.type,
      sortOrder: category.sortOrder
    });
  }

  function resetCategoryForm() {
    setEditingCategoryId("");
    setCategoryForm({ id: "", name: "", type: "all", sortOrder: data.categories.length });
  }

  function startItemEdit(item) {
    setEditingItemId(item.id);
    setItemForm({
      id: item.id,
      categoryId: item.categoryId,
      name: item.name,
      type: item.type,
      description: item.description,
      imageUrl: item.imageUrl,
      pricingKind: item.pricingKind,
      fixedPrice: item.fixedPrice,
      sortOrder: item.sortOrder,
      variantsText: prettyJson(item.variants)
    });
  }

  function resetItemForm() {
    setEditingItemId("");
    setItemForm({
      id: "",
      categoryId: data.categories[0]?.id || "",
      name: "",
      type: "veg",
      description: "",
      imageUrl: "",
      pricingKind: "fixed",
      fixedPrice: "",
      sortOrder: 0,
      variantsText: "[]"
    });
  }

  function startUserEdit(user) {
    setEditingUserId(String(user.id));
    setUserForm({
      username: user.username,
      password: "",
      role: user.role,
      isActive: user.isActive
    });
  }

  function resetUserForm() {
    setEditingUserId("");
    setUserForm({ username: "", password: "", role: "admin", isActive: true });
  }

  async function saveCategory(event) {
    event.preventDefault();
    const url = editingCategoryId ? `/api/admin/categories/${editingCategoryId}` : "/api/admin/categories";
    const method = editingCategoryId ? "PATCH" : "POST";
    await submitRequest(
      url,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: categoryForm.id,
          name: categoryForm.name,
          type: categoryForm.type,
          sortOrder: Number(categoryForm.sortOrder || 0)
        })
      },
      editingCategoryId ? "Category updated" : "Category created"
    );
    resetCategoryForm();
  }

  async function saveItem(event) {
    event.preventDefault();
    const url = editingItemId ? `/api/admin/items/${editingItemId}` : "/api/admin/items";
    const method = editingItemId ? "PATCH" : "POST";
    let variants = [];

    if (itemForm.pricingKind === "variant") {
      variants = JSON.parse(itemForm.variantsText || "[]");
    }

    await submitRequest(
      url,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itemForm.id,
          categoryId: itemForm.categoryId,
          name: itemForm.name,
          type: itemForm.type,
          description: itemForm.description,
          imageUrl: itemForm.imageUrl,
          sortOrder: Number(itemForm.sortOrder || 0),
          pricing: itemForm.pricingKind === "fixed"
            ? { kind: "fixed", price: Number(itemForm.fixedPrice || 0) }
            : { kind: "variant", variants }
        })
      },
      editingItemId ? "Item updated" : "Item created"
    );
    resetItemForm();
  }

  async function saveUser(event) {
    event.preventDefault();
    const url = editingUserId ? `/api/admin/users/${editingUserId}` : "/api/admin/users";
    const method = editingUserId ? "PATCH" : "POST";

    await submitRequest(
      url,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm)
      },
      editingUserId ? "User updated" : "User created"
    );
    resetUserForm();
  }

  async function removeCategory(id) {
    await submitRequest(`/api/admin/categories/${id}`, { method: "DELETE" }, "Category removed");
  }

  async function removeItem(id) {
    await submitRequest(`/api/admin/items/${id}`, { method: "DELETE" }, "Item removed");
  }

  async function removeUser(id) {
    await submitRequest(`/api/admin/users/${id}`, { method: "DELETE" }, "User removed");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(237,242,247,0.95)_38%,_rgba(221,229,240,0.9))] px-3 py-3 text-slate-900 sm:px-4 sm:py-4">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-[0_28px_90px_rgba(148,163,184,0.2)] backdrop-blur-3xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-slate-500">Dashboard</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{data.restaurant.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Manage categories, menu pricing, public image URLs, and admin users from one mobile-first glass dashboard.</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Logged in as {sessionUser.username} • {sessionUser.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => refreshData("Dashboard refreshed")}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700"
              >
                <RefreshCw size={14} /> Refresh
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Categories" value={data.stats.categories} icon={Soup} />
          <StatCard label="Menu Items" value={data.stats.items} icon={Plus} />
          <StatCard label="Admins" value={data.stats.users} icon={Users} />
        </div>

        {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <SectionCard title="Categories" subtitle="Compact category controls for mobile use.">
            <form onSubmit={saveCategory} className="grid gap-3 rounded-[1.5rem] bg-slate-50/80 p-3">
              <input value={categoryForm.id} onChange={(event) => setCategoryForm((c) => ({ ...c, id: event.target.value }))} placeholder="category-id (optional)" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input value={categoryForm.name} onChange={(event) => setCategoryForm((c) => ({ ...c, name: event.target.value }))} placeholder="Category name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <select value={categoryForm.type} onChange={(event) => setCategoryForm((c) => ({ ...c, type: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <option value="all">All</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non veg</option>
                  <option value="egg">Egg</option>
                </select>
                <input type="number" value={categoryForm.sortOrder} onChange={(event) => setCategoryForm((c) => ({ ...c, sortOrder: event.target.value }))} placeholder="Sort" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"><Save size={14} /> {editingCategoryId ? "Update" : "Add"}</button>
                <button type="button" onClick={resetCategoryForm} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Reset</button>
              </div>
            </form>

            <div className="mt-4 space-y-2">
              {sortedCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/70 bg-white/90 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{category.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{category.id} • {category.type} • {category.itemCount} items</p>
                  </div>
                  <div className="flex gap-2 text-xs font-semibold">
                    <button onClick={() => startCategoryEdit(category)} className="rounded-xl border border-slate-200 px-3 py-2 text-slate-700">Edit</button>
                    <button onClick={() => removeCategory(category.id)} className="rounded-xl bg-rose-50 px-3 py-2 text-rose-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Menu Items" subtitle="Image uses public URL only. Keep more data visible in a tighter card layout.">
            <form onSubmit={saveItem} className="grid gap-3 rounded-[1.5rem] bg-slate-50/80 p-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={itemForm.id} onChange={(event) => setItemForm((c) => ({ ...c, id: event.target.value }))} placeholder="item-id (optional)" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
                <select value={itemForm.categoryId} onChange={(event) => setItemForm((c) => ({ ...c, categoryId: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  {sortedCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
              <input value={itemForm.name} onChange={(event) => setItemForm((c) => ({ ...c, name: event.target.value }))} placeholder="Item name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <textarea value={itemForm.description} onChange={(event) => setItemForm((c) => ({ ...c, description: event.target.value }))} rows={2} placeholder="Description" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input value={itemForm.imageUrl} onChange={(event) => setItemForm((c) => ({ ...c, imageUrl: event.target.value }))} placeholder="Public image URL" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <div className="grid grid-cols-3 gap-3">
                <select value={itemForm.type} onChange={(event) => setItemForm((c) => ({ ...c, type: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non veg</option>
                  <option value="egg">Egg</option>
                </select>
                <select value={itemForm.pricingKind} onChange={(event) => setItemForm((c) => ({ ...c, pricingKind: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <option value="fixed">Fixed</option>
                  <option value="variant">Variant</option>
                </select>
                <input type="number" value={itemForm.sortOrder} onChange={(event) => setItemForm((c) => ({ ...c, sortOrder: event.target.value }))} placeholder="Sort" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </div>
              {itemForm.pricingKind === "fixed" ? (
                <input type="number" value={itemForm.fixedPrice} onChange={(event) => setItemForm((c) => ({ ...c, fixedPrice: event.target.value }))} placeholder="Price" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              ) : (
                <textarea value={itemForm.variantsText} onChange={(event) => setItemForm((c) => ({ ...c, variantsText: event.target.value }))} rows={5} placeholder='[{"label":"Half","size":"Half","price":140}]' className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-xs" />
              )}
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"><Save size={14} /> {editingItemId ? "Update" : "Add"}</button>
                <button type="button" onClick={resetItemForm} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Reset</button>
              </div>
            </form>

            <div className="mt-4 grid gap-2">
              {sortedItems.map((item) => (
                <div key={item.id} className="rounded-[1.4rem] border border-white/70 bg-white/92 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{item.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{item.categoryName} • {item.type} • {item.pricingKind}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{item.description || "No description"}</p>
                      <p className="mt-1 truncate text-[11px] text-slate-400">{item.imageUrl || "Placeholder image will be used"}</p>
                      <p className="mt-2 text-xs font-semibold text-slate-700">
                        {item.pricingKind === "fixed" ? `Price: INR ${item.fixedPrice}` : `${item.variants.length} variants`}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs font-semibold">
                      <button onClick={() => startItemEdit(item)} className="rounded-xl border border-slate-200 px-3 py-2 text-slate-700">Edit</button>
                      <button onClick={() => removeItem(item.id)} className="rounded-xl bg-rose-50 px-3 py-2 text-rose-700">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Admin Users" subtitle="Create and manage dashboard access.">
          <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
            <form onSubmit={saveUser} className="grid gap-3 rounded-[1.5rem] bg-slate-50/80 p-3">
              <input value={userForm.username} onChange={(event) => setUserForm((c) => ({ ...c, username: event.target.value }))} placeholder="Username" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <input type="password" value={userForm.password} onChange={(event) => setUserForm((c) => ({ ...c, password: event.target.value }))} placeholder={editingUserId ? "New password (optional)" : "Password"} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <select value={userForm.role} onChange={(event) => setUserForm((c) => ({ ...c, role: event.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super admin</option>
                </select>
                <select value={userForm.isActive ? "active" : "inactive"} onChange={(event) => setUserForm((c) => ({ ...c, isActive: event.target.value === "active" }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"><Shield size={14} /> {editingUserId ? "Update" : "Add"}</button>
                <button type="button" onClick={resetUserForm} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Reset</button>
              </div>
            </form>

            <div className="grid gap-2">
              {sortedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/70 bg-white/92 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{user.username}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{user.role} • {user.isActive ? "active" : "inactive"}</p>
                  </div>
                  <div className="flex gap-2 text-xs font-semibold">
                    <button onClick={() => startUserEdit(user)} className="rounded-xl border border-slate-200 px-3 py-2 text-slate-700">Edit</button>
                    <button onClick={() => removeUser(user.id)} className="rounded-xl bg-rose-50 px-3 py-2 text-rose-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
