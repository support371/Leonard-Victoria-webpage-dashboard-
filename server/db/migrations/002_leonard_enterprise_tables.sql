-- ============================================================
-- Migration 002: Leonard Enterprise Portal Tables
-- Idempotent — uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS
-- Run after 001_add_workspaces.sql
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- CLIENTS  (CRM-style client records, Leonard workspace)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  full_name        TEXT NOT NULL,
  email            TEXT,
  phone            TEXT,
  company          TEXT,
  status           TEXT NOT NULL DEFAULT 'prospect'
    CHECK (status IN ('prospect', 'active', 'inactive', 'archived')),
  onboarding_stage TEXT NOT NULL DEFAULT 'inquiry'
    CHECK (onboarding_stage IN ('inquiry', 'application', 'review', 'onboarded', 'active', 'offboarded')),
  membership_tier  TEXT
    CHECK (membership_tier IN ('community', 'stewardship', 'legacy')),
  notes            TEXT,
  next_followup    TIMESTAMPTZ,
  created_by       UUID,                     -- auth UUID of the creating user
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- PORTFOLIO ACCOUNTS  (investment account containers per client)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_accounts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id     UUID REFERENCES clients(id) ON DELETE SET NULL,
  account_name  TEXT NOT NULL,
  account_type  TEXT NOT NULL DEFAULT 'general'
    CHECK (account_type IN ('digital_asset', 'crypto_asset', 'real_estate', 'general', 'mixed')),
  provider      TEXT,
  status        TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'closed')),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- PORTFOLIO HOLDINGS  (individual asset positions)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id         UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id            UUID REFERENCES clients(id) ON DELETE SET NULL,
  portfolio_account_id UUID REFERENCES portfolio_accounts(id) ON DELETE SET NULL,
  asset_category       TEXT NOT NULL
    CHECK (asset_category IN ('digital_asset', 'crypto_asset', 'real_estate')),
  asset_subtype        TEXT,
  symbol_or_name       TEXT NOT NULL,
  quantity             NUMERIC(24, 8) NOT NULL DEFAULT 0,
  unit_value           NUMERIC(24, 8) NOT NULL DEFAULT 0,
  total_value          NUMERIC(24, 2) NOT NULL DEFAULT 0,  -- maintained by backend: quantity * unit_value
  currency             TEXT NOT NULL DEFAULT 'USD',
  acquisition_date     DATE,
  status               TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'sold', 'pending', 'frozen')),
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- REAL ESTATE ASSETS  (property records)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS real_estate_assets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id         UUID REFERENCES clients(id) ON DELETE SET NULL,
  property_name     TEXT NOT NULL,
  property_type     TEXT NOT NULL DEFAULT 'residential'
    CHECK (property_type IN ('residential', 'commercial', 'industrial', 'land', 'mixed_use', 'other')),
  address           TEXT,
  city              TEXT,
  state_province    TEXT,
  country           TEXT NOT NULL DEFAULT 'US',
  market_value      NUMERIC(24, 2),
  acquisition_date  DATE,
  acquisition_price NUMERIC(24, 2),
  ownership_status  TEXT NOT NULL DEFAULT 'owned'
    CHECK (ownership_status IN ('owned', 'partial', 'leased', 'under_contract', 'pending_sale', 'sold')),
  occupancy_status  TEXT NOT NULL DEFAULT 'vacant'
    CHECK (occupancy_status IN ('occupied', 'vacant', 'partial', 'under_renovation')),
  revenue_amount    NUMERIC(24, 2),
  expense_amount    NUMERIC(24, 2),
  revenue_period    TEXT DEFAULT 'monthly',
  status            TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'archived', 'sold')),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- SECURITY ASSETS  (monitored asset inventory)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS security_assets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  asset_name        TEXT NOT NULL,
  asset_type        TEXT NOT NULL DEFAULT 'endpoint'
    CHECK (asset_type IN ('endpoint', 'server', 'network', 'cloud', 'application', 'identity', 'data', 'other')),
  criticality       TEXT NOT NULL DEFAULT 'medium'
    CHECK (criticality IN ('critical', 'high', 'medium', 'low')),
  owner_name        TEXT,
  monitoring_status TEXT NOT NULL DEFAULT 'active'
    CHECK (monitoring_status IN ('active', 'inactive', 'degraded', 'unknown')),
  protection_status TEXT NOT NULL DEFAULT 'protected'
    CHECK (protection_status IN ('protected', 'partial', 'unprotected', 'unknown')),
  ip_address        TEXT,
  location          TEXT,
  last_checked_at   TIMESTAMPTZ,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- SECURITY INCIDENTS  (threat / alert tracking)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS security_incidents (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  security_asset_id UUID REFERENCES security_assets(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  severity          TEXT NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  status            TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'investigating', 'contained', 'resolved', 'closed')),
  incident_type     TEXT,
  detected_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at       TIMESTAMPTZ,
  assigned_to       TEXT,
  resolution_notes  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add settings JSONB column to workspaces (for workspace-level config)
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT '{}';

-- ──────────────────────────────────────────────────────────────
-- Indexes
-- ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_clients_workspace      ON clients(workspace_id);
CREATE INDEX IF NOT EXISTS idx_clients_status         ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_email          ON clients(email);

CREATE INDEX IF NOT EXISTS idx_portfolio_accounts_workspace ON portfolio_accounts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_accounts_client    ON portfolio_accounts(client_id);

CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_workspace ON portfolio_holdings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_client    ON portfolio_holdings(client_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_category  ON portfolio_holdings(asset_category);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_account   ON portfolio_holdings(portfolio_account_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_workspace  ON real_estate_assets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_client     ON real_estate_assets(client_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_status     ON real_estate_assets(status);

CREATE INDEX IF NOT EXISTS idx_security_assets_workspace  ON security_assets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_security_assets_criticality ON security_assets(criticality);

CREATE INDEX IF NOT EXISTS idx_security_incidents_workspace ON security_incidents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_security_incidents_status    ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_security_incidents_severity  ON security_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_security_incidents_detected  ON security_incidents(detected_at DESC);
