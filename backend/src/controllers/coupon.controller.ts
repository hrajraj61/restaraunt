import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { validateCoupon } from "../services/admin-store.js";

@Controller("api/coupon")
export class CouponController {
  @Post()
  async validate(@Body("code") code: string) {
    if (!code?.trim()) {
      throw new BadRequestException("Coupon code is required");
    }

    return validateCoupon(code);
  }
}
