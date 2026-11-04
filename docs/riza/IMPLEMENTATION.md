# Riza project discovery and demo enquiries

## User flow

The approved cyan avatar launches a lazy-loaded chat on every page. Riza is visibly identified as AI. It asks context-specific discovery questions using only the site's published company/service facts. No tools or email/calendar credentials are available to the model.

The visitor reviews and edits their contact details, business/country, service, requirements, timeline, optional budget, exact preferred local date/time and IANA time zone. Chat inclusion is optional. Explicit consent and a review step precede email submission. Resend acceptance is the only condition for the success screen. The existing mailto contact form remains working.

Recipient mapping was supplied explicitly by the owner:
- To: sales@scriza.in
- CC: karnveer@scriza.in, laxman@scriza.in
- From: Riza at ScrizaOne <riza@scrizaone.com> (owner reports this domain verified in Resend)
- Reply-To: the validated visitor email

These recipients and sender are server constants. The model and request payload cannot replace them. Plain-text enquiry content includes the reviewed requirements, optional transcript, preferred time plus UTC, consent timestamp and an explicit unconfirmed-slot status. Visitor text is labelled untrusted.

## Meeting boundary

No calendar connection or availability endpoint was supplied. Therefore Riza requests a preferred 30-minute slot; it never claims a reservation, confirmed booking or meeting link. The team confirms availability by replying. Automatic final booking requires an authorized scheduling calendar, availability rules and an invitation/meeting-link integration. Do not fake a booking to complete the conversation.

Dates are checked on server and client. The conversion validates the local date, IANA zone and a one-hour/90-day scheduling window. DST gaps and repeated local times are rejected rather than guessed. Both local time/zone and UTC reach the team.

## Model choice and zero-cost boundary

Catalog checked 4 November 2026 at https://openrouter.ai/api/v1/models. First preference: nvidia/nemotron-3-ultra-550b-a55b:free, followed by nvidia/nemotron-3.5-super-vl:free, google/gemma-4-31b-it:free and openrouter/free when earlier candidates are unavailable in the catalog. At most two candidates are attempted per chat request.

This is a task-specific initial preference, not a claim of universal best-model benchmark performance. Primary choice combines a large-capacity current model and available free serving; site-specific live evaluation follows deployment. The public free-model collection's popularity ranking is usage, not quality: https://openrouter.ai/collections/free-models/.

Only allowlisted :free model IDs or openrouter/free can run. When catalog data is available, prompt/completion prices must both be zero. Provider max_price is zero for both directions; no paid fallback or automatic credit purchase is configured. Provider data_collection:'deny' is requested. Free models have capacity/rate limits and may be unavailable, especially when these privacy preferences exclude providers. The enquiry form stays available when AI is unavailable. Free limits are account-wide; do not promise an SLA.

References: https://openrouter.ai/docs/guides/routing/provider-selection and https://openrouter.ai/docs/api-reference/limits.

## Credentials

Server-only Vercel environment variables OPEN_ROUTER and RESEND_MAIL were observed by name in production, without decrypting or exporting their values. Neither key is a NEXT_PUBLIC variable. An optional dedicated RIZA_SESSION_SECRET may be configured; otherwise session signing derives from a server-side API credential with domain separation. Rotating the signing credential expires existing sessions. No diagnostics endpoint or secret-printing behavior is added.

## Security and delivery

- Same-origin JSON POSTs only; signed, expiring HttpOnly/SameSite=Strict session cookie and session-specific CSRF header.
- Bounded request bytes, message length/count, alternating user/assistant roles, no caller-provided system prompt or tools.
- Fixed destinations, validated email, constrained service enum, honeypot, minimum review time, consent check and plain-text mail.
- Resend Idempotency-Key is fixed per signed session; retries keep the same reviewed payload and timestamp. No automatic email retry loop or model-triggered send. Provider acceptance is not a delivery receipt.
- Per-instance IP/session request guards are best effort. They are not a durable, cross-region rate limit. For sustained abuse or larger traffic, configure a platform WAF rate limit or an approved durable limiter/CAPTCHA; no new paid service is silently provisioned.
- No persistent chat/lead database is introduced. Conversation lives in browser memory; selected chat and reviewed fields pass through Resend to team mailboxes only after consent. External model processing is disclosed. Basic contact redaction is defense in depth, not complete PII detection.
- Logs contain operational codes/model IDs/email acceptance IDs, not API keys, raw prompts, transcripts or contact fields. API routes send no-store/noindex and are excluded from robots crawling.
- UI renders model text as React text, not HTML. Obvious booking/send claims are replaced, but the authoritative send/booking status comes from server/UI, not model prose.

Resend API and deduplication references: https://resend.com/docs/api-reference/emails/send-email and https://resend.com/blog/engineering-idempotency-keys.

## Verification and operations

Run npm test and npm run build. Browser checks cover desktop/mobile chat, keyboard focus, enquiry review, time-zone conversion, API origin/session rejection and provider mocks. Mock credentials and transport hooks live outside the repository and are never production feature flags.

After deployment, exercise the real free model and one clearly labelled internal setup enquiry to the exact authorized internal recipients. Do not fabricate a customer or claim inbox delivery from an accepted-email ID. Record the actual model/service result in the release report. Inspect redacted runtime errors; confirm privacy copy reflects live processing.

Rollback source parent: 5d8b5ec6e1c9a9a4aa10c8b6019d72b5103d8881. Existing services, canonicals and country architecture stay intact. Revert with a normal commit; do not force-push or remove later work.
