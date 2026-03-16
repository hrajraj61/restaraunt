import { getMenuStore as getDbMenuStore } from "./admin-store.js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const menuStore = require("../../data.json");

export async function getMenuStore() {
  try {
    return await getDbMenuStore();
  } catch (error) {
    console.error("Falling back to bundled menu data:", error);
    return menuStore;
  }
}


