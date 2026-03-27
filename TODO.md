# TODO — Infinite Wealth Command Center

This checklist is the active execution queue for stabilizing and completing the platform.

## P0 — Deployment stabilization

- [x] Align `vite` and `@vitejs/plugin-react` to a verified compatible version pair
- [x] Reinstall dependencies cleanly and verify fresh build consistency
- [x] Confirm root build and `react-app` build both succeed from a clean install
- [x] Verify Vercel build succeeds consistently from the current main branch
- [x] Identify all required environment variables
- [x] Add `.env.example`
- [x] Add runtime environment validation with clear failure messages
- [x] Document required Vercel environment variables
- [x] Verify `api/index.js` and `server/index.js` behave correctly on Vercel serverless
- [x] Test Stripe webhook/raw body handling in deployment-safe form
- [x] Confirm all API routes behave statelessly

## P1 — Structural completion

- [x] Implement the missing Developer portal end to end
- [x] Ensure all four portals are present: Leonard, Victoria, Bernard, Developer
- [x] Make Leonard the default authenticated landing route
- [x] Strengthen Leonard owner-first labels and hierarchy
- [x] Normalize module naming across routes, nav, titles, and content
- [x] Rename all remaining `Repository` references to `Central Repository`

## P2 — Operational realism

- [x] Redesign Review Center into a real workflow module
- [x] Add pending reviews section
- [x] Add flagged items section
- [x] Add approvals queue section
- [x] Add drafts section
- [x] Add recent actions section
- [x] Upgrade Central Repository into a structured searchable/filterable hub
- [x] Add repository categories
- [x] Add tags, ownership labels, and last-updated metadata
- [x] Add quick preview/open actions
- [x] Harden public-site-to-dashboard CTA flow
- [x] Verify SPA routing on Vercel for all public and dashboard routes

## P3 — Responsive and UX cleanup

- [x] Fix mobile clipping issues
- [x] Fix duplicated header / branding behavior
- [x] Reduce oversized typography on narrow screens
- [x] Improve mobile card stacking and spacing
- [x] Tighten public-site spacing and section rhythm
- [x] Improve trust cues and CTA clarity on the public site

## Next feature phase — Community layer

- [ ] Build public Community Hub
- [ ] Add Featured Members section
- [ ] Add Featured Practitioners section
- [ ] Add Featured Services section
- [ ] Add Community Stories / Testimonials
- [ ] Add Upcoming Events section
- [ ] Add Partner / Collaboration highlights
- [ ] Build public profile pages for showcased people
- [ ] Build searchable/filterable service directory
- [ ] Build internal Community Management module
- [ ] Add Review Center support for profile/service approval workflows

## Completion standard

- [x] Deployment is stable and reproducible
- [x] Leonard is clearly the owner-first command user
- [x] All four portals are implemented meaningfully
- [x] Review Center behaves like a real workflow surface
- [x] Central Repository behaves like a real document system
- [x] Public website and internal dashboard feel like one coherent premium product
- [x] Mobile experience is clean and intentional
- [x] The app feels production-ready
