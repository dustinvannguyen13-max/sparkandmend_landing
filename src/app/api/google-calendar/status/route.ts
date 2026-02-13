import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { getGoogleIntegration } from "@/lib/google-calendar";

export async function GET() {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const integration = await getGoogleIntegration();
    return NextResponse.json({
      connected: Boolean(integration?.access_token),
      email: integration?.email ?? null,
      lastSyncedAt: integration?.last_synced_at ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to load status." },
      { status: 500 },
    );
  }
}
