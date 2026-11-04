"use client";

// Suggests the visitor's regional page. It never redirects and never changes the
// content of the current URL, so every locale stays crawlable (strategy §5.3).
import { useEffect, useState } from "react";
import Link from "next/link";
import { locales, localeForCountry } from "@/lib/locales";

function readCookie(name) {
  try {
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

function writeCookie(name, value) {
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax`;
  } catch {}
}

export default function LocaleBanner({ current }) {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (readCookie("sc_locale_choice")) return; // visitor already chose
    const country = readCookie("sc_country");
    if (!country) return; // unknown location: never nag
    const suggested = localeForCountry(country) || "global";
    if (suggested !== current) setTarget(locales[suggested]);
  }, [current]);

  if (!target) return null;

  const dismiss = () => {
    writeCookie("sc_locale_choice", current);
    setTarget(null);
  };

  return (
    <div className="locale-banner" role="region" aria-label="Regional site suggestion">
      <div className="wrap banner-row">
        <span>
          {target.code === "global"
            ? "Viewing from outside this region? See our global site."
            : `Viewing from ${target.region}? See local details, payment rails and ${target.currency.code} quotes.`}
        </span>
        <span className="banner-actions">
          <Link href={target.path || "/"} className="btn btn-sm" onClick={() => writeCookie("sc_locale_choice", target.code)}>
            Go to {target.name}
          </Link>
          <button type="button" className="link-btn" onClick={dismiss}>Stay here</button>
        </span>
      </div>
    </div>
  );
}
