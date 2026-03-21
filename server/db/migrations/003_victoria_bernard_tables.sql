-- Migration 003: Victoria & Bernard workspace-specific tables
-- Idempotent — safe to re-run

-- ============================================================
-- VICTORIA — Governance / Legal workspace
-- ============================================================

-- Governance meetings (board, committee, general membership)
CREATE TABLE IF NOT EXISTS meetings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  meeting_type    TEXT NOT NULL DEFAULT 'general'
    CHECK (meeting_type IN ('board', 'committee', 'general_membership', 'working_group', 'other')),
  status          TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  meeting_date    TIMESTAMPTZ NOT NULL,
  location        TEXT,
  virtual_link    TEXT,
  agenda          TEXT,
  minutes         TEXT,
  attendee_count  INTEGER,
  quorum_reached  BOOLEAN,
  chaired_by      TEXT,
  recorded_by     TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Formal resolutions passed by the governance body
CREATE TABLE IF NOT EXISTS resolutions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  resolution_number TEXT,
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL DEFAULT 'governance'
    CHECK (category IN ('governance', 'finance', 'policy', 'membership', 'legal', 'operations', 'other')),
  status          TEXT NOT NULL DEFAULT 'proposed'
    CHECK (status IN ('proposed', 'under_review', 'passed', 'failed', 'withdrawn', 'superseded')),
  votes_for       INTEGER NOT NULL DEFAULT 0,
  votes_against   INTEGER NOT NULL DEFAULT 0,
  votes_abstain   INTEGER NOT NULL DEFAULT 0,
  proposed_by     TEXT,
  meeting_id      UUID REFERENCES meetings(id) ON DELETE SET NULL,
  passed_at       TIMESTAMPTZ,
  effective_date  DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Governance committees
CREATE TABLE IF NOT EXISTS committees (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  purpose         TEXT,
  chair           TEXT,
  status          TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'dissolved')),
  meeting_cadence TEXT,   -- e.g. "Monthly", "Quarterly"
  member_count    INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BERNARD — Programs / Community workspace
-- ============================================================

-- Community programs
CREATE TABLE IF NOT EXISTS programs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL DEFAULT 'community'
    CHECK (category IN ('education', 'community', 'leadership', 'wellness', 'advocacy', 'social', 'other')),
  status          TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'completed', 'planned')),
  start_date      DATE,
  end_date        DATE,
  capacity        INTEGER,
  enrolled_count  INTEGER NOT NULL DEFAULT 0,
  lead_name       TEXT,
  budget_cents    INTEGER,
  location        TEXT,
  is_recurring    BOOLEAN NOT NULL DEFAULT FALSE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Program enrollments (members enrolled in programs)
CREATE TABLE IF NOT EXISTS program_enrollments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  program_id      UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  member_id       UUID REFERENCES members(id) ON DELETE SET NULL,
  member_email    TEXT,
  status          TEXT NOT NULL DEFAULT 'enrolled'
    CHECK (status IN ('enrolled', 'completed', 'withdrawn', 'waitlisted')),
  enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  UNIQUE (program_id, member_email)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_meetings_workspace    ON meetings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date         ON meetings(meeting_date DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_status       ON meetings(status);

CREATE INDEX IF NOT EXISTS idx_resolutions_workspace ON resolutions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_resolutions_status    ON resolutions(status);
CREATE INDEX IF NOT EXISTS idx_resolutions_category  ON resolutions(category);

CREATE INDEX IF NOT EXISTS idx_committees_workspace  ON committees(workspace_id);

CREATE INDEX IF NOT EXISTS idx_programs_workspace    ON programs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_programs_status       ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_category     ON programs(category);

CREATE INDEX IF NOT EXISTS idx_program_enrollments_program ON program_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_program_enrollments_member  ON program_enrollments(member_id);
