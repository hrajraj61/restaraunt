"use client";

import { Capacitor } from "@capacitor/core";
import { useState, useCallback } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Users,
  Plus,
  Search,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Package,
  Menu,
  X,
  Save,
  Shield,
  Trash2,
  Edit3,
  LogOut,
  RefreshCw,
  Percent,
  TicketPercent,
  Check,
  Copy,
} from "lucide-react";

/* ══════════════════════════════════════════
   SHARED UI PRIMITIVES (Luxe stone theme)
   ══════════════════════════════════════════ */

function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</span>}
      <input
        {...props}
        className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
      />
    </label>
  );
}

function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</span>}
      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
        >
          {children}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
      </div>
    </label>
  );
}

function Btn({ variant = "primary", icon: Icon, children, className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-stone-900 text-white hover:opacity-90 shadow-lg shadow-stone-200",
    secondary: "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:shadow-sm",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-stone-400 hover:text-stone-700 hover:bg-stone-100",
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
    <div className={`rounded-2xl border border-stone-100 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 rounded-full bg-stone-50 p-4">
        <Package size={24} className="text-stone-300" />
      </div>
      <p className="text-sm text-stone-400 font-medium">{message}</p>
    </div>
  );
}

/* ── Confirm Dialog ── */
function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-5 w-full max-w-sm">
        <h3 className="text-sm font-bold text-stone-900 mb-1">{title || "Confirm Delete"}</h3>
        <p className="text-xs text-stone-500 mb-4">{message || "Are you sure? This action cannot be undone."}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-stone-200 text-sm font-bold text-stone-600 hover:bg-stone-50 transition">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition disabled:opacity-50">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Variant Row Editor ── */
function VariantRows({ variants, onChange }) {
  function updateVariant(index, field, value) {
    const updated = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    onChange(updated);
  }
  function removeVariant(index) { onChange(variants.filter((_, i) => i !== index)); }
  function addVariant() { onChange([...variants, { name: "", price: "" }]); }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Variants</span>
        <button type="button" onClick={addVariant} className="inline-flex items-center gap-1 rounded-lg bg-stone-50 px-2.5 py-1.5 text-[10px] font-bold text-stone-600 hover:bg-stone-100 transition uppercase tracking-wider">
          <Plus size={12} /> Add
        </button>
      </div>
      {variants.length === 0 && <p className="text-xs text-stone-300 italic">No variants. Click Add above.</p>}
      {variants.map((v, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1">
            {i === 0 && <span className="mb-1 block text-[10px] font-medium text-stone-300">Name</span>}
            <input value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)} placeholder="e.g. Half, Full, Large" className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400" />
          </div>
          <div className="w-28">
            {i === 0 && <span className="mb-1 block text-[10px] font-medium text-stone-300">Price (₹)</span>}
            <input type="number" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} placeholder="0" className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400" />
          </div>
          <button type="button" onClick={() => removeVariant(i)} className="mb-0.5 rounded-lg p-2 text-red-300 hover:bg-red-50 hover:text-red-500 transition">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   OVERVIEW TAB (Dashboard)
   ══════════════════════════════════════════ */
function OverviewTab({ data }) {
  const stats = [
    { label: "Categories", value: data.stats.categories, icon: Tag },
    { label: "Menu Items", value: data.stats.items, icon: UtensilsCrossed },
    { label: "Admins", value: data.stats.users, icon: Users },
    { label: "Offers", value: data.offers?.length || 0, icon: TicketPercent },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-3 lg:p-5 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2 lg:mb-4">
              <div className="p-1.5 lg:p-2 rounded-xl bg-stone-50 text-stone-400">
                <stat.icon size={16} className="lg:hidden" />
                <stat.icon size={20} className="hidden lg:block" />
              </div>
            </div>
            <p className="text-stone-400 font-bold text-[10px] uppercase tracking-widest mb-0.5">{stat.label}</p>
            <p className="text-lg lg:text-2xl font-bold tracking-tight text-stone-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm lg:text-base font-bold">Menu Categories</h2>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-stone-50">
                  {data.categories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-stone-50/50 transition-colors">
                      <td className="px-4 py-3 lg:px-5 lg:py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-[9px] font-bold text-stone-500">
                            {cat.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-xs leading-none">{cat.name}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">{cat.type} · {cat.itemCount} items</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-stone-50 text-stone-500 text-[10px] font-bold uppercase tracking-wider">{cat.type}</span>
                      </td>
                      <td className="px-4 py-3 lg:px-5 lg:py-3.5 text-right">
                        <span className="text-xs font-bold text-stone-900">{cat.itemCount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm lg:text-base font-bold px-1">Restaurant</h2>
          <div className="p-4 lg:p-6 rounded-2xl bg-stone-900 text-white shadow-xl shadow-stone-200 relative overflow-hidden">
            <TrendingUp className="absolute top-[-20%] right-[-10%] opacity-10" size={120} />
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">Venue</p>
            <h3 className="text-lg lg:text-xl font-bold mb-3">{data.restaurant.name}</h3>
            <div className="space-y-1.5 text-[10px] font-bold text-stone-400">
              {data.restaurant.address && <p>{data.restaurant.address}</p>}
              {data.restaurant.phone && <p>Phone: {data.restaurant.phone}</p>}
              <p>Currency: {data.restaurant.currency || "INR"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   CATEGORIES TAB
   ══════════════════════════════════════════ */
function CategoriesTab({ categories, loading, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", type: "all", sortOrder: 0 });

  function startEdit(cat) {
    setEditing(cat.id);
    setForm({ id: cat.id, name: cat.name, type: cat.type, sortOrder: cat.sortOrder });
    setShowForm(true);
  }
  function resetForm() {
    setEditing(null);
    setShowForm(false);
    setForm({ id: "", name: "", type: "all", sortOrder: categories.length });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    await onSave(form, editing);
    resetForm();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{categories.length} Categories</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="hidden md:flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-stone-200">
          <Plus size={16} /> Create New
        </button>
      </div>

      {showForm && (
        <Card>
          <div className="border-b border-stone-100 px-4 py-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-stone-900">{editing ? "Edit Category" : "New Category"}</h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-stone-50"><X size={16} className="text-stone-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 p-4">
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
            <div className="flex gap-2 pt-2">
              <Btn type="submit" disabled={loading} icon={Save} className="flex-1">{editing ? "Update" : "Add Category"}</Btn>
              <Btn type="button" variant="secondary" onClick={resetForm}>Cancel</Btn>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-2">
        {categories.length === 0 ? (
          <Card><EmptyState message="No categories yet" /></Card>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-stone-100 p-2.5 lg:p-4 flex group hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-stone-50 flex-shrink-0 flex items-center justify-center text-stone-300 mr-3">
                <Tag size={18} />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs lg:text-base text-stone-900 leading-tight truncate">{cat.name}</h3>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">{cat.id} · {cat.type}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-stone-50 text-stone-600 text-[10px] font-bold ml-2 flex-shrink-0">{cat.itemCount} items</span>
                </div>
              </div>
              <div className="flex items-center gap-1 pl-2">
                <button onClick={() => startEdit(cat)} className="p-2 rounded-xl hover:bg-stone-50 text-stone-400 hover:text-stone-700 transition"><Edit3 size={14} /></button>
                <button onClick={() => onDelete(cat.id)} className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={() => { resetForm(); setShowForm(true); }} className="md:hidden fixed bottom-20 right-5 w-12 h-12 bg-stone-900 rounded-2xl shadow-xl shadow-stone-300 flex items-center justify-center text-white z-[60]">
        <Plus size={22} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   MENU ITEMS TAB
   ══════════════════════════════════════════ */
function ItemsTab({ items, categories, loading, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    id: "", categoryId: categories[0]?.id || "", name: "", type: "veg",
    description: "", imageUrl: "", pricingKind: "fixed", fixedPrice: "", sortOrder: 0, variants: [],
  });

  function startEdit(item) {
    setEditing(item.id);
    setForm({
      id: item.id, categoryId: item.categoryId, name: item.name, type: item.type,
      description: item.description, imageUrl: item.imageUrl, pricingKind: item.pricingKind,
      fixedPrice: item.fixedPrice, sortOrder: item.sortOrder,
      variants: item.variants.map((v) => ({ name: v.name, price: v.price })),
    });
    setShowForm(true);
  }
  function resetForm() {
    setEditing(null);
    setShowForm(false);
    setForm({
      id: "", categoryId: categories[0]?.id || "", name: "", type: "veg",
      description: "", imageUrl: "", pricingKind: "fixed", fixedPrice: "", sortOrder: 0, variants: [],
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const variants = form.variants.map((v) => ({ name: v.name, price: Number(v.price || 0) }));
    await onSave(
      { ...form, pricing: form.pricingKind === "fixed" ? { kind: "fixed", price: Number(form.fixedPrice || 0) } : { kind: "variant", variants } },
      editing
    );
    resetForm();
  }

  const filtered = searchQuery.trim()
    ? items.filter((it) => it.name.toLowerCase().includes(searchQuery.toLowerCase()) || it.categoryName.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search items..." className="w-full bg-white border border-stone-200 rounded-xl py-2 pl-10 pr-4 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-stone-100" />
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="hidden md:flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-stone-200">
          <Plus size={16} /> Create New
        </button>
      </div>

      {showForm && (
        <Card>
          <div className="border-b border-stone-100 px-4 py-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-stone-900">{editing ? "Edit Item" : "New Item"}</h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-stone-50"><X size={16} className="text-stone-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Item ID (optional)" value={form.id} onChange={(e) => setForm(f => ({ ...f, id: e.target.value }))} placeholder="auto-generated" disabled={!!editing} />
              <Select label="Category" value={form.categoryId} onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <Input label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Item name" required />
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-stone-400">Description</span>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Optional description" className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none resize-none transition placeholder:text-stone-300 focus:border-stone-400 focus:ring-2 focus:ring-stone-100" />
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
              <Input label="Price (₹)" type="number" value={form.fixedPrice} onChange={(e) => setForm(f => ({ ...f, fixedPrice: e.target.value }))} placeholder="0" />
            ) : (
              <VariantRows variants={form.variants} onChange={(v) => setForm(f => ({ ...f, variants: v }))} />
            )}
            <div className="flex gap-2 pt-2">
              <Btn type="submit" disabled={loading} icon={Save} className="flex-1">{editing ? "Update" : "Add Item"}</Btn>
              <Btn type="button" variant="secondary" onClick={resetForm}>Cancel</Btn>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full"><Card><EmptyState message={searchQuery ? "No items match your search" : "No menu items yet"} /></Card></div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl lg:rounded-2xl border border-stone-100 p-2.5 lg:p-4 flex lg:flex-col group hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 lg:w-full lg:h-16 rounded-xl lg:rounded-xl bg-stone-50 flex-shrink-0 flex items-center justify-center text-stone-200 mb-0 lg:mb-3 mr-2.5 lg:mr-0 overflow-hidden relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <UtensilsCrossed size={20} className="lg:hidden" />
                    <UtensilsCrossed size={32} className="hidden lg:block" />
                  </>
                )}
                <div className="hidden lg:block absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm text-stone-900">
                  {item.categoryName}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-start mb-0.5 lg:mb-1">
                  <div className="min-w-0">
                    <p className="lg:hidden text-[9px] font-bold text-stone-400 uppercase tracking-widest">{item.categoryName}</p>
                    <h3 className="font-bold text-xs lg:text-sm text-stone-900 leading-tight truncate">{item.name}</h3>
                  </div>
                  <p className="font-bold text-xs lg:text-sm text-stone-900 ml-2 flex-shrink-0">
                    {item.pricingKind === "fixed" ? `₹${item.fixedPrice}` : `₹${item.variants[0]?.price || 0}+`}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                      item.type === "veg" ? "bg-emerald-50 text-emerald-600" : item.type === "non-veg" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                    }`}>{item.type}</span>
                    <span className="text-[10px] text-stone-400 font-medium">{item.pricingKind === "variant" ? `${item.variants.length} variants` : "fixed"}</span>
                  </div>
                </div>
                {item.description && <p className="text-[10px] text-stone-400 mt-1 line-clamp-1 hidden lg:block">{item.description}</p>}

                <div className="hidden lg:flex gap-2 mt-2">
                  <button onClick={() => startEdit(item)} className="flex-1 py-1.5 rounded-xl bg-stone-900 text-white text-[10px] font-bold hover:opacity-90 transition">Edit Item</button>
                  <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-xl border border-stone-100 hover:bg-red-50 hover:text-red-500 text-stone-400 transition"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="lg:hidden flex items-center gap-1 pl-1">
                <button onClick={() => startEdit(item)} className="p-2 rounded-xl hover:bg-stone-50 text-stone-400"><Edit3 size={14} /></button>
                <button onClick={() => onDelete(item.id)} className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={() => { resetForm(); setShowForm(true); }} className="md:hidden fixed bottom-20 right-5 w-12 h-12 bg-stone-900 rounded-2xl shadow-xl shadow-stone-300 flex items-center justify-center text-white z-[60]">
        <Plus size={22} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   USERS TAB
   ══════════════════════════════════════════ */
function UsersTab({ users, loading, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", role: "admin", isActive: true });

  function startEdit(user) {
    setEditing(String(user.id));
    setForm({ username: user.username, password: "", role: user.role, isActive: user.isActive });
    setShowForm(true);
  }
  function resetForm() {
    setEditing(null);
    setShowForm(false);
    setForm({ username: "", password: "", role: "admin", isActive: true });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    await onSave(form, editing);
    resetForm();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{users.length} Admin Users</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="hidden md:flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-stone-200">
          <Plus size={16} /> Add User
        </button>
      </div>

      {showForm && (
        <Card>
          <div className="border-b border-stone-100 px-4 py-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-stone-900">{editing ? "Edit User" : "New User"}</h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-stone-50"><X size={16} className="text-stone-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 p-4">
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
            <div className="flex gap-2 pt-2">
              <Btn type="submit" disabled={loading} icon={Shield} className="flex-1">{editing ? "Update" : "Add User"}</Btn>
              <Btn type="button" variant="secondary" onClick={resetForm}>Cancel</Btn>
            </div>
          </form>
        </Card>
      )}

      {users.length === 0 ? (
        <Card><EmptyState message="No users" /></Card>
      ) : (
        <Card>
          <div className="divide-y divide-stone-50">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-stone-50/50 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-500 flex-shrink-0">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-stone-900 truncate">{user.username}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${user.isActive ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">{user.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(user)} className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"><Edit3 size={14} /></button>
                  <button onClick={() => onDelete(user.id)} className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <button onClick={() => { resetForm(); setShowForm(true); }} className="md:hidden fixed bottom-20 right-5 w-12 h-12 bg-stone-900 rounded-2xl shadow-xl shadow-stone-300 flex items-center justify-center text-white z-[60]">
        <Plus size={22} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   OFFERS / PROMOTIONS TAB
   ══════════════════════════════════════════ */
function OffersTab({ offers, categories, items, loading, onSave, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [form, setForm] = useState({
    code: "", title: "", discountPercent: "", applyTo: "all", targetIds: [], isActive: true, validFrom: "", validUntil: "",
  });

  function startEdit(offer) {
    setEditing(String(offer.id));
    setForm({
      code: offer.code, title: offer.title, discountPercent: offer.discountPercent,
      applyTo: offer.applyTo, targetIds: offer.targetIds || [], isActive: offer.isActive,
      validFrom: offer.validFrom ? new Date(offer.validFrom).toISOString().slice(0, 16) : "",
      validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().slice(0, 16) : "",
    });
    setShowForm(true);
  }
  function resetForm() {
    setEditing(null); setShowForm(false);
    setForm({ code: "", title: "", discountPercent: "", applyTo: "all", targetIds: [], isActive: true, validFrom: "", validUntil: "" });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    await onSave({
      ...form,
      discountPercent: Number(form.discountPercent),
      validFrom: form.validFrom || null,
      validUntil: form.validUntil || null,
    }, editing);
    resetForm();
  }
  function toggleTarget(id) {
    setForm(f => ({
      ...f,
      targetIds: f.targetIds.includes(id) ? f.targetIds.filter(t => t !== id) : [...f.targetIds, id],
    }));
  }
  function copyCode(code) {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{offers.length} Offers</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="hidden md:flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-stone-200">
          <Plus size={16} /> Create Offer
        </button>
      </div>

      {showForm && (
        <Card>
          <div className="border-b border-stone-100 px-4 py-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-stone-900">{editing ? "Edit Offer" : "New Offer"}</h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-stone-50"><X size={16} className="text-stone-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Coupon Code" value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. WELCOME20" required />
              <Input label="Title (optional)" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Welcome offer" />
            </div>
            <div className="grid gap-3 grid-cols-3">
              <Input label="Discount %" type="number" min="1" max="100" value={form.discountPercent} onChange={(e) => setForm(f => ({ ...f, discountPercent: e.target.value }))} placeholder="10" required />
              <Select label="Apply To" value={form.applyTo} onChange={(e) => setForm(f => ({ ...f, applyTo: e.target.value, targetIds: [] }))}>
                <option value="all">All Items</option>
                <option value="categories">Categories</option>
                <option value="items">Specific Items</option>
              </Select>
              <Select label="Status" value={form.isActive ? "active" : "inactive"} onChange={(e) => setForm(f => ({ ...f, isActive: e.target.value === "active" }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>

            {form.applyTo === "categories" && (
              <div>
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-stone-400">Select Categories</span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button key={cat.id} type="button" onClick={() => toggleTarget(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${form.targetIds.includes(cat.id) ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-500 hover:bg-stone-100"}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {form.applyTo === "items" && (
              <div>
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-stone-400">Select Items</span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {items.map(item => (
                    <button key={item.id} type="button" onClick={() => toggleTarget(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${form.targetIds.includes(item.id) ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-500 hover:bg-stone-100"}`}>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Valid From (optional)" type="datetime-local" value={form.validFrom} onChange={(e) => setForm(f => ({ ...f, validFrom: e.target.value }))} />
              <Input label="Valid Until (optional)" type="datetime-local" value={form.validUntil} onChange={(e) => setForm(f => ({ ...f, validUntil: e.target.value }))} />
            </div>

            <div className="flex gap-2 pt-2">
              <Btn type="submit" disabled={loading} icon={Save} className="flex-1">{editing ? "Update" : "Create Offer"}</Btn>
              <Btn type="button" variant="secondary" onClick={resetForm}>Cancel</Btn>
            </div>
          </form>
        </Card>
      )}

      {offers.length === 0 ? (
        <Card><EmptyState message="No offers yet" /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl border border-stone-100 p-3 lg:p-4 group hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${offer.isActive ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"}`}>
                    <Percent size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => copyCode(offer.code)} className="font-mono text-sm font-bold text-stone-900 hover:text-stone-600 transition flex items-center gap-1" title="Copy code">
                        {offer.code}
                        {copiedCode === offer.code ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-stone-300" />}
                      </button>
                    </div>
                    {offer.title && <p className="text-[10px] text-stone-400 truncate">{offer.title}</p>}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest flex-shrink-0 ${offer.isActive ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"}`}>
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">{offer.discountPercent}% off</span>
                <span className="px-2 py-0.5 rounded-full bg-stone-50 text-stone-500 text-[10px] font-bold">
                  {offer.applyTo === "all" ? "All items" : offer.applyTo === "categories" ? `${offer.targetIds.length} categories` : `${offer.targetIds.length} items`}
                </span>
                {offer.validUntil && (
                  <span className="text-[10px] text-stone-400">
                    Until {new Date(offer.validUntil).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(offer)} className="p-1.5 rounded-lg hover:bg-stone-50 text-stone-400 hover:text-stone-700 transition"><Edit3 size={13} /></button>
                <button onClick={() => onDelete(offer.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-500 transition"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => { resetForm(); setShowForm(true); }} className="md:hidden fixed bottom-20 right-5 w-12 h-12 bg-stone-900 rounded-2xl shadow-xl shadow-stone-300 flex items-center justify-center text-white z-[60]">
        <Plus size={22} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD EXPORT
   ══════════════════════════════════════════ */
const NAV = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "menu", label: "Menu Library", icon: UtensilsCrossed },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "offers", label: "Promotions", icon: TicketPercent },
  { id: "users", label: "Admins", icon: Users },
];

export default function AdminDashboard({ initialData, sessionUser }) {
  const [data, setData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function refreshData(successMessage) {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const response = await fetch(`${API_BASE}/api/admin/bootstrap`, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to refresh dashboard");
    setData(payload.data);
    if (successMessage) setMessage(successMessage);
  }

  async function submitRequest(url, options, successMessage) {
    setLoading(true); setError(""); setMessage("");
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const fullUrl = url.startsWith('/') ? `${API_BASE}${url}` : url;
      const response = await fetch(fullUrl, options);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Action failed");
      await refreshData(successMessage);
    } catch (requestError) { setError(requestError.message || "Action failed"); }
    finally { setLoading(false); }
  }

  async function handleLogout() {
    setLoading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    await fetch(`${API_BASE}/api/admin/logout`, { method: "POST" });
    window.location.href = "/dashboard/login";
  }

  async function saveCategory(form, editingId) {
    const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
    await submitRequest(url, { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id, name: form.name, type: form.type, sortOrder: Number(form.sortOrder || 0) }) }, editingId ? "Category updated" : "Category created");
  }
  function removeCategory(id) {
    setConfirmDelete({ title: "Delete Category", message: "This will delete the category and all its items. Continue?", action: () => submitRequest(`/api/admin/categories/${id}`, { method: "DELETE" }, "Category removed") });
  }

  async function saveItem(form, editingId) {
    const url = editingId ? `/api/admin/items/${editingId}` : "/api/admin/items";
    await submitRequest(url, { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id, categoryId: form.categoryId, name: form.name, type: form.type, description: form.description, imageUrl: form.imageUrl, sortOrder: Number(form.sortOrder || 0), pricing: form.pricing }) }, editingId ? "Item updated" : "Item created");
  }
  function removeItem(id) {
    setConfirmDelete({ title: "Delete Item", message: "Are you sure you want to delete this menu item?", action: () => submitRequest(`/api/admin/items/${id}`, { method: "DELETE" }, "Item removed") });
  }

  async function saveUser(form, editingId) {
    const url = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
    await submitRequest(url, { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }, editingId ? "User updated" : "User created");
  }
  function removeUser(id) {
    setConfirmDelete({ title: "Delete User", message: "Are you sure you want to remove this admin user?", action: () => submitRequest(`/api/admin/users/${id}`, { method: "DELETE" }, "User removed") });
  }

  async function saveOffer(form, editingId) {
    const url = editingId ? `/api/admin/offers/${editingId}` : "/api/admin/offers";
    await submitRequest(url, { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }, editingId ? "Offer updated" : "Offer created");
  }
  function removeOffer(id) {
    setConfirmDelete({ title: "Delete Offer", message: "Are you sure you want to delete this offer?", action: () => submitRequest(`/api/admin/offers/${id}`, { method: "DELETE" }, "Offer removed") });
  }

  async function handleConfirmDelete() {
    if (confirmDelete?.action) await confirmDelete.action();
    setConfirmDelete(null);
  }

  function switchTab(id) { setActiveTab(id); setMessage(""); setError(""); setIsSidebarOpen(false); }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-stone-900 font-sans antialiased">
      {/* Background blurs */}
      <div className="fixed top-0 right-0 w-[60vw] h-[60vw] bg-indigo-100/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[50vw] h-[50vw] bg-rose-50/30 blur-[150px] rounded-full pointer-events-none" />

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white/70 backdrop-blur-2xl border-r border-stone-200 flex-col z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-stone-200">
              <Package size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">{data.restaurant.name ? data.restaurant.name.split(" ")[0].toUpperCase() : "ADMIN"}<span className="font-light text-stone-400">PANEL</span></span>
          </div>
          <nav className="space-y-2">
            {NAV.map((item) => (
              <button key={item.id} onClick={() => switchTab(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === item.id ? "bg-stone-900 text-white shadow-lg shadow-stone-200" : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"}`}>
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 space-y-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Signed in as</p>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              {sessionUser.username} · {sessionUser.role}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => refreshData("Refreshed")} disabled={loading} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-50 text-xs font-bold transition disabled:opacity-50">
              <RefreshCw size={14} /> Sync
            </button>
            <button onClick={handleLogout} disabled={loading} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-stone-900 text-white text-xs font-bold transition hover:opacity-90 disabled:opacity-50">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="lg:ml-72 flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#F8F7F4]/80 backdrop-blur-md px-4 py-4 lg:px-10 flex justify-between items-center border-b border-stone-100 lg:border-none">
          <div className="flex items-center gap-3 lg:gap-4">
            <button className="lg:hidden p-2 rounded-xl bg-white border border-stone-200 shadow-sm" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-stone-900">
                {NAV.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="hidden md:block text-[10px] text-stone-400 font-bold uppercase tracking-widest">{data.restaurant.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => refreshData("Refreshed")} disabled={loading} className="lg:hidden p-2 rounded-full bg-white border border-stone-200 hover:shadow-sm disabled:opacity-50">
              <RefreshCw size={16} />
            </button>
            <button onClick={handleLogout} disabled={loading} className="lg:hidden p-2 rounded-full bg-white border border-stone-200 hover:shadow-sm disabled:opacity-50">
              <LogOut size={16} />
            </button>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-stone-500">
              {sessionUser.username.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Toasts */}
        <div className="px-4 lg:px-10 pt-2">
          {message && (
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-emerald-50 px-5 py-3 text-sm text-emerald-700 font-medium">
              <span>{message}</span>
              <button onClick={() => setMessage("")} className="ml-3 text-emerald-400 hover:text-emerald-600"><X size={14} /></button>
            </div>
          )}
          {error && (
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-red-50 px-5 py-3 text-sm text-red-700 font-medium">
              <span>{error}</span>
              <button onClick={() => setError("")} className="ml-3 text-red-400 hover:text-red-600"><X size={14} /></button>
            </div>
          )}
        </div>

        {/* Content */}
        <main className="p-4 lg:p-10 flex-1 max-w-7xl mx-auto w-full space-y-6 lg:space-y-8 pb-24 lg:pb-10">
          {activeTab === "dashboard" && <OverviewTab data={data} />}
          {activeTab === "menu" && <ItemsTab items={data.items} categories={data.categories} loading={loading} onSave={saveItem} onDelete={removeItem} />}
          {activeTab === "categories" && <CategoriesTab categories={data.categories} loading={loading} onSave={saveCategory} onDelete={removeCategory} />}
          {activeTab === "offers" && <OffersTab offers={data.offers || []} categories={data.categories} items={data.items} loading={loading} onSave={saveOffer} onDelete={removeOffer} />}
          {activeTab === "users" && <UsersTab users={data.users} loading={loading} onSave={saveUser} onDelete={removeUser} />}
        </main>

        <footer className="p-10 text-center text-stone-300 text-[10px] font-bold uppercase tracking-widest hidden lg:block">
          Admin Dashboard · Secured End-to-End
        </footer>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-2xl border-t border-stone-100 flex items-center justify-around px-6 z-50">
        {NAV.map((item) => (
          <button key={item.id} onClick={() => switchTab(item.id)} className={`relative p-2 transition-all duration-300 ${activeTab === item.id ? "text-stone-900 scale-110" : "text-stone-300"}`}>
            <item.icon size={22} />
            {activeTab === item.id && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-stone-900 rounded-full" />}
          </button>
        ))}
      </nav>

      {/* ── Mobile Sidebar Drawer ── */}
      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        open={!!confirmDelete}
        title={confirmDelete?.title}
        message={confirmDelete?.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
        loading={loading}
      />

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-bold tracking-tight">{data.restaurant.name ? data.restaurant.name.split(" ")[0].toUpperCase() : "ADMIN"}<span className="text-stone-300">PANEL</span></span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-stone-50 rounded-xl"><X size={18} /></button>
            </div>
            <div className="space-y-2 flex-1">
              {NAV.map(item => (
                <button key={item.id} onClick={() => switchTab(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${activeTab === item.id ? "bg-stone-900 text-white shadow-lg shadow-stone-100" : "text-stone-500"}`}>
                  <item.icon size={20} />
                  <span className="font-bold text-sm">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="pt-6 border-t border-stone-100 mt-auto">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-500">
                  {sessionUser.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold">{sessionUser.username}</p>
                  <p className="text-[10px] text-stone-400 font-medium">{sessionUser.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
