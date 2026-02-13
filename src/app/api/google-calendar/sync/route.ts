import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { syncGoogleCalendar } from "@/lib/google-calendar-sync";

export async function POST() {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await syncGoogleCalendar();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Sync failed." },
      { status: 500 },
    );
  }
}
