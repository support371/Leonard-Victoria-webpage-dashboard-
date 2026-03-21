-- Leonard & Victoria — Development Seed Data
-- Run AFTER schema.sql for local development only. Do NOT run in production.

-- Sample events
INSERT INTO events (title, description, event_date, location, category, member_only, capacity)
VALUES
  ('Governance Forum — Q1 2025', 'Quarterly member forum covering governance updates, financial review, and open Q&A.', NOW() + INTERVAL '14 days', 'Virtual (Zoom)', 'Governance', TRUE, 200),
  ('Community Welcome Gathering', 'An open event welcoming new members and reacquainting the community.', NOW() + INTERVAL '21 days', 'TBD — City Center', 'Community', FALSE, 80),
  ('Member Education: Stewardship Principles', 'Deep-dive session on the practical application of stewardship principles in organizations.', NOW() + INTERVAL '35 days', 'Virtual (Zoom)', 'Education', TRUE, 150);

-- Sample admin user (password must be set via Supabase Auth dashboard)
-- This just inserts the app-level user record
INSERT INTO users (email, role)
VALUES ('admin@leonardandvictoria.org', 'admin')
ON CONFLICT (email) DO NOTHING;
