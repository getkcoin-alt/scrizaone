# ScrizaOne — international website (scrizaone.com)

International site for Scriza Private Limited. Strategy and rules: see `docs/global-strategy.md`
in the scriza.in GitLab repo (§5.2 two-site model, §5.3 location-aware experience).

## Stack
Next.js 14 (App Router), statically generated. No external UI libraries.

## Structure
- `lib/site.js` — company facts (keep identical to scriza.in)
- `lib/locales.js` — regional pages: currency, hours overlap, payment rails, regulatory topics
- `lib/service-content.js` — service page copy (claims must stay verifiable)
- `/` global, `/us` `/uk` `/ca` `/au` `/sg` `/ae` `/eu` regional homes; `/[region]/services/[service]`
- `middleware.js` — sets a country cookie for the suggestion banner and noindexes non-production hosts

## Location-aware rules
- One crawlable URL per region with hreflang. Content is never swapped by IP at one URL.
- Visitors get a dismissible suggestion banner; there is no automatic redirect.

## Environment
- `NEXT_PUBLIC_SITE_URL` (optional): canonical origin, default `https://www.scrizaone.com`.

## Develop
```bash
npm install
npm run dev
```

## Buyer experience

- `/demos` — three bounded synthetic workflows with failures and resets.
- `/tools/payment-readiness` — fintech/software/organic planning workspace; existing provider checklist retained.
- `/meeting-prep` — browser-local brief and agenda, noindex and no public buyer records.
- `docs/buyer/OPERATIONS.md` and `EVIDENCE.md` — operating loop, data handling, claims and dependencies.
- Riza receives a reviewed brief locally; email recipients and validation stay server-controlled. Preferred time is optional and never a confirmed booking.
