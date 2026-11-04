# Buyer experience: operating guide

The first release connects existing resources and the payment planner to three synthetic demonstrations, a local project brief, and Riza's reviewed enquiry. It implements the attached “They Ask. They Try. They Decide.” proposal; it does not claim to have read the full book or to be a world-first invention.

## Visitor flow and data

1. /demos lets a visitor run payment, service-request and editorial state transitions. Fixed samples only, no generated code, payment execution or publication.
2. /tools/payment-readiness extends the existing URL with fintech/software/growth paths. The original country/provider checklist remains inside the fintech scope step, with its original source-backed export. It is not a readiness certificate.
3. The recommendation is a deterministic mapping of the visitor's selected alternative. Its explanation is visible; there are no invented prices, scores, ROI or dates.
4. The visitor edits the generated brief. Export is ungated UTF-8 text. The full brief can exceed the enquiry's 4,000-character bound; the visitor must shorten it explicitly before handoff. Never silently discard a long brief.
5. The brief and selected sample move in browser memory into /meeting-prep and the Riza form. They are never sent to AI automatically. Explicit tab saving uses sessionStorage, with deletion. A full reload clears a memory-only brief. The local meeting route is noindex/no-store and absent from the sitemap; no buyer data is rendered by a server or stored in public URLs.
6. Riza review supports an optional preferred slot, country, timing, budget and edited requirements. Contact fields are entered only when enquiring. Recipients remain server constants; the sample category is validated on the server. Email acceptance is not delivery or booking.
7. Failure leaves the reviewed brief in place. Export and visitor-reviewed WhatsApp remain alternatives. Opening WhatsApp is composition, not sending. No calendar is connected.

## Integrations and evidence gates

Vercel metadata rechecked during this release: OPEN_ROUTER and RESEND_MAIL remain server-only production variables; their values were not retrieved. They are not configured for preview. No separate calendar/storage service was found. The last observed Resend error was a sender-domain rejection; recent logs returned no relevant observations, which does not establish that the issue persists or is fixed. Do not claim current email functionality until a real authorized enquiry is accepted. Routine tests use mocks; no real email was sent for this release.

OpenRouter's public catalog is checked for the existing free model IDs; the code preserves zero-price provider limits and no paid fallback. Provider retention/training disclosures remain visible. Preview may show AI/session unavailable because production keys are deliberately not copied there. The entire planning and demonstration journey still works.

GA4 remains unconfigured until the public measurement ID and property collection settings are authorized. GSC's current connector list did not expose ScrizaOne during the earlier check. Consent-aware event code is infrastructure, not a historical baseline.

## Weekly question-to-improvement loop

- Collect only consented and redacted buyer questions in an approved private business system. Use QUESTION-QUEUE.csv as a blank manual template; do not commit actual lead records, identity details or private questions to this repository.
- Classify the decision: cost, risk/problem, comparison, documented review or best fit. Check whether an existing answer already covers it before creating another URL.
- Validate the market terminology and source. Note whether evidence is a company claim, operator fact, visitor self-report, synthetic example or hypothesis.
- Improve one answer, tool rule or failure case. Record the expected buyer decision, an owner and a stop/change rule. Review with a subject-matter expert before making new company claims.
- Record interaction, composition, provider acceptance, observed delivery, qualification, opportunity and closed revenue separately. Unknown is not zero. Human qualification needs the fit/disqualification reason and a responsible owner.
- Compare matching time windows only after a reliable instrumentation baseline exists. Low sample size and missing consent/referrers limit attribution. Do not infer customer demand from a synthetic demo run.
- Refresh operator/regulator sources and product terms when they change. Retire or revise unsupported claims. Do not generate country pages merely to increase page count.

## Operational checks

Run npm test, npm run check:research, npm run audit:growth, npm run build. On a protected preview, use the existing Vercel protection flow. Do not change access controls or buy observability services merely for QA. Preserve preview noindex and canonical production origin.

No unsolicited emails, community posts, ads, backlink purchases, paid models or new customer database are included.
