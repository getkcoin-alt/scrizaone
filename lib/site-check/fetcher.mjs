// Safe fetching for the public AI Search Readiness Check.
//
// The server fetches a URL typed by a visitor, so it must never become a proxy into
// private networks (SSRF). Every hop is checked:
// - only http/https on the default ports;
// - the hostname is resolved by our own lookup, every resolved address must be public,
//   and the connection is pinned to that checked address (no DNS-rebinding window);
// - redirects are followed manually (max 5) and each target is re-validated;
// - TLS certificates are always verified;
// - each response is capped in time and size.
import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import net from "node:net";

export const USER_AGENT = "ScrizaOneReadinessCheck/1.0 (+https://www.scrizaone.com/tools/ai-search-readiness)";
const MAX_REDIRECTS = 5;

export class CheckError extends Error {
  constructor(message, status = 400, code = "BAD_REQUEST") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function ipv4Parts(ip) {
  const p = ip.split(".").map(Number);
  return p.length === 4 && p.every((n) => Number.isInteger(n) && n >= 0 && n <= 255) ? p : null;
}

// True only for globally routable unicast addresses.
export function isPublicAddress(ip) {
  const family = net.isIP(ip);
  if (family === 4) {
    const [a, b, c] = ipv4Parts(ip);
    if (a === 0 || a === 10 || a === 127) return false; // "this" network, private, loopback
    if (a === 100 && b >= 64 && b <= 127) return false; // carrier-grade NAT
    if (a === 169 && b === 254) return false; // link-local (incl. cloud metadata)
    if (a === 172 && b >= 16 && b <= 31) return false; // private
    if (a === 192 && b === 168) return false; // private
    if (a === 192 && b === 0 && (c === 0 || c === 2)) return false; // IETF / TEST-NET-1
    if (a === 192 && b === 88 && c === 99) return false; // 6to4 relay anycast
    if (a === 198 && (b === 18 || b === 19)) return false; // benchmarking
    if (a === 198 && b === 51 && c === 100) return false; // TEST-NET-2
    if (a === 203 && b === 0 && c === 113) return false; // TEST-NET-3
    if (a >= 224) return false; // multicast, reserved, broadcast
    return true;
  }
  if (family === 6) {
    const v = ip.toLowerCase();
    if (v === "::" || v === "::1") return false;
    const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPublicAddress(mapped[1]);
    if (/^::ffff:/.test(v)) return false; // hex-form mapped addresses: refuse
    const first = parseInt(v.split(":")[0] || "0", 16);
    if ((first & 0xfe00) === 0xfc00) return false; // fc00::/7 unique local
    if ((first & 0xffc0) === 0xfe80) return false; // fe80::/10 link-local
    if ((first & 0xff00) === 0xff00) return false; // multicast
    if (v.startsWith("2001:db8:") || v.startsWith("2001:0db8:")) return false; // documentation
    if (v.startsWith("64:ff9b:")) return false; // NAT64 can reach IPv4 private space
    if (v.startsWith("2002:")) return false; // 6to4 can embed private IPv4
    if ((first & 0xe000) !== 0x2000) return false; // only 2000::/3 is global unicast
    return true;
  }
  return false;
}

// Normalise visitor input into a URL we are willing to fetch.
export function normaliseTarget(raw) {
  let text = String(raw || "").trim();
  if (!text || text.length > 2048) throw new CheckError("Enter a website address, for example example.com.");
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) text = "https://" + text;
  let url;
  try {
    url = new URL(text);
  } catch {
    throw new CheckError("That doesn't look like a website address.");
  }
  assertFetchable(url);
  url.hash = "";
  return url;
}

export function assertFetchable(url) {
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new CheckError("Only http and https websites can be checked.");
  if (url.username || url.password) throw new CheckError("Website addresses with login details can't be checked.");
  if (url.port && !((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80"))) {
    throw new CheckError("Only websites on the standard web ports can be checked.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (net.isIP(host)) {
    if (!isPublicAddress(host)) throw new CheckError("That address is private or reserved, so it can't be checked.");
    return;
  }
  if (!host.includes(".") || /\.(localhost|local|internal|intranet|lan|home|corp|test|invalid|example)$/.test(host) || host === "localhost") {
    throw new CheckError("Enter a public website address, for example example.com.");
  }
}

// DNS lookup used for the actual socket: rejects the connection if any resolved
// address is not public, and hands the socket only the checked address.
function safeLookup(hostname, options, callback) {
  dns.lookup(hostname, { all: true, verbatim: true }, (err, addresses) => {
    if (err) return callback(new CheckError("We couldn't find that website (DNS lookup failed).", 422, "DNS_FAILED"));
    const list = Array.isArray(addresses) ? addresses : [];
    if (!list.length || list.some((a) => !isPublicAddress(a.address))) {
      return callback(new CheckError("That website resolves to a private or reserved address, so it can't be checked.", 422, "PRIVATE_ADDRESS"));
    }
    const chosen = list.find((a) => a.family === 4) || list[0];
    if (options && options.all) return callback(null, [chosen]);
    callback(null, chosen.address, chosen.family);
  });
}

function requestOnce(url, { maxBytes, timeoutMs, accept }) {
  return new Promise((resolve, reject) => {
    const lib = url.protocol === "https:" ? https : http;
    const started = performance.now();
    let ttfbMs = null;
    const req = lib.request(
      url,
      {
        method: "GET",
        lookup: safeLookup,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: accept,
          "Accept-Language": "en",
          "Accept-Encoding": "identity",
        },
        timeout: timeoutMs,
        rejectUnauthorized: true,
      },
      (res) => {
        ttfbMs = Math.round(performance.now() - started);
        const chunks = [];
        let size = 0;
        let truncated = false;
        res.on("data", (chunk) => {
          if (truncated) return;
          size += chunk.length;
          if (size > maxBytes) {
            truncated = true;
            chunks.push(chunk.subarray(0, chunk.length - (size - maxBytes)));
            res.destroy();
            return;
          }
          chunks.push(chunk);
        });
        const done = () =>
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf8"),
            bytes: Math.min(size, maxBytes),
            truncated,
            ttfbMs,
            totalMs: Math.round(performance.now() - started),
          });
        res.on("end", done);
        res.on("close", done);
        res.on("error", () => (truncated ? done() : reject(new CheckError("The website closed the connection.", 422, "FETCH_FAILED"))));
      }
    );
    const wall = setTimeout(() => req.destroy(new CheckError("The website took too long to respond.", 422, "TIMEOUT")), timeoutMs);
    req.on("timeout", () => req.destroy(new CheckError("The website took too long to respond.", 422, "TIMEOUT")));
    req.on("error", (e) => {
      clearTimeout(wall);
      if (e instanceof CheckError) return reject(e);
      if (/certificate|SSL|TLS|CERT/i.test(e.code || e.message || "")) {
        return reject(new CheckError("The website's HTTPS certificate is not valid, so browsers would warn visitors too.", 422, "TLS_INVALID"));
      }
      reject(new CheckError("We couldn't connect to that website.", 422, "FETCH_FAILED"));
    });
    req.on("close", () => clearTimeout(wall));
    req.end();
  });
}

// Fetch with manual, re-validated redirects. Returns the final response plus the chain.
export async function safeFetch(startUrl, { maxBytes = 1_500_000, timeoutMs = 8000, accept = "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5" } = {}) {
  let url = new URL(startUrl);
  const chain = [];
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    assertFetchable(url);
    const res = await requestOnce(url, { maxBytes, timeoutMs, accept });
    chain.push({ url: url.toString(), status: res.status });
    const location = res.headers.location;
    if (res.status >= 300 && res.status < 400 && location) {
      try {
        url = new URL(location, url);
      } catch {
        throw new CheckError("The website redirected to an invalid address.", 422, "BAD_REDIRECT");
      }
      continue;
    }
    return { ...res, finalUrl: url.toString(), chain };
  }
  throw new CheckError("The website redirected too many times.", 422, "TOO_MANY_REDIRECTS");
}
