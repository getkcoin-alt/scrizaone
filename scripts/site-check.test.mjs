import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { isPublicAddress, normaliseTarget, safeFetch, CheckError } from "../lib/site-check/fetcher.mjs";
import { parseRobots, isAllowed, analyze, extractPage } from "../lib/site-check/analyze.mjs";

test("private, reserved and metadata addresses are never public", () => {
  for (const ip of ["127.0.0.1", "10.1.2.3", "172.16.0.1", "172.31.255.255", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "224.0.0.1", "255.255.255.255", "198.18.0.1", "::1", "::", "fc00::1", "fd12::1", "fe80::1", "::ffff:127.0.0.1", "::ffff:10.0.0.1", "64:ff9b::a00:1", "2002:a00:1::", "2001:db8::1", "ff02::1"]) {
    assert.equal(isPublicAddress(ip), false, ip);
  }
  for (const ip of ["8.8.8.8", "1.1.1.1", "172.32.0.1", "2606:4700:4700::1111", "::ffff:8.8.8.8"]) {
    assert.equal(isPublicAddress(ip), true, ip);
  }
});

test("visitor input is normalised and unsafe targets are refused", () => {
  assert.equal(normaliseTarget("example.com").href, "https://example.com/");
  assert.equal(normaliseTarget("http://example.com/a#x").href, "http://example.com/a");
  for (const bad of ["", "ftp://example.com", "file:///etc/passwd", "http://localhost", "http://127.0.0.1", "http://[::1]/", "http://169.254.169.254/latest", "https://user:pw@example.com", "https://example.com:8443", "http://intranet", "http://server.internal"]) {
    assert.throws(() => normaliseTarget(bad), CheckError, bad);
  }
});

test("fetcher refuses to connect to a server on a private address", async () => {
  const server = http.createServer((_, res) => res.end("secret"));
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  await assert.rejects(safeFetch(new URL(`http://127.0.0.1:${port}/`)), CheckError);
  await assert.rejects(safeFetch(new URL("http://127.0.0.1/")), CheckError);
  server.close();
});

test("robots.txt: specific groups override *, longest rule wins, Allow wins ties", () => {
  const g = parseRobots(`
User-agent: *
Disallow: /private
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: PerplexityBot
User-agent: OAI-SearchBot
Disallow: /
Allow: /blog/
`);
  assert.equal(isAllowed(g, "Googlebot", "/"), true);
  assert.equal(isAllowed(g, "Googlebot", "/private/x"), false);
  assert.equal(isAllowed(g, "GPTBot", "/"), false);
  assert.equal(isAllowed(g, "OAI-SearchBot", "/"), false);
  assert.equal(isAllowed(g, "OAI-SearchBot", "/blog/post"), true);
  assert.equal(isAllowed(g, "PerplexityBot", "/blog/"), true);
  assert.equal(isAllowed(parseRobots(""), "Bingbot", "/"), true);
  assert.equal(isAllowed(parseRobots("User-agent: *\nDisallow:"), "Bingbot", "/"), true);
  assert.equal(isAllowed(parseRobots("User-agent: *\nDisallow: /*.pdf$"), "Bingbot", "/a.pdf"), false);
  assert.equal(isAllowed(parseRobots("User-agent: *\nDisallow: /*.pdf$"), "Bingbot", "/a.pdfx"), true);
});

const goodHtml = `<!doctype html><html lang="en"><head>
<title>Payment Integration Services | Acme Engineering</title>
<meta name="description" content="Acme builds payment integrations, reconciliation and billing systems for fintechs and merchants in the UK and Europe.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="https://acme.example.org/services/payments">
<meta property="og:title" content="Payment Integration Services"><meta property="og:image" content="https://acme.example.org/og.png">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"Acme"},{"@type":"Service","name":"Payments"}]}</script>
</head><body><h1>Payment integration</h1><form></form><a href="mailto:hi@acme.example.org">Email</a><img src="a.png" alt="Diagram"></body></html>`;

const base = {
  finalUrl: "https://acme.example.org/services/payments",
  status: 200,
  headers: { "strict-transport-security": "max-age=63072000", "x-content-type-options": "nosniff", "x-frame-options": "SAMEORIGIN", "content-type": "text/html" },
  bytes: 40_000,
  ttfbMs: 320,
  chain: [{ url: "https://acme.example.org/services/payments", status: 200 }],
  robots: { status: 200, body: "User-agent: *\nAllow: /\nUser-agent: GPTBot\nDisallow: /\nSitemap: https://acme.example.org/sitemap.xml" },
  llms: { status: 200, body: "# Acme\n> Acme builds payment integrations for fintechs and merchants." },
  sitemap: { status: 200, body: "<urlset></urlset>", url: "https://acme.example.org/sitemap.xml" },
};

test("a well-prepared page scores 100 and blocking a training crawler costs nothing", () => {
  const r = analyze({ ...base, html: goodHtml });
  assert.equal(r.score, 100, JSON.stringify(r.checks.filter((c) => c.points < c.max)));
  assert.equal(r.priorities.length, 0);
  assert.match(r.checks.find((c) => c.id === "training-crawlers").detail, /GPTBot/);
  assert.equal(r.categories.reduce((s, c) => s + c.max, 0), 100);
});

test("blocked AI search, noindex and a homepage canonical on an inner page are caught", () => {
  const html = goodHtml
    .replace('<link rel="canonical" href="https://acme.example.org/services/payments">', '<link rel="canonical" href="https://acme.example.org/">')
    .replace("<head>", '<head><meta name="robots" content="noindex">');
  const r = analyze({ ...base, html, robots: { status: 200, body: "User-agent: OAI-SearchBot\nDisallow: /\nUser-agent: PerplexityBot\nDisallow: /" } });
  const byId = Object.fromEntries(r.checks.map((c) => [c.id, c]));
  assert.equal(byId["search-crawlers"].level, "fail");
  assert.match(byId["search-crawlers"].detail, /OAI-SearchBot.*PerplexityBot/);
  assert.equal(byId.indexable.level, "fail");
  assert.equal(byId.canonical.level, "fail");
  assert.ok(r.score < 75);
  assert.ok(r.priorities.includes("indexable") && r.priorities.includes("canonical"));
});

test("unreachable robots.txt is treated as blocking, as search engines do", () => {
  const r = analyze({ ...base, html: goodHtml, robots: { status: 503, body: "" } });
  assert.equal(r.checks.find((c) => c.id === "search-crawlers").points, 0);
});

test("reports never contain money or traffic estimates", () => {
  const r = analyze({ ...base, html: "<html><body>hi</body></html>", robots: { status: 404, body: "" }, llms: { status: 404, body: "" }, sitemap: { status: 404, body: "" } });
  const text = JSON.stringify(r);
  assert.doesNotMatch(text, /₹|\$\d|revenue leak|lost revenue|per month/i);
  assert.ok(r.score >= 0 && r.score <= 100);
});

test("HTML extraction tolerates attribute order, quotes and scripts", () => {
  const p = extractPage(`<html LANG=en><head><META content='Hi there' NAME=description><title>A &amp; B</title></head><body><script>"<h1>"</script><h1 class=x>T</h1><a href="https://wa.me/1">wa</a><a href="tel:+1">t</a></body></html>`);
  assert.equal(p.description, "Hi there");
  assert.equal(p.title, "A & B");
  assert.equal(p.lang, "en");
  assert.equal(p.h1Count, 1);
  assert.equal(p.hasWhatsApp && p.hasTel, true);
});
