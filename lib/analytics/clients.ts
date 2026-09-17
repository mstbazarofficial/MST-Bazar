// lib/analytics/clients.ts
// Both Google clients are created once per server process (module-level
// singletons) instead of per-request, since building the JWT client has
// real overhead. This file is server-only — never import it from a
// client component.
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { google } from "googleapis";
import "server-only";

function getCredentials() {
  // Store the whole service-account JSON as one env var (base64-encoded
  // so multiline keys survive .env files and hosting-provider UIs).
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
  if (!raw) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_BASE64 env var. See README for setup.",
    );
  }
  return JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
}

let _ga4: BetaAnalyticsDataClient | null = null;
export function getGa4Client(): BetaAnalyticsDataClient {
  if (!_ga4) {
    _ga4 = new BetaAnalyticsDataClient({ credentials: getCredentials() });
  }
  return _ga4;
}

let _searchConsole: ReturnType<typeof google.searchconsole> | null = null;
export function getSearchConsoleClient() {
  if (!_searchConsole) {
    const auth = new google.auth.GoogleAuth({
      credentials: getCredentials(),
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });
    _searchConsole = google.searchconsole({ version: "v1", auth });
  }
  return _searchConsole;
}

export const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID ?? ""; // e.g. "properties/123456789"
export const GSC_SITE_URL = process.env.GSC_SITE_URL ?? ""; // e.g. "https://edugen.global/" or "sc-domain:edugen.global"
