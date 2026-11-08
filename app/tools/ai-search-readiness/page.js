import Link from "next/link";
import Shell from "@/components/Shell";
import SiteCheck from "@/components/SiteCheck";
import { SITE_URL } from "@/lib/site";

const PATH = "/tools/ai-search-readiness";

export const metadata = {
  title: "Free AI Search Readiness Checker: Can ChatGPT, Perplexity & Google Find Your Site?",
  description:
    "Check whether ChatGPT search, Perplexity, Claude, Google and Bing can crawl and understand your website. Free check for robots.txt, llms.txt, schema, canonicals and speed, with fixes. No signup.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Free AI Search Readiness Checker",
    description: "See which search and AI crawlers can read your site, and what to fix first. Free, no signup.",
    url: PATH,
  },
};

const faqs = [
  {
    q: "What does the AI Search Readiness Check test?",
    a: "It loads one page of your site plus your robots.txt, llms.txt and XML sitemap, then checks 20 things across five areas: AI search access (which crawlers robots.txt allows, noindex, llms.txt), search essentials (status, title, description, canonical, H1, language, sitemap, mobile viewport), machine-readable facts (JSON-LD, Organization schema, Open Graph), speed and security (HTTPS, HSTS, security headers, response time, HTML size) and contact paths.",
  },
  {
    q: "How do I check if ChatGPT can crawl my website?",
    a: "ChatGPT search uses the OAI-SearchBot crawler, and ChatGPT-User when someone asks it to open a page. Enter your page in the checker: the 'Who can read this page' table shows whether robots.txt allows each of them, plus Googlebot, Bingbot, PerplexityBot and Claude-SearchBot.",
  },
  {
    q: "Should I block GPTBot or ClaudeBot?",
    a: "That's a business decision. GPTBot, ClaudeBot, Google-Extended, Applebot-Extended and CCBot relate to AI training. Blocking them doesn't remove you from AI search answers, which use separate search crawlers, so the check reports training crawlers for information only and doesn't change your score.",
  },
  {
    q: "Is llms.txt required to appear in AI answers?",
    a: "No. llms.txt is an optional summary file. It's cheap to publish, but no major AI search engine has confirmed it as a ranking factor. Crawl access, indexable pages, clear content and consistent business facts matter far more, so llms.txt is worth only 5 of the 100 points.",
  },
  {
    q: "Does the score estimate my lost traffic or revenue?",
    a: "No. One page load can't measure traffic or revenue, so we don't estimate them. The score is a fixed rubric of technical signals, published on this page, so you can see exactly why each point was given.",
  },
  {
    q: "Do you store my website or report?",
    a: "No. The report is shown in your browser and isn't saved on our servers. You can download it, print it, or choose to send a summary to our team on WhatsApp.",
  },
  {
    q: "Can I check a competitor's site?",
    a: "Please only check sites you own or manage, or have permission to check. The tool makes one normal page request, like a browser, and is rate-limited.",
  },
];

const rubric = [
  ["AI search access", 30, "Search and AI-search crawlers allowed in robots.txt (15), page not set to noindex (10), optional llms.txt (5)."],
  ["Search essentials", 30, "HTTP 200 (5), title (5), meta description (4), canonical (5), one H1 (3), language (2), XML sitemap (3), mobile viewport (3)."],
  ["Machine-readable facts", 15, "Valid JSON-LD (6), Organization or LocalBusiness entity (5), Open Graph title and image (4)."],
  ["Speed & security", 15, "HTTPS (4), HSTS (2), basic security headers (2), response time measured once from our server (4), HTML size (3)."],
  ["Ways to contact you", 10, "At least two visible contact paths: form, email, phone, WhatsApp or a contact/booking page."],
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Search Readiness Checker",
    url: `${SITE_URL}${PATH}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": "https://www.scriza.in/#organization" },
    description: metadata.description,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function Page() {
  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero hero-sm">
        <div className="wrap">
          <p className="eyebrow">Free tool / No signup</p>
          <h1>Can AI search find your website?</h1>
          <p className="lede">
            Check whether ChatGPT search, Perplexity, Claude, Google and Bing can crawl, index and understand a page on your site.
            You get a score out of 100, the fixes that matter most, and a report you can share with your developer.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SiteCheck />
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <h2>How to use it</h2>
          <ol className="steps">
            <li><strong>Check your most important page first:</strong> your homepage, or the service page you most want buyers to find.</li>
            <li><strong>Fix the "Fix these first" list.</strong> Crawler blocks, noindex and broken canonicals stop pages being found at all, so they come before everything else.</li>
            <li><strong>Download the report</strong> and share it with whoever manages your site. Each finding says what was found and what to change.</li>
            <li><strong>Re-run after changes</strong>, then check a few other key pages. Each page can differ.</li>
            <li><strong>Confirm with real data:</strong> Google Search Console and Bing Webmaster Tools show what actually gets indexed and clicked.</li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>How the score works</h2>
          <p>A fixed 100-point rubric. No hidden weighting, and no traffic or revenue estimates.</p>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Area</th><th>Points</th><th>What earns them</th></tr></thead>
              <tbody>{rubric.map(([a, p, w]) => <tr key={a}><td>{a}</td><td>{p}</td><td>{w}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="small muted mt-s">
            Training crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot) are reported but never scored: blocking them is your choice.
            If a page doesn't load, is set to noindex, or blocks every search crawler, the score is capped at 40, because nothing else matters until it can be found.
          </p>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap reading-width">
          <h2>Questions</h2>
          {faqs.map((f) => (
            <details key={f.q} className="faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
          <p className="mt">
            Need the fixes done? We handle technical SEO and AI-search readiness as part of{" "}
            <Link href="/services/organic-growth">organic growth</Link> and{" "}
            <Link href="/services/custom-software">custom software</Link> work. <Link href="/contact">Contact the team</Link>.
          </p>
        </div>
      </section>
    </Shell>
  );
}
