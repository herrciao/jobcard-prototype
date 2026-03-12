-- JobCard SaaS Database Schema
-- Run this in Supabase SQL Editor

-- 1. Profiles table (synced from NextAuth on login)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  locale TEXT DEFAULT 'zh-TW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Set admin role for the owner
UPDATE profiles SET role = 'admin' WHERE email = 'info@elixirfab.com';

-- 2. Job Cards table
CREATE TABLE IF NOT EXISTS job_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL DEFAULT 'lathe',
  part_name TEXT DEFAULT '',
  machine TEXT DEFAULT '',
  material TEXT DEFAULT '',
  program_id TEXT DEFAULT '',
  cycle_time TEXT DEFAULT '',
  date TEXT DEFAULT '',
  setup_data JSONB DEFAULT '{}',
  tools_data JSONB DEFAULT '[]',
  warnings TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_cards_user_id ON job_cards(user_id);

-- 3. Job Card Photos table
CREATE TABLE IF NOT EXISTS job_card_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  public_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_card_photos_job_card_id ON job_card_photos(job_card_id);
CREATE INDEX idx_job_card_photos_user_id ON job_card_photos(user_id);

-- 4. Subscriptions table (if not already created)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan TEXT NOT NULL DEFAULT 'free',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- 5. Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_card_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS; these policies are for anon/authenticated access if needed
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can read own job cards" ON job_cards FOR SELECT USING (true);
CREATE POLICY "Users can insert own job cards" ON job_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own job cards" ON job_cards FOR UPDATE USING (true);
CREATE POLICY "Users can delete own job cards" ON job_cards FOR DELETE USING (true);

CREATE POLICY "Users can read own photos" ON job_card_photos FOR SELECT USING (true);
CREATE POLICY "Users can insert own photos" ON job_card_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own photos" ON job_card_photos FOR DELETE USING (true);

CREATE POLICY "Users can read own subscription" ON subscriptions FOR SELECT USING (true);
