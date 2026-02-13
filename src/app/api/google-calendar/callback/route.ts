import { NextResponse } from "next/server";
import { getAdminSession, isAdminEmail } from "@/lib/admin/auth";
import { APP_DOMAIN } from "@/utils/constants/site";
import {
  GOOGLE_OAUTH_STATE_COOKIE,
  exchangeCodeForTokens,
  fetchGoogleUserEmail,
  getGoogleIntegration,
  upsertGoogleIntegration,
} from "@/lib/google-calendar";
import { syncGoogleCalendar } from "@/lib/google-calendar-sync";

export async function GET(request: Request) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.redirect(`${APP_DOMAIN}/login`);
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !storedState || storedState !== state) {
    return NextResponse.json(
      { error: "Invalid Google OAuth state." },
      { status: 400 },
    );
  }

  try {
    const tokenPayload = await exchangeCodeForTokens(code);
    const email = await fetchGoogleUserEmail(tokenPayload.access_token);

    if (!email || !isAdminEmail(email)) {
      return NextResponse.json(
        { error: "Google account is not authorized for admin access." },
        { status: 403 },
      );
    }

    const existing = await getGoogleIntegration();
    const refreshToken =
      tokenPayload.refresh_token || existing?.refresh_token || undefined;

    await upsertGoogleIntegration({
      email,
      access_token: tokenPayload.access_token,
      refresh_token: refreshToken,
      scope: tokenPayload.scope ?? existing?.scope,
      token_type: tokenPayload.token_type ?? existing?.token_type,
      expires_at: tokenPayload.expires_in
        ? new Date(Date.now() + tokenPayload.expires_in * 1000).toISOString()
        : existing?.expires_at,
    });

    try {
      await syncGoogleCalendar();
    } catch {
      // Initial sync failures should not block OAuth completion.
    }

    const response = NextResponse.redirect(
      `${APP_DOMAIN}/dashboard/calendar?connected=1`,
    );
    response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "OAuth connection failed." },
      { status: 500 },
    );
  }
}
