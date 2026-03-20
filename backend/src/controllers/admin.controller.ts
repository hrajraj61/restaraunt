import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException
} from "@nestjs/common";
import { Request, Response } from "express";
import type { CookieOptions } from "express";
import { parse as parseCookie } from "cookie";
import {
  authenticateAdmin,
  buildSessionCookie,
  clearSessionCookie,
  createCategory,
  updateCategory,
  deleteCategory,
  createItem,
  updateItem,
  deleteItem,
  createUser,
  updateUser,
  deleteUser,
  getDashboardSnapshot,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer
} from "../services/admin-store.js";
import { getSessionCookieName, readSessionValue } from "../services/security.js";

const SESSION_COOKIE = getSessionCookieName();

function extractSession(req: Request) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = parseCookie(Array.isArray(cookieHeader) ? cookieHeader.join(";") : cookieHeader);
  const value = cookies[SESSION_COOKIE];
  if (!value) return null;
  return readSessionValue(value);
}

@Controller("api/admin")
export class AdminController {
  private ensureSession(req: Request) {
    const session = extractSession(req);
    if (!session) {
      throw new UnauthorizedException("Unauthorized");
    }
    return session;
  }

  @Post("login")
  async login(
    @Body() body: { username?: string; password?: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await authenticateAdmin(body.username || "", body.password || "");
    if (!user) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const cookie = buildSessionCookie(user);
    res.cookie(cookie.name, cookie.value, cookie.options as CookieOptions);
    return { ok: true, user: { id: user.id, username: user.username, role: user.role } };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookie = clearSessionCookie();
    res.cookie(cookie.name, cookie.value, cookie.options as CookieOptions);
    return { ok: true };
  }

  @Get("session")
  getSession(@Req() req: Request) {
    const session = extractSession(req);
    if (!session) {
      throw new UnauthorizedException("Unauthorized");
    }
    return { user: { id: session.id, username: session.username, role: session.role } };
  }

  @Get("bootstrap")
  async bootstrap(@Req() req: Request) {
    this.ensureSession(req);
    const data = await getDashboardSnapshot();
    return { data };
  }

  @Post("categories")
  async addCategory(@Req() req: Request, @Body() body: { id?: string; name: string; type?: string; sortOrder?: number }) {
    this.ensureSession(req);
    if (!body?.name?.trim()) {
      throw new BadRequestException("Category name is required");
    }

    return createCategory(body);
  }

  @Patch("categories/:id")
  async renameCategory(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() body: { name: string; type?: string; sortOrder?: number }
  ) {
    this.ensureSession(req);
    if (!body?.name?.trim()) {
      throw new BadRequestException("Category name is required");
    }

    await updateCategory(id, body);
    return { ok: true };
  }

  @Delete("categories/:id")
  async removeCategory(@Req() req: Request, @Param("id") id: string) {
    this.ensureSession(req);
    await deleteCategory(id);
    return { ok: true };
  }

  @Post("items")
  async addItem(@Req() req: Request, @Body() body: any) {
    this.ensureSession(req);
    await createItem(body);
    return { ok: true };
  }

  @Patch("items/:id")
  async editItem(@Req() req: Request, @Param("id") id: string, @Body() body: any) {
    this.ensureSession(req);
    await updateItem(id, body);
    return { ok: true };
  }

  @Delete("items/:id")
  async removeItem(@Req() req: Request, @Param("id") id: string) {
    this.ensureSession(req);
    await deleteItem(id);
    return { ok: true };
  }

  @Post("users")
  async addUser(@Req() req: Request, @Body() body: any) {
    this.ensureSession(req);
    await createUser(body);
    return { ok: true };
  }

  @Patch("users/:id")
  async editUser(@Req() req: Request, @Param("id") id: string, @Body() body: any) {
    this.ensureSession(req);
    await updateUser(id, body);
    return { ok: true };
  }

  @Delete("users/:id")
  async removeUser(@Req() req: Request, @Param("id") id: string) {
    this.ensureSession(req);
    await deleteUser(id);
    return { ok: true };
  }

  @Get("offers")
  async listOffers(@Req() req: Request) {
    this.ensureSession(req);
    const offers = await getOffers();
    return { offers };
  }

  @Post("offers")
  async addOffer(@Req() req: Request, @Body() body: any) {
    this.ensureSession(req);
    await createOffer(body);
    return { ok: true };
  }

  @Patch("offers/:id")
  async editOffer(@Req() req: Request, @Param("id") id: string, @Body() body: any) {
    this.ensureSession(req);
    await updateOffer(id, body);
    return { ok: true };
  }

  @Delete("offers/:id")
  async removeOffer(@Req() req: Request, @Param("id") id: string) {
    this.ensureSession(req);
    await deleteOffer(id);
    return { ok: true };
  }
}
