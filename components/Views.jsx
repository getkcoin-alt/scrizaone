import Link from "next/link";
import { company, services } from "@/lib/site";
import { locales } from "@/lib/locales";
import { serviceContent } from "@/lib/service-content";
import HeroArtwork from "./HeroArtwork";

const p = (locale, sub = "") => `${locales[locale].path}${sub}` || "/";

export function RegionPanel({ locale, focus = "fintech" }) {
  const l = locales[locale];
  return (
    <section className="section alt" aria-labelledby="region-h">
      <div className="wrap">
        <p className="eyebrow">{locale === "global" ? "Working across regions" : `For clients in ${l.region}`}</p>
        <h2 id="region-h">{locale === "global" ? "What we plan for, wherever you are" : `What we plan for in ${l.region}`}</h2>
        <div className="grid-3">
          <div className="card">
            <h3>Hours & overlap</h3>
            <p>{l.overlap}</p>
            <p className="small muted">{company.replyRule}</p>
          </div>
          <div className="card">
            <h3>Pricing currency: {l.currency.code}</h3>
            <p>{l.currency.note} Every project is quoted per milestone after a free discovery call, so the quote matches your scope.</p>
          </div>
          {focus === "fintech" ? (
            <div className="card">
              <h3>Payment rails we design for</h3>
              <ul className="ticks">
                {l.paymentRails.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          ) : (
            <div className="card">
              <h3>Contracts & IP</h3>
              <p>You contract with {company.legalName}. Intellectual property is assigned to you, and we sign an NDA before detailed discussions if you prefer.</p>
            </div>
          )}
        </div>
        <h3 className="mt">Regulatory topics we design around</h3>
        <div className="grid-2">
          {l.compliance.map((c) => (
            <div className="card flat" key={c.name}>
              <h4>{c.name}</h4>
              <p>{c.note}</p>
            </div>
          ))}
        </div>
        <p className="small muted mt-s">
          These notes summarise what buyers in this region usually plan for. They are not legal advice, and Scriza does not hold
          payment or financial licences; we integrate with your licensed providers. Checked November 2026.
        </p>
      </div>
    </section>
  );
}

export function HomeView({ locale }) {
  const l = locales[locale];
  const where = locale === "global" ? "worldwide" : `in ${l.region}`;
  return (
    <>
      <section className="hero home-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="wrap hero-layout">
          <div className="hero-copy">
          <p className="eyebrow">Software engineering partner · {l.name}</p>
          <h1><span>Fintech, AI</span> and custom software engineering for companies {where}</h1>
          <p className="lede">
            ScrizaOne is the international team of {company.legalName}. We build payment integrations and payments platforms,
            AI agents and automation, and custom software and SaaS, with working hours that overlap yours.
          </p>
          <div className="cta-row">
            <Link className="btn" href="/contact">Book a free discovery call</Link>
            <Link className="btn btn-ghost" href={p(locale, "/services/fintech")}>Fintech engineering</Link>
          </div>
          <p className="small muted">{l.overlap}</p>
          </div>
          <HeroArtwork />
        </div>
        <div className="wrap hero-foot" aria-hidden="true"><span>01 / SCRIZAONE</span><span>{l.name} · {l.currency.code}<span className="foot-arrow">↓</span></span></div>
      </section>

      <section className="section services-section" aria-labelledby="svc-h">
        <div className="wrap">
          <h2 id="svc-h">What we build</h2>
          <div className="grid-3">
            {services.map((s, index) => (
              <Link key={s.slug} href={p(locale, `/services/${s.slug}`)} className={`card link-card${s.lead ? " lead" : ""}`}>
                <div className="service-card-top" aria-hidden="true"><span>0{index + 1}</span><span>↗</span></div>
                {s.lead && <span className="tag">Core expertise</span>}
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                <span className="more">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RegionPanel locale={locale} />

      <section className="section trust-section" aria-labelledby="trust-h">
        <div className="wrap">
          <h2 id="trust-h">Who you would be working with</h2>
          <div className="grid-3">
            <div className="card flat">
              <h3>A registered company</h3>
              <p>{company.legalName}, incorporated in India in July 2022 (CIN {company.cin}), exporting software services under DGFT Importer Exporter Code {company.iec}.</p>
            </div>
            <div className="card flat">
              <h3>Audited management systems</h3>
              <p>{company.iso.map((i) => `${i.standard} (${i.number})`).join(" and ")}, valid {company.isoValidity}. Scope: {company.isoScope}.</p>
              <a href="https://www.scriza.in/portfolio/certifications" className="more">Certificate details →</a>
            </div>
            <div className="card flat">
              <h3>Products we run ourselves</h3>
              <p>ScrizaPay (bill payments), HRVico (HRMS), Edu2All (school ERP) and Hostelo. These serve the Indian market today and show how we operate software long-term.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export function ServiceView({ locale, slug }) {
  const s = serviceContent[slug];
  const l = locales[locale];
  return (
    <>
      <section className="hero hero-sm">
        <div className="wrap">
          <nav className="crumbs small" aria-label="Breadcrumb">
            <Link href={p(locale)}>Home</Link> / <span>{s.title}</span>
          </nav>
          <p className="eyebrow">{l.name}</p>
          <h1>{s.title}{locale !== "global" ? ` for ${l.region}` : ""}</h1>
          <p className="lede">{s.answer}</p>
          <div className="cta-row">
            <Link className="btn" href="/contact">Discuss your project</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Capabilities</h2>
          <div className="grid-3">
            {s.capabilities.map((c) => (
              <div className="card" key={c.h}><h3>{c.h}</h3><p>{c.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap proof">
          <h2>{s.proof.h}</h2>
          <p>{s.proof.p}</p>
          <a className="more" href={s.proof.link.href} rel="noopener">{s.proof.link.label} →</a>
        </div>
      </section>

      <RegionPanel locale={locale} focus={slug} />

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>How we work</h2>
            <ol className="steps">{s.process.map((x) => <li key={x}>{x}</li>)}</ol>
          </div>
          <div>
            <h2>Questions</h2>
            {s.faqs.map((f) => (
              <details key={f.q} className="faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="wrap">
        <h2>Tell us what you're building</h2>
        <p>
          Free discovery call and written estimate. Team hours: {company.hours.india} and {company.hours.pacific}.
        </p>
        <Link className="btn btn-light" href="/contact">Contact the team</Link>
      </div>
    </section>
  );
}

export function faqSchema(slug) {
  const s = serviceContent[slug];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
