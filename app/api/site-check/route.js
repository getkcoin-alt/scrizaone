import { createHmac } from "node:crypto";
import { runCheck } from "@/lib/site-check/run.mjs";
import { CheckError } from "@/lib/site-check/fetcher.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

// Best-effort per-instance limits (not a global quota). Nothing about the
// checked site or the visitor is stored.
const buckets = new Map();
function limit(request) {
  const ip = (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const key = createHmac("sha256", process.env.RIZA_SESSION_SECRET || "site-check").update("site-check/" + ip).digest("base64url");
  const now = Date.now();
  for (const [k, v] of buckets) if (v.until <= now) buckets.delete(k); // keep nothing past its window
  for (const [k, max, windowMs] of [[key + "/m", 3, 60_000], [key + "/h", 15, 3_600_000]]) {
    let b = buckets.get(k);
    if (!b || b.until <= now) { b = { count: 0, until: now + windowMs }; buckets.set(k, b); }
    if (b.count >= max) throw new CheckError("You've run several checks in a short time. Please wait a few minutes and try again.", 429, "RATE_LIMITED");
    b.count++;
  }
}

function verifyOrigin(request) {
  const origin = request.headers.get("origin");
  const allowed = new Set(["https://www.scrizaone.com", "https://scrizaone.com"]);
  if (process.env.VERCEL_URL) allowed.add("https://" + process.env.VERCEL_URL);
  if (process.env.VERCEL_BRANCH_URL) allowed.add("https://" + process.env.VERCEL_BRANCH_URL);
  if (!process.env.VERCEL) allowed.add(new URL(request.url).origin);
  if (!origin || !allowed.has(origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new CheckError("Please run the check from scrizaone.com.", 403, "ORIGIN_REJECTED");
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new CheckError("JSON is required.", 415);
}

export async function POST(request) {
  try {
    verifyOrigin(request);
    limit(request);
    const text = await request.text();
    if (text.length > 4096) throw new CheckError("Request too large.", 413);
    let body;
    try { body = JSON.parse(text); } catch { throw new CheckError("Invalid request."); }
    if (body?.confirm !== true) throw new CheckError("Please confirm you own or manage this website, or have permission to check it.");
    const report = await runCheck(body?.url);
    return Response.json(report, { headers: NO_STORE });
  } catch (e) {
    const known = e instanceof CheckError;
    if (!known) console.error("site_check_failed", { code: "INTERNAL_ERROR" });
    return Response.json(
      { error: known ? e.message : "The check could not be completed. Please try again.", code: known ? e.code : "INTERNAL_ERROR" },
      { status: known ? e.status : 500, headers: NO_STORE }
    );
  }
}
