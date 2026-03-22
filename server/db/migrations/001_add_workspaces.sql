-- Migration 001: Add workspace isolation layer
-- Run this against an EXISTING database that already has the v1 schema.
-- Safe to run multiple times (idempotent).

-- ============================================================
-- NEW TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS workspaces (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  workspace_type TEXT NOT NULL DEFAULT 'personal'
    CHECK (workspace_type IN ('personal', 'legal', 'developer', 'shared')),
  status         TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'archived')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id           UUID PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  full_name    TEXT,
  global_role  TEXT NOT NULL DEFAULT 'member'
    CHECK (global_role IN ('member', 'legal', 'operations', 'admin', 'developer', 'super_admin')),
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace_memberships (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id   UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL,
  workspace_role TEXT NOT NULL DEFAULT 'viewer'
    CHECK (workspace_role IN ('owner', 'editor', 'viewer', 'legal_reviewer')),
  status         TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'revoked')),
  granted_by     UUID,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

-- ============================================================
-- ADD workspace_id TO EXISTING TABLES (nullable — safe for existing rows)
-- ============================================================

ALTER TABLE members            ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;
ALTER TABLE applications       ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;
ALTER TABLE contact_requests   ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;
ALTER TABLE events             ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;
ALTER TABLE audit_logs         ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;

-- Documents: drop public_url (no unrestricted public access) and add workspace_id
ALTER TABLE documents ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
-- Note: public_url column is kept for backward compat but ignored by new code.
-- Signed URLs are generated on demand instead.

-- Extend users.role check to include new roles (requires recreating the constraint)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('member', 'legal', 'operations', 'admin', 'developer', 'super_admin'));

-- ============================================================
-- SEED WORKSPACES
-- ============================================================
INSERT INTO workspaces (slug, name, workspace_type) VALUES
  ('leonard',   'Leonard',   'personal'),
  ('victoria',  'Victoria',  'personal'),
  ('bernard',   'Bernard',   'legal'),
  ('developer', 'Developer', 'developer')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_workspace_memberships_user ON workspace_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_memberships_workspace ON workspace_memberships(workspace_id);
CREATE INDEX IF NOT EXISTS idx_members_workspace ON members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_applications_workspace ON applications(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_workspace ON documents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_workspace ON events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_workspace ON payment_transactions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace ON audit_logs(workspace_id);
