import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = Deno.env.get("EXTEND_SERIES_URL");
  const secret = Deno.env.get("EXTEND_SERIES_SECRET");

  if (!url || !secret) {
    return new Response("Missing EXTEND_SERIES_URL or EXTEND_SERIES_SECRET", {
      status: 500,
    });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-cron-secret": secret,
    },
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
});
