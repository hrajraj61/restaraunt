"use client";

import { useState } from "react";
import { LogOut, Plus, RefreshCw, Save, Shield, Soup, Trash2, Edit3, Users, Utensils, X, ChevronDown } from "lucide-react";

const TABS = [
  { id: "categories", label: "Categories", icon: Soup },
  { id: "items", label: "Menu Items", icon: Utensils },
  { id: "users", label: "Users", icon: Users },
];

function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>}
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
      />
    </label>
  );
}

function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>}
      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
        >
          {children}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

function Btn({ variant = "primary", icon: Icon, children, className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200",
    ghost: "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-2 rounded-full bg-slate-100 p-3">
        <Soup size={20} className="text-slate-400" />
      </div>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

/* Variant Row Editor */
function VariantRows({ variants, onChange }) {
  function updateVariant(index, field, value) {
    const updated = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    onChange(updated);
  }

  function removeVariant(index) {
    onChange(variants.filter((_, i) => i !== index));
  }

  function addVariant() {
    onChange([...variants, { name: "", price: "" }]);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Variants</span>
        <button type="button" onClick={addVariant} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition">
          <Plus size={12} /> Add
        </button>
      </div>
      {variants.length === 0 && (
        <p className="text-xs text-slate-400 italic">No variants yet. Click Add to create one.</p>
      )}
      {variants.map((v, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1">
            {i === 0 && <span className="mb-1 block text-[10px] font-medium text-slate-400">Name</span>}
            <input
              value={v.name}
              onChange={(e) => updateVariant(i, "name", e.target.value)}
              placeholder="e.g. Half, Full, Large"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <div className="w-28">
            {i === 0 && <span className="mb-1 block text-[10px] font-medium text-slate-400">Price</span>}
            <input
              type="number"
              value={v.price}
              onChange={(e) => updateVariant(i, "price", e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <button type="button" onClick={() => removeVariant(i)} className="mb-0.5 rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* Categories Tab */
function CategoriesTab({ categories, loading, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: "", name: "", type: "all", sortOrder: 0 });

  function startEdit(cat) {
    setEditing(cat.id);
    setForm({ id: cat.id, name: cat.name, type: cat.type, sortOrder: cat.sortOrder });
  }

  function resetForm() {
    setEditing(null);
    setForm({ id: "", name: "", type: "all", sortOrder: categories.length });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await onSave(form, editing);
    resetForm();
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h3 className="text-sm font-semibold text-slate-900">{editing ? "Edit Category" : "New Category"}</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Category ID (optional)" value={form.id} onChange={(e) => setForm(f => ({ ...f, id: e.target.value }))} placeholder="auto-generated" disabled={!!editing} />
            <Input label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Category name" required />
          </div>
          <div className="grid gap-3 grid-cols-2">
            <Select label="Type" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="all">All</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non veg</option>
              <option value="egg">Egg</option>
            </Select>
            <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-1">
            <Btn type="submit" disabled={loading} icon={Save} className="flex-1">{editing ? "Update" : "Add Category"}</Btn>
            {editing && <Btn type="button" variant="secondary" onClick={resetForm}>Cancel</Btn>}
          </div>
        </form>
      </Card>

      <Card>
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h3 className="text-sm font-semibold text-slate-900">All Categories ({categories.length})</h3>
        </div>
        {categories.length === 0 ? (
          <EmptyState message="No categories yet" />
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 hover:bg-slate-50/50 transition">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{cat.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{cat.id} · {cat.type} · {cat.itemCount} items</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <Btn variant="ghost" icon={Edit3} onClick={() => startEdit(cat)} />
                  <Btn variant="danger" icon={Trash2} onClick={() => onDelete(cat.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* Menu Items Tab */
function ItemsTab({ items, categories, loading, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: "",
    categoryId: categories[0]?.id || "",
    name: "",
    type: "veg",
    description: "",
    imageUrl: "",
    pricingKind: "fixed",
    fixedPrice: "",
    sortOrder: 0,
    variants: [],
  });

  function startEdit(item) {
    setEditing(item.id);
    setForm({
      id: item.id,
      categoryId: item.categoryId,
      name: item.name,
      type: item.type,
      description: item.description,
      imageUrl: item.imageUrl,
      pricingKind: item.pricingKind,
      fixedPrice: item.fixedPrice,
      sortOrder: item.sortOrder,
      variants: item.variants.map((v) => ({ name: v.name, price: v.price })),
    });
  }

  function resetForm() {
    setEditing(null);
    setForm({
      id: "",
      categoryId: categories[0]?.id || "",
      name: "",
      type: "veg",
      description: "",
      imageUrl: "",
      pricingKind: "fixed",
      fixedPrice: "",
      sortOrder: 0,
      variants: [],
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const variants = form.variants.map((v) => ({ name: v.name, price: Number(v.price || 0) }));
    await onSave(
      {
        ...form,
        pricing:
          form.pricingKind === "fixed"
            ? { kind: "fixed", price: Number(form.fixedPrice || 0) }
            : { kind: "variant", variants },
      },
      editing
    );
    resetForm();
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h3 className="text-sm font-semibold text-slate-900">{editing ? "Edit Item" : "New Item"}</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Item ID (optional)" value={form.id} onChange={(e) => setForm(f => ({ ...f, id: e.target.value }))} placeholder="auto-generated" disabled={!!editing} />
            <Select label="Category" value={form.categoryId} onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <Input label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Item name" required />
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Optional description"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none resize-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
            />
          </label>
          <Input label="Image URL" value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://... (optional)" />
          <div className="grid gap-3 grid-cols-3">
            <Select label="Diet" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="veg">Veg</option>
              <option value="non-veg">Non veg</option>
              <option value="egg">Egg</option>
            </Select>
            <Select label="Pricing" value={form.pricingKind} onChange={(e) => setForm(f => ({ ...f, pricingKind: e.target.value }))}>
              <option value="fixed">Fixed</option>
              <option value="variant">Variant</option>
            </Select>
            <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: e.target.value }))} />
          </div>

          {form.pricingKind === "fixed" ? (
            <Input label="Price" type="number" value={form.fixedPrice} onChange={(e) => setForm(f => ({ ...f, fixedPrice: e.target.value }))} placeholder="0" />
          ) : (
            <VariantRows variants={form.variants} onChange={(v) => setForm(f => ({ ...f, variants: v }))} />
          )}

          <div className="flex gap-2 pt-1">
            <Btn type="submit" disabled={loading} icon={Save} className="flex-1">{editing ? "Update" : "Add Item"}</Btn>
            {editing && <Btn type="button" variant="secondary" onClick={resetForm}>Cancel</Btn>}
          </div>
        </form>
      </Card>

      <Card>
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h3 className="text-sm font-semibold text-slate-900">All Items ({items.length})</h3>
        </div>
        {items.length === 0 ? (
          <EmptyState message="No menu items yet" />
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="px-4 py-3 sm:px-5 hover:bg-slate-50/50 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        item.type === "veg" ? "bg-green-50 text-green-700" : item.type === "non-veg" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                      }`}>{item.type}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{item.categoryName} · {item.pricingKind}</p>
                    {item.description && <p className="mt-1 text-xs text-slate-500 line-clamp-1">{item.description}</p>}
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {item.pricingKind === "fixed"
                        ? `₹${item.fixedPrice}`
                        : item.variants.map((v) => `${v.name}: ₹${v.price}`).join(" · ")}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Btn variant="ghost" icon={Edit3} onClick={() => startEdit(item)} />
                    <Btn variant="danger" icon={Trash2} onClick={() => onDelete(item.id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* Users Tab */
function UsersTab({ users, loading, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ username: "", password: "", role: "admin", isActive: true });

  function startEdit(user) {
    setEditing(String(user.id));
    setForm({ username: user.username, password: "", role: user.role, isActive: user.isActive });
  }

  function resetForm() {
    setEditing(null);
    setForm({ username: "", password: "", role: "admin", isActive: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await onSave(form, editing);
    resetForm();
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h3 className="text-sm font-semibold text-slate-900">{editing ? "Edit User" : "New User"}</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Username" value={form.username} onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))} placeholder="Username" required />
            <Input label={editing ? "New Password (optional)" : "Password"} type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" required={!editing} />
          </div>
          <div className="grid gap-3 grid-cols-2">
            <Select label="Role" value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </Select>
            <Select label="Status" value={form.isActive ? "active" : "inactive"} onChange={(e) => setForm(f => ({ ...f, isActive: e.target.value === "active" }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
          <div className="flex gap-2 pt-1">
            <Btn type="submit" disabled={loading} icon={Shield} className="flex-1">{editing ? "Update" : "Add User"}</Btn>
            {editing && <Btn type="button" variant="secondary" onClick={resetForm}>Cancel</Btn>}
          </div>
        </form>
      </Card>

      <Card>
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h3 className="text-sm font-semibold text-slate-900">All Users ({users.length})</h3>
        </div>
        {users.length === 0 ? (
          <EmptyState message="No users" />
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 hover:bg-slate-50/50 transition">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{user.username}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${user.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{user.role}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <Btn variant="ghost" icon={Edit3} onClick={() => startEdit(user)} />
                  <Btn variant="danger" icon={Trash2} onClick={() => onDelete(user.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* Main Dashboard */
export default function AdminDashboard({ initialData, sessionUser }) {
  const [data, setData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");

  async function refreshData(successMessage) {
    const response = await fetch("/api/admin/bootstrap", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to refresh dashboard");
    setData(payload.data);
    if (successMessage) setMessage(successMessage);
  }

  async function submitRequest(url, options, successMessage) {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(url, options);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Action failed");
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

  async function saveCategory(form, editingId) {
    const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
    const method = editingId ? "PATCH" : "POST";
    await submitRequest(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: form.id, name: form.name, type: form.type, sortOrder: Number(form.sortOrder || 0) }),
    }, editingId ? "Category updated" : "Category created");
  }

  async function removeCategory(id) {
    await submitRequest(`/api/admin/categories/${id}`, { method: "DELETE" }, "Category removed");
  }

  async function saveItem(form, editingId) {
    const url = editingId ? `/api/admin/items/${editingId}` : "/api/admin/items";
    const method = editingId ? "PATCH" : "POST";
    await submitRequest(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.id,
        categoryId: form.categoryId,
        name: form.name,
        type: form.type,
        description: form.description,
        imageUrl: form.imageUrl,
        sortOrder: Number(form.sortOrder || 0),
        pricing: form.pricing,
      }),
    }, editingId ? "Item updated" : "Item created");
  }

  async function removeItem(id) {
    await submitRequest(`/api/admin/items/${id}`, { method: "DELETE" }, "Item removed");
  }

  async function saveUser(form, editingId) {
    const url = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
    const method = editingId ? "PATCH" : "POST";
    await submitRequest(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }, editingId ? "User updated" : "User created");
  }

  async function removeUser(id) {
    await submitRequest(`/api/admin/users/${id}`, { method: "DELETE" }, "User removed");
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">{data.restaurant.name}</h1>
            <p className="text-[11px] text-slate-500">
              {sessionUser.username} · {sessionUser.role}
            </p>
          </div>
          <div className="flex gap-2">
            <Btn variant="secondary" icon={RefreshCw} onClick={() => refreshData("Refreshed")} disabled={loading} />
            <Btn variant="secondary" icon={LogOut} onClick={handleLogout} disabled={loading} />
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: "Categories", value: data.stats.categories, icon: Soup },
            { label: "Items", value: data.stats.items, icon: Utensils },
            { label: "Users", value: data.stats.users, icon: Users },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200/80 bg-white px-3 py-3 text-center shadow-sm">
              <s.icon size={16} className="mx-auto text-slate-400" />
              <p className="mt-1 text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toasts */}
      <div className="mx-auto max-w-3xl px-4 pt-3">
        {message && (
          <div className="mb-2 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="ml-3 text-emerald-500 hover:text-emerald-700"><X size={14} /></button>
          </div>
        )}
        {error && (
          <div className="mb-2 flex items-center justify-between rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-3 text-red-500 hover:text-red-700"><X size={14} /></button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <nav className="sticky top-[57px] z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMessage(""); setError(""); }}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="mx-auto max-w-3xl px-4 py-4 pb-20">
        {activeTab === "categories" && (
          <CategoriesTab
            categories={data.categories}
            loading={loading}
            onSave={saveCategory}
            onDelete={removeCategory}
          />
        )}
        {activeTab === "items" && (
          <ItemsTab
            items={data.items}
            categories={data.categories}
            loading={loading}
            onSave={saveItem}
            onDelete={removeItem}
          />
        )}
        {activeTab === "users" && (
          <UsersTab
            users={data.users}
            loading={loading}
            onSave={saveUser}
            onDelete={removeUser}
          />
        )}
      </main>
    </div>
  );
}
