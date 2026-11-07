"""
Scriza Autonomous Revenue Machine (S-ARM)
Auditor Engine - Real-time technical, SEO, AEO (AI Search), Security & Conversion Diagnostics.
"""

import re
import time
import urllib.parse
from typing import Dict, Any, List, Optional
import httpx
from bs4 import BeautifulSoup

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

AI_BOTS = [
    "GPTBot",
    "PerplexityBot",
    "ClaudeBot",
    "Google-Extended",
    "Applebot-Extended",
    "OAI-SearchBot"
]

def normalize_url(raw_url: str) -> str:
    url = raw_url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url
    return url

def extract_domain(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc or parsed.path
    if domain.startswith("www."):
        domain = domain[4:]
    return domain.split(":")[0]

async def audit_website(target_url: str) -> Dict[str, Any]:
    url = normalize_url(target_url)
    domain = extract_domain(url)
    
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
    }
    
    start_time = time.time()
    html_content = ""
    status_code = 0
    resp_headers = {}
    ttfb_ms = 0.0
    page_size_kb = 0.0
    ssl_valid = url.startswith("https://")
    final_url = url
    
    # 1. Fetch main document
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True, verify=False) as client:
        try:
            req_start = time.time()
            resp = await client.get(url, headers=headers)
            ttfb_ms = round((time.time() - req_start) * 1000, 1)
            status_code = resp.status_code
            resp_headers = dict(resp.headers)
            html_content = resp.text
            final_url = str(resp.url)
            page_size_kb = round(len(resp.content) / 1024, 2)
            ssl_valid = final_url.startswith("https://")
        except Exception as e:
            ttfb_ms = 9999.0
            status_code = 500
            html_content = f"<html><body>Failed to fetch: {str(e)}</body></html>"

    # 2. Fetch robots.txt & llms.txt concurrently
    robots_text = ""
    has_llms_txt = False
    ai_bots_blocked = []
    ai_bots_allowed = []

    parsed_final = urllib.parse.urlparse(final_url)
    base_root = f"{parsed_final.scheme}://{parsed_final.netloc}"

    async with httpx.AsyncClient(timeout=8.0, follow_redirects=True, verify=False) as client:
        # Check robots.txt
        try:
            robots_resp = await client.get(f"{base_root}/robots.txt", headers=headers)
            if robots_resp.status_code == 200:
                robots_text = robots_resp.text
                for bot in AI_BOTS:
                    if re.search(rf"User-agent:\s*{bot}.*?Disallow:\s*/", robots_text, re.IGNORECASE | re.DOTALL):
                        ai_bots_blocked.append(bot)
                    else:
                        ai_bots_allowed.append(bot)
            else:
                ai_bots_allowed = list(AI_BOTS)
        except Exception:
            ai_bots_allowed = list(AI_BOTS)
            
        # Check llms.txt (2026 Generative Engine Standard)
        try:
            llms_resp = await client.get(f"{base_root}/llms.txt", headers=headers)
            if llms_resp.status_code == 200 and len(llms_resp.text.strip()) > 20:
                has_llms_txt = True
        except Exception:
            has_llms_txt = False

    # 3. Parse HTML DOM
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Title analysis
    title_tag = soup.find("title")
    title_text = title_tag.get_text().strip() if title_tag else ""
    title_length = len(title_text)
    duplicate_title = False
    if title_text:
        # Check if brand is repeated (like "Scriza | Scriza" or "Brand - Brand")
        parts = [p.strip().lower() for p in re.split(r"[|\-–—:]", title_text) if p.strip()]
        if len(parts) != len(set(parts)):
            duplicate_title = True
    
    # Meta Description
    meta_desc_tag = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    meta_desc = meta_desc_tag.get("content", "").strip() if meta_desc_tag else ""
    
    # Canonical Tag
    canonical_tag = soup.find("link", attrs={"rel": "canonical"})
    canonical_href = canonical_tag.get("href", "").strip() if canonical_tag else ""
    canonical_status = "OK"
    if not canonical_href:
        canonical_status = "MISSING"
    else:
        # Check if canonical mismatches or forces root on subpages
        parsed_canon = urllib.parse.urlparse(canonical_href)
        if parsed_final.path and parsed_final.path != "/" and parsed_canon.path in ["", "/"]:
            canonical_status = "CANONICAL_POINTS_TO_ROOT_BUG"
    
    # Viewport Tag
    viewport_tag = soup.find("meta", attrs={"name": re.compile(r"^viewport$", re.I)})
    has_viewport = viewport_tag is not None
    
    # Schema / JSON-LD
    json_lds = soup.find_all("script", attrs={"type": "application/ld+json"})
    has_schema = len(json_lds) > 0
    schema_types = []
    for s in json_lds:
        try:
            content = s.string or ""
            if '"@type"' in content:
                matches = re.findall(r'"@type"\s*:\s*"([^"]+)"', content)
                schema_types.extend(matches)
        except Exception:
            pass

    # OpenGraph & Social
    og_title = soup.find("meta", attrs={"property": "og:title"})
    og_image = soup.find("meta", attrs={"property": "og:image"})
    has_og = bool(og_title and og_image)
    
    # Headings
    h1s = soup.find_all("h1")
    h2s = soup.find_all("h2")
    h1_count = len(h1s)
    h2_count = len(h2s)
    
    # Asset counts & hygiene
    scripts = soup.find_all("script")
    script_count = len(scripts)
    stylesheets = soup.find_all("link", attrs={"rel": "stylesheet"})
    css_count = len(stylesheets)
    
    images = soup.find_all("img")
    img_count = len(images)
    missing_alt = sum(1 for img in images if not img.get("alt") or not img.get("alt").strip())
    
    # Security Headers
    hsts = "strict-transport-security" in resp_headers
    csp = "content-security-policy" in resp_headers
    x_frame = "x-frame-options" in resp_headers
    x_content_type = "x-content-type-options" in resp_headers
    
    # Conversion Triggers
    page_text = soup.get_text()
    has_phone = bool(re.search(r"(\+91[\-\s]?)?[6789]\d{9}|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|tel:", html_content))
    has_whatsapp = bool(re.search(r"wa\.me|api\.whatsapp\.com|whatsapp", html_content, re.I))
    forms = soup.find_all("form")
    form_count = len(forms)

    # 4. Scoring Algorithm (100 Point Model)
    # Category 1: Performance & Speed (25 pts)
    perf_pts = 25
    if ttfb_ms > 1200: perf_pts -= 10
    elif ttfb_ms > 600: perf_pts -= 5
    if page_size_kb > 3500: perf_pts -= 5
    elif page_size_kb > 1500: perf_pts -= 3
    if script_count > 30: perf_pts -= 5
    elif script_count > 15: perf_pts -= 2
    if css_count > 10: perf_pts -= 3
    perf_score = max(5, perf_pts)
    
    # Category 2: Technical SEO (25 pts)
    seo_pts = 25
    if not title_text or title_length < 10: seo_pts -= 7
    if duplicate_title: seo_pts -= 4
    if not meta_desc or len(meta_desc) < 30: seo_pts -= 5
    if canonical_status == "MISSING": seo_pts -= 4
    elif canonical_status == "CANONICAL_POINTS_TO_ROOT_BUG": seo_pts -= 8
    if not has_viewport: seo_pts -= 5
    if h1_count == 0 or h1_count > 2: seo_pts -= 3
    if missing_alt > 3: seo_pts -= 3
    seo_score = max(5, seo_pts)

    # Category 3: AEO & AI Search Readiness (20 pts)
    aeo_pts = 20
    if not has_llms_txt: aeo_pts -= 6
    if ai_bots_blocked: aeo_pts -= (len(ai_bots_blocked) * 3)
    if not has_schema: aeo_pts -= 5
    if not has_og: aeo_pts -= 3
    aeo_score = max(3, aeo_pts)

    # Category 4: Security & Hardening (15 pts)
    sec_pts = 15
    if not ssl_valid: sec_pts -= 8
    if not hsts: sec_pts -= 3
    if not x_frame: sec_pts -= 2
    if not x_content_type: sec_pts -= 2
    sec_score = max(3, sec_pts)

    # Category 5: Conversion Architecture (15 pts)
    ux_pts = 15
    if not has_whatsapp: ux_pts -= 5
    if not has_phone: ux_pts -= 4
    if form_count == 0: ux_pts -= 4
    ux_score = max(3, ux_pts)

    overall_score = perf_score + seo_score + aeo_score + sec_score + ux_score
    overall_score = min(100, max(12, overall_score))

    if overall_score >= 90: grade = "A+"
    elif overall_score >= 80: grade = "A"
    elif overall_score >= 70: grade = "B"
    elif overall_score >= 60: grade = "C"
    elif overall_score >= 50: grade = "D"
    else: grade = "F"

    # 5. Extract Concrete Flaws
    flaws = []
    if ttfb_ms > 800:
        flaws.append({
            "category": "Performance",
            "severity": "CRITICAL" if ttfb_ms > 1500 else "HIGH",
            "title": f"Sluggish Server Response (TTFB: {ttfb_ms}ms)",
            "impact": "Visitors bounce within 3 seconds; Google de-prioritizes slow mobile experiences.",
            "fix": "Deploy Edge caching (Cloudflare/Vercel) and migrate to SSR/Next.js/FastAPI decoupled backend."
        })
    if canonical_status == "CANONICAL_POINTS_TO_ROOT_BUG":
        flaws.append({
            "category": "SEO",
            "severity": "CRITICAL",
            "title": "Canonical Meta Inheritance Cannibalization",
            "impact": "Inner service/blog pages declare canonical URL as homepage, causing search engines to de-index ranking content.",
            "fix": "Enforce dynamic self-referencing canonical tags across all route templates."
        })
    elif canonical_status == "MISSING":
        flaws.append({
            "category": "SEO",
            "severity": "HIGH",
            "title": "Missing Canonical URL Declaration",
            "impact": "Duplicate content penalties across HTTP/HTTPS and trailing slash variations.",
            "fix": "Add <link rel='canonical' href='...' /> to all templates."
        })
    if not has_llms_txt:
        flaws.append({
            "category": "AEO / AI Search",
            "severity": "HIGH",
            "title": "No /llms.txt AI Citation Manifest",
            "impact": "Perplexity, ChatGPT Search, and Claude cannot ingest your company's official facts, pricing, or credentials for AI search summaries.",
            "fix": "Publish /llms.txt with structured markdown facts, case studies, and corporate credentials."
        })
    if ai_bots_blocked:
        flaws.append({
            "category": "AEO / AI Search",
            "severity": "CRITICAL",
            "title": f"AI Search Bots Blocked: {', '.join(ai_bots_blocked)}",
            "impact": "Competitors will be recommended over you in AI Search (SearchGPT, Perplexity, Apple Intelligence).",
            "fix": "Update robots.txt to explicitly grant crawl access to commercial AI Search agents."
        })
    if not has_schema:
        flaws.append({
            "category": "SEO / AEO",
            "severity": "HIGH",
            "title": "Missing JSON-LD Structured Data Schema",
            "impact": "Zero rich snippets, missing FAQ accordions in Google SERP, and zero machine-readable entity graph.",
            "fix": "Embed schema.org JSON-LD (Organization, LocalBusiness, FAQPage, Service)."
        })
    if not hsts or not x_frame:
        flaws.append({
            "category": "Security",
            "severity": "MEDIUM",
            "title": "Missing Production Security Headers (HSTS / X-Frame-Options)",
            "impact": "Vulnerable to clickjacking and SSL strip downgrade attacks in corporate networks.",
            "fix": "Inject Strict-Transport-Security, X-Frame-Options: SAMEORIGIN, and CSP via Nginx or reverse proxy."
        })
    if not has_whatsapp:
        flaws.append({
            "category": "Conversion",
            "severity": "HIGH",
            "title": "No Instant WhatsApp Engagement Mechanism",
            "impact": "Up to 68% of mobile Indian and GCC buyers drop off without contacting via legacy web forms.",
            "fix": "Deploy an automated WhatsApp click-to-chat bot and lead qualification flow."
        })
    if duplicate_title:
        flaws.append({
            "category": "SEO",
            "severity": "MEDIUM",
            "title": "Duplicate Brand Concatenation in Title Tag",
            "impact": "SERP title clipping degrades click-through rate (CTR) on commercial search queries.",
            "fix": "Clean metadata template inheritance to remove repetitive brand suffixes."
        })
    if missing_alt > 0:
        flaws.append({
            "category": "SEO & A11y",
            "severity": "LOW",
            "title": f"{missing_alt} Images Missing Descriptive ALT Tags",
            "impact": "Degrades accessibility compliance and loses Google Image Search referral traffic.",
            "fix": "Inject descriptive alt text with commercial keyword context."
        })

    # Opportunities (High-ROI Value Drivers)
    opportunities = [
        {
            "title": "AI Generative Engine Optimization (AEO/GEO)",
            "potential": "High",
            "description": "Structure your services for Perplexity and SearchGPT citations to capture non-brand enterprise buyers."
        },
        {
            "title": "Sub-200ms Headless Architecture",
            "potential": "High",
            "description": "Migrate core pages to Next.js / FastAPI edge deployment to eliminate bounce rate and boost Google rankings."
        },
        {
            "title": "Autonomous 24/7 WhatsApp Lead Qualifier",
            "potential": "Critical",
            "description": "Convert night-time and GCC/UAE visitors instantly into qualified leads and deposits without human lag."
        }
    ]

    # Revenue Leak Estimation Formula
    # Base estimated monthly traffic: 2,500 - 15,000 visitors
    # High-intent lead value in tech/services: ₹5,000 to ₹50,000
    # Penalty factor derived from score
    penalty = (100 - overall_score) / 100.0
    estimated_monthly_leak_inr = int(round(penalty * 185000 / 1000) * 1000)
    if estimated_monthly_leak_inr < 25000:
        estimated_monthly_leak_inr = 35000

    return {
        "domain": domain,
        "target_url": final_url,
        "status_code": status_code,
        "overall_score": overall_score,
        "grade": grade,
        "perf_score": perf_score,
        "seo_score": seo_score,
        "aeo_score": aeo_score,
        "sec_score": sec_score,
        "ux_score": ux_score,
        "ttfb_ms": ttfb_ms,
        "page_size_kb": page_size_kb,
        "ssl_valid": ssl_valid,
        "canonical_status": canonical_status,
        "has_llms_txt": has_llms_txt,
        "ai_bots_allowed": ", ".join(ai_bots_allowed),
        "ai_bots_blocked": ", ".join(ai_bots_blocked),
        "flaws": flaws,
        "opportunities": opportunities,
        "revenue_leak_monthly_inr": estimated_monthly_leak_inr,
        "raw": {
            "title": title_text,
            "meta_description": meta_desc,
            "h1_count": h1_count,
            "h2_count": h2_count,
            "script_count": script_count,
            "css_count": css_count,
            "img_count": img_count,
            "missing_alt": missing_alt,
            "has_whatsapp": has_whatsapp,
            "has_phone": has_phone,
            "has_schema": has_schema,
            "schema_types": schema_types
        }
    }

if __name__ == "__main__":
    import asyncio
    async def test():
        res = await audit_website("https://scriza.in")
        print("Audit Result for scriza.in:")
        print(f"Score: {res['overall_score']} ({res['grade']})")
        print(f"TTFB: {res['ttfb_ms']}ms | Size: {res['page_size_kb']}KB")
        print(f"AEO Bots Allowed: {res['ai_bots_allowed']}")
        print(f"Flaws ({len(res['flaws'])}):")
        for f in res['flaws']:
            print(f" - [{f['severity']}] {f['title']}")
        print(f"Estimated Monthly Revenue Leak: ₹{res['revenue_leak_monthly_inr']:,}")
    asyncio.run(test())
