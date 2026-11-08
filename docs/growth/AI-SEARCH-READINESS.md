# AI Search Readiness Check: product, keyword strategy and user journey

Released 8 November 2026. Page: `/tools/ai-search-readiness`. API: `POST /api/site-check`.

This replaces the `r_model` branch's "autonomous revenue machine" (see "What changed from r_model" below). The useful idea, a technical and AI-search diagnostic, is kept as an opt-in, self-serve, free tool. The outbound parts are not.

## 1. What the tool does

A visitor enters a page on a site they own or manage, confirms that they do, and gets:

- **A score out of 100** from a fixed, published rubric across five areas: AI search access (30), search essentials (30), machine-readable facts (15), speed and security (15), and ways to contact you (10). The score is capped at 40 if the page doesn't load, is noindexed, or blocks every search crawler.
- **"Fix these first"**: up to five prioritised fixes. Anything that stops the page being found at all (crawler blocks, noindex, broken canonical, failed load) always comes first.
- **A crawler table**: whether robots.txt allows Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot and Claude-SearchBot. Training crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot) are reported for information only and never scored, because blocking them is a legitimate choice.
- **Every finding with what was found, why it matters and what to do.**
- **A Markdown download and print/PDF**, so the report can go to the visitor's developer.
- **An optional "Send summary on WhatsApp"** to Scriza. The visitor reviews the prefilled message and chooses whether to send it.

Honesty rules built into the code and tested:

- No revenue, traffic or "leakage" estimates. One page load cannot measure them (a test fails if money appears in a report).
- Response time is labelled as measured once, from one server location.
- The limits are shown in every report: one page, HTML before JavaScript, not a full SEO audit.
- llms.txt is described as optional, with no confirmed ranking effect.

Safety:

- The fetcher blocks private, reserved and cloud-metadata addresses for every DNS answer and every redirect, and pins the connection to the checked address (no DNS rebinding).
- TLS certificates are verified. Responses are capped in time (≈9 s) and size (1.5 MB page, 300 KB for robots.txt, llms.txt and the sitemap).
- Only same-origin POSTs are accepted, with explicit ownership confirmation and per-IP rate limits (3/minute, 15/hour, best-effort per instance).
- Nothing is stored: no URLs, reports or contact details.

## 2. What changed from r_model

| r_model | Now |
| :--- | :--- |
| `lead_hunter.py` / `cron_hunter.py` scanned other companies' sites and generated cold email and WhatsApp pitches | Removed. Visitors check their own sites by choice; no outreach is generated or sent. Unsolicited outreach risks anti-spam and privacy law (CAN-SPAM, UK PECR, GDPR, India DPDP) and WhatsApp Business policy. |
| Wrong CIN `U72900RJ2021PTC076840` and phone `+91 80058 84894` | Company facts come only from `lib/site.js` (CIN U74999RJ2022PTC082624, +91 91191 12999). |
| "₹X/month silent revenue leakage" from a formula | Removed. No money or traffic estimates. |
| "Resolve 100% of these bottlenecks in 7 days" | Removed. Fixes are quoted per milestone, in the visitor's currency, after a free call. |
| Fixed INR/USD tiers ($39–$1,499) | Not published. The site's pricing statement stays "quoted per milestone in your currency". |
| Report links on scriza.in | The tool lives on scrizaone.com. |
| `httpx(verify=False)`: TLS checks disabled | Certificates always verified. |
| robots.txt regex matched across groups | RFC 9309 group and longest-match parsing, unit-tested. |
| Separate Python/Docker service | Runs inside the existing Next.js app on Vercel; no extra service to host. |

The `r_model` branch is not merged. Recommend deleting it once this release is confirmed. It hasn't been deleted automatically.

## 3. Keyword strategy

**Demand data status:** no search volumes are stated. The Ahrefs key available returns "Insufficient plan", and this environment cannot query Keyword Planner. Every row below is "Unvalidated"; validate in Google Ads Keyword Planner (per country), Bing Webmaster Tools keyword research and, after launch, Search Console queries for this URL.

**Why this tool fits:** queries about whether AI assistants can see a site are new and lightly served by neutral tools. Most results are agency landing pages or opinion posts. A working tool with a transparent rubric is linkable and citable, and it leads naturally into Scriza's organic-growth and engineering services.

### Cluster A: tool intent (target: `/tools/ai-search-readiness`)

| Primary / supporting queries | Intent | Notes |
| :--- | :--- | :--- |
| ai search readiness checker; ai visibility checker; ai seo checker; website ai readiness test | Tool / transactional | Title and H1 target "AI search" + "checker". |
| check if chatgpt can crawl my site; is my website visible to chatgpt; chatgpt crawler checker | Tool / problem | Answered by the crawler table and an FAQ. |
| robots.txt ai crawler checker; ai bot blocker check; is my site blocking gptbot | Tool / technical | Crawler table; training-vs-search distinction is the differentiator. |
| llms.txt checker; llms.txt validator | Tool / technical | Checks presence; describes llms.txt honestly as optional. |
| geo audit tool; generative engine optimization checker; aeo checker | Tool / emerging | Use the terms in copy and FAQ once; don't stuff them. |

### Cluster B: informational, answered on the page now (FAQ + FAQPage schema)

- how do I check if ChatGPT can crawl my website
- should I block GPTBot / ClaudeBot
- does llms.txt help AI search
- can AI tools see my site

### Cluster C: supporting guides to publish next (target: `/resources/...`, linking to the tool)

1. "OAI-SearchBot, PerplexityBot, Claude-SearchBot, GPTBot: which AI crawlers to allow, and which to block." Queries: oai-searchbot robots.txt, perplexitybot user agent, claude-searchbot, gptbot vs oai-searchbot.
2. "llms.txt: what it is, what it does and what it doesn't." Queries: what is llms.txt, does llms.txt work, llms.txt example.
3. "The homepage-canonical bug that hides your service pages." Queries: canonical points to homepage, rel canonical wrong page.
4. "How to appear in Google AI Overviews and ChatGPT search: technical checklist." Queries: how to appear in ai overviews, how to get my website on chatgpt search.

Each guide must use primary sources (OpenAI, Anthropic, Perplexity and Google crawler documentation), dated, and link to the tool. One guide per cycle; review against current vendor documentation before publishing.

### Cluster D: commercial follow-on (target: existing service pages)

- technical seo audit services; ai search optimization services; generative engine optimization services → `/services/organic-growth`
- the fixes themselves (schema, canonicals, speed, CDN) → `/services/custom-software`

No country- or city-modified tool pages. One global tool serves every market. Regional pages link to it.

### On-page implementation (done in this release)

- Title: "Free AI Search Readiness Checker: Can ChatGPT, Perplexity & Google Find Your Site?" Meta description names the crawlers and checks.
- H1: "Can AI search find your website?"
- Sections: tool, how to use it, how the score works (full rubric), questions (7 FAQs).
- Schema: WebApplication (free offer, publisher = the shared Scriza Organization @id) plus FAQPage.
- Linked from the header mobile menu and the footer; included in sitemap.xml and llms.txt.

## 4. How users use it (journey)

1. **Discover:** search ("check if chatgpt can crawl my site"), an AI answer citing the page, a guide in Cluster C, or a link in the footer of any ScrizaOne page.
2. **Run:** enter a page, tick the ownership box, run. About 5–10 seconds; no signup.
3. **Understand:** the score and grade, the five-area bars, then "Fix these first". Blockers always lead.
4. **Act:** download the Markdown report or save as PDF and hand it to their developer; fix; re-run; check other key pages.
5. **Ask for help (optional):** "Send summary on WhatsApp" pre-fills the URL, score and top fixes. The visitor reviews and sends; the team replies within 24 hours (Wednesday and Friday enquiries may take longer) and quotes per milestone in their currency.

## 5. Measurement

Consent-gated GA4 events (no URLs or free text are sent): `site_check_run`, `site_check_completed`, `site_check_report_exported`, `site_check_help_requested`.

| KPI | Source |
| :--- | :--- |
| Completion rate (completed ÷ run) | GA4 events |
| Export rate (exported ÷ completed) | GA4 events |
| Help requests and resulting qualified enquiries | GA4 event + WhatsApp/CRM |
| Impressions, clicks and queries for the tool URL by country | Search Console / Bing Webmaster Tools |
| Referring domains linking to the tool | Search Console links report |

Review monthly. Don't report rankings, traffic or enquiries as achieved until the data exists.

## 6. Legitimate distribution (no cold outreach)

- Link the tool from the Cluster C guides and relevant journal notes.
- Submit to free-tool roundups and directories only where they accept submissions.
- Publish an engineering write-up on dev.to or Hashnode about building an SSRF-safe URL checker (useful on its own, and it links back).
- Answer genuine questions in communities where tool links are allowed, disclosing affiliation.

## 7. Limits and next steps

- Live verification of the API against public sites must happen on the Vercel deployment. The build environment had no external DNS.
- Rate limits are per serverless instance. If abuse appears, add a Vercel WAF rule for `/api/site-check`.
- Possible later additions: checking several pages, rendered-DOM (JavaScript) mode, Core Web Vitals via the CrUX API.
