# JobCard SaaS

Digital setup sheets for CNC shops. Mobile-first, cloud-saved, multilingual (EN / 繁體中文).

## Features

- **Lathe Job Card** — digital setup sheet with tooling, parameters, photos
- **Milling Job Card** — coming soon
- **Product Flow** — process route tracking across vendors
- **Photo Upload** — up to 5 photos per card via Cloudinary
- **i18n** — Traditional Chinese (default) + English, switchable in UI
- **Admin Dashboard** — user list, stats, view/delete users and their job cards
- **Auth** — Google OAuth + Email magic link via Resend
- **Stripe** — subscription billing (test mode ready)
- **GDPR** — privacy statement on landing page

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in your keys
2. Run `npm install`
3. Run the SQL in `supabase/schema.sql` in your Supabase SQL editor
4. Run `npm run dev`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Run `npx auth secret` to generate |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase project settings (keep secret) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe dashboard |
| `STRIPE_SECRET_KEY` | From Stripe dashboard (keep secret) |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook settings |
| `STRIPE_PRO_PRICE_ID` | Price ID of your Pro subscription product |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name (create in Cloudinary Settings > Upload) |
| `RESEND_API_KEY` | From resend.com |
| `CONTACT_EMAIL` | Email to receive contact form submissions |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL (e.g. https://jobcard.vercel.app) |

## Supabase Setup

Run the full SQL schema in `supabase/schema.sql` in your Supabase SQL editor. This creates:

- `profiles` — user profiles synced from NextAuth
- `job_cards` — job card data with setup, tools, warnings, notes
- `job_card_photos` — photo URLs (stored in Cloudinary)
- `subscriptions` — Stripe subscription status

## Cloudinary Setup

1. Create a free Cloudinary account
2. Go to Settings > Upload > Upload presets
3. Create an unsigned upload preset named `jobcard_unsigned`
4. Set the `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` env vars

## Limits (Free Plan)

- Max 10 job cards per user
- Max 5 photos per job card
- No video upload

## Admin Access

The admin dashboard is at `/admin`. Only the user with email `info@elixirfab.com` can access it.

## Deploy

1. Push to GitHub
2. Connect repo to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

**Note:** Vercel Hobby plan does not allow commercial use. Upgrade to Vercel Pro ($20/mo) before charging customers.
