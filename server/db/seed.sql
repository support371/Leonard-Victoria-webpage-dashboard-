-- Leonard & Victoria — Development Seed Data
-- Run AFTER schema.sql. Do NOT run in production.

-- Workspaces
INSERT INTO workspaces (slug, name, workspace_type) VALUES
  ('leonard',   'Leonard',   'personal'),
  ('victoria',  'Victoria',  'personal'),
  ('bernard',   'Bernard',   'legal'),
  ('developer', 'Developer', 'developer')
ON CONFLICT (slug) DO NOTHING;

-- Sample events (associated with leonard workspace)
-- (workspace_id resolved by slug at insert time)
INSERT INTO events (workspace_id, title, description, event_date, location, category, member_only, capacity)
SELECT w.id, e.title, e.description, e.event_date, e.location, e.category, e.member_only, e.capacity
FROM workspaces w, (VALUES
  ('leonard', 'Governance Forum — Q1 2025', 'Quarterly member forum.', NOW() + INTERVAL '14 days', 'Virtual (Zoom)', 'Governance', TRUE, 200),
  ('leonard', 'Community Welcome Gathering', 'Open event for new members.', NOW() + INTERVAL '21 days', 'TBD — City Center', 'Community', FALSE, 80)
) AS e(slug, title, description, event_date, location, category, member_only, capacity)
WHERE w.slug = e.slug
ON CONFLICT DO NOTHING;

-- Developer/admin user profile (auth UUID must be set manually after creating in Supabase Auth dashboard)
-- Replace 'YOUR-SUPABASE-AUTH-UUID' with the actual UUID after provisioning the user in Supabase.
-- INSERT INTO user_profiles (id, email, full_name, global_role)
-- VALUES ('YOUR-SUPABASE-AUTH-UUID', 'developer@leonardandvictoria.org', 'Developer Admin', 'super_admin')
-- ON CONFLICT (id) DO NOTHING;
