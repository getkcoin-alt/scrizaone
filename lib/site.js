// Single source of truth for company facts. Keep in sync with scriza.in
// (docs/global-strategy.md §5.2: one legal entity, two websites).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.scrizaone.com").replace(/\/$/, "");

export const company = {
  brand: "ScrizaOne",
  legalName: "Scriza Private Limited",
  cin: "U74999RJ2022PTC082624",
  iec: "ABICS9865M",
  founded: "2022-07",
  email: "sales@scriza.in",
  phone: "+91 91191 12999",
  phoneHref: "tel:+919119112999",
  whatsapp: "https://wa.me/919119112999",
  hq: {
    street: "NX One, T1 - 507, Tech Zone IV, Amrapali Dream Valley",
    city: "Greater Noida",
    region: "Uttar Pradesh",
    postal: "201318",
    country: "IN",
    countryName: "India",
  },
  registered: "488, Pandit Plaza, Sector-9, Savina, Udaipur, Rajasthan 313001, India",
  indiaSite: "https://www.scriza.in",
  hours: {
    india: "09:30–18:30 India Standard Time (UTC+5:30)",
    pacific: "09:00–17:00 US Pacific Time",
  },
  replyRule: "We reply to enquiries within 24 hours. Enquiries received on Wednesday or Friday may take longer.",
  iso: [
    { standard: "ISO/IEC 27001:2022", system: "Information Security Management System", number: "UQ-2026022728" },
    { standard: "ISO 9001:2015", system: "Quality Management System", number: "QMS2600233" },
  ],
  isoScope: "IT service and support",
  isoValidity: "27 February 2026 to 26 February 2029",
};

export const services = [
  {
    slug: "fintech",
    name: "Fintech integration & development",
    nav: "Fintech",
    short: "Payment integrations, payments platforms, billing and reconciliation, and fintech product engineering.",
    lead: true,
  },
  {
    slug: "ai-automation",
    name: "AI agents & automation",
    nav: "AI & automation",
    short: "AI agents, workflow automation and LLM integrations that keep a person in the loop.",
  },
  {
    slug: "custom-software",
    name: "Custom software & SaaS",
    nav: "Software & SaaS",
    short: "SaaS platforms, MVPs, web and mobile apps, ERP and CRM, and the APIs that connect them.",
  },
];
