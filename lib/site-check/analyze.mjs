// AI Search Readiness Check: pure analysis of fetched data.
// Every check states what was found, why it matters and how to fix it.
// Scores use a published, fixed rubric (100 points). No revenue or traffic
// estimates are produced: we cannot measure those from one page load.

export const SEARCH_BOTS = [
  { ua: "Googlebot", who: "Google Search and AI Overviews" },
  { ua: "Bingbot", who: "Bing and Microsoft Copilot" },
  { ua: "OAI-SearchBot", who: "ChatGPT search" },
  { ua: "ChatGPT-User", who: "ChatGPT fetching a page a user asked about" },
  { ua: "PerplexityBot", who: "Perplexity" },
  { ua: "Claude-SearchBot", who: "Claude web search" },
];
export const TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];

export const CATEGORIES = [
  { id: "ai", name: "AI search access", max: 30 },
  { id: "seo", name: "Search essentials", max: 30 },
  { id: "facts", name: "Machine-readable facts", max: 15 },
  { id: "speed", name: "Speed & security", max: 15 },
  { id: "contact", name: "Ways to contact you", max: 10 },
];

// ---------- robots.txt ----------

export function parseRobots(text) {
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (key === "allow" || key === "disallow") {
      if (current) current.rules.push({ allow: key === "allow", path: value });
      lastWasAgent = false;
    } else {
      lastWasAgent = false;
    }
  }
  return groups;
}

function ruleMatches(pattern, path) {
  if (pattern === "") return false;
  const re = "^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$");
  return new RegExp(re).test(path);
}

// RFC 9309: the most specific matching group applies; within it the longest
// matching rule wins, and Allow wins a tie.
export function isAllowed(groups, userAgent, path = "/") {
  const ua = userAgent.toLowerCase();
  let chosen = groups.filter((g) => g.agents.some((a) => a !== "*" && ua.includes(a)));
  if (!chosen.length) chosen = groups.filter((g) => g.agents.includes("*"));
  if (!chosen.length) return true;
  const rules = chosen.flatMap((g) => g.rules);
  let best = null;
  for (const r of rules) {
    if (!ruleMatches(r.path, path)) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r;
  }
  return best ? best.allow : true;
}

// ---------- HTML helpers (dependency-free, tolerant) ----------

const decode = (s) =>
  String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    out[m[1].toLowerCase()] = decode(m[3] ?? m[4] ?? m[5] ?? "");
  }
  return out;
}

const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => attrs(m[0]));

function metaContent(html, key, value) {
  const t = tags(html, "meta").find((a) => (a[key] || "").toLowerCase() === value);
  return t ? t.content || "" : null;
}

export function extractPage(html) {
  const doc = String(html || "");
  const noScripts = doc.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  const titleMatch = doc.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const links = tags(doc, "link");
  const canonical = links.find((l) => (l.rel || "").toLowerCase().split(/\s+/).includes("canonical"));
  const hreflangs = links.filter((l) => (l.rel || "").toLowerCase() === "alternate" && l.hreflang);
  const jsonLd = [...doc.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const schemaTypes = new Set();
  let schemaParseErrors = 0;
  for (const block of jsonLd) {
    try {
      const walk = (node) => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (node && typeof node === "object") {
          const t = node["@type"];
          (Array.isArray(t) ? t : t ? [t] : []).forEach((x) => schemaTypes.add(String(x)));
          Object.values(node).forEach(walk);
        }
      };
      walk(JSON.parse(block));
    } catch {
      schemaParseErrors++;
    }
  }
  const htmlTag = doc.match(/<html\b[^>]*>/i);
  const anchors = tags(doc, "a").map((a) => a.href || "");
  const imgs = tags(doc, "img");
  return {
    title: titleMatch ? decode(titleMatch[1]) : "",
    description: metaContent(doc, "name", "description"),
    robotsMeta: [metaContent(doc, "name", "robots"), metaContent(doc, "name", "googlebot")].filter(Boolean).join(", "),
    viewport: metaContent(doc, "name", "viewport"),
    ogTitle: metaContent(doc, "property", "og:title"),
    ogImage: metaContent(doc, "property", "og:image"),
    canonical: canonical ? canonical.href || "" : null,
    hreflangs: hreflangs.map((h) => ({ lang: h.hreflang, href: h.href })),
    lang: htmlTag ? attrs(htmlTag[0]).lang || "" : "",
    h1Count: (noScripts.match(/<h1\b/gi) || []).length,
    jsonLdBlocks: jsonLd.length,
    schemaTypes: [...schemaTypes],
    schemaParseErrors,
    hasTel: anchors.some((h) => /^tel:/i.test(h)),
    hasMailto: anchors.some((h) => /^mailto:/i.test(h)),
    hasWhatsApp: anchors.some((h) => /(^|\/\/)(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)/i.test(h)),
    hasForm: /<form\b/i.test(noScripts),
    hasContactLink: anchors.some((h) => /contact|get-in-touch|book|demo/i.test(h)),
    imgCount: imgs.length,
    imgMissingAlt: imgs.filter((i) => !("alt" in i)).length,
  };
}

// ---------- scoring ----------

const check = (category, id, level, points, max, title, detail, fix) => ({ category, id, level, points, max, title, detail, fix });

export function analyze(input) {
  const { finalUrl, status, headers = {}, html = "", bytes = 0, ttfbMs = null, robots, llms, sitemap, chain = [] } = input;
  const url = new URL(finalUrl);
  const page = extractPage(html);
  const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), Array.isArray(v) ? v.join(", ") : String(v)]));
  const checks = [];
  const path = url.pathname + (url.search || "");

  // --- AI search access (30) ---
  const groups = robots && robots.status === 200 ? parseRobots(robots.body) : [];
  const robotsUnreachable = robots && robots.status >= 500;
  const botRows = SEARCH_BOTS.map((b) => ({ ...b, allowed: robotsUnreachable ? false : isAllowed(groups, b.ua, path) }));
  const blocked = botRows.filter((b) => !b.allowed);
  const botPts = Math.round(15 * (botRows.length - blocked.length) / botRows.length);
  checks.push(check("ai", "search-crawlers", blocked.length ? "fail" : "pass", botPts, 15,
    "Search and AI-search crawlers can read this page",
    robotsUnreachable
      ? `robots.txt returned HTTP ${robots.status}. Search engines treat an unreachable robots.txt as "don't crawl" until it recovers.`
      : blocked.length
        ? `Blocked by robots.txt: ${blocked.map((b) => `${b.ua} (${b.who})`).join("; ")}.`
        : `Allowed: ${botRows.map((b) => b.ua).join(", ")}.`,
    blocked.length || robotsUnreachable
      ? "Allow the search crawlers you want to be found by in robots.txt. Blocking a search crawler removes the page from that engine's answers."
      : "Nothing to fix."));
  const trainingBlocked = TRAINING_BOTS.filter((ua) => !isAllowed(groups, ua, path));
  checks.push(check("ai", "training-crawlers", "info", 0, 0,
    "AI training crawlers (your choice)",
    trainingBlocked.length ? `Blocked: ${trainingBlocked.join(", ")}.` : `Not blocked: ${TRAINING_BOTS.join(", ")}.`,
    "Blocking training crawlers is a legitimate business choice and does not affect this score. It does not remove you from AI search answers, which use the search crawlers above."));

  const headerRobots = h["x-robots-tag"] || "";
  const noindex = /noindex/i.test(page.robotsMeta) || /noindex/i.test(headerRobots);
  checks.push(check("ai", "indexable", noindex ? "fail" : "pass", noindex ? 0 : 10, 10,
    "Page is allowed in search indexes",
    noindex ? `A noindex directive was found (${[page.robotsMeta, headerRobots].filter(Boolean).join(" / ")}).` : "No noindex directive in the page or response headers.",
    noindex ? "Remove noindex from pages you want in Google, Bing and AI answers. Keep it only on private or duplicate pages." : "Nothing to fix."));

  const hasLlms = llms && llms.status === 200 && llms.body.trim().length > 40 && !/<html/i.test(llms.body);
  checks.push(check("ai", "llms-txt", hasLlms ? "pass" : "warn", hasLlms ? 5 : 0, 5,
    "llms.txt summary for AI tools (optional)",
    hasLlms ? "Found /llms.txt." : "No /llms.txt found.",
    hasLlms ? "Keep it accurate and in sync with your site." : "Optionally publish /llms.txt: a short, factual summary of who you are, what you offer and your key pages. It's cheap to add, but no major AI engine has confirmed it as a ranking factor, so treat it as a bonus, not a fix."));

  // --- Search essentials (30) ---
  const ok = status >= 200 && status < 300;
  checks.push(check("seo", "status", ok ? "pass" : "fail", ok ? 5 : 0, 5,
    "Page loads successfully",
    `Final response: HTTP ${status}${chain.length > 1 ? ` after ${chain.length - 1} redirect(s)` : ""}.`,
    ok ? (chain.length > 2 ? "Reduce the redirect chain to a single hop." : "Nothing to fix.") : "Make the page return HTTP 200 for visitors and crawlers."));

  const t = page.title;
  const segs = t.split(/\s[|\-–—:]\s/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  const dupTitle = segs.length !== new Set(segs).size;
  const titleLevel = !t ? "fail" : t.length < 15 || t.length > 65 || dupTitle ? "warn" : "pass";
  checks.push(check("seo", "title", titleLevel, !t ? 0 : titleLevel === "pass" ? 5 : 3, 5,
    "Title tag",
    t ? `"${t}" (${t.length} characters)${dupTitle ? ". The same phrase appears twice." : "."}` : "No <title> found.",
    titleLevel === "pass" ? "Nothing to fix." : "Write a unique title of about 30–60 characters that names what you offer and who it's for, and mention the brand once."));

  const d = page.description;
  const descLevel = d == null || !d ? "fail" : d.length < 50 || d.length > 170 ? "warn" : "pass";
  checks.push(check("seo", "description", descLevel, descLevel === "pass" ? 4 : descLevel === "warn" ? 2 : 0, 4,
    "Meta description",
    d ? `${d.length} characters.` : "No meta description found.",
    descLevel === "pass" ? "Nothing to fix." : "Add a 120–160 character summary that answers what the page offers. Search engines and AI tools often quote it."));

  let canonLevel = "pass", canonDetail = "", canonPts = 5;
  if (page.canonical == null || page.canonical === "") {
    canonLevel = "warn"; canonPts = 2; canonDetail = "No canonical link found.";
  } else {
    let c;
    try { c = new URL(page.canonical, url); } catch { c = null; }
    if (!c) { canonLevel = "fail"; canonPts = 0; canonDetail = `Canonical "${page.canonical}" is not a valid URL.`; }
    else if (url.pathname !== "/" && (c.pathname === "/" || c.pathname === "")) { canonLevel = "fail"; canonPts = 0; canonDetail = `This inner page declares the homepage (${c.href}) as its canonical, which tells search engines to ignore this page.`; }
    else if (c.hostname.replace(/^www\./, "") !== url.hostname.replace(/^www\./, "")) { canonLevel = "warn"; canonPts = 2; canonDetail = `Canonical points to another domain: ${c.href}.`; }
    else canonDetail = `Canonical: ${c.href}.`;
  }
  checks.push(check("seo", "canonical", canonLevel, canonPts, 5, "Canonical URL", canonDetail,
    canonLevel === "pass" ? "Nothing to fix." : "Give each indexable page a self-referencing canonical URL on your preferred domain."));

  const h1Level = page.h1Count === 1 ? "pass" : page.h1Count === 0 ? "fail" : "warn";
  checks.push(check("seo", "h1", h1Level, h1Level === "pass" ? 3 : h1Level === "warn" ? 2 : 0, 3,
    "One main heading (H1)", `${page.h1Count} H1 heading(s) found in the delivered HTML.`,
    h1Level === "pass" ? "Nothing to fix." : page.h1Count === 0 ? "Add one H1 that states the page's main topic. If your H1 only appears after JavaScript runs, some crawlers may not see it." : "Use a single H1 and turn the others into H2s."));

  checks.push(check("seo", "lang", page.lang ? "pass" : "warn", page.lang ? 2 : 0, 2,
    "Page language declared", page.lang ? `lang="${page.lang}".` : "No lang attribute on <html>.",
    page.lang ? "Nothing to fix." : 'Add lang (for example <html lang="en">) so search engines and screen readers know the language.'));

  const sitemapOk = sitemap && sitemap.status === 200 && /<(urlset|sitemapindex)\b/i.test(sitemap.body);
  checks.push(check("seo", "sitemap", sitemapOk ? "pass" : "warn", sitemapOk ? 3 : 0, 3,
    "XML sitemap", sitemapOk ? `Found ${sitemap.url}.` : "No XML sitemap found at /sitemap.xml or in robots.txt.",
    sitemapOk ? "Nothing to fix." : "Publish an XML sitemap, list it in robots.txt, and submit it in Google Search Console and Bing Webmaster Tools."));

  checks.push(check("seo", "viewport", page.viewport ? "pass" : "fail", page.viewport ? 3 : 0, 3,
    "Mobile viewport", page.viewport ? `viewport: ${page.viewport}` : "No viewport meta tag.",
    page.viewport ? "Nothing to fix." : 'Add <meta name="viewport" content="width=device-width, initial-scale=1">. Google indexes the mobile version of pages.'));

  // --- Machine-readable facts (15) ---
  const hasLd = page.jsonLdBlocks > 0 && page.schemaParseErrors < page.jsonLdBlocks;
  checks.push(check("facts", "structured-data", hasLd ? (page.schemaParseErrors ? "warn" : "pass") : "fail", hasLd ? (page.schemaParseErrors ? 4 : 6) : 0, 6,
    "Structured data (JSON-LD)",
    hasLd ? `Types found: ${page.schemaTypes.join(", ") || "none"}${page.schemaParseErrors ? `. ${page.schemaParseErrors} block(s) contain invalid JSON.` : "."}` : "No valid JSON-LD found.",
    hasLd && !page.schemaParseErrors ? "Validate with Google's Rich Results Test after changes." : "Add JSON-LD describing your organisation and the page (for example Organization, Service, Product or FAQPage), and make sure it is valid JSON."));

  const orgTypes = ["Organization", "Corporation", "LocalBusiness", "ProfessionalService", "OnlineStore", "NGO", "EducationalOrganization", "MedicalOrganization"];
  const hasOrg = page.schemaTypes.some((x) => orgTypes.includes(x) || /Business$|Organization$/.test(x));
  checks.push(check("facts", "entity", hasOrg ? "pass" : "warn", hasOrg ? 5 : 0, 5,
    "Business identity is machine-readable",
    hasOrg ? "An Organization-type entity is declared." : "No Organization or LocalBusiness entity found on this page.",
    hasOrg ? "Keep name, address, phone and profiles identical everywhere you are listed." : "Declare who you are (Organization or LocalBusiness) with your legal name, URL, logo, contact details and official profiles in sameAs. AI answers rely on consistent entity facts."));

  const hasOg = Boolean(page.ogTitle && page.ogImage);
  checks.push(check("facts", "open-graph", hasOg ? "pass" : "warn", hasOg ? 4 : page.ogTitle ? 2 : 0, 4,
    "Link previews (Open Graph)", hasOg ? "og:title and og:image found." : `Missing: ${[!page.ogTitle && "og:title", !page.ogImage && "og:image"].filter(Boolean).join(", ")}.`,
    hasOg ? "Nothing to fix." : "Add og:title, og:description and og:image so shared links (LinkedIn, WhatsApp, Slack) show a proper preview."));

  if (page.hreflangs.length) {
    const self = page.hreflangs.some((x) => { try { return new URL(x.href, url).href.replace(/\/$/, "") === url.href.replace(/\/$/, ""); } catch { return false; } });
    checks.push(check("facts", "hreflang", self ? "pass" : "warn", 0, 0, "Language/region alternates (hreflang)",
      `${page.hreflangs.length} alternate(s) declared${self ? ", including this page." : "; this page does not reference itself."}`,
      self ? "Make sure every alternate links back to all the others." : "Each page in an hreflang set must list itself and every alternate."));
  }

  // --- Speed & security (15) ---
  const https = url.protocol === "https:";
  checks.push(check("speed", "https", https ? "pass" : "fail", https ? 4 : 0, 4, "HTTPS",
    https ? "The final page is served over HTTPS with a valid certificate." : "The final page is served over plain HTTP.",
    https ? "Nothing to fix." : "Serve every page over HTTPS and redirect HTTP to HTTPS."));
  const hsts = Boolean(h["strict-transport-security"]);
  checks.push(check("speed", "hsts", hsts ? "pass" : "warn", hsts ? 2 : 0, 2, "HSTS header",
    hsts ? "Strict-Transport-Security is set." : "No Strict-Transport-Security header.",
    hsts ? "Nothing to fix." : "Add Strict-Transport-Security so browsers always use HTTPS."));
  const nosniff = /nosniff/i.test(h["x-content-type-options"] || "");
  const framing = Boolean(h["x-frame-options"]) || /frame-ancestors/i.test(h["content-security-policy"] || "");
  checks.push(check("speed", "headers", nosniff && framing ? "pass" : "warn", (nosniff ? 1 : 0) + (framing ? 1 : 0), 2, "Basic security headers",
    `X-Content-Type-Options: ${nosniff ? "set" : "missing"}; clickjacking protection (X-Frame-Options or CSP frame-ancestors): ${framing ? "set" : "missing"}.`,
    nosniff && framing ? "Nothing to fix." : "Add X-Content-Type-Options: nosniff and X-Frame-Options (or a CSP frame-ancestors rule)."));
  const ttfbLevel = ttfbMs == null ? "warn" : ttfbMs <= 800 ? "pass" : ttfbMs <= 1800 ? "warn" : "fail";
  checks.push(check("speed", "ttfb", ttfbLevel, ttfbLevel === "pass" ? 4 : ttfbLevel === "warn" ? 2 : 0, 4, "Server response time",
    ttfbMs == null ? "Not measured." : `${ttfbMs} ms to first byte, measured once from our server. Your visitors' times depend on where they are.`,
    ttfbLevel === "pass" ? "Measure from several regions (and with real-user Core Web Vitals) before concluding speed is fine everywhere." : "Cache pages at the edge with a CDN, reduce server work before the first byte, and check real-user data in Google Search Console's Core Web Vitals report."));
  const kb = Math.round(bytes / 1024);
  const sizeLevel = kb <= 500 ? "pass" : kb <= 1200 ? "warn" : "fail";
  checks.push(check("speed", "html-size", sizeLevel, sizeLevel === "pass" ? 3 : sizeLevel === "warn" ? 1 : 0, 3, "HTML size",
    `${kb} KB of HTML${input.truncated ? " (capped; the page is larger)" : ""}. Images and scripts are not included.`,
    sizeLevel === "pass" ? "Nothing to fix." : "Reduce inline scripts, data and markup in the HTML. Large documents slow the first render, especially on mobile."));

  // --- Contact (10) ---
  const paths = [page.hasForm && "form", page.hasMailto && "email link", page.hasTel && "phone link", page.hasWhatsApp && "WhatsApp link", page.hasContactLink && "contact/booking page link"].filter(Boolean);
  const cLevel = paths.length >= 2 ? "pass" : paths.length === 1 ? "warn" : "fail";
  checks.push(check("contact", "contact-paths", cLevel, paths.length >= 2 ? 10 : paths.length === 1 ? 6 : 0, 10, "Clear ways to contact you",
    paths.length ? `Found: ${paths.join(", ")}.` : "No form, email, phone, WhatsApp or contact-page link found in the HTML.",
    cLevel === "pass" ? "Make sure international visitors can see your working hours and time zone near these options." : "Add at least two visible ways to reach you (for example a form plus email or WhatsApp), and state your hours and time zone."));

  if (page.imgCount) {
    checks.push(check("contact", "img-alt", page.imgMissingAlt ? "warn" : "pass", 0, 0, "Image alt text",
      `${page.imgMissingAlt} of ${page.imgCount} images have no alt attribute.`,
      page.imgMissingAlt ? "Add descriptive alt text (or alt=\"\" for decorative images). It helps accessibility and image search." : "Nothing to fix."));
  }

  const categories = CATEGORIES.map((c) => {
    const items = checks.filter((x) => x.category === c.id);
    return { ...c, score: items.reduce((s, x) => s + x.points, 0) };
  });
  const rawScore = categories.reduce((s, c) => s + c.score, 0);
  // A page that can't be found shouldn't look healthy, however good the rest is.
  const capReason = !ok
    ? "the page does not load successfully"
    : noindex
      ? "the page tells search engines not to index it"
      : robotsUnreachable || blocked.length === botRows.length
        ? "no search crawler is allowed to read it"
        : null;
  const score = capReason ? Math.min(rawScore, 40) : rawScore;
  const order = { fail: 0, warn: 1, pass: 2, info: 3 };
  // Anything that stops the page being found at all comes first, whatever its points.
  const blockers = ["status", "search-crawlers", "indexable", "canonical"];
  const rank = (x) => (blockers.includes(x.id) && x.level === "fail" ? 0 : 1);
  const priorities = checks
    .filter((x) => x.level === "fail" || x.level === "warn")
    .sort((a, b) => rank(a) - rank(b) || order[a.level] - order[b.level] || (b.max - b.points) - (a.max - a.points))
    .slice(0, 5)
    .map((x) => x.id);

  return {
    url: url.href,
    checkedAt: new Date().toISOString(),
    score,
    capped: capReason ? `Score capped at 40 because ${capReason}. Fix this first; the other results only matter once the page can be found.` : null,
    grade:score >= 85 ? "Strong" : score >= 65 ? "Good, with gaps" : score >= 45 ? "Needs work" : "At risk",
    categories,
    checks,
    priorities,
    bots: botRows.map(({ ua, who, allowed }) => ({ ua, who, allowed })),
    limits: [
      "One page was checked, as delivered before JavaScript runs. Content added by JavaScript is not seen here, and may not be seen by some crawlers either.",
      "Response time was measured once, from one server location.",
      "This is not a full SEO audit and makes no estimate of traffic or revenue.",
    ],
  };
}
