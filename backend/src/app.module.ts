import { Module } from "@nestjs/common";
import { AdminController } from "./controllers/admin.controller.js";
import { MenuController } from "./controllers/menu.controller.js";
import { CouponController } from "./controllers/coupon.controller.js";

@Module({
  controllers: [MenuController, CouponController, AdminController]
})
export class AppModule {}
