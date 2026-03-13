-- Migration: Add team_members table for collaboration feature

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  member_email TEXT NOT NULL,
  can_create BOOLEAN NOT NULL DEFAULT true,
  can_edit BOOLEAN NOT NULL DEFAULT true,
  can_delete BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(owner_id, member_email)
);

CREATE INDEX IF NOT EXISTS idx_team_members_owner ON team_members(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(member_email);
CREATE INDEX IF NOT EXISTS idx_team_members_member ON team_members(member_id);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read team members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Users can insert team members" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update team members" ON team_members FOR UPDATE USING (true);
CREATE POLICY "Users can delete team members" ON team_members FOR DELETE USING (true);
