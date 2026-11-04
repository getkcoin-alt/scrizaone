import { SITE_URL } from "@/lib/site";
import { alternatesFor, localeList } from "@/lib/locales";
import { guides, guideDate } from "@/lib/guides";
import { serviceContent } from "@/lib/service-content";

const abs = (path) => `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;

function absLanguages(sub) {
  const out = {};
  for (const [k, v] of Object.entries(alternatesFor(sub))) out[k] = abs(v);
  return out;
}

export default function sitemap() {
  const now = new Date("2026-11-04T00:00:00Z"); // Actual initial content review; do not refresh on every build.
  const subs = ["", ...Object.keys(serviceContent).map((s) => `/services/${s}`)];
  const entries = [];
  for (const sub of subs) {
    for (const l of localeList) {
      const path = `${l.path}${sub}` || "/";
      entries.push({
        url: abs(path),
        lastModified: now,
        changeFrequency: "monthly",
        priority: sub === "" ? 1 : 0.8,
        ...(l.code === "eu" ? {} : { alternates: { languages: absLanguages(sub) } }),
      });
    }
  }
  entries.push({ url: abs("/working-with-us"), lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  entries.push({ url: abs("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 });
  for (const path of ["/demos", "/services/organic-growth", "/research", "/resources", "/tools/payment-readiness", "/company", "/privacy", ...guides.map(g => `/resources/${g.slug}`)]) { entries.push({url:abs(path),lastModified:new Date(guideDate),changeFrequency:"monthly",priority:0.7}); }
  return entries;
}
