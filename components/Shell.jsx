import Link from "next/link";
import { company, services } from "@/lib/site";
import { localeList, locales } from "@/lib/locales";
import LocaleBanner from "./LocaleBanner";
import Brand from "./Brand";

function href(locale, sub = "") {
  const base = locales[locale]?.path || "";
  return `${base}${sub}` || "/";
}

export default function Shell({ locale = "global", children }) {
  const l = locales[locale];
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <LocaleBanner current={locale} />
      <header className="site-header">
        <div className="wrap header-row">
          <Link href={href(locale)} className="logo" aria-label="ScrizaOne home">
            <Brand />
          </Link>
          <nav aria-label="Main" className="desktop-nav">
            <ul className="nav">
              {services.map((s) => (
                <li key={s.slug}><Link href={href(locale, `/services/${s.slug}`)}>{s.nav}</Link></li>
              ))}
              <li><Link href="/working-with-us">Working with us</Link></li>
              <li><Link href="/contact" className="btn btn-sm">Contact</Link></li>
            </ul>
          </nav>
          <details className="mobile-menu">
            <summary aria-label="Open navigation"><span /><span /></summary>
            <nav aria-label="Mobile">
              {services.map((s) => <Link key={s.slug} href={href(locale, `/services/${s.slug}`)}>{s.nav}<span aria-hidden="true">↗</span></Link>)}
              <Link href="/working-with-us">Working with us<span aria-hidden="true">↗</span></Link>
              <Link href="/contact">Contact<span aria-hidden="true">↗</span></Link>
            </nav>
          </details>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <Link href={href(locale)} className="logo" aria-label="ScrizaOne home"><Brand /></Link>
            <p className="muted">
              ScrizaOne is the international website of {company.legalName}, a software engineering company
              headquartered in {company.hq.city}, {company.hq.countryName}.
            </p>
            <p className="muted small">
              CIN {company.cin} · DGFT IEC {company.iec}<br />
              {company.iso.map((i) => i.standard).join(" and ")} certified (scope: {company.isoScope}).
            </p>
          </div>
          <div>
            <p className="footer-h">Regions</p>
            <ul className="plain">
              {localeList.map((x) => (
                <li key={x.code}>
                  <Link href={x.path || "/"} hrefLang={x.code === "eu" ? undefined : x.hreflang} aria-current={x.code === locale ? "page" : undefined}>
                    {x.name} ({x.currency.code})
                  </Link>
                </li>
              ))}
              <li><a href={company.indiaSite} hrefLang="en-IN">India: scriza.in</a></li>
            </ul>
          </div>
          <div>
            <p className="footer-h">Contact</p>
            <ul className="plain">
              <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><a href={company.phoneHref}>{company.phone}</a></li>
              <li><a href={company.whatsapp} rel="noopener">WhatsApp</a></li>
            </ul>
            <p className="muted small">
              Team hours: {company.hours.india} and {company.hours.pacific}.<br />{company.replyRule}
            </p>
          </div>
        </div>
        <div className="wrap small muted footer-base">
          © {new Date().getFullYear()} {company.legalName}. Viewing: {l?.name}.
        </div>
      </footer>
    </>
  );
}
