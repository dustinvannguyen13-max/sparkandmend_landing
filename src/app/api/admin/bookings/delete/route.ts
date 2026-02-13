import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

export async function DELETE(request: Request) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { reference?: string };
    const reference = body.reference?.trim();

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required." },
        { status: 400 },
      );
    }

    if (!supabaseConfig.url || !supabaseHeaders) {
      return NextResponse.json(
        { error: "Supabase configuration is missing." },
        { status: 500 },
      );
    }

    const lookupResponse = await fetch(
      `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
        reference,
      )}&select=series_id`,
      { headers: supabaseHeaders },
    );

    if (!lookupResponse.ok) {
      const text = await lookupResponse.text();
      return NextResponse.json(
        { error: text || "Unable to find booking." },
        { status: 502 },
      );
    }

    const lookupData = (await lookupResponse.json()) as Array<{
      series_id?: string | null;
    }>;
    const seriesId = lookupData[0]?.series_id ?? null;
    const deleteQuery = seriesId
      ? `series_id=eq.${encodeURIComponent(seriesId)}`
      : `reference=eq.${encodeURIComponent(reference)}`;

    const response = await fetch(
      `${supabaseConfig.url}/rest/v1/bookings?${deleteQuery}`,
      {
        method: "DELETE",
        headers: supabaseHeaders,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: text || "Unable to delete booking." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to delete booking." },
      { status: 500 },
    );
  }
}
