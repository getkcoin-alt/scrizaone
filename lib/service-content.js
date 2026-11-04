// Service page content. Claims stay within verified facts:
// - ScrizaPay is Scriza's own production bill-payment platform on India's Bharat Connect (BBPS) rails.
// - No third-party gateway, rail or regulator is named as "delivered" until the business
//   supplies evidence (docs/global-strategy.md §4.4).

export const serviceContent = {
  fintech: {
    title: "Fintech integration & development",
    metaTitle: "Fintech Software Development & Payment Integration",
    description:
      "Fintech engineering for payment integrations, payments platforms, billing and reconciliation. Built by the team behind ScrizaPay, a production bill-payment platform.",
    answer:
      "ScrizaOne designs and builds fintech software: payment gateway and payment API integrations, payments and bill-payment platforms, billing, ledgers and reconciliation, and the dashboards and APIs around them. We built and run our own production payments platform, ScrizaPay, so we engineer for settlement, failure handling and audit trails from day one. We work with your licensed payment providers; we are not a payment institution ourselves.",
    capabilities: [
      { h: "Payment integrations", p: "Card, bank-transfer and real-time payment integrations through your PSP or acquirer, including webhooks, retries, idempotency keys and refunds." },
      { h: "Payment orchestration", p: "Routing across more than one provider, fallbacks when a provider fails, and one internal API in front of all of them." },
      { h: "Billing, ledgers & reconciliation", p: "Double-entry ledgers, invoice and subscription billing, and automated matching of provider settlement files against your records." },
      { h: "Bill-payment & payments platforms", p: "Multi-tenant platforms for merchants, distributors and agents, with commission, limits and reporting." },
      { h: "Onboarding & risk integrations", p: "KYC/KYB and fraud-screening integrations with your chosen vendors, with case queues for your operations team." },
      { h: "Admin, reporting & APIs", p: "Operations dashboards, audit logs, role-based access, and documented partner APIs." },
    ],
    proof: {
      h: "Built and operated in production: ScrizaPay",
      p: "ScrizaPay is Scriza's own bill-payment platform on India's Bharat Connect (BBPS) ecosystem, serving retail service counters, distributors and businesses that integrate bill payments by API. ScrizaPay itself is an India-only service; the engineering behind it (transaction state machines, reconciliation, uptime and partner APIs) is what we bring to your product.",
      link: { href: "https://scrizapay.com", label: "Visit scrizapay.com" },
    },
    process: [
      "Discovery: map your money flows, providers and regulatory model (who holds funds, who is licensed).",
      "Architecture: ledger design, provider abstraction, failure and reconciliation paths, security controls.",
      "Build in sprints with demos, against provider sandboxes first.",
      "Certification and go-live with your provider, then monitored rollout.",
    ],
    faqs: [
      { q: "Are you a licensed payment company?", a: "No. Scriza Private Limited is a software engineering company. We build the software and integrate it with your licensed payment providers, banks or e-money partners. Regulated activities stay with them or with you." },
      { q: "Can you work with our existing payment provider?", a: "Yes. We start from the provider's API documentation and sandbox, and design an internal abstraction so you can add or switch providers later." },
      { q: "How do you keep us out of PCI scope?", a: "Wherever possible we use the provider's tokenisation, hosted fields or redirect flows so raw card data never touches your servers. The exact PCI DSS level you need is confirmed with your provider and assessor." },
    ],
  },
  "ai-automation": {
    title: "AI agents & automation",
    metaTitle: "AI Agent Development & Business Process Automation",
    description:
      "AI agents and workflow automation for real business processes: lead qualification, document handling, customer conversations and back-office work, with people kept in the loop.",
    answer:
      "ScrizaOne builds AI agents and workflow automation for specific, measurable business tasks: qualifying leads, extracting data from documents, answering customer questions from your own knowledge, and moving work between your systems. We ground agents in your data, limit what they can do, log every action, and keep a person in the loop wherever a mistake would be costly.",
    capabilities: [
      { h: "AI agents with guardrails", p: "Tool-using agents with explicit permissions, approval steps and full action logs." },
      { h: "Grounded assistants", p: "Assistants that answer only from your approved content, like Riza, the assistant on scriza.in." },
      { h: "Document automation", p: "Extraction and validation of data from invoices, forms and contracts into your systems." },
      { h: "Workflow & CRM automation", p: "Connecting forms, CRM, email, WhatsApp and internal tools so routine steps run by themselves." },
      { h: "AI voice & IVR", p: "Voice agents and AI-assisted IVR for enquiry handling and routing." },
      { h: "Evaluation & monitoring", p: "Test sets, accuracy tracking and cost monitoring so you know the system keeps working." },
    ],
    proof: {
      h: "In production: Riza",
      p: "Riza is the AI assistant on Scriza's own website. It answers only from verified company facts, refuses off-topic requests, and hands qualified enquiries to the sales team as a structured lead.",
      link: { href: "https://www.scriza.in", label: "Try Riza on scriza.in" },
    },
    process: [
      "Pick one workflow and define what success means (time saved, accuracy, conversion).",
      "Prototype against real, anonymised examples and measure it.",
      "Harden: permissions, human review, logging, cost limits.",
      "Roll out gradually and monitor accuracy and cost.",
    ],
    faqs: [
      { q: "Will the AI make decisions on its own?", a: "Only where you decide it should. We design approval steps for anything with financial, legal or customer impact, and every action is logged." },
      { q: "Which AI models do you use?", a: "We choose per use case, based on accuracy, cost, data-residency and privacy requirements, and design so the model can be swapped later." },
      { q: "What about data protection?", a: "We minimise the personal data sent to models, respect your retention rules, and align the design with the data-protection law that applies to your users (for example GDPR or UK GDPR)." },
    ],
  },
  "custom-software": {
    title: "Custom software & SaaS",
    metaTitle: "Custom Software & SaaS Development Company",
    description:
      "Custom software, SaaS platforms and MVPs: product engineering for startups and growing companies, with full IP assignment and documented delivery.",
    answer:
      "ScrizaOne engineers custom software and SaaS products: MVPs for funded startups, multi-tenant SaaS platforms, web and mobile apps, ERP and CRM systems, and the APIs and integrations that connect them. You own the code and IP, and you get documented architecture, regular demos and a team that overlaps with your working day.",
    capabilities: [
      { h: "MVP engineering", p: "Scoping, clickable prototypes and a production-ready first release built to be extended, not thrown away." },
      { h: "SaaS platforms", p: "Multi-tenant architecture, subscription billing, roles and permissions, and admin tooling." },
      { h: "Web & mobile apps", p: "React and Next.js web apps and Flutter mobile apps backed by Node.js or Python services." },
      { h: "ERP & CRM", p: "Custom operational systems where off-the-shelf tools don't fit your workflow." },
      { h: "APIs & integrations", p: "Documented APIs and integrations with your existing tools and data." },
      { h: "Industry software", p: "Operational HR and hospitality systems, including our company-reported HRVico product." },
    ],
    proof: {
      h: "Products we build and run ourselves",
      p: "Scriza builds and maintains its own software products: HRVico (HRMS and payroll), Hostelo (accommodation discovery) and ScrizaPay (bill payments). These products currently serve the Indian market; they show how we engineer and operate software over the long term.",
      link: { href: "https://www.scriza.in/portfolio/case-studies", label: "See case studies on scriza.in" },
    },
    process: [
      "Discovery and scoping with a written plan and milestones.",
      "Architecture and design, reviewed with your team.",
      "Build in sprints with demos and a shared backlog.",
      "QA, deployment, handover documentation and support.",
    ],
    faqs: [
      { q: "Who owns the code?", a: "You do. Contracts are with Scriza Private Limited and include assignment of intellectual property and confidentiality terms." },
      { q: "How do you price projects?", a: "We quote per project, by milestone, after a free discovery call. Quotes are issued in your currency (for example USD, GBP, EUR, CAD, AUD, SGD or AED)." },
      { q: "Do you sign NDAs?", a: "Yes, before any detailed discussion of your product if you prefer." },
    ],
  },
};
