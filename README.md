# Bilgewater Market

Premium Riftbound TCG vending site — browse inventory, express interest, join the weekly email list.

**Stack:** Next.js (App Router) · Tailwind · Sanity Studio · Resend  
**Domain:** [www.bilgewatermkt.com](https://www.bilgewatermkt.com) (buy + DNS on Cloudflare; host on Vercel)

## Quick start (no logistics required)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Until Sanity and Resend are connected:

- The site shows **sample inventory** so you can build/review UI
- Interest + subscribe forms succeed with a local capture message (check the server console)
- `/studio` shows setup instructions

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Local development        |
| `npm run build` | Production build       |
| `npm run start` | Run production server  |
| `npm run lint`  | ESLint                 |

## Pages

- `/` — Home + weekly list signup
- `/inventory` — Available cards + express interest
- `/contact` — General inquiry form
- `/faq` — Buying / authenticity / shipping
- `/studio` — Sanity inventory dashboard (after env is set)

## Connect Sanity (when ready)

1. Create a project at [sanity.io](https://www.sanity.io)
2. Copy `.env.example` → `.env.local` and set:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)
3. Restart `npm run dev` and open `/studio`
4. Add inventory items (images, price, status)
5. Optional: webhook to `POST /api/revalidate?secret=YOUR_SECRET` on publish

## Connect Resend (when ready)

1. Create a [Resend](https://resend.com) account
2. Add API key + Audience ID to `.env.local`
3. Set `INQUIRY_TO_EMAIL` / `INQUIRY_FROM_EMAIL`
4. Later: verify `bilgewater.market` for production sending

Until then, forms still work in the UI (no real email sent).

## Deferred go-live logistics

Buy `bilgewatermkt.com` on **Cloudflare Registrar**, point DNS at Vercel, use Cloudflare Email Routing for `hello@…`, verify the domain in Resend. See the go-live checklist in chat history — local development does not require any of that.

## Brand

Hero / Open Graph art: `public/brand/bilgewater-market-hero.png`
