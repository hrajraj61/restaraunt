"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  Coffee,
  Flame,
  LayoutGrid,
  Leaf,
  List,
  Minus,
  Pin,
  PinOff,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Truck,
  Utensils,
  Wheat,
  X,
  Zap
} from "lucide-react";

const CATEGORIES = [
  { id: "starters", name: "Starters", icon: <Zap size={14} />, count: 6 },
  { id: "mains", name: "Mains", icon: <Utensils size={14} />, count: 6 },
  { id: "bread", name: "Breads", icon: <Wheat size={14} />, count: 4 },
  { id: "beverage", name: "Drinks", icon: <Coffee size={14} />, count: 4 }
];

const DISHES = [
  { id: 1, cat: "starters", type: "veg", name: "Paneer Tikka", fullName: "Classic Malai Paneer Tikka", price: 320, rating: 4.8, desc: "Cottage cheese marinated in yellow chilies.", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600" },
  { id: 2, cat: "starters", type: "non-veg", name: "Chicken Wings", fullName: "Peri-Peri Flame Wings", price: 380, rating: 4.9, desc: "Citrus-habanero glaze fire-grilled wings.", img: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=600" },
  { id: 3, cat: "starters", type: "veg", name: "Hara Bhara Kabab", fullName: "Spinach and Pea Kabab", price: 260, rating: 4.6, desc: "Spiced patties made of spinach and green peas.", img: "https://images.unsplash.com/photo-1601050633647-8f8f5f30d31e?q=80&w=600" },
  { id: 4, cat: "starters", type: "non-veg", name: "Fish Tikka", fullName: "Ajwaini Fish Tikka", price: 420, rating: 4.7, desc: "River fish marinated with carom seeds and yogurt.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600" },
  { id: 5, cat: "starters", type: "veg", name: "Gobi 65", fullName: "Crispy Cauliflower 65", price: 240, rating: 4.5, desc: "Deep fried cauliflower tossed in south Indian spices.", img: "https://images.unsplash.com/photo-1589647363535-882ffc193ed1?q=80&w=600" },
  { id: 6, cat: "starters", type: "non-veg", name: "Chicken 65", fullName: "Hyderabadi Chicken 65", price: 360, rating: 4.8, desc: "Spicy fried chicken tempered with curry leaves.", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=600" },
  { id: 7, cat: "mains", type: "non-veg", name: "Butter Chicken", fullName: "Old Delhi Style Butter Chicken", price: 480, rating: 5.0, desc: "Tandoori charred chicken in velvet tomato gravy.", img: "https://images.unsplash.com/photo-1603894527176-222439f374e1?q=80&w=600" },
  { id: 8, cat: "mains", type: "veg", name: "Dal Makhani", fullName: "24-Hour Dal Makhani", price: 340, rating: 4.7, desc: "Black lentils slow-cooked with cream.", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600" },
  { id: 9, cat: "mains", type: "veg", name: "Kadai Paneer", fullName: "Spicy Kadai Paneer", price: 360, rating: 4.8, desc: "Cottage cheese cooked with peppers in a wok.", img: "https://images.unsplash.com/photo-1626132646540-1f3c3018243a?q=80&w=600" },
  { id: 10, cat: "mains", type: "non-veg", name: "Mutton Rogan Josh", fullName: "Kashmiri Mutton Curry", price: 540, rating: 4.9, desc: "Lamb cooked in a thin red gravy with dry ginger.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600" },
  { id: 11, cat: "mains", type: "veg", name: "Mix Veg", fullName: "Seasonal Mix Vegetable", price: 280, rating: 4.4, desc: "Sauteed seasonal vegetables with mild spices.", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600" },
  { id: 12, cat: "mains", type: "non-veg", name: "Chicken Biryani", fullName: "Lucknowi Chicken Biryani", price: 420, rating: 4.9, desc: "Aromatic basmati rice cooked with chicken on dum.", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600" },
  { id: 13, cat: "bread", type: "veg", name: "Garlic Naan", fullName: "Fresh Garlic Butter Naan", price: 80, rating: 4.9, desc: "Refined flour bread with chopped garlic.", img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=600" },
  { id: 14, cat: "bread", type: "veg", name: "Butter Roti", fullName: "Tandoori Butter Roti", price: 35, rating: 4.5, desc: "Whole wheat bread cooked in tandoor.", img: "https://images.unsplash.com/photo-1601050633647-8f8f5f30d31e?q=80&w=600" },
  { id: 15, cat: "bread", type: "veg", name: "Laccha Paratha", fullName: "Multi-layered Paratha", price: 60, rating: 4.7, desc: "Crispy layered wheat bread finished with butter.", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600" },
  { id: 16, cat: "bread", type: "veg", name: "Missi Roti", fullName: "Gram Flour Flatbread", price: 50, rating: 4.6, desc: "Savory gram flour bread with herbs.", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600" },
  { id: 17, cat: "beverage", type: "veg", name: "Mango Lassi", fullName: "Thick Mango Lassi", price: 120, rating: 4.8, desc: "Sweet yogurt drink blended with mango pulp.", img: "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=600" },
  { id: 18, cat: "beverage", type: "veg", name: "Fresh Lime Soda", fullName: "Refreshing Lime Soda", price: 80, rating: 4.5, desc: "Sweet and salted soda with fresh lemon.", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600" },
  { id: 19, cat: "beverage", type: "veg", name: "Masala Chai", fullName: "Indian Spiced Tea", price: 40, rating: 4.9, desc: "Milk tea brewed with ginger and cardamom.", img: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=600" },
  { id: 20, cat: "beverage", type: "veg", name: "Cold Coffee", fullName: "Iced Coffee with Ice Cream", price: 160, rating: 4.7, desc: "Creamy cold coffee served with vanilla ice cream.", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600" }
];

const Stepper = React.memo(function Stepper({ quantity, onAdd, onRemove, compact = false }) {
  return (
    <div className={`flex items-center overflow-hidden rounded-full border border-white/30 bg-white/10 ${compact ? "" : "backdrop-blur-md"}`}>
      <button onClick={onRemove} className={`${compact ? "p-1.5" : "p-2"} transition-colors hover:bg-white/10`}>
        {quantity > 1 ? <Minus size={compact ? 12 : 16} /> : <X size={compact ? 12 : 16} className="text-red-400" />}
      </button>
      <span className={`${compact ? "w-6 text-xs" : "w-8 text-sm"} text-center font-body font-semibold`}>{quantity}</span>
      <button onClick={onAdd} className={`${compact ? "p-1.5" : "p-2"} transition-colors hover:bg-white/10`}>
        <Plus size={compact ? 12 : 16} />
      </button>
    </div>
  );
});

const DishCard = React.memo(function DishCard({
  dish,
  cartQty,
  onAdd,
  onRemove,
  mode,
  isHighlighted,
  onToggleHighlight
}) {
  const isImmersive = mode === "immersive";

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`relative ${isImmersive ? "mb-2" : "mb-1"}`}>
      <div className={`${isImmersive ? "flex flex-col p-2" : "flex items-center gap-2 p-2"} ${isHighlighted ? "bg-amber-500/10" : ""} border-b border-white/5 transition-colors`}>
        <div className={`relative flex-shrink-0 overflow-hidden rounded ${isImmersive ? "mb-2 h-32 w-full" : "h-12 w-12"}`}>
          <img src={dish.img} className="h-full w-full object-cover" alt={dish.name} loading="lazy" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleHighlight(dish.id);
            }}
            className={`absolute left-1 top-1 rounded p-1 backdrop-blur-md ${isHighlighted ? "bg-amber-500 text-black" : "bg-black/60 text-white/60"}`}
          >
            <Pin size={8} className={isHighlighted ? "fill-black" : ""} />
          </button>
          {isImmersive ? (
            <div className="absolute right-1 top-1 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 backdrop-blur-md">
              <Star size={8} className="fill-amber-400 text-amber-400" />
              <span className="font-body text-xs text-white">{dish.rating}</span>
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className={`${isImmersive ? "" : "flex items-center justify-between gap-2"}`}>
            <div className="flex items-center gap-1.5 truncate">
              <span className={`rounded p-0.5 ${dish.type === "veg" ? "bg-green-500/30 text-green-400" : "bg-red-500/30 text-red-400"}`}>
                {dish.type === "veg" ? <Leaf size={isImmersive ? 12 : 10} /> : <Flame size={isImmersive ? 12 : 10} />}
              </span>
              <h3 className={`font-body ${isImmersive ? "text-lg font-medium" : "text-sm font-medium"} truncate text-white`}>
                {dish.name}
              </h3>
            </div>
            {isImmersive ? null : <p className="whitespace-nowrap font-body text-sm font-semibold text-amber-400">₹{dish.price}</p>}
          </div>
          {isImmersive ? (
            <>
              <p className="mb-2 line-clamp-2 font-body text-xs leading-relaxed text-white/60">{dish.desc}</p>
              <p className="font-body text-base font-semibold text-amber-400">₹{dish.price}</p>
            </>
          ) : null}
          <div className={`${isImmersive ? "mt-2" : "mt-1"} flex items-center justify-end`}>
            {cartQty > 0 ? (
              <Stepper quantity={cartQty} onAdd={() => onAdd(dish.id)} onRemove={() => onRemove(dish.id)} compact={!isImmersive} />
            ) : (
              <button onClick={() => onAdd(dish.id)} className={`${isImmersive ? "px-4 py-2" : "px-3 py-1"} rounded-full bg-white font-body text-[10px] font-semibold uppercase tracking-wide text-black`}>
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function MenuApp() {
  const [activeCat, setActiveCat] = useState("starters");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [dietFilter, setDietFilter] = useState("all");
  const [cart, setCart] = useState({});
  const [highlights, setHighlights] = useState([]);
  const [showHighlightsModal, setShowHighlightsModal] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [showDineInInstruction, setShowDineInInstruction] = useState(false);

  const addToCart = useCallback((id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id] -= 1;
      else delete updated[id];
      return updated;
    });
  }, []);

  const toggleHighlight = useCallback((id) => {
    setHighlights((prev) => {
      if (prev.includes(id)) return prev.filter((hid) => hid !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      const searchTerms = searchQuery.trim().toLowerCase();
      const matchesSearch =
        searchTerms === "" ||
        dish.name.toLowerCase().includes(searchTerms) ||
        dish.desc.toLowerCase().includes(searchTerms) ||
        dish.fullName.toLowerCase().includes(searchTerms);
      const matchesCat = searchTerms !== "" ? true : dish.cat === activeCat;
      const matchesDiet = dietFilter === "all" || dish.type === dietFilter;
      return matchesSearch && matchesCat && matchesDiet;
    });
  }, [searchQuery, activeCat, dietFilter]);

  const selectedDishes = useMemo(() => DISHES.filter((dish) => Boolean(cart[dish.id])), [cart]);
  const totalCartItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalCartPrice = selectedDishes.reduce((sum, dish) => sum + dish.price * (cart[dish.id] || 0), 0);
  const highlightedDishes = useMemo(() => DISHES.filter((dish) => highlights.includes(dish.id)), [highlights]);

  const handleHomeDelivery = useCallback(() => {
    const number = "6202525132";
    let message = "*Dubey's Dhaba Order*%0A%0A";
    selectedDishes.forEach((dish) => {
      message += `- ${dish.name} (x${cart[dish.id]}) - Rs. ${dish.price * cart[dish.id]}%0A`;
    });
    message += `%0A*TOTAL ITEMS:* ${totalCartItems}`;
    message += "%0A%0A*REQUEST:* I'd like to get this delivered to my home. Please confirm.";
    window.open(`https://wa.me/91${number}?text=${message}`, "_blank", "noopener,noreferrer");
  }, [cart, selectedDishes, totalCartItems]);

  return (
    <div className="h-[100dvh] overflow-hidden bg-stone-950 text-white">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden bg-[#050505]">
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat + (searchQuery !== "" ? "searching" : "")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-cover bg-center grayscale-[80%]"
                style={{ backgroundImage: `url(${filteredDishes[0]?.img || DISHES[0].img})` }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </div>

          <header className="relative z-50 border-b border-white/10 p-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Link href="/" className="mb-1 inline-flex items-center gap-1 font-body text-[10px] uppercase text-white/50">
                  <ArrowLeft size={12} /> Home
                </Link>
                <h1 className="font-display text-2xl font-bold text-amber-500">Dubey&apos;s Dhaba</h1>
                <p className="font-body text-xs text-white/50">Hotel Bajrang, Mako, Latehar</p>
              </div>
              <div className="flex gap-2 self-start">
                <button
                  onClick={() => setShowHighlightsModal(true)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 backdrop-blur-xl transition-all ${highlights.length > 0 ? "border-amber-600 bg-amber-500 text-black" : "border-white/10 bg-white/5 text-white/40"}`}
                >
                  <Pin size={14} className={highlights.length > 0 ? "fill-black" : ""} />
                  {highlights.length > 0 ? <span className="text-[10px] font-bold">{highlights.length}</span> : null}
                </button>
                <button
                  onClick={() => setViewMode((prev) => (prev === "list" ? "immersive" : "list"))}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  {viewMode === "list" ? <LayoutGrid size={14} /> : <List size={14} />}
                </button>
              </div>
            </div>

            <div className="relative mt-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30" size={12} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full rounded border border-white/20 bg-white/5 pl-8 pr-3 font-body text-xs placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>
          </header>

          <nav className="relative z-50 border-b border-white/10 px-3 py-2">
            <div className="no-scrollbar flex gap-1 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCat(cat.id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 font-body text-xs transition-all ${activeCat === cat.id && searchQuery === "" ? "bg-white font-medium text-black" : "bg-white/10 font-normal text-white/60"}`}
                >
                  {cat.icon}
                  <span className="text-xs uppercase">{cat.name} <span className="ml-0.5 opacity-50">{cat.count}</span></span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {["all", "veg", "non-veg"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDietFilter(filter)}
                  className={`rounded-full px-3 py-1 font-body text-xs uppercase transition-all ${dietFilter === filter ? "bg-amber-500 text-black" : "bg-white/10 text-white/50"}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </nav>

          <main className="no-scrollbar relative z-20 min-h-0 flex-1 overflow-y-auto px-3 pb-20 pt-2">
            <div className="mb-1">
              {searchQuery.trim() !== "" ? (
                <p className="mb-2 font-body text-xs uppercase text-amber-400">Results ({filteredDishes.length})</p>
              ) : (
                <p className="mb-2 font-body text-xs uppercase text-white/40">{activeCat}</p>
              )}
            </div>
            <LayoutGroup>
              {filteredDishes.length > 0 ? (
                <div className="space-y-0">
                  {filteredDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      mode={viewMode}
                      cartQty={cart[dish.id] || 0}
                      onAdd={addToCart}
                      onRemove={removeFromCart}
                      isHighlighted={highlights.includes(dish.id)}
                      onToggleHighlight={toggleHighlight}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-white/30">
                  <X size={20} className="mb-2" />
                  <p className="font-body text-xs">No items found for &quot;{searchQuery}&quot;</p>
                  <button onClick={() => setSearchQuery("")} className="mt-2 font-body text-xs text-amber-400 underline">Clear</button>
                </div>
              )}
            </LayoutGroup>
            <div className="flex flex-col items-center gap-1 py-4 text-center opacity-20">
              <ChevronRight className="rotate-90" size={10} />
              <span className="font-body text-xs uppercase">End of Menu</span>
            </div>
          </main>

          <AnimatePresence>
            {totalCartItems > 0 ? (
              <motion.button
                type="button"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={() => setIsSummaryOpen(true)}
                className="absolute bottom-2 left-2 right-2 z-[100] flex h-10 items-center justify-between rounded-lg bg-white px-3 text-black shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <ShoppingBag size={14} />
                    <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-black">
                      {totalCartItems}
                    </span>
                  </div>
                  <p className="font-body text-xs font-semibold text-black">{totalCartItems} items</p>
                </div>
                <span className="flex items-center gap-1 font-body text-xs font-semibold text-black">
                  View <ChevronRight size={12} />
                </span>
              </motion.button>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {isSummaryOpen ? (
              <div className="absolute inset-0 z-[150] flex items-end justify-center p-3 sm:p-4 lg:items-center lg:p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSummaryOpen(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ y: 40, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 40, opacity: 0, scale: 0.96 }}
                  className="relative flex h-[min(65dvh,520px)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-white/10 bg-white text-black shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center justify-between border-b border-black/5 bg-neutral-50 p-3 sm:p-4">
                    <button onClick={() => setIsSummaryOpen(false)} className="flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.2em] text-black/70">
                      <ArrowLeft size={14} /> Back
                    </button>
                    <div className="text-right">
                      <h2 className="font-display text-lg text-black">Selection Summary</h2>
                      <p className="font-body text-[9px] font-semibold uppercase tracking-[0.22em] text-black/40">{totalCartItems} items selected • ₹{totalCartPrice}</p>
                    </div>
                  </div>

                  <div className="relative flex min-h-0 flex-1 flex-col p-3 sm:p-4">
                    <AnimatePresence>
                      {showDineInInstruction ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white p-8 text-center"
                        >
                          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <Utensils size={40} />
                          </div>
                          <h3 className="font-display mb-2 text-3xl text-black">Ready to Dine?</h3>
                          <p className="font-body mb-8 text-sm font-medium leading-relaxed text-black/60">
                            Please show the selection summary to the staff to place your order.
                          </p>
                          <button
                            onClick={() => setShowDineInInstruction(false)}
                            className="rounded-full bg-black px-8 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-white"
                          >
                            Got it
                          </button>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                      <div className="space-y-2">
                        {selectedDishes.map((dish) => (
                          <div key={dish.id} className="flex items-center gap-2 rounded-lg border border-black/5 bg-neutral-50 px-2.5 py-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="truncate font-body text-sm font-semibold text-black">{dish.name}</span>
                                <span className="font-body whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
                                  x {cart[dish.id]}
                                </span>
                              </div>
                              <p className="font-body text-xs font-bold text-amber-600">₹{dish.price * cart[dish.id]}</p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => removeFromCart(dish.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:bg-black hover:text-white"
                                aria-label={`Decrease ${dish.name}`}
                              >
                                {cart[dish.id] > 1 ? <Minus size={12} /> : <X size={12} />}
                              </button>
                              <button
                                onClick={() => addToCart(dish.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800"
                                aria-label={`Increase ${dish.name}`}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-black/5 pt-3">
                      <div className="flex items-center justify-between rounded-lg bg-neutral-100 px-3 py-2">
                        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">Total</span>
                        <span className="font-body text-sm font-bold text-black">₹{totalCartPrice}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 p-2.5">
                        <ClipboardList size={16} className="flex-shrink-0 text-amber-600" />
                        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-900">
                          Show this to the waiter or choose delivery below.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDineInInstruction(true)}
                          className="h-10 flex-1 rounded-lg bg-neutral-100 font-body text-xs font-bold uppercase tracking-[0.2em] text-black"
                        >
                          Dine-In
                        </button>
                        <button
                          onClick={handleHomeDelivery}
                          className="flex h-10 flex-[2] items-center justify-center gap-2 rounded-lg bg-black font-body text-xs font-bold uppercase tracking-[0.2em] text-white"
                        >
                          <Truck size={16} /> Home Delivery
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {showHighlightsModal ? (
              <div className="absolute inset-0 z-[200] flex items-end justify-center p-4 sm:items-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowHighlightsModal(false)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />
                <motion.div
                  initial={{ y: 100, scale: 0.9 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 100, scale: 0.9 }}
                  className="relative w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#111] p-4 shadow-2xl"
                >
                  <div className="absolute right-0 top-0 p-3">
                    <button onClick={() => setShowHighlightsModal(false)} className="rounded-full bg-white/5 p-1.5">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="flex items-center gap-2 text-lg font-black tracking-tighter text-amber-500">
                        <Pin size={18} className="fill-amber-500" /> Top Highlights
                      </h2>
                      <p className="mt-1 text-[9px] uppercase tracking-widest text-white/30">Your curated selection (max 4)</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {highlightedDishes.length > 0 ? (
                        highlightedDishes.map((dish) => (
                          <div key={dish.id} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-2.5">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                              <img src={dish.img} className="h-full w-full object-cover" alt={dish.name} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-bold uppercase">{dish.name}</h3>
                              <p className="text-sm font-black text-amber-500">₹{dish.price}</p>
                            </div>
                            <button onClick={() => toggleHighlight(dish.id)} className="p-2 text-white/20">
                              <PinOff size={16} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-10 text-center opacity-20">
                          <Pin size={32} />
                          <p className="text-xs font-bold uppercase tracking-widest">No items pinned</p>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setShowHighlightsModal(false)} className="w-full rounded-lg bg-white py-2.5 text-xs font-black uppercase tracking-widest text-black shadow-lg">
                      Back to Menu
                    </button>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
