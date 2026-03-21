-- Leonard & Victoria — PostgreSQL Schema (v2 — workspace-isolated)
-- Run this against a fresh database or via Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- WORKSPACES
-- ============================================================
CREATE TABLE IF NOT EXISTS workspaces (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           TEXT UNIQUE NOT NULL,         -- leonard | victoria | bernard | developer
  name           TEXT NOT NULL,
  workspace_type TEXT NOT NULL DEFAULT 'personal'
    CHECK (workspace_type IN ('personal', 'legal', 'developer', 'shared')),
  status         TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'archived')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USER PROFILES (canonical, DB-managed roles — supplements Supabase auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id           UUID PRIMARY KEY,              -- = Supabase auth.users.id
  email        TEXT UNIQUE NOT NULL,
  full_name    TEXT,
  global_role  TEXT NOT NULL DEFAULT 'member'
    CHECK (global_role IN ('member', 'legal', 'operations', 'admin', 'developer', 'super_admin')),
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WORKSPACE MEMBERSHIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS workspace_memberships (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id   UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL,               -- Supabase auth UUID (= user_profiles.id)
  workspace_role TEXT NOT NULL DEFAULT 'viewer'
    CHECK (workspace_role IN ('owner', 'editor', 'viewer', 'legal_reviewer')),
  status         TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'revoked')),
  granted_by     UUID,                        -- auth UUID of the granting user
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

-- ============================================================
-- USERS (legacy — kept for FK references, superseded by user_profiles)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id     UUID UNIQUE,
  email       TEXT UNIQUE NOT NULL,
  role        TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('member', 'legal', 'operations', 'admin', 'developer', 'super_admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS members (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id     UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  membership_tier  TEXT NOT NULL DEFAULT 'community'
    CHECK (membership_tier IN ('community', 'stewardship', 'legacy')),
  status           TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
  stripe_customer_id TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, email)
);

-- ============================================================
-- APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id     UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  membership_tier  TEXT NOT NULL DEFAULT 'community'
    CHECK (membership_tier IN ('community', 'stewardship', 'legacy')),
  motivation       TEXT NOT NULL,
  referral         TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_at      TIMESTAMPTZ,
  reviewed_by      UUID REFERENCES users(auth_id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CONTACT REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_requests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  subject      TEXT NOT NULL,
  message      TEXT NOT NULL,
  resolved     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('legal', 'governance', 'finance', 'operations', 'member', 'general')),
  description   TEXT,
  storage_path  TEXT,
  filename      TEXT,
  size_bytes    BIGINT,
  content_type  TEXT,
  -- No public_url: all access via signed URLs only
  uploader_id   UUID REFERENCES users(auth_id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  event_date   TIMESTAMPTZ NOT NULL,
  location     TEXT,
  capacity     INTEGER,
  category     TEXT,
  member_only  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EVENT REGISTRATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  event_id     UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

-- ============================================================
-- PAYMENT TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_transactions (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id       UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  stripe_session_id  TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  plan               TEXT,
  amount_cents       INTEGER NOT NULL DEFAULT 0,
  status             TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  customer_email     TEXT,
  member_id          UUID REFERENCES members(id) ON DELETE SET NULL,
  raw_event          JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  action        TEXT NOT NULL,
  actor_id      UUID,
  actor_email   TEXT,
  resource_type TEXT,
  resource_id   TEXT,
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_workspace_memberships_user ON workspace_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_memberships_workspace ON workspace_memberships(workspace_id);
CREATE INDEX IF NOT EXISTS idx_members_workspace ON members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_applications_workspace ON applications(workspace_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_documents_workspace ON documents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_workspace ON events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_workspace ON payment_transactions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_session ON payment_transactions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace ON audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
