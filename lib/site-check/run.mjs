import { safeFetch, normaliseTarget, CheckError } from "./fetcher.mjs";
import { analyze } from "./analyze.mjs";

async function optional(url, opts) {
  try {
    const r = await safeFetch(url, opts);
    // Only trust same-host results for site-level files.
    if (new URL(r.finalUrl).hostname !== new URL(url).hostname) return { status: 0, body: "", url: r.finalUrl };
    return { status: r.status, body: r.body, url: r.finalUrl };
  } catch {
    return { status: 0, body: "", url };
  }
}

export async function runCheck(rawUrl) {
  const target = normaliseTarget(rawUrl);
  const page = await safeFetch(target, { maxBytes: 1_500_000, timeoutMs: 9000 });
  const ctype = String(page.headers["content-type"] || "");
  if (page.status < 400 && ctype && !/html/i.test(ctype)) {
    throw new CheckError("That address returned a file, not a web page. Enter the page URL instead.", 422, "NOT_HTML");
  }
  const origin = new URL(page.finalUrl).origin;
  const small = { maxBytes: 300_000, timeoutMs: 6000, accept: "text/plain,application/xml,text/xml;q=0.9,*/*;q=0.5" };
  const [robots, llms] = await Promise.all([optional(`${origin}/robots.txt`, small), optional(`${origin}/llms.txt`, small)]);

  let sitemapUrl = `${origin}/sitemap.xml`;
  const declared = robots.status === 200 && robots.body.match(/^\s*sitemap:\s*(\S+)/im);
  if (declared) {
    try {
      const u = new URL(declared[1], origin);
      if (u.origin === origin) sitemapUrl = u.href;
    } catch {}
  }
  const sitemap = await optional(sitemapUrl, small);

  return analyze({
    finalUrl: page.finalUrl,
    status: page.status,
    headers: page.headers,
    html: page.body,
    bytes: page.bytes,
    truncated: page.truncated,
    ttfbMs: page.ttfbMs,
    chain: page.chain,
    robots,
    llms,
    sitemap,
  });
}
