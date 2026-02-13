import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

const OFFERS_TABLE = "offers";

const ensureSupabase = () => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }
};

const normalizeTimestamp = (value: unknown) => {
  if (!value) return null;
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }
  return value;
};

export async function GET() {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    ensureSupabase();
    const response = await fetch(
      `${supabaseConfig.url}/rest/v1/${OFFERS_TABLE}?select=*&order=created_at.desc`,
      { headers: supabaseHeaders },
    );
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: text || "Unable to fetch offers." },
        { status: 502 },
      );
    }
    const data = await response.json();
    return NextResponse.json(
      { offers: data },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to fetch offers." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    ensureSupabase();
    const body = (await request.json()) as {
      offer?: Record<string, unknown>;
    };
    const offer = body.offer ?? {};
    const id = typeof offer.id === "string" ? offer.id : null;
    if (offer.enabled === true) {
      await fetch(`${supabaseConfig.url}/rest/v1/${OFFERS_TABLE}`, {
        method: "PATCH",
        headers: supabaseHeaders,
        body: JSON.stringify({ enabled: false }),
      });
    }

    const payload = {
      title: offer.title ?? "",
      message: offer.message ?? "",
      cta_label: offer.cta_label ?? "",
      cta_href: offer.cta_href ?? "",
      discount_type: offer.discount_type ?? "amount",
      discount_value: Number(offer.discount_value) || 0,
      enabled: Boolean(offer.enabled),
      start_at: normalizeTimestamp(offer.start_at),
      end_at: normalizeTimestamp(offer.end_at),
      updated_at: new Date().toISOString(),
    };

    let response: Response;
    if (id) {
      response = await fetch(
        `${supabaseConfig.url}/rest/v1/${OFFERS_TABLE}?id=eq.${encodeURIComponent(
          id,
        )}&select=*`,
        {
          method: "PATCH",
          headers: supabaseHeaders,
          body: JSON.stringify(payload),
        },
      );
    } else {
      response = await fetch(`${supabaseConfig.url}/rest/v1/${OFFERS_TABLE}`, {
        method: "POST",
        headers: supabaseHeaders,
        body: JSON.stringify(payload),
      });
    }

    const responseText = await response.text();
    if (!response.ok) {
      const text = responseText;
      return NextResponse.json(
        { error: text || "Unable to save offer." },
        { status: 502 },
      );
    }

    let data: Array<Record<string, unknown>> = [];
    if (responseText) {
      try {
        const parsed = JSON.parse(responseText) as Array<Record<string, unknown>>;
        data = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        data = [];
      }
    }

    if (!data.length && id) {
      const verify = await fetch(
        `${supabaseConfig.url}/rest/v1/${OFFERS_TABLE}?id=eq.${encodeURIComponent(
          id,
        )}&select=*`,
        { headers: supabaseHeaders },
      );
      const verifyText = await verify.text();
      if (verify.ok) {
        try {
          const parsed = JSON.parse(verifyText) as Array<Record<string, unknown>>;
          data = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          data = [];
        }
      }
    }

    if (!data.length) {
      return NextResponse.json(
        { error: "Offer was not updated in the database." },
        { status: 500 },
      );
    }

    return NextResponse.json({ offer: data[0] });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to save offer." },
      { status: 500 },
    );
  }
}
