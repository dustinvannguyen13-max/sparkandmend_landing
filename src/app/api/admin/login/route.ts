import { NextResponse } from "next/server";
import { isAdminEmail, setAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      code?: string;
    };
    const email = body.email?.trim().toLowerCase();
    const code = body.code?.trim();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and access code are required." },
        { status: 400 },
      );
    }

    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const expectedCode = process.env.ADMIN_LOGIN_CODE;
    if (!expectedCode) {
      return NextResponse.json(
        { error: "Admin login is not configured." },
        { status: 500 },
      );
    }

    if (code !== expectedCode) {
      return NextResponse.json({ error: "Invalid access code." }, { status: 401 });
    }

    setAdminSession(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to sign in." },
      { status: 500 },
    );
  }
}
