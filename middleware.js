import { NextResponse } from "next/server";

const PRODUCTION_HOSTS = new Set(["scrizaone.com", "www.scrizaone.com"]);

export function middleware(request) {
  const res = NextResponse.next();

  // Country hint for the suggestion banner only. Page content never changes by IP.
  const country = request.headers.get("x-vercel-ip-country");
  if (country && request.cookies.get("sc_country")?.value !== country) {
    res.cookies.set("sc_country", country, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  }

  // Keep preview and *.vercel.app hosts out of search indexes (duplicate-content guard).
  const host = (request.headers.get("host") || "").toLowerCase().split(":")[0];
  if (!PRODUCTION_HOSTS.has(host)) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
