import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const menuSeed = require("../../data.json");
import { query, withTransaction, safeUpdate } from "./db.js";
import {
  createSessionValue,
  getSessionCookieName,
  getSessionCookieOptions,
  hashPassword,
  readSessionValue,
  verifyPassword
} from "./security.js";

const DEFAULT_SUPER_ADMIN = {
  username: "shubham",
  password: "zaqplm@1029",
  role: "super_admin"
};

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

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

function normalizePricing(input = {}) {
  if (input.kind === "variant") {
    const variants = (input.variants || [])
      .map((variant, index) => ({
        id: variant.id || `${slugify(variant.name || variant.label || `variant-${index + 1}`)}-${index + 1}`,
        name: variant.name || variant.label || `Variant ${index + 1}`,
        price: Number(variant.price || 0)
      }))
      .filter((variant) => variant.name && Number.isFinite(variant.price));

    return {
      kind: variants.length ? "variant" : "fixed",
      price: variants.length ? null : Number(input.price || 0),
      variants
    };
  }

  return {
    kind: "fixed",
    price: Number(input.price || 0),
    variants: []
  };
}

function getDisplayPrice(pricing) {
  if (pricing.kind === "fixed") {
    return pricing.price;
  }

  return Math.min(...pricing.variants.map((variant) => variant.price));
}

async function tableExists(tableName, db = { query }) {
  const result = await db.query("select to_regclass($1) as name", [`public.${tableName}`]);
  return Boolean(result.rows[0]?.name);
}

async function createSchema(db) {
  await db.query(`
    create table if not exists restaurant_config (
      id text primary key,
      name text not null,
      address text,
      currency text not null default 'INR',
      phone text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  await db.query(`
    create table if not exists admin_users (
      id bigserial primary key,
      username text not null unique,
      password_hash text not null,
      role text not null default 'admin',
      is_active boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  await db.query(`
    create table if not exists menu_categories (
      id text primary key,
      name text not null,
      type text not null default 'all',
      sort_order integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  await db.query(`
    create table if not exists menu_items (
      id text primary key,
      category_id text not null references menu_categories(id) on delete cascade,
      name text not null,
      type text not null default 'veg',
      description text,
      image_url text,
      pricing_kind text not null default 'fixed',
      fixed_price numeric(10,2),
      sort_order integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  await db.query(`
    create table if not exists menu_item_variants (
      id text primary key,
      item_id text not null references menu_items(id) on delete cascade,
      name text not null,
      price numeric(10,2) not null,
      sort_order integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  await db.query(`
    create table if not exists offers (
      id bigserial primary key,
      code text not null unique,
      title text not null default '',
      discount_percent numeric(5,2) not null default 0,
      apply_to text not null default 'all',
      target_ids text[] not null default '{}',
      is_active boolean not null default true,
      valid_from timestamptz,
      valid_until timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

}

async function seedInitialData(db) {
  const restaurant = menuSeed.restaurant;
  await db.query(
    `
      insert into restaurant_config (id, name, address, currency, phone)
      values ($1, $2, $3, $4, $5)
    `,
    [restaurant.id, restaurant.name, restaurant.address, restaurant.currency, restaurant.phone]
  );

  await db.query(
    `
      insert into admin_users (username, password_hash, role, is_active)
      values ($1, $2, $3, true)
    `,
    [DEFAULT_SUPER_ADMIN.username, hashPassword(DEFAULT_SUPER_ADMIN.password), DEFAULT_SUPER_ADMIN.role]
  );

  for (const [categoryIndex, category] of menuSeed.categories.entries()) {
    await db.query(
      `
        insert into menu_categories (id, name, type, sort_order)
        values ($1, $2, $3, $4)
      `,
      [category.id, category.name, category.type || "all", categoryIndex]
    );

    for (const [itemIndex, item] of category.items.entries()) {
      const pricing = normalizePricing(item.pricing);
      await db.query(
        `
          insert into menu_items (
            id, category_id, name, type, description, image_url, pricing_kind, fixed_price, sort_order
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          item.id,
          category.id,
          item.name,
          item.type,
          item.description || "",
          item.image || "",
          pricing.kind,
          pricing.kind === "fixed" ? pricing.price : null,
          itemIndex
        ]
      );

      for (const [variantIndex, variant] of pricing.variants.entries()) {
        await db.query(
          `
            insert into menu_item_variants (id, item_id, name, price, sort_order)
            values ($1, $2, $3, $4, $5)
          `,
          [
            variant.id,
            item.id,
            variant.name,
            variant.price,
            variantIndex
          ]
        );
      }
    }
  }
}

async function migrateVariantsSchema() {
  await query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_item_variants' AND column_name = 'label') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_item_variants' AND column_name = 'name') THEN
          ALTER TABLE menu_item_variants RENAME COLUMN label TO name;
        END IF;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_item_variants' AND column_name = 'size') THEN
        ALTER TABLE menu_item_variants DROP COLUMN size;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_item_variants' AND column_name = 'inches') THEN
        ALTER TABLE menu_item_variants DROP COLUMN inches;
      END IF;
    END
    $$;
  `);
}

export async function ensureSchemaAndSeed() {
  const categoriesExist = await tableExists("menu_categories");
  const itemsExist = await tableExists("menu_items");
  const usersExist = await tableExists("admin_users");

  if (categoriesExist && itemsExist && usersExist) {
    await migrateVariantsSchema();
    await migrateOffersTable();
    return { seeded: false };
  }

  return withTransaction(async (db) => {
    await createSchema(db);

    if (!categoriesExist || !itemsExist || !usersExist) {
      const alreadySeeded = await db.query("select count(*)::int as count from menu_categories");
      if (alreadySeeded.rows[0]?.count === 0) {
        await seedInitialData(db);
        return { seeded: true };
      }
    }

    return { seeded: false };
  });
}

async function getRestaurant(db = { query }) {
  const result = await db.query(
    "select id, name, address, currency, phone from restaurant_config order by created_at asc limit 1"
  );
  return result.rows[0] || menuSeed.restaurant;
}

export async function getMenuStore() {
  await ensureSchemaAndSeed();

  const [restaurantResult, categoriesResult, itemsResult, variantsResult] = await Promise.all([
    query("select id, name, address, currency, phone from restaurant_config order by created_at asc limit 1"),
    query("select id, name, type, sort_order from menu_categories order by sort_order asc, name asc"),
    query(
      `
        select id, category_id, name, type, description, image_url, pricing_kind, fixed_price, sort_order
        from menu_items
        order by sort_order asc, name asc
      `
    ),
    query(
      `
        select id, item_id, name, price, sort_order
        from menu_item_variants
        order by sort_order asc, name asc
      `
    )
  ]);

  const variantsByItem = new Map();
  for (const variant of variantsResult.rows) {
    const list = variantsByItem.get(variant.item_id) || [];
    list.push({
      id: variant.id,
      name: variant.name,
      price: Number(variant.price)
    });
    variantsByItem.set(variant.item_id, list);
  }

  const categoryNames = new Map(categoriesResult.rows.map((category) => [category.id, category.name]));
  const itemsByCategory = new Map();
  for (const item of itemsResult.rows) {
    const variants = variantsByItem.get(item.id) || [];
    const pricing =
      item.pricing_kind === "variant"
        ? { kind: "variant", variants }
        : { kind: "fixed", price: Number(item.fixed_price || 0) };
    const list = itemsByCategory.get(item.category_id) || [];
    list.push({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description || "",
      image:
        item.image_url ||
        createPlaceholderImage({
          itemName: item.name,
          categoryName: categoryNames.get(item.category_id) || item.category_id,
          type: item.type
        }),
      pricing,
      displayPrice: getDisplayPrice(pricing.kind === "fixed" ? { kind: "fixed", price: pricing.price } : pricing)
    });
    itemsByCategory.set(item.category_id, list);
  }

  return {
    restaurant: restaurantResult.rows[0] || menuSeed.restaurant,
    categories: categoriesResult.rows.map((category) => {
      const items = itemsByCategory.get(category.id) || [];
      return {
        id: category.id,
        name: category.name,
        type: category.type,
        count: items.length,
        items
      };
    })
  };
}

export async function authenticateAdmin(username, password) {
  await ensureSchemaAndSeed();
  const result = await query(
    `
      select id, username, password_hash, role, is_active
      from admin_users
      where lower(username) = lower($1)
      limit 1
    `,
    [username]
  );

  const user = result.rows[0];
  if (!user || !user.is_active || !verifyPassword(password, user.password_hash)) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role
  };
}

export function buildSessionCookie(user) {
  return {
    name: getSessionCookieName(),
    value: createSessionValue({ id: user.id, username: user.username, role: user.role }),
    options: getSessionCookieOptions()
  };
}

export function readSessionFromCookies(cookieStore) {
  const value = cookieStore.get(getSessionCookieName())?.value;
  return readSessionValue(value);
}

export function clearSessionCookie() {
  return {
    name: getSessionCookieName(),
    value: "",
    options: {
      ...getSessionCookieOptions(),
      maxAge: 0
    }
  };
}

export async function getDashboardSnapshot() {
  await ensureSchemaAndSeed();
  const [restaurant, categories, items, users, variants, offers] = await Promise.all([
    getRestaurant(),
    query(
      `
        select c.id, c.name, c.type, c.sort_order, count(i.id)::int as item_count
        from menu_categories c
        left join menu_items i on i.category_id = c.id
        group by c.id
        order by c.sort_order asc, c.name asc
      `
    ),
    query(
      `
        select i.id, i.category_id, c.name as category_name, i.name, i.type, i.description, i.image_url,
               i.pricing_kind, i.fixed_price, i.sort_order
        from menu_items i
        join menu_categories c on c.id = i.category_id
        order by c.sort_order asc, i.sort_order asc, i.name asc
      `
    ),
    query(
      `
        select id, username, role, is_active, created_at
        from admin_users
        order by created_at asc, username asc
      `
    ),
    query(
      `
        select id, item_id, name, price, sort_order
        from menu_item_variants
        order by item_id asc, sort_order asc, name asc
      `
    ),
    (async () => {
      const exists = await tableExists("offers");
      if (!exists) return { rows: [] };
      return query("select id, code, title, discount_percent, apply_to, target_ids, is_active, valid_from, valid_until, created_at from offers order by created_at desc");
    })()
  ]);

  const variantsByItem = new Map();
  for (const variant of variants.rows) {
    const list = variantsByItem.get(variant.item_id) || [];
    list.push({
      id: variant.id,
      name: variant.name,
      price: Number(variant.price)
    });
    variantsByItem.set(variant.item_id, list);
  }

  return {
    restaurant,
    stats: {
      categories: categories.rows.length,
      items: items.rows.length,
      users: users.rows.length
    },
    categories: categories.rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      sortOrder: row.sort_order,
      itemCount: row.item_count
    })),
    items: items.rows.map((row) => ({
      id: row.id,
      categoryId: row.category_id,
      categoryName: row.category_name,
      name: row.name,
      type: row.type,
      description: row.description || "",
      imageUrl: row.image_url || "",
      pricingKind: row.pricing_kind,
      fixedPrice: row.fixed_price === null ? "" : Number(row.fixed_price),
      sortOrder: row.sort_order,
      variants: variantsByItem.get(row.id) || []
    })),
    users: users.rows.map((row) => ({
      id: row.id,
      username: row.username,
      role: row.role,
      isActive: row.is_active,
      createdAt: row.created_at
    })),
    offers: offers.rows.map((r) => ({
      id: r.id,
      code: r.code,
      title: r.title,
      discountPercent: Number(r.discount_percent),
      applyTo: r.apply_to,
      targetIds: r.target_ids || [],
      isActive: r.is_active,
      validFrom: r.valid_from,
      validUntil: r.valid_until,
      createdAt: r.created_at,
    }))
  };
}

export async function createCategory(input) {
  await ensureSchemaAndSeed();
  const id = input.id ? slugify(input.id) : slugify(input.name);
  if (!id || !input.name?.trim()) {
    throw new Error("Category name is required.");
  }

  const result = await query(
    `
      insert into menu_categories (id, name, type, sort_order, updated_at)
      values (
        $1,
        $2,
        $3,
        coalesce($4, (select coalesce(max(sort_order), -1) + 1 from menu_categories)),
        now()
      )
      returning id
    `,
    [id, input.name.trim(), input.type || "all", Number.isFinite(input.sortOrder) ? input.sortOrder : null]
  );

  return result.rows[0];
}

export async function updateCategory(id, input) {
  await ensureSchemaAndSeed();
  await query(
    `
      update menu_categories
      set name = $2,
          type = $3,
          sort_order = $4,
          updated_at = now()
      where id = $1
    `,
    [id, input.name.trim(), input.type || "all", Number(input.sortOrder || 0)]
  );
}

export async function deleteCategory(id) {
  await ensureSchemaAndSeed();
  await query("delete from menu_categories where id = $1", [id]);
}

export async function createItem(input) {
  await ensureSchemaAndSeed();
  const id = input.id ? slugify(input.id) : slugify(input.name);
  if (!id || !input.name?.trim() || !input.categoryId?.trim()) {
    throw new Error("Item name and category are required.");
  }

  const pricing = normalizePricing(input.pricing);

  await withTransaction(async (db) => {
    await db.query(
      `
        insert into menu_items (
          id, category_id, name, type, description, image_url, pricing_kind, fixed_price, sort_order, updated_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
      `,
      [
        id,
        input.categoryId,
        input.name.trim(),
        input.type || "veg",
        input.description || "",
        input.imageUrl || "",
        pricing.kind,
        pricing.kind === "fixed" ? pricing.price : null,
        Number(input.sortOrder || 0)
      ]
    );

    for (const [index, variant] of pricing.variants.entries()) {
      await db.query(
        `
          insert into menu_item_variants (id, item_id, name, price, sort_order, updated_at)
          values ($1, $2, $3, $4, $5, now())
        `,
        [
          variant.id || `${id}-variant-${index + 1}`,
          id,
          variant.name,
          variant.price,
          index
        ]
      );
    }
  });
}

export async function updateItem(id, input) {
  await ensureSchemaAndSeed();
  const pricing = normalizePricing(input.pricing);

  await withTransaction(async (db) => {
    await db.query(
      `
        update menu_items
        set category_id = $2,
            name = $3,
            type = $4,
            description = $5,
            image_url = $6,
            pricing_kind = $7,
            fixed_price = $8,
            sort_order = $9,
            updated_at = now()
        where id = $1
      `,
      [
        id,
        input.categoryId,
        input.name.trim(),
        input.type || "veg",
        input.description || "",
        input.imageUrl || "",
        pricing.kind,
        pricing.kind === "fixed" ? pricing.price : null,
        Number(input.sortOrder || 0)
      ]
    );

    await db.query("delete from menu_item_variants where item_id = $1", [id]);

    for (const [index, variant] of pricing.variants.entries()) {
      await db.query(
        `
          insert into menu_item_variants (id, item_id, name, price, sort_order, updated_at)
          values ($1, $2, $3, $4, $5, now())
        `,
        [
          variant.id || `${id}-variant-${index + 1}`,
          id,
          variant.name,
          variant.price,
          index
        ]
      );
    }
  });
}

export async function deleteItem(id) {
  await ensureSchemaAndSeed();
  await query("delete from menu_items where id = $1", [id]);
}

export async function createUser(input) {
  await ensureSchemaAndSeed();
  if (!input.username?.trim() || !input.password?.trim()) {
    throw new Error("Username and password are required.");
  }

  const result = await query(
    `
      insert into admin_users (username, password_hash, role, is_active, updated_at)
      values ($1, $2, $3, $4, now())
      returning id
    `,
    [input.username.trim(), hashPassword(input.password), input.role || "admin", input.isActive !== false]
  );

  return result.rows[0];
}

export async function updateUser(id, input) {
  await ensureSchemaAndSeed();
  const existing = await query("select username, role, is_active, password_hash from admin_users where id = $1", [id]);
  if (!existing.rows[0]) {
    throw new Error("User not found.");
  }

  await query(
    `
      update admin_users
      set username = $2,
          role = $3,
          is_active = $4,
          password_hash = $5,
          updated_at = now()
      where id = $1
    `,
    [
      id,
      input.username?.trim() || existing.rows[0].username,
      input.role || existing.rows[0].role,
      input.isActive ?? existing.rows[0].is_active,
      input.password?.trim() ? hashPassword(input.password) : existing.rows[0].password_hash
    ]
  );
}

export async function deleteUser(id) {
  await ensureSchemaAndSeed();
  await query("delete from admin_users where id = $1 and username <> $2", [id, DEFAULT_SUPER_ADMIN.username]);
}

/* ── Offers migration (for existing DBs) ── */
async function migrateOffersTable() {
  const exists = await tableExists("offers");
  if (exists) return;
  await query(`
    create table if not exists offers (
      id bigserial primary key,
      code text not null unique,
      title text not null default '',
      discount_percent numeric(5,2) not null default 0,
      apply_to text not null default 'all',
      target_ids text[] not null default '{}',
      is_active boolean not null default true,
      valid_from timestamptz,
      valid_until timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);
}

/* ── Offers CRUD ── */
export async function getOffers() {
  await ensureSchemaAndSeed();
  const result = await query(
    "select id, code, title, discount_percent, apply_to, target_ids, is_active, valid_from, valid_until, created_at from offers order by created_at desc"
  );
  return result.rows.map((r) => ({
    id: r.id,
    code: r.code,
    title: r.title,
    discountPercent: Number(r.discount_percent),
    applyTo: r.apply_to,
    targetIds: r.target_ids || [],
    isActive: r.is_active,
    validFrom: r.valid_from,
    validUntil: r.valid_until,
    createdAt: r.created_at,
  }));
}

export async function createOffer(input) {
  await ensureSchemaAndSeed();
  if (!input.code?.trim()) throw new Error("Coupon code is required.");
  if (!input.discountPercent || Number(input.discountPercent) <= 0 || Number(input.discountPercent) > 100) {
    throw new Error("Discount must be between 1 and 100.");
  }
  const result = await query(
    `insert into offers (code, title, discount_percent, apply_to, target_ids, is_active, valid_from, valid_until)
     values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
    [
      input.code.trim().toUpperCase(),
      input.title?.trim() || "",
      Number(input.discountPercent),
      input.applyTo || "all",
      input.targetIds || [],
      input.isActive !== false,
      input.validFrom || null,
      input.validUntil || null,
    ]
  );
  return result.rows[0];
}

export async function updateOffer(id, input) {
  await ensureSchemaAndSeed();
  await query(
    `update offers set code=$2, title=$3, discount_percent=$4, apply_to=$5, target_ids=$6, is_active=$7, valid_from=$8, valid_until=$9, updated_at=now() where id=$1`,
    [
      id,
      input.code?.trim().toUpperCase(),
      input.title?.trim() || "",
      Number(input.discountPercent),
      input.applyTo || "all",
      input.targetIds || [],
      input.isActive !== false,
      input.validFrom || null,
      input.validUntil || null,
    ]
  );
}

export async function deleteOffer(id) {
  await ensureSchemaAndSeed();
  await query("delete from offers where id = $1", [id]);
}

export async function validateCoupon(code) {
  await ensureSchemaAndSeed();
  const result = await query(
    `select id, code, title, discount_percent, apply_to, target_ids, is_active, valid_from, valid_until
     from offers where upper(code) = upper($1) limit 1`,
    [code]
  );
  const offer = result.rows[0];
  if (!offer) return { valid: false, error: "Invalid coupon code." };
  if (!offer.is_active) return { valid: false, error: "This coupon is no longer active." };
  const now = new Date();
  if (offer.valid_from && new Date(offer.valid_from) > now) return { valid: false, error: "This coupon is not yet valid." };
  if (offer.valid_until && new Date(offer.valid_until) < now) return { valid: false, error: "This coupon has expired." };
  return {
    valid: true,
    code: offer.code,
    title: offer.title,
    discountPercent: Number(offer.discount_percent),
    applyTo: offer.apply_to,
    targetIds: offer.target_ids || [],
  };
}

export function parseVariantsText(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    throw new Error("Variants must be valid JSON.");
  }
}


