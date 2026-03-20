import { Controller, Get } from "@nestjs/common";
import { getMenuStore } from "../services/admin-store.js";

@Controller("api/menu")
export class MenuController {
  @Get()
  async fetchMenu() {
    const menu = await getMenuStore();
    return { menu };
  }
}
