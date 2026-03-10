# JobCard SaaS

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in your keys
2. Run `npm install`
3. Run `npm run dev`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Run `npx auth secret` to generate |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase project settings (keep secret) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe dashboard |
| `STRIPE_SECRET_KEY` | From Stripe dashboard (keep secret) |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook settings |
| `STRIPE_PRO_PRICE_ID` | Price ID of your Pro subscription product |
| `RESEND_API_KEY` | From resend.com |
| `CONTACT_EMAIL` | Email to receive contact form submissions |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL (e.g. https://jobcard.vercel.app) |

## Supabase Tables

Run this SQL in your Supabase SQL editor:

```sql
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text default 'inactive',
  plan text default 'free',
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid()::text = user_id);
```

## Deploy

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
