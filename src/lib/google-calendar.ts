import { APP_DOMAIN } from "@/utils/constants/site";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

const PROVIDER = "google_calendar";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/calendar"];

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  `${APP_DOMAIN.replace(/\/$/, "")}/api/google-calendar/callback`;

export const GOOGLE_OAUTH_STATE_COOKIE = "spark_mend_google_oauth_state";
export const GOOGLE_CALENDAR_ID = "primary";
export const GOOGLE_CALENDAR_TIMEZONE = "Europe/London";
export const GOOGLE_EVENT_DURATION_HOURS = 4;

export type GoogleIntegration = {
  id?: string;
  provider?: string;
  email?: string;
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expires_at?: string;
  last_synced_at?: string;
};

const ensureSupabase = () => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }
};

export const getGoogleOAuthConfig = () => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth client configuration.");
  }

  return {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
    scopes: GOOGLE_SCOPES,
  };
};

export const buildGoogleAuthUrl = (state: string) => {
  const { clientId, redirectUri, scopes } = getGoogleOAuthConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

export const exchangeCodeForTokens = async (code: string) => {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error_description || "Google token exchange failed.");
  }

  return payload as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
  };
};

const refreshGoogleToken = async (refreshToken: string) => {
  const { clientId, clientSecret } = getGoogleOAuthConfig();
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error_description || "Google token refresh failed.");
  }

  return payload as {
    access_token: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
  };
};

export const fetchGoogleUserEmail = async (accessToken: string) => {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || "Unable to fetch Google user info.");
  }

  return payload.email as string | undefined;
};

export const getGoogleIntegration = async () => {
  ensureSupabase();

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/admin_integrations?provider=eq.${PROVIDER}&select=*`,
    {
      headers: supabaseHeaders,
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as GoogleIntegration[];
  return data[0] ?? null;
};

export const upsertGoogleIntegration = async (
  payload: Partial<GoogleIntegration>,
) => {
  ensureSupabase();

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/admin_integrations?on_conflict=provider`,
    {
      method: "POST",
      headers: {
        ...supabaseHeaders,
        Prefer: "return=representation,resolution=merge-duplicates",
      },
      body: JSON.stringify({
        provider: PROVIDER,
        ...payload,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to save Google Calendar connection.");
  }

  const data = (await response.json()) as GoogleIntegration[];
  return data[0] ?? null;
};

export const updateIntegrationLastSynced = async (timestamp: string) => {
  return upsertGoogleIntegration({ last_synced_at: timestamp });
};

export const getGoogleAccessToken = async () => {
  const integration = await getGoogleIntegration();
  if (!integration?.access_token) {
    throw new Error("Google Calendar is not connected.");
  }

  const expiresAt = integration.expires_at
    ? new Date(integration.expires_at).getTime()
    : null;

  if (!expiresAt || expiresAt - Date.now() > 60_000) {
    return { accessToken: integration.access_token, integration };
  }

  if (!integration.refresh_token) {
    return { accessToken: integration.access_token, integration };
  }

  const refreshed = await refreshGoogleToken(integration.refresh_token);
  const next = await upsertGoogleIntegration({
    access_token: refreshed.access_token,
    refresh_token: integration.refresh_token,
    scope: refreshed.scope ?? integration.scope,
    token_type: refreshed.token_type ?? integration.token_type,
    expires_at: refreshed.expires_in
      ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
      : integration.expires_at,
  });

  return {
    accessToken: next?.access_token || refreshed.access_token,
    integration: next ?? integration,
  };
};
