-- Leonard & Victoria — Supabase Row Level Security Policies
-- Apply after running schema.sql in the Supabase SQL editor

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role from users table
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- USERS
-- ============================================================
-- Users can read their own record
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (auth_id = auth.uid());

-- Admin can read all
CREATE POLICY "users_admin_all" ON users
  FOR ALL USING (current_user_role() = 'admin');

-- ============================================================
-- MEMBERS
-- ============================================================
-- Members can read their own record
CREATE POLICY "members_read_own" ON members
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Admin and operations can read all
CREATE POLICY "members_admin_ops_read" ON members
  FOR SELECT USING (current_user_role() IN ('admin', 'operations'));

-- Admin can write all
CREATE POLICY "members_admin_write" ON members
  FOR ALL USING (current_user_role() = 'admin');

-- ============================================================
-- APPLICATIONS
-- ============================================================
-- Anyone can submit (INSERT) an application — enforced at API level, no anon RLS needed
-- Admin can read and update all
CREATE POLICY "applications_admin_all" ON applications
  FOR ALL USING (current_user_role() = 'admin');

-- ============================================================
-- CONTACT REQUESTS
-- ============================================================
-- Admin only
CREATE POLICY "contact_requests_admin" ON contact_requests
  FOR ALL USING (current_user_role() = 'admin');

-- ============================================================
-- DOCUMENTS
-- ============================================================
-- All authenticated members can view documents
CREATE POLICY "documents_authenticated_read" ON documents
  FOR SELECT USING (auth.role() = 'authenticated');

-- Uploader can manage their own docs
CREATE POLICY "documents_uploader_manage" ON documents
  FOR ALL USING (
    uploader_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Admin and legal can manage all
CREATE POLICY "documents_admin_legal_manage" ON documents
  FOR ALL USING (current_user_role() IN ('admin', 'legal'));

-- ============================================================
-- EVENTS
-- ============================================================
-- Public can read non-member-only events
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (member_only = FALSE);

-- Authenticated can read all events
CREATE POLICY "events_auth_read" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admin can manage all
CREATE POLICY "events_admin_manage" ON events
  FOR ALL USING (current_user_role() = 'admin');

-- ============================================================
-- EVENT REGISTRATIONS
-- ============================================================
-- Users can manage their own registrations
CREATE POLICY "event_reg_own" ON event_registrations
  FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Admin can read all
CREATE POLICY "event_reg_admin_read" ON event_registrations
  FOR SELECT USING (current_user_role() = 'admin');

-- ============================================================
-- PAYMENT TRANSACTIONS
-- ============================================================
-- Admin only
CREATE POLICY "payments_admin_only" ON payment_transactions
  FOR ALL USING (current_user_role() = 'admin');

-- ============================================================
-- AUDIT LOGS
-- ============================================================
-- Admin only
CREATE POLICY "audit_logs_admin_only" ON audit_logs
  FOR ALL USING (current_user_role() = 'admin');
