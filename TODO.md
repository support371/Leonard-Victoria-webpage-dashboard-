# TODO — Infinite Wealth Command Center

This checklist is the active execution queue for stabilizing and completing the platform.

## P0 — Deployment stabilization

- [ ] Align `vite` and `@vitejs/plugin-react` to a verified compatible version pair
- [ ] Reinstall dependencies cleanly and verify fresh build consistency
- [ ] Confirm root build and `react-app` build both succeed from a clean install
- [ ] Verify Vercel build succeeds consistently from the current main branch
- [ ] Identify all required environment variables
- [ ] Add `.env.example`
- [ ] Add runtime environment validation with clear failure messages
- [ ] Document required Vercel environment variables
- [ ] Verify `api/index.js` and `server/index.js` behave correctly on Vercel serverless
- [ ] Test Stripe webhook/raw body handling in deployment-safe form
- [ ] Confirm all API routes behave statelessly

## P1 — Structural completion

- [ ] Implement the missing Developer portal end to end
- [ ] Ensure all four portals are present: Leonard, Victoria, Bernard, Developer
- [ ] Make Leonard the default authenticated landing route
- [ ] Strengthen Leonard owner-first labels and hierarchy
- [ ] Normalize module naming across routes, nav, titles, and content
- [ ] Rename all remaining `Repository` references to `Central Repository`

## P2 — Operational realism

- [ ] Redesign Review Center into a real workflow module
- [ ] Add pending reviews section
- [ ] Add flagged items section
- [ ] Add approvals queue section
- [ ] Add drafts section
- [ ] Add recent actions section
- [ ] Upgrade Central Repository into a structured searchable/filterable hub
- [ ] Add repository categories
- [ ] Add tags, ownership labels, and last-updated metadata
- [ ] Add quick preview/open actions
- [ ] Harden public-site-to-dashboard CTA flow
- [ ] Verify SPA routing on Vercel for all public and dashboard routes

## P3 — Responsive and UX cleanup

- [ ] Fix mobile clipping issues
- [ ] Fix duplicated header / branding behavior
- [ ] Reduce oversized typography on narrow screens
- [ ] Improve mobile card stacking and spacing
- [ ] Tighten public-site spacing and section rhythm
- [ ] Improve trust cues and CTA clarity on the public site

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

- [ ] Deployment is stable and reproducible
- [ ] Leonard is clearly the owner-first command user
- [ ] All four portals are implemented meaningfully
- [ ] Review Center behaves like a real workflow surface
- [ ] Central Repository behaves like a real document system
- [ ] Public website and internal dashboard feel like one coherent premium product
- [ ] Mobile experience is clean and intentional
- [ ] The app feels production-ready
