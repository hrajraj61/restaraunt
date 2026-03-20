import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED;

const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined
});

async function main() {
  try {
    const client = await pool.connect();
    console.log("Connected successfully");
    client.release();
    process.exit(0);
  } catch (err) {
    console.error("Connection failed");
    if (err.name === 'AggregateError') {
      console.error(err.errors);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

main();
