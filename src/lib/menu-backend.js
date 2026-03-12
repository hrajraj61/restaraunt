import menuStore from "../../data.json";

const PLACEHOLDER_THEMES = {
  veg: {
    accent: "#22c55e",
    accentSoft: "#14532d",
    base: "#052e16",
    label: "VEG"
  },
  "non-veg": {
    accent: "#f97316",
    accentSoft: "#7c2d12",
    base: "#431407",
    label: "NON VEG"
  },
  egg: {
    accent: "#facc15",
    accentSoft: "#713f12",
    base: "#422006",
    label: "EGG"
  }
};

function createPlaceholderImage({ itemName, categoryName, type }) {
  const theme = PLACEHOLDER_THEMES[type] ?? PLACEHOLDER_THEMES.veg;
  const initials = itemName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${theme.base}" />
          <stop offset="100%" stop-color="${theme.accentSoft}" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill="url(#bg)" />
      <circle cx="520" cy="96" r="110" fill="${theme.accent}" fill-opacity="0.18" />
      <circle cx="120" cy="430" r="140" fill="${theme.accent}" fill-opacity="0.14" />
      <rect x="42" y="38" width="130" height="36" rx="18" fill="${theme.accent}" fill-opacity="0.9" />
      <text x="107" y="61" text-anchor="middle" fill="#111827" font-size="18" font-family="Arial, sans-serif" font-weight="700">${theme.label}</text>
      <text x="52" y="320" fill="white" font-size="60" font-family="Arial, sans-serif" font-weight="700">${initials}</text>
      <text x="52" y="376" fill="white" font-size="26" font-family="Arial, sans-serif" font-weight="600">${itemName}</text>
      <text x="52" y="416" fill="rgba(255,255,255,0.72)" font-size="20" font-family="Arial, sans-serif">${categoryName}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

function getDisplayPrice(pricing) {
  if (pricing.kind === "fixed") {
    return pricing.price;
  }

  return Math.min(...pricing.variants.map((variant) => variant.price));
}

export function getMenuStore() {
  return {
    ...menuStore,
    categories: menuStore.categories.map((category) => ({
      ...category,
      count: category.items.length,
      items: category.items.map((item) => ({
        ...item,
        image:
          item.image ||
          createPlaceholderImage({
            itemName: item.name,
            categoryName: category.name,
            type: item.type
          }),
        displayPrice: getDisplayPrice(item.pricing)
      }))
    }))
  };
}
