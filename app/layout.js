import "./globals.css";
import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import { SITE_URL, company } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ScrizaOne | Fintech, AI & Custom Software Engineering",
    template: "%s | ScrizaOne",
  },
  description:
    "International software engineering by Scriza Private Limited: fintech and payment integrations, AI agents and automation, and custom software and SaaS, with team hours that overlap yours.",
  applicationName: "ScrizaOne",
  openGraph: { siteName: "ScrizaOne", type: "website", locale: "en" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport = { themeColor: "#0A1016" };

// Same legal entity and @id as scriza.in (strategy §5.2, rule 4).
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.scriza.in/#organization",
  name: "Scriza Private Limited",
  legalName: company.legalName,
  alternateName: ["Scriza", "ScrizaOne"],
  url: company.indiaSite,
  foundingDate: company.founded,
  email: company.email,
  telephone: "+91-9119112999",
  address: {
    "@type": "PostalAddress",
    streetAddress: company.hq.street,
    addressLocality: company.hq.city,
    addressRegion: company.hq.region,
    postalCode: company.hq.postal,
    addressCountry: company.hq.country,
  },
  identifier: [
    { "@type": "PropertyValue", name: "Corporate Identification Number (CIN)", value: company.cin },
    { "@type": "PropertyValue", name: "Importer Exporter Code (IEC)", value: company.iec },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: company.email,
      telephone: "+91-9119112999",
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
  ],
  knowsAbout: [
    "Fintech software development",
    "Payment gateway integration",
    "Payment orchestration",
    "Billing and reconciliation systems",
    "AI agent development",
    "Business process automation",
    "SaaS development",
    "Custom software development",
  ],
  sameAs: [company.indiaSite, SITE_URL, "https://www.linkedin.com/company/scriza", "https://scrizapay.com"],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "ScrizaOne",
  publisher: { "@id": "https://www.scriza.in/#organization" },
  inLanguage: "en",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organization, website]) }} />
        {children}
      </body>
    </html>
  );
}
