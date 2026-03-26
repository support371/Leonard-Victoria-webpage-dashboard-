-- ============================================================
-- Migration 004: Community Layer Tables
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COMMUNITY PROFILES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  profile_type      TEXT NOT NULL DEFAULT 'member'
    CHECK (profile_type IN ('member', 'practitioner')),
  bio               TEXT,
  specialties       TEXT[],
  region            TEXT,
  availability      TEXT DEFAULT 'remote'
    CHECK (availability IN ('remote', 'in-person', 'both')),
  status            TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
  featured_image_url TEXT,
  contact_cta       TEXT DEFAULT 'Connect',
  metadata          JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- COMMUNITY SERVICES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_services (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id       UUID NOT NULL REFERENCES community_profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  category         TEXT,
  audience         TEXT,
  expected_outcome TEXT,
  price_info       TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'inactive')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- COMMUNITY CONTENT (Stories & Testimonials)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_content (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type  TEXT NOT NULL DEFAULT 'testimonial'
    CHECK (content_type IN ('story', 'testimonial', 'highlight')),
  author_name   TEXT NOT NULL,
  author_role   TEXT,
  content       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'inactive')),
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- FEATURED PLACEMENTS
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS featured_placements (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section        TEXT NOT NULL,              -- e.g., 'hub_featured', 'hub_practitioners'
  resource_type  TEXT NOT NULL,              -- 'profile', 'service', 'content', 'event'
  resource_id    UUID NOT NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(section, resource_id)
);

-- ──────────────────────────────────────────────────────────────
-- Indexes
-- ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_community_profiles_user      ON community_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_community_profiles_status    ON community_profiles(status);
CREATE INDEX IF NOT EXISTS idx_community_profiles_type      ON community_profiles(profile_type);

CREATE INDEX IF NOT EXISTS idx_community_services_profile    ON community_services(profile_id);
CREATE INDEX IF NOT EXISTS idx_community_services_status     ON community_services(status);

CREATE INDEX IF NOT EXISTS idx_community_content_type       ON community_content(content_type);
CREATE INDEX IF NOT EXISTS idx_community_content_featured   ON community_content(featured);

CREATE INDEX IF NOT EXISTS idx_featured_placements_section  ON featured_placements(section);
