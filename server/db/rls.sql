-- Leonard & Victoria — Supabase RLS Policies (v2)
-- Apply AFTER running schema.sql in Supabase SQL editor.

-- ============================================================
-- HELPERS
-- ============================================================

CREATE OR REPLACE FUNCTION current_user_global_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT global_role FROM public.user_profiles WHERE id = auth.uid() LIMIT 1),
    (SELECT role FROM public.users WHERE auth_id = auth.uid() LIMIT 1),
    'member'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_workspace_role(p_workspace_id UUID)
RETURNS TEXT AS $$
  SELECT workspace_role FROM public.workspace_memberships
  WHERE user_id = auth.uid()
    AND workspace_id = p_workspace_id
    AND status = 'active'
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_has_workspace_access(p_workspace_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_memberships
    WHERE user_id = auth.uid()
      AND workspace_id = p_workspace_id
      AND status = 'active'
  ) OR current_user_global_role() IN ('super_admin', 'developer');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- ENABLE RLS
-- ============================================================
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- WORKSPACES
-- ============================================================
CREATE POLICY "workspaces_member_read" ON workspaces
  FOR SELECT USING (user_has_workspace_access(id));

CREATE POLICY "workspaces_superadmin_all" ON workspaces
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'developer'));

-- ============================================================
-- USER PROFILES
-- ============================================================
CREATE POLICY "user_profiles_read_own" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "user_profiles_superadmin_all" ON user_profiles
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'developer'));

-- ============================================================
-- WORKSPACE MEMBERSHIPS
-- ============================================================
-- Users can read their own memberships
CREATE POLICY "wm_read_own" ON workspace_memberships
  FOR SELECT USING (user_id = auth.uid());

-- super_admin/developer can manage all
CREATE POLICY "wm_superadmin_all" ON workspace_memberships
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'developer'));

-- ============================================================
-- USERS (legacy)
-- ============================================================
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "users_superadmin_all" ON users
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'admin', 'developer'));

-- ============================================================
-- MEMBERS
-- ============================================================
CREATE POLICY "members_workspace_access" ON members
  FOR SELECT USING (user_has_workspace_access(workspace_id));

CREATE POLICY "members_superadmin_write" ON members
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'admin', 'developer'));

-- ============================================================
-- APPLICATIONS
-- ============================================================
CREATE POLICY "applications_workspace_access" ON applications
  FOR SELECT USING (user_has_workspace_access(workspace_id));

CREATE POLICY "applications_superadmin_all" ON applications
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'admin', 'developer'));

-- ============================================================
-- CONTACT REQUESTS
-- ============================================================
CREATE POLICY "contact_requests_workspace_access" ON contact_requests
  FOR SELECT USING (user_has_workspace_access(workspace_id));

CREATE POLICY "contact_requests_superadmin_all" ON contact_requests
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'admin', 'developer'));

-- ============================================================
-- DOCUMENTS (no public access — workspace-scoped only)
-- ============================================================
CREATE POLICY "documents_workspace_access" ON documents
  FOR SELECT USING (user_has_workspace_access(workspace_id));

CREATE POLICY "documents_workspace_write" ON documents
  FOR INSERT WITH CHECK (user_has_workspace_access(workspace_id));

CREATE POLICY "documents_superadmin_all" ON documents
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'admin', 'developer'));

-- ============================================================
-- EVENTS
-- ============================================================
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (member_only = FALSE);

CREATE POLICY "events_workspace_read" ON events
  FOR SELECT USING (user_has_workspace_access(workspace_id));

CREATE POLICY "events_superadmin_all" ON events
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'admin', 'developer'));

-- ============================================================
-- EVENT REGISTRATIONS
-- ============================================================
CREATE POLICY "event_reg_own" ON event_registrations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "event_reg_workspace_read" ON event_registrations
  FOR SELECT USING (user_has_workspace_access(workspace_id));

-- ============================================================
-- PAYMENT TRANSACTIONS
-- ============================================================
CREATE POLICY "payments_workspace_access" ON payment_transactions
  FOR SELECT USING (user_has_workspace_access(workspace_id));

CREATE POLICY "payments_superadmin_all" ON payment_transactions
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'admin', 'developer'));

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE POLICY "audit_workspace_access" ON audit_logs
  FOR SELECT USING (user_has_workspace_access(workspace_id));

CREATE POLICY "audit_superadmin_all" ON audit_logs
  FOR ALL USING (current_user_global_role() IN ('super_admin', 'admin', 'developer'));

-- ============================================================
-- STORAGE POLICIES (documents bucket — workspace-scoped paths)
-- ============================================================
-- Paths follow: documents/{workspace_slug}/{filename}
-- No public access. All reads must go through signed URLs generated server-side.

-- Allow authenticated users to upload to their workspace paths
CREATE POLICY "storage_workspace_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND user_has_workspace_access(
      (SELECT id FROM public.workspaces WHERE slug = split_part(name, '/', 1) LIMIT 1)
    )
  );

-- Only allow reads via signed URLs (no direct authenticated SELECT)
-- Access is enforced server-side by generating short-lived signed URLs.
