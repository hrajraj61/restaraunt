import crypto from "node:crypto";

const SESSION_COOKIE = "dashboard_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    crypto.createHash("sha256").update(process.env.DATABASE_URL || "dubeys-dhaba-admin").digest("hex")
  );
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, expectedHash] = storedHash.split(":");
  const actualHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actualHash, "hex"), Buffer.from(expectedHash, "hex"));
}

export function createSessionValue(payload: { id: number; username: string; role: string }) {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const body = Buffer.from(JSON.stringify({ ...payload, expiresAt })).toString("base64url");
  const signature = crypto.createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function readSessionValue(value?: string | null) {
  if (!value || !value.includes(".")) {
    return null;
  }

  const [body, signature] = value.split(".");
  const expectedSignature = crypto.createHmac("sha256", getSessionSecret()).update(body).digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  };
}

export function buildSessionCookie(user: { id: number; username: string; role: string }) {
  return {
    name: getSessionCookieName(),
    value: createSessionValue(user),
    options: getSessionCookieOptions()
  };
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
