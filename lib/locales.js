// Locale definitions for the location-aware experience (docs/global-strategy.md §5.3).
// Each locale is a separate crawlable URL with its own currency, overlap facts and
// regional topics. Content is never swapped by IP at a single URL.
//
// Regulatory and payment-rail notes describe what a buyer in that market typically
// has to plan for. They are not claims that Scriza holds any licence; Scriza builds
// integrations with the buyer's licensed providers.

export const DEFAULT_LOCALE = "global";

export const locales = {
  global: {
    code: "global",
    path: "",
    hreflang: "en",
    name: "Global",
    region: "your region",
    currency: { code: "USD", note: "Quotes are usually issued in USD; we can also quote in GBP, EUR, CAD, AUD, SGD or AED." },
    countries: [],
    overlap: "Our team works two windows, 09:30–18:30 India time and 09:00–17:00 US Pacific time. That gives most regions at least 4 hours of same-business-day overlap.",
    paymentRails: ["Card networks via your payment service provider", "Bank transfers and local real-time payment schemes", "Wallets and alternative payment methods"],
    compliance: [
      { name: "PCI DSS", note: "Keeping card data out of your systems (tokenised, hosted fields or redirects) to reduce PCI scope." },
      { name: "Data protection", note: "GDPR-style requirements on consent, retention and cross-border transfer, depending on where your users are." },
    ],
  },
  us: {
    code: "us",
    path: "/us",
    hreflang: "en-US",
    name: "United States",
    region: "the United States",
    currency: { code: "USD", note: "Quotes in US dollars." },
    countries: ["US"],
    overlap: "We staff 09:00–17:00 US Pacific time: a full business day on the West Coast, about 7 hours in Mountain time, 6 in Central and 5 on the East Coast (12:00–17:00 ET).",
    paymentRails: ["Cards via your processor or payment facilitator", "ACH (Nacha rules) and same-day ACH", "RTP and FedNow real-time payments", "Wires"],
    compliance: [
      { name: "PCI DSS", note: "Card-data scope reduction through tokenisation and hosted payment fields." },
      { name: "Money transmission", note: "If funds flow through your platform, state money-transmitter licensing usually applies, so most products partner with a licensed provider. We design around your provider's model." },
      { name: "HIPAA (health payments)", note: "For healthcare billing products, protected health information needs HIPAA-aligned handling." },
    ],
  },
  uk: {
    code: "uk",
    path: "/uk",
    hreflang: "en-GB",
    name: "United Kingdom",
    region: "the United Kingdom",
    currency: { code: "GBP", note: "Quotes in pounds sterling." },
    countries: ["GB"],
    overlap: "Our India window overlaps 4 hours with the UK in winter (GMT) and 5 hours in summer (BST), every working day.",
    paymentRails: ["Faster Payments", "Bacs Direct Debit", "Open banking payment initiation", "Cards via your acquirer or PSP"],
    compliance: [
      { name: "FCA authorisation", note: "Payment and e-money activities need FCA authorisation or an authorised partner. We integrate with your regulated partner." },
      { name: "Strong Customer Authentication", note: "SCA under the UK payment services rules for online card and account payments." },
      { name: "UK GDPR", note: "Lawful basis, retention and international data transfer rules." },
    ],
  },
  ca: {
    code: "ca",
    path: "/ca",
    hreflang: "en-CA",
    name: "Canada",
    region: "Canada",
    currency: { code: "CAD", note: "Quotes in Canadian dollars." },
    countries: ["CA"],
    overlap: "Our US Pacific window gives a full business day in Vancouver and about 5 hours in Toronto (12:00–17:00 ET).",
    paymentRails: ["Interac e-Transfer", "EFT / pre-authorised debits (Payments Canada rules)", "Cards via your PSP", "Real-Time Rail (as it rolls out)"],
    compliance: [
      { name: "PIPEDA and provincial privacy laws", note: "Consent, safeguarding and breach-reporting obligations for personal information." },
      { name: "Retail Payment Activities Act", note: "Payment service providers registering with the Bank of Canada. We integrate with registered providers." },
    ],
  },
  au: {
    code: "au",
    path: "/au",
    hreflang: "en-AU",
    name: "Australia & New Zealand",
    region: "Australia and New Zealand",
    currency: { code: "AUD", note: "Quotes in Australian dollars. New Zealand clients can be quoted in NZD." },
    countries: ["AU", "NZ"],
    overlap: "Using both our windows, Sydney gets about 5 hours of overlap (AEDT) and about 4 hours in AEST. Auckland gets about 5 hours.",
    paymentRails: ["NPP and PayID", "BECS direct entry", "PayTo", "Cards via your acquirer"],
    compliance: [
      { name: "Consumer Data Right (CDR)", note: "Open banking data sharing with accredited data recipients." },
      { name: "Privacy Act 1988", note: "Australian Privacy Principles for handling personal information." },
      { name: "AFSL / ASIC", note: "Some payment and financial products need an Australian Financial Services Licence or a licensed partner." },
    ],
  },
  sg: {
    code: "sg",
    path: "/sg",
    hreflang: "en-SG",
    name: "Singapore & Southeast Asia",
    region: "Singapore and Southeast Asia",
    currency: { code: "SGD", note: "Quotes in Singapore dollars. USD is available for regional clients." },
    countries: ["SG", "MY", "PH"],
    overlap: "Our India window overlaps about 5 hours with Singapore, Kuala Lumpur and Manila (UTC+8) every working day.",
    paymentRails: ["PayNow and FAST", "SGQR", "DuitNow (Malaysia)", "InstaPay / PESONet (Philippines)", "Cards via your PSP"],
    compliance: [
      { name: "MAS Payment Services Act", note: "Payment service licensing in Singapore. We build with your MAS-licensed partner." },
      { name: "MAS Technology Risk Management", note: "Expectations for system resilience, access control and incident handling." },
      { name: "PDPA", note: "Singapore's Personal Data Protection Act." },
    ],
  },
  ae: {
    code: "ae",
    path: "/ae",
    hreflang: "en-AE",
    name: "UAE & GCC",
    region: "the UAE and the GCC",
    currency: { code: "AED", note: "Quotes in UAE dirhams. SAR and USD are available for GCC clients." },
    countries: ["AE", "SA", "QA", "OM", "BH", "KW"],
    overlap: "Our India window overlaps about 8 hours with the UAE and Oman, and about 7 hours with Saudi Arabia, Qatar, Kuwait and Bahrain.",
    paymentRails: ["UAE Aani instant payments", "UAEFTS", "mada (Saudi Arabia)", "SARIE (Saudi Arabia)", "Cards via your acquirer"],
    compliance: [
      { name: "CBUAE regulations", note: "Retail payment services and stored-value rules from the Central Bank of the UAE. We integrate with licensed providers." },
      { name: "UAE e-invoicing", note: "Phased rollout from 2027 through accredited service providers (ASPs). Scriza is not an ASP and does not give tax advice; we build the ERP and billing integrations that feed your ASP." },
      { name: "Saudi ZATCA (Fatoora)", note: "E-invoicing integration requirements for Saudi taxpayers." },
    ],
  },
  eu: {
    code: "eu",
    path: "/eu",
    hreflang: "en",
    name: "Europe",
    region: "Europe",
    currency: { code: "EUR", note: "Quotes in euros." },
    countries: ["DE", "FR", "NL", "IE", "ES", "IT", "BE", "AT", "FI", "PT", "SE", "DK", "PL", "LU"],
    overlap: "Our India window overlaps about 5 hours with Central Europe in winter (CET) and about 6 hours in summer (CEST).",
    paymentRails: ["SEPA Credit Transfer and SEPA Instant", "SEPA Direct Debit", "Open banking (PSD2 APIs)", "Cards via your acquirer"],
    compliance: [
      { name: "PSD2 / PSD3", note: "Strong Customer Authentication and open-banking access rules. Payment activity needs a licensed institution or partner." },
      { name: "GDPR", note: "Lawful basis, data minimisation and transfer safeguards." },
      { name: "DORA", note: "ICT risk and third-party requirements for EU financial entities, which affect how vendors like us are onboarded." },
      { name: "EU AI Act", note: "Obligations for AI systems, relevant if your product uses AI in credit or fraud decisions." },
    ],
  },
};

export const localeList = Object.values(locales);
export const regionalLocales = localeList.filter((l) => l.code !== "global");

export function getLocale(code) {
  return locales[code] || null;
}

// Map an ISO country code to a locale code (used by the suggestion banner only).
export function localeForCountry(country) {
  if (!country) return null;
  const c = country.toUpperCase();
  for (const l of regionalLocales) if (l.countries.includes(c)) return l.code;
  return null;
}

// hreflang alternates for a page path that exists in every locale ("" = home).
export function alternatesFor(subpath = "") {
  const languages = {};
  for (const l of localeList) {
    if (l.code === "eu") continue; // EU folder shares "en" with global; not a single-country tag.
    languages[l.hreflang] = `${l.path}${subpath}` || "/";
  }
  languages["x-default"] = subpath || "/";
  return languages;
}
