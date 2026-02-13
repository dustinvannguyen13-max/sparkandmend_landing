import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import {
  GOOGLE_OAUTH_STATE_COOKIE,
  buildGoogleAuthUrl,
} from "@/lib/google-calendar";

export async function GET() {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const state = randomUUID();
  const authUrl = buildGoogleAuthUrl(state);
  const response = NextResponse.redirect(authUrl);
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });
  return response;
}
