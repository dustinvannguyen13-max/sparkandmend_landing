import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "spark_mend_admin_session";
const SESSION_DAYS = 7;

const ADMIN_ALLOWLIST = (process.env.ADMIN_EMAIL_ALLOWLIST || "")
  .split(",")
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "spark-mend-admin-secret";

type AdminSession = {
  email: string;
  exp: number;
};

const base64UrlEncode = (value: string) =>
  Buffer.from(value).toString("base64url");

const base64UrlDecode = (value: string) =>
  Buffer.from(value, "base64url").toString("utf8");

const signPayload = (payload: string) =>
  createHmac("sha256", ADMIN_SESSION_SECRET).update(payload).digest("base64url");

const createToken = (session: AdminSession) => {
  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
};

const verifyToken = (token?: string | null): AdminSession | null => {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = signPayload(payload);
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    const decoded = JSON.parse(base64UrlDecode(payload)) as AdminSession;
    if (!decoded?.email || !decoded?.exp) return null;
    if (decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
};

export const isAdminEmail = (email: string) =>
  ADMIN_ALLOWLIST.includes(email.trim().toLowerCase());

export const getAdminSession = () => {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyToken(token);
};

export const setAdminSession = (email: string) => {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const token = createToken({ email, exp: expires });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
};

export const clearAdminSession = () => {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
};
