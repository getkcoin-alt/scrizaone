export const articles = [
  {
    "slug": "mpesa-payment-received-order-pending",
    "title": "M-PESA payment received, order still pending: a reconciliation checklist",
    "country": "Kenya",
    "market": "KE",
    "service": "fintech",
    "keyword": "M-PESA payment reconciliation Kenya",
    "secondary": [
      "Daraja callback order pending",
      "M-PESA ERP integration",
      "M-PESA payment status mismatch"
    ],
    "selectionReason": "Existing Daraja integration access and observed local reconciliation products; focus on a concrete operations failure, not generic fintech outsourcing.",
    "publishAt": "2026-11-05T03:30:00.000Z",
    "reviewedAt": "2026-11-04",
    "description": "A customer has a payment confirmation, but your order is still pending. Before retrying a collection or marking it paid manually, build an evidence trail b",
    "intro": "A customer has a payment confirmation, but your order is still pending. Before retrying a collection or marking it paid manually, build an evidence trail between the order, provider transaction and finance records.",
    "sections": [
      {
        "title": "First separate the three records",
        "paragraphs": [
          "In this proposed workflow, the order tells you what the customer bought, the provider record tells you what the payment service reports, and reconciliation tells finance what matches. A screenshot from a customer can start an investigation; it should not silently replace the provider evidence.",
          "Safaricom publishes Daraja APIs for M-PESA integrations. The exact product, account permissions and provider documentation govern what your system can query or receive. An application developer is not automatically a payment provider."
        ]
      },
      {
        "title": "Trace one exception from start to finish",
        "paragraphs": [
          "Give the support team a single exception record with the order reference, provider reference if known, expected amount, observed state and next owner. Check whether the notification arrived, whether it was persisted, and whether processing failed after receipt. Do not put customer phone numbers in public diagnostic links.",
          "If the callback is missing, use the status or report route documented for your product. Keep an ambiguous result pending. A retry can create a second collection when the original outcome is unknown; agree the recovery action with the provider before automating it."
        ]
      },
      {
        "title": "A test you can run before connecting an ERP",
        "paragraphs": [
          "In our synthetic payment demo, create a request, receive success, and then make the bank report disagree. The customer state and finance exception remain distinct. Replay the success notification and confirm that the demo does not create a second credit.",
          "For a real integration, repeat these scenarios in the permitted provider environment: duplicate callback, delayed callback, application timeout, amount mismatch and unavailable ERP. Agree which system owns each identifier and who can approve manual corrections."
        ]
      },
      {
        "title": "What Scriza could scope",
        "paragraphs": [
          "A useful first scope is one supported M-PESA product and one ERP order flow, with a reconciliation queue and an export for the finance owner. Include provider onboarding, test access, retention decisions and exception handling in the estimate.",
          "Bring a redacted example of the current mismatch, your ERP name, the chosen provider product and the person who closes finance exceptions. The first success criterion is an explainable, recoverable flow—not an invented promise of zero failed payments."
        ]
      }
    ],
    "sources": [
      {
        "label": "Safaricom Daraja developer platform",
        "url": "https://developer.safaricom.co.ke/"
      },
      {
        "label": "CBK national payments system",
        "url": "https://www.centralbank.go.ke/national-payments-system/"
      }
    ],
    "related": [
      "mpesa-erp-reconciliation",
      "payment-events-and-reconciliation"
    ],
    "searchVolume": null,
    "competitionDifficulty": null,
    "commercialDemand": "Unvalidated; infrastructure and public offers support a topic hypothesis, not demand volume."
  },
  {
    "slug": "uae-quotation-automation-human-review",
    "title": "AI quotation automation in the UAE: keep pricing approval with your team",
    "country": "United Arab Emirates",
    "market": "AE",
    "service": "ai-automation",
    "keyword": "AI quotation automation UAE",
    "secondary": [
      "quotation workflow automation Dubai",
      "Arabic English document automation",
      "AI automation ROI UAE"
    ],
    "selectionReason": "UAE AI policy and observed quote-generation offers support investigation; a specific bilingual quotation workflow is a testable hypothesis.",
    "publishAt": "2026-11-06T03:30:00.000Z",
    "reviewedAt": "2026-11-04",
    "description": "When enquiries arrive as messages, attachments and spreadsheets, start by automating the preparation of a quotation. Keep the final price, promised deliver",
    "intro": "When enquiries arrive as messages, attachments and spreadsheets, start by automating the preparation of a quotation. Keep the final price, promised delivery and outbound message under a person’s control.",
    "sections": [
      {
        "title": "Define the task before selecting a model",
        "paragraphs": [
          "Choose one enquiry type, one price catalogue and one output template. Record the language, required fields and the information a person must confirm. Arabic and English support needs evaluation against representative examples; an English-only demo does not prove bilingual accuracy.",
          "The UAE AI Charter emphasizes transparency, privacy and human oversight. It supports a cautious design direction, not proof that this particular workflow is compliant or commercially demanded."
        ]
      },
      {
        "title": "The useful boundary: draft, check, approve",
        "paragraphs": [
          "A proposed flow extracts the requested service and quantities, looks up approved catalogue entries, then prepares a draft. Missing quantities, ambiguous specifications and unsupported items go into a review queue. The model should not invent a price to keep the process moving.",
          "A reviewer confirms the source, price, exclusions and delivery terms before anything is sent. Use an explicit approval record and restrict which integrations can act. A failed CRM update should remain a visible failure rather than a success message."
        ]
      },
      {
        "title": "Measure the work that remains",
        "paragraphs": [
          "Count the minutes required to collect, read, correct and approve each draft. Compare the complete process against the current manual process, not only model response speed. Include subscriptions, usage charges, support and evaluation work.",
          "Use our economics calculator with your own task volume and review time. Its defaults are illustrative. If review takes longer than the original task, the model should show negative capacity; do not hide that result behind a favourable headline."
        ]
      },
      {
        "title": "What Scriza could scope",
        "paragraphs": [
          "Start with a synthetic workflow demonstration, then a permissioned evaluation set and one reviewed quotation path. Define the pass/fail criteria with the commercial owner: correct catalogue selection, clear missing-data flags and no unapproved outbound quote.",
          "Bring the template, catalogue structure, supported languages and a redacted example of an enquiry that goes wrong today. The first milestone should answer whether the workflow is useful enough to integrate, before committing to a broad AI transformation."
        ]
      }
    ],
    "sources": [
      {
        "label": "UAE Charter for the development and use of AI",
        "url": "https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/policies/Ai/The-UAE-Charter-for-the-Development-and-Use-of-Artificial-Intelligence"
      }
    ],
    "related": [
      "uae-document-automation",
      "custom-software-cost-drivers"
    ],
    "searchVolume": null,
    "competitionDifficulty": null,
    "commercialDemand": "Unvalidated; infrastructure and public offers support a topic hypothesis, not demand volume."
  },
  {
    "slug": "nigeria-open-banking-consent-lifecycle",
    "title": "Nigeria open-banking integration: design the consent lifecycle before the dashboard",
    "country": "Nigeria",
    "market": "NG",
    "service": "fintech",
    "keyword": "open banking API integration Nigeria",
    "secondary": [
      "open banking consent Nigeria",
      "Nigeria account aggregation software",
      "bank API integration requirements Nigeria"
    ],
    "selectionReason": "CBN open-banking guidance establishes local infrastructure context. A consent and access lifecycle is a narrower engineering topic than generic fintech development.",
    "publishAt": "2026-11-07T03:30:00.000Z",
    "reviewedAt": "2026-11-04",
    "description": "An account dashboard is only the visible part of an open-banking product. First define who can access which data, for what purpose, for how long, and what ",
    "intro": "An account dashboard is only the visible part of an open-banking product. First define who can access which data, for what purpose, for how long, and what happens when access is withdrawn.",
    "sections": [
      {
        "title": "Use Nigeria’s own framework",
        "paragraphs": [
          "The CBN publishes operational guidance for open banking in Nigeria. Open Banking Nigeria also publishes technical standards, while explicitly distinguishing its standards from a legal framework. Confirm the actual participant, permission and bank access route with the responsible partners.",
          "A generic aggregator demo does not establish access to Nigerian bank accounts. Your project must name the provider, permitted endpoints, environment and operational owner before any delivery commitment."
        ]
      },
      {
        "title": "Treat consent as a changing state",
        "paragraphs": [
          "The following is an application design proposal, not a statement of mandatory API field names. Record the purpose, data categories, permission reference and relevant expiry or withdrawal state. Keep the consent history separate from the cached financial records.",
          "Before a scheduled refresh, check whether the permitted access is still active. If the provider rejects access, stop the refresh and show a recoverable state. Do not repeatedly request fresh data because an old dashboard screen still looks connected."
        ]
      },
      {
        "title": "Test revocation and unavailable providers",
        "paragraphs": [
          "A useful test set includes successful consent, expiry, explicit withdrawal, a provider outage and a stale cached result. Label the age and source of visible information. A user should not mistake yesterday’s balance for a current response.",
          "For each case, specify what the background worker does, what the customer sees and what support can inspect. Decide which records must be deleted or retained with your qualified privacy and compliance advisers; the engineering team should not invent those obligations."
        ]
      },
      {
        "title": "What Scriza could scope",
        "paragraphs": [
          "Scope one approved data-access journey and its error states, with a consent-aware refresh process and an operator audit view. The milestone is an inspectable integration through an eligible partner, not a claim that Scriza holds regulatory authorization.",
          "Bring the provider agreement, sample API documentation, intended customer purpose and retention decisions. Compare an existing integration product against a custom implementation before building a new abstraction layer."
        ]
      }
    ],
    "sources": [
      {
        "label": "CBN payments system and open-banking guidance",
        "url": "https://www.cbn.gov.ng/PaymentsSystem/"
      },
      {
        "label": "Open Banking Nigeria technical standards and scope",
        "url": "https://docs.openbanking.ng/standard"
      }
    ],
    "related": [
      "payment-integration-responsibilities",
      "payment-events-and-reconciliation"
    ],
    "searchVolume": null,
    "competitionDifficulty": null,
    "commercialDemand": "Unvalidated; infrastructure and public offers support a topic hypothesis, not demand volume."
  },
  {
    "slug": "saudi-zatca-erp-exception-workflow",
    "title": "ZATCA ERP integration: make invoice exceptions visible before rollout",
    "country": "Saudi Arabia",
    "market": "SA",
    "service": "custom-software",
    "keyword": "ZATCA ERP integration Saudi Arabia",
    "secondary": [
      "Fatoora integration exception handling",
      "ZATCA invoice validation workflow",
      "Saudi e invoicing software integration"
    ],
    "selectionReason": "ZATCA publishes integration and developer materials. Target ERP exception handling, with taxpayer scope and regulatory interpretation confirmed separately.",
    "publishAt": "2026-11-08T03:30:00.000Z",
    "reviewedAt": "2026-11-04",
    "description": "A successful sample invoice is a starting point. A usable integration also needs to explain rejected documents, interrupted submissions and corrections to ",
    "intro": "A successful sample invoice is a starting point. A usable integration also needs to explain rejected documents, interrupted submissions and corrections to the finance team operating the ERP.",
    "sections": [
      {
        "title": "Establish the actual integration scope",
        "paragraphs": [
          "ZATCA describes a generation phase and an integration phase, introduced in waves. Its developer materials include specifications and a sandbox. Confirm the taxpayer’s applicability, current requirements and invoice types with the responsible adviser and official materials.",
          "This article proposes software workflow questions. It does not certify a product, identify a taxpayer’s deadline or substitute for tax advice. An ERP integration should use the applicable documented requirements rather than a copied template from another country."
        ]
      },
      {
        "title": "Create an exception workbench",
        "paragraphs": [
          "Map each ERP invoice to its generated document, submission attempt and provider response. Show finance the last confirmed state, a readable explanation and the next permitted action. Preserve the original response alongside a human-readable message.",
          "Keep draft corrections separate from previously issued records. A network interruption should create an investigation path, not a loop that blindly resubmits documents. Agree the exact retry and correction rules from current specifications."
        ]
      },
      {
        "title": "Test with the people who close the month",
        "paragraphs": [
          "Use synthetic invoices to test missing fields, invalid source data, a rejected submission and service unavailability. Ask a finance operator to identify which item needs attention without opening technical logs. The sandbox can test integrations but does not, by itself, establish production compliance.",
          "Include role permissions, credential ownership, monitoring and a documented recovery process in the project scope. An attractive dashboard is not useful if only its developer can understand the failures."
        ]
      },
      {
        "title": "What Scriza could scope",
        "paragraphs": [
          "A narrow milestone connects one ERP source and one documented invoice path, with a visible exception queue and a handover guide. Compare that against configuring an existing supported connector first.",
          "Bring your ERP version, current connector, applicable invoice types, technical documentation and named finance owner. Estimate migration, assurance and support separately from the happy-path API work."
        ]
      }
    ],
    "sources": [
      {
        "label": "ZATCA: what e-invoicing is and its phases",
        "url": "https://www.zatca.gov.sa/en/E-Invoicing/Introduction/Pages/What-is-e-invoicing.aspx"
      },
      {
        "label": "ZATCA e-invoicing specifications and developer resources",
        "url": "https://www.zatca.gov.sa/en/E-Invoicing/Pages/default.aspx"
      }
    ],
    "related": [
      "buy-or-build-software",
      "source-code-ownership-and-handover"
    ],
    "searchVolume": null,
    "competitionDifficulty": null,
    "commercialDemand": "Unvalidated; infrastructure and public offers support a topic hypothesis, not demand volume."
  },
  {
    "slug": "pix-automatico-saas-recurring-billing",
    "title": "Pix Automático for SaaS: separate authorization, cobrança and access",
    "country": "Brazil",
    "market": "BR",
    "service": "fintech",
    "keyword": "Pix Automático SaaS integração",
    "secondary": [
      "cobrança recorrente Pix Automático",
      "Pix Automático conciliação",
      "Pix recurring billing integration Brazil"
    ],
    "selectionReason": "Banco Central documents Pix Automático recurring collections. Local Portuguese terminology is retained; this article is an English engineering guide, not a Portuguese landing page.",
    "publishAt": "2026-11-09T03:30:00.000Z",
    "reviewedAt": "2026-11-04",
    "description": "A subscription system needs to keep payment authorization, each collection and product access in sync. For a Brazilian Pix Automático project, begin with t",
    "intro": "A subscription system needs to keep payment authorization, each collection and product access in sync. For a Brazilian Pix Automático project, begin with the receiving institution’s supported integration and lifecycle.",
    "sections": [
      {
        "title": "Start with the Brazilian product",
        "paragraphs": [
          "Banco Central describes Pix Automático as a recurring-payment arrangement in which the payer authorizes the business to collect under agreed terms. It distinguishes this from a payer scheduling their own recurring transfers. Confirm the offered integration with the receiving institution before designing your application.",
          "Useful local research terms include cobrança recorrente, autorização and conciliação. They identify relevant concepts, but this site has not measured their search volumes or established that every institution exposes the same API."
        ]
      },
      {
        "title": "Model three separate lifecycles",
        "paragraphs": [
          "As a proposed SaaS design, keep the authorization record separate from the collection attempt and subscription entitlement. An authorization can change independently of a past payment. A successful past collection is not sufficient evidence for every future instruction.",
          "Store the institution’s references and documented statuses. When notifications arrive late or out of order, retain the event history and reconcile against authoritative reports. Avoid granting or removing access solely on a transport timeout."
        ]
      },
      {
        "title": "Decide the customer policy explicitly",
        "paragraphs": [
          "Define what happens to access while a collection is unresolved, who contacts the customer and which retry actions are permitted. These are product and provider decisions; an engineer should not quietly choose a new grace period or debit policy.",
          "Test cancellation, an unavailable integration, duplicate notifications and a customer whose collection and entitlement records disagree. Use synthetic data first, then your provider’s permitted test environment."
        ]
      },
      {
        "title": "What Scriza could scope",
        "paragraphs": [
          "A useful first milestone covers one recurring plan, one approved receiving integration and a reconciliation view. Include an operator workflow for unresolved collections and a customer-visible explanation of their subscription state.",
          "Bring the institution’s contract and developer materials, your subscription rules and the finance owner. The generic payment demo on this site demonstrates state handling only; it is not a working Pix connector or proof of network participation."
        ]
      }
    ],
    "sources": [
      {
        "label": "Banco Central: Pix Automático",
        "url": "https://www.bcb.gov.br/pix-automatico"
      },
      {
        "label": "Banco Central: Pix Automático versus recurring scheduled Pix",
        "url": "https://bcb.gov.br/meubc/faqs/p/diferenca-entre-pix-automatico-e-pix-agendado-recorrente"
      }
    ],
    "related": [
      "payto-agreement-lifecycle",
      "payment-events-and-reconciliation"
    ],
    "searchVolume": null,
    "competitionDifficulty": null,
    "commercialDemand": "Unvalidated; infrastructure and public offers support a topic hypothesis, not demand volume."
  },
  {
    "slug": "uk-saas-mvp-budget-scope",
    "title": "SaaS MVP cost in the UK: compare scope before comparing quotes",
    "country": "United Kingdom",
    "market": "GB",
    "service": "custom-software",
    "keyword": "SaaS MVP development cost UK",
    "secondary": [
      "MVP scope checklist UK",
      "custom software running costs UK",
      "buy or build SaaS MVP"
    ],
    "selectionReason": "Observed UK provider search results explicitly discuss MVP cost and scope. This establishes visible competing content, not measured buyer volume or low competition.",
    "publishAt": "2026-11-10T03:30:00.000Z",
    "reviewedAt": "2026-11-04",
    "description": "Two quotes can look wildly different because they describe different products. Compare the same workflow, operational responsibilities and exclusions befor",
    "intro": "Two quotes can look wildly different because they describe different products. Compare the same workflow, operational responsibilities and exclusions before treating the lower price as better value.",
    "sections": [
      {
        "title": "Write one valuable journey",
        "paragraphs": [
          "Describe one intended user, one job and the observable result. A prototype can test whether the journey makes sense; a production release must also account for access control, persistent data, failure recovery and operations. Do not use the word MVP to erase those responsibilities.",
          "The UK Government Service Manual’s discovery guidance is useful for questioning the problem before committing to a solution. This is an engineering method reference, not a claim that Scriza has delivered a government service."
        ]
      },
      {
        "title": "Make quotes comparable",
        "paragraphs": [
          "Give each vendor the same assumptions: workflows, user roles, integrations, migration volume, environments, test expectations and support boundaries. Ask what is included in the first milestone and what would trigger a change.",
          "Separate design and discovery, implementation, assurance, release support and ongoing operation. Clarify code ownership, account ownership, handover documentation and exit arrangements in the contract. Tax and contractual treatment need professional review."
        ]
      },
      {
        "title": "Use a scenario, not a fake price promise",
        "paragraphs": [
          "Our calculator shows hours multiplied by a rate, one-time extras, contingency and monthly operating costs. Its example numbers are not Scriza’s prices or a UK market average. Change them to compare assumptions from real proposals.",
          "For a revenue product, staff-time savings are only one possible benefit. Do not substitute the calculator’s capacity value for a sales forecast. Validate customer willingness to use or pay through a suitable test before funding a larger build."
        ]
      },
      {
        "title": "What Scriza could scope",
        "paragraphs": [
          "Start with a discovery brief and one synthetic customer/operator flow. Name the riskiest assumption and choose the least expensive credible test: configuring an existing product, a prototype or one bounded custom workflow.",
          "Bring the user problem, current alternative and a description of what a successful first customer could do. A written estimate follows the agreed scope; this article does not invent a fixed MVP fee or delivery date."
        ]
      }
    ],
    "sources": [
      {
        "label": "GOV.UK Service Manual: the discovery phase",
        "url": "https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works"
      }
    ],
    "related": [
      "custom-software-cost-drivers",
      "prototype-vs-production",
      "buy-or-build-software"
    ],
    "searchVolume": null,
    "competitionDifficulty": null,
    "commercialDemand": "Unvalidated; infrastructure and public offers support a topic hypothesis, not demand volume."
  },
  {
    "slug": "us-ai-support-human-escalation",
    "title": "AI customer-support automation: design the human escalation first",
    "country": "United States",
    "market": "US",
    "service": "ai-automation",
    "keyword": "AI customer support automation human handoff",
    "secondary": [
      "AI support pilot cost US",
      "customer service AI escalation workflow",
      "AI support automation evaluation"
    ],
    "selectionReason": "US Census tracks business AI adoption and NIST publishes risk-management guidance. A support handoff pilot is a testable use-case hypothesis, not a claim of universal US demand.",
    "publishAt": "2026-11-11T03:30:00.000Z",
    "reviewedAt": "2026-11-04",
    "description": "A support assistant is useful when it can answer a bounded question and recognize when a person must take over. Design that handoff before giving a model t",
    "intro": "A support assistant is useful when it can answer a bounded question and recognize when a person must take over. Design that handoff before giving a model tools that change customer accounts.",
    "sections": [
      {
        "title": "Choose the safe first question set",
        "paragraphs": [
          "Pick a narrow set of supported questions and approved reference material. Record which topics need human review and which actions are outside the pilot. A confident answer is not evidence that the answer is grounded.",
          "US Census business surveys document AI adoption with varying usage by firm size and sector. That makes adoption worth investigating, but it does not prove demand for this exact project. NIST’s AI Risk Management Framework is a useful risk-management reference, not a certification earned by adding a chatbot."
        ]
      },
      {
        "title": "Make escalation carry useful context",
        "paragraphs": [
          "A proposed handoff includes the customer’s stated problem, attempted steps and source references, with appropriate permissions and retention controls. Show the customer whether a person has actually accepted the handoff. Do not claim a live transfer when a queue is unavailable.",
          "Begin with read-only answers or draft actions. Refunds, account changes and consequential decisions need defined authorization, identity checks and an accountable owner. Approval should be a real control in the workflow, not just a sentence in a prompt."
        ]
      },
      {
        "title": "Evaluate the complete service",
        "paragraphs": [
          "Build a permissioned, representative evaluation set containing answerable questions, missing evidence, ambiguous requests and unavailable integrations. Measure correct answers, appropriate escalations, reviewer effort and customer resolution. Deflection alone can reward an assistant that makes it difficult to reach a person.",
          "Use the synthetic AI demo to inspect the approval and failure states, then the economics calculator to test review time and ongoing costs. These tools illustrate a decision; they are not a benchmark of production accuracy or guaranteed savings."
        ]
      },
      {
        "title": "What Scriza could scope",
        "paragraphs": [
          "A first milestone could be one knowledge source, one support queue and a reviewed handoff path. Agree the evaluation threshold, fallback, access boundaries and stop condition before connecting real customer records.",
          "Bring the current workflow, approved help content, escalation policy and a redacted set of difficult questions. If the source material is unreliable, improving it may be more valuable than deploying an agent immediately."
        ]
      }
    ],
    "sources": [
      {
        "label": "US Census: Business Trends and Outlook Survey",
        "url": "https://www.census.gov/hfp/btos/data"
      },
      {
        "label": "NIST AI Risk Management Framework",
        "url": "https://www.nist.gov/itl/ai-risk-management-framework"
      }
    ],
    "related": [
      "uae-document-automation",
      "when-custom-software-is-wrong"
    ],
    "searchVolume": null,
    "competitionDifficulty": null,
    "commercialDemand": "Unvalidated; infrastructure and public offers support a topic hypothesis, not demand volume."
  }
];

export function publishedArticles(now = new Date()) { const time = new Date(now).getTime(); return articles.filter(a => Date.parse(a.publishAt) <= time).sort((a,b)=>b.publishAt.localeCompare(a.publishAt)); }
export function publishedArticle(slug,now=new Date()){return publishedArticles(now).find(a=>a.slug===slug)||null;}
