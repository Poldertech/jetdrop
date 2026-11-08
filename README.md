# JetDrop — website

Discovery and alerts for European private-jet empty-leg flights. **Not** an operator or broker. Goal: free flight-alert signups.

Static multi-page site built with Vite (no framework, no server code).

```bash
npm ci
npm run dev                       # local dev server
npx vite build --outDir dist      # static output in dist/
```

## Pages
`index` · `explore` (filters, sort, empty state) · `alerts` (multi-airport, radius, budget, dates, frequency, live summary) · `flight?id=…` (one template, every listing) · `membership` · `empty-legs` · `faq` · `about` · `contact` · `login` · `privacy` / `terms` / `subscription-policy` (**placeholders — need legal review**).

## Structure
- `index.html` + other `*.html` in the project root — one Vite page each (auto-detected by `vite.config.js`)
- `public/` — favicon (copied as-is)
- `src/styles.css` — design tokens (brand colours) + components; imports self-hosted Plus Jakarta Sans via `@fontsource`
- `src/js/data.js` — **sample data only**: airports, aircraft, 15 demo flights, nearby-airport maths
- `src/js/ui.js` — header/footer, reusable `JD.flightCard`, validation, demo-notice helpers
- `src/js/{home,explore,alerts,flight}.js` — page logic (`common.js` for pages without any)

## Honesty rules built in
Listings are labelled "Sample listing"; no countdowns, reviews, discount %, or operator confirmations; per-person figures are labelled illustrations; statuses are never "confirmed"; forms show a "Demonstration mode — nothing was saved" result; Plus checkout is disabled.

## Future integrations (none connected)
| Need | Service | Where |
|---|---|---|
| Flight data, accounts, saved alerts | Supabase | replace `JD.FLIGHTS`; submit handlers in `alerts.js`, `ui.js` (`wireQuickSignup`), `login.html` |
| Listings ingestion | separate authorised ingestion service | writes `empty_legs` (id, from, to, date, time, aircraft, price, currency, source, provider_url, checked_at, status) |
| Alert/contact email | Resend or Brevo | after alert match |
| Plus subscriptions | Stripe | enable button in `membership.html` only after backend is tested |
| Matching workflow | n8n | new listing → saved alerts |

`flight.html` has `noindex` until real listings exist; switch to server-rendered per-listing pages when Supabase is wired.

## Photography
The hero is an original SVG illustration. To use licensed photography, put the file in `public/` and replace the `<svg class="hero-art">` in `index.html` with an `<img class="hero-art" src="/hero.jpg" alt="…">` (the CSS already positions it) and add provider-permitted aircraft photos on flight pages.
