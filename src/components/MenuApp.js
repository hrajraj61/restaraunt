"use client";

import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState
} from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Flame,
  Leaf,
  Minus,
  Pin,
  Plus,
  Search,
  ShoppingBag,
  Utensils,
  X
} from "lucide-react";

function getDietClasses(type) {
  if (type === "non-veg") {
    return "border-red-500/30 bg-red-500/10 text-red-200";
  }

  if (type === "egg") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-100";
  }

  return "border-green-500/30 bg-green-500/10 text-green-100";
}

function getDietIcon(type) {
  return type === "veg" ? <Leaf size={12} /> : <Flame size={12} />;
}

function DishCard({
  dish,
  mode,
  cartQty,
  onAdd,
  onRemove,
  isHighlighted,
  onToggleHighlight
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      className={`group relative overflow-hidden rounded-lg border transition-all ${
        isHighlighted
          ? "border-amber-500/50 bg-amber-500/5"
          : "border-white/10 bg-white/5"
      } backdrop-blur-lg hover:bg-white/8`}
    >
      {mode === "immersive" ? (
        <div className="relative">
          <div className="aspect-[3/2] overflow-hidden">
            <img
              src={dish.img}
              alt={dish.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          </div>
          <div className="absolute inset-0 p-3 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <button
                onClick={() => onToggleHighlight(dish.id)}
                className={`rounded-full p-1.5 transition-all ${
                  isHighlighted
                    ? "bg-amber-500 text-black"
                    : "bg-black/30 text-white/70 hover:bg-black/50"
                }`}
              >
                <Pin size={12} className={isHighlighted ? "fill-black" : ""} />
              </button>
              <div className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${
                dish.type === "veg" 
                  ? "bg-green-500/20 text-green-300 border border-green-500/40"
                  : "bg-red-500/20 text-red-300 border border-red-500/40"
              }`}>
                {dish.type === "veg" ? <Leaf size={8} /> : <Flame size={8} />}
              </div>
            </div>
            <div>
              <h3 className="font-body text-lg font-bold text-white mb-1">{dish.name}</h3>
              <p className="font-body text-xs text-white/70 leading-tight mb-2 line-clamp-2">{dish.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm font-bold text-white">{dish.hasVariants ? dish.displayPrice : `₹${dish.price}`}</span>
                {cartQty > 0 ? (
                  <div className="flex items-center gap-1 bg-white/20 rounded-full p-1">
                    <button
                      onClick={() => onRemove(dish)}
                      className="rounded-full bg-white/20 p-1 hover:bg-white/30"
                    >
                      {cartQty > 1 ? <Minus size={10} /> : <X size={10} />}
                    </button>
                    <span className="font-body text-xs font-bold text-white px-2">{cartQty}</span>
                    <button
                      onClick={() => onAdd(dish.id)}
                      className="rounded-full bg-white/20 p-1 hover:bg-white/30"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAdd(dish.id)}
                    className="font-body text-[10px] font-bold uppercase bg-white text-black px-3 py-1 rounded-full hover:bg-white/90 transition-colors"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3">
          <div className="flex gap-3">
            <div className="relative w-16 h-16 overflow-hidden rounded-lg flex-shrink-0">
              <img
                src={dish.img}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-body text-sm font-semibold text-white truncate">{dish.name}</h3>
                <button
                  onClick={() => onToggleHighlight(dish.id)}
                  className={`flex-shrink-0 rounded-full p-1 transition-all ${
                    isHighlighted
                      ? "bg-amber-500 text-black"
                      : "bg-white/10 text-white/40 hover:bg-white/20"
                  }`}
                >
                  <Pin size={10} className={isHighlighted ? "fill-black" : ""} />
                </button>
              </div>
              <p className="font-body text-xs text-white/60 leading-tight mb-2 line-clamp-1">{dish.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm font-bold text-white">{dish.hasVariants ? dish.displayPrice : `₹${dish.price}`}</span>
                  <div className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                    dish.type === "veg"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}>
                    {dish.type === "veg" ? <Leaf size={6} /> : <Flame size={6} />}
                  </div>
                </div>
                {cartQty > 0 ? (
                  <div className="flex items-center gap-1 bg-white/20 rounded-full p-0.5">
                    <button
                      onClick={() => onRemove(dish)}
                      className="rounded-full bg-white/20 p-1 hover:bg-white/30"
                    >
                      {cartQty > 1 ? <Minus size={8} /> : <X size={8} />}
                    </button>
                    <span className="font-body text-xs font-bold text-white px-2">{cartQty}</span>
                    <button
                      onClick={() => onAdd(dish.id)}
                      className="rounded-full bg-white/20 p-1 hover:bg-white/30"
                    >
                      <Plus size={8} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAdd(dish.id)}
                    className="font-body text-[9px] font-bold uppercase bg-white text-black px-2 py-1 rounded-full hover:bg-white/90 transition-colors"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function MenuApp() {
  const [menu, setMenu] = useState(null);
  const [activeCat, setActiveCat] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [cart, setCart] = useState({});
  const [highlights, setHighlights] = useState([]);
  const [showHighlightsModal, setShowHighlightsModal] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [showDineInInstruction, setShowDineInInstruction] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedItemForVariant, setSelectedItemForVariant] = useState(null);
  const deferredSearch = useDeferredValue(searchQuery.trim().toLowerCase());

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/menu", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const payload = await response.json();
        if (!cancelled) {
          setMenu(payload.menu);
          setActiveCat((current) => current || payload.menu.categories[0]?.id || "");
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Unable to load menu");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = menu?.categories ?? [];

  const allItems = useMemo(
    () =>
      categories.flatMap((category) =>
        category.items.map((item) => ({
          ...item,
          categoryId: category.id,
          categoryName: category.name,
          desc: item.description,
          price: item.pricing.kind === "fixed" ? item.pricing.price : item.pricing.variants?.[0]?.price || 0,
          img: item.image || category.categoryImage,
          hasVariants: item.pricing.kind === "variant",
          displayPrice: item.pricing.kind === "variant" 
            ? `₹${item.pricing.variants[0].price} - ₹${item.pricing.variants[item.pricing.variants.length - 1].price}`
            : `₹${item.pricing.price}`
        }))
      ),
    [categories]
  );

  const filteredDishes = useMemo(() => {
    return allItems.filter((dish) => {
      const searchTerms = searchQuery.trim().toLowerCase();
      const matchesSearch =
        searchTerms === "" ||
        dish.name.toLowerCase().includes(searchTerms) ||
        dish.desc.toLowerCase().includes(searchTerms) ||
        dish.categoryName.toLowerCase().includes(searchTerms);
      const matchesCat = searchTerms !== "" ? true : dish.categoryId === activeCat;
      const matchesDiet = dietFilter === "all" || dish.type === dietFilter;
      return matchesSearch && matchesCat && matchesDiet;
    });
  }, [searchQuery, activeCat, dietFilter, allItems]);

  const selectedDishes = useMemo(() => {
    const result = [];
    
    Object.keys(cart).forEach(cartItemId => {
      // Check if it's a variant ID
      const variantItem = categories.flatMap(cat => 
        cat.items.filter(item => item.pricing.kind === "variant")
          .flatMap(item => item.pricing.variants.map(variant => ({
            ...item,
            id: variant.id,
            variantId: variant.id,
            baseItemId: item.id,
            name: item.name,
            variant: variant,
            categoryId: cat.id,
            categoryName: cat.name,
            desc: item.description,
            price: variant.price,
            img: item.image || cat.categoryImage,
            hasVariants: true,
            baseItem: item
          })))
      ).find(item => item.id === cartItemId);
      
      if (variantItem) {
        result.push(variantItem);
      } else {
        // Regular item
        const regularItem = allItems.find(item => item.id === cartItemId);
        if (regularItem) {
          result.push(regularItem);
        }
      }
    });
    
    return result;
  }, [cart, allItems, categories]);
  const totalCartItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalCartPrice = selectedDishes.reduce((sum, dish) => sum + dish.price * (cart[dish.id] || 0), 0);
  const highlightedDishes = useMemo(() => allItems.filter((dish) => highlights.includes(dish.id)), [highlights, allItems]);

  const addToCart = useCallback((id) => {
    const item = allItems.find(item => item.id === id);
    if (item && item.hasVariants) {
      // For variant items, show variant selection modal
      setSelectedItemForVariant(item);
      setShowVariantModal(true);
    } else {
      // For fixed price items, add directly
      setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  }, [allItems]);

  const addVariantToCart = useCallback((variantId) => {
    setCart((prev) => ({ ...prev, [variantId]: (prev[variantId] || 0) + 1 }));
    setShowVariantModal(false);
    setSelectedItemForVariant(null);
  }, []);

  // Helper function to get total cart quantity for a dish (including variants)
  const getDishCartQty = useCallback((dish) => {
    if (dish.hasVariants && dish.variants) {
      return dish.variants.reduce((total, variant) => total + (cart[variant.id] || 0), 0);
    }
    return cart[dish.id] || 0;
  }, [cart]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id] -= 1;
      else delete updated[id];
      return updated;
    });
  }, []);

  // Helper function to handle remove for dishes with variants
  const handleRemoveFromCart = useCallback((dish) => {
    if (dish.hasVariants && dish.variants) {
      // Find the variant with items in cart and remove from it
      const variantInCart = dish.variants.find(variant => cart[variant.id] > 0);
      if (variantInCart) {
        removeFromCart(variantInCart.id);
      }
    } else {
      removeFromCart(dish.id);
    }
  }, [cart, removeFromCart]);

  const toggleHighlight = useCallback((id) => {
    setHighlights((prev) => {
      if (prev.includes(id)) return prev.filter((hid) => hid !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const handleHomeDelivery = useCallback(() => {
    const number = menu?.restaurant?.phone || "6202525132";
    let message = `*${menu?.restaurant?.name || "Dubey's Dhaba"} Order*%0A%0A`;
    selectedDishes.forEach((dish) => {
      message += `- ${dish.name} (x${cart[dish.id]}) - Rs. ${dish.price * cart[dish.id]}%0A`;
    });
    message += `%0A*TOTAL ITEMS:* ${totalCartItems}`;
    message += "%0A%0A*REQUEST:* I'd like to get this delivered to my home. Please confirm.";
    window.open(`https://wa.me/91${number}?text=${message}`, "_blank", "noopener,noreferrer");
  }, [cart, selectedDishes, totalCartItems, menu]);

  const heroImage = filteredDishes[0]?.img || allItems[0]?.img || "";

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
                style={{ backgroundImage: `url(${heroImage})` }}
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
                <h1 className="font-display text-2xl font-bold text-amber-500">{menu?.restaurant?.name || "Dubey's Dhaba"}</h1>
                <p className="font-body text-xs text-white/50">{menu?.restaurant?.address || "Hotel Bajrang, Mako, Latehar"}</p>
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
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCat(cat.id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 font-body text-xs transition-all ${activeCat === cat.id && searchQuery === "" ? "bg-white font-medium text-black" : "bg-white/10 font-normal text-white/60"}`}
                >
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
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-20 animate-pulse rounded-lg border border-white/10 bg-white/5"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                  {error}
                </div>
              ) : filteredDishes.length > 0 ? (
                <div className="space-y-0">
                  {filteredDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      mode={viewMode}
                      cartQty={getDishCartQty(dish)}
                      onAdd={addToCart}
                      onRemove={handleRemoveFromCart}
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
                                <div className="min-w-0 flex-1">
                                  <span className="truncate font-body text-sm font-semibold text-black">{dish.name}</span>
                                  {dish.hasVariants && dish.variant && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <span className="font-body text-xs text-black/60">{dish.variant.label}</span>
                                    </div>
                                  )}
                                </div>
                                <span className="font-body whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
                                  x {cart[dish.id]}
                                </span>
                              </div>
                              <p className="font-body text-xs font-bold text-amber-600">₹{dish.price * cart[dish.id]}</p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => removeFromCart(dish.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
                              >
                                {cart[dish.id] > 1 ? <Minus size={10} /> : <X size={10} />}
                              </button>
                              <button
                                onClick={() => dish.hasVariants ? (setSelectedItemForVariant(dish), setShowVariantModal(true)) : addToCart(dish.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white hover:bg-black/90"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
                      <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2.5 text-black">
                        <span className="font-body text-[10px] font-bold uppercase tracking-[0.22em] text-gray-600">Total</span>
                        <span className="font-body text-lg font-bold">₹{totalCartPrice}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setShowDineInInstruction(true)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 font-body text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-amber-400"
                        >
                          <Utensils size={12} />
                          Dine In
                        </button>
                        <button
                          onClick={handleHomeDelivery}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 font-body text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-black/90"
                        >
                          <ShoppingBag size={12} />
                          Delivery
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>

          {/* Variant Selection Modal */}
          <AnimatePresence>
            {showVariantModal && selectedItemForVariant ? (
              <div className="absolute inset-0 z-[160] flex items-end justify-center p-3 sm:p-4 lg:items-center lg:p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowVariantModal(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ y: 40, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 40, opacity: 0, scale: 0.96 }}
                  className="relative flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/10 bg-white text-black shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center justify-between border-b border-black/5 bg-neutral-50 p-4">
                    <button 
                      onClick={() => setShowVariantModal(false)} 
                      className="flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.2em] text-black/70"
                    >
                      <X size={14} /> Close
                    </button>
                    <div className="text-right">
                      <h2 className="font-display text-lg text-black">Select Size</h2>
                      <p className="font-body text-xs text-black/60">{selectedItemForVariant.name}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      {selectedItemForVariant.pricing.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => addVariantToCart(variant.id)}
                          className="w-full flex items-center justify-between rounded-lg border border-black/10 bg-white p-3 text-left hover:bg-neutral-50 transition-colors"
                        >
                          <div>
                            <div className="font-body text-sm font-semibold text-black">{variant.label}</div>
                            <div className="font-body text-xs text-black/60">{variant.size} ({variant.inches}")</div>
                          </div>
                          <div className="font-body text-sm font-bold text-black">₹{variant.price}</div>
                        </button>
                      ))}
                    </div>
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
