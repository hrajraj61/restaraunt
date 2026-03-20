import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL is required to use the admin backend.");
}

const globalForDb = globalThis;

export const pool =
  globalForDb.__menuAdminPool ||
  new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__menuAdminPool = pool;
}

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Safe parameterized update: builds SET clause from an allowlist of columns.
 * Only columns present in `values` AND in `allowedColumns` are updated.
 * Returns the query result or null if nothing to update.
 */
export async function safeUpdate(table, id, values, allowedColumns, db = { query }) {
  const sets = [];
  const params = [];
  let idx = 1;

  for (const col of allowedColumns) {
    if (col in values) {
      sets.push(`${col} = $${idx}`);
      params.push(values[col]);
      idx++;
    }
  }

  if (sets.length === 0) return null;

  sets.push(`updated_at = now()`);
  params.push(id);

  const sql = `UPDATE ${table} SET ${sets.join(", ")} WHERE id = $${idx}`;
  return db.query(sql, params);
}
