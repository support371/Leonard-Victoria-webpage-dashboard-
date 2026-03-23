# Infinite Wealth Command Center

This repository powers the Leonard & Victoria platform and is being evolved into the **Infinite Wealth Command Center**: a premium global service website plus an owner-first internal command dashboard.

## Active execution directive for Jules

Jules: inspect this repository, review the active TODO items below, verify the current deployment state, and execute the work directly in this repo as intended.

### Source and deployment references
- Primary repository: `support371/Leonard-Victoria-webpage-dashboard-`
- Current production/live target: `https://leonard-victoria-webpage-dash-1gtdjs7sl.vercel.app`
- Replit live reference: `https://f458bd97-177f-4979-b6b9-c540e027a823-00-2gaesegwfqbli.worf.replit.dev/`
- Lovable design/structure reference: `https://lovable.dev/projects/7e5b0fcc-200c-451c-a927-f3676fa6837e`

## Product intent
Build and stabilize a **finished production-ready application**, not a mockup.

The product must include:
- a polished public-facing global website
- an owner-first internal dashboard
- separate portals for Leonard, Victoria, Bernard, and Developer
- complete modules for Overview, Review Center, Central Repository, Live Preview, Live Structure, and Live Status
- coherent routing, deployment-safe configuration, and backend-ready structure

## Non-negotiable rules
- Work in the existing repository.
- Do not replace the project with a disconnected prototype.
- Preserve what is useful and refactor in place.
- Prioritize deployment stability first.
- Keep Leonard as the owner and primary command user.
- Treat this as a real production platform, not a design experiment.

## Immediate TODO execution list

### P0 — Deployment stabilization
1. **Align frontend build tooling**
   - Inspect `react-app/package.json` and `react-app/vite.config.js`.
   - Align `vite` and `@vitejs/plugin-react` to a verified compatible pairing.
   - Reinstall cleanly and ensure fresh build consistency.
   - Confirm local build and Vercel build both succeed from a clean install.

2. **Audit required environment variables**
   - Identify all required env vars for frontend and backend.
   - Add a `.env.example` file.
   - Add explicit validation for required runtime variables.
   - Make missing environment configuration fail clearly instead of silently.
   - Verify all required Vercel environment variables are documented.

3. **Verify Vercel serverless backend compatibility**
   - Inspect `api/index.js` and `server/index.js`.
   - Confirm all routes behave correctly in a stateless serverless environment.
   - Verify webhook/raw body handling for Stripe-related routes.
   - Reduce deployment/runtime fragility wherever practical.

### P1 — Complete structural requirements
4. **Add missing Developer portal end to end**
   - The platform must have four internal portals: Leonard, Victoria, Bernard, Developer.
   - Ensure frontend routes, navigation, module views, and any backend route/data handling exist for Developer.
   - Do not ship a placeholder-only Developer portal.

5. **Make Leonard the default owner command route**
   - Leonard must be the default authenticated landing experience.
   - Strengthen owner-first hierarchy with labels such as `Owner Command`, `Executive Overview`, `Strategic Priorities`, and `Decision Queue`.
   - Other portals should extend from Leonard’s command framework, not compete equally with it.

6. **Normalize module naming**
   - Standardize and enforce these names everywhere:
     - Overview
     - Review Center
     - Central Repository
     - Live Preview
     - Live Structure
     - Live Status
   - Rename any remaining `Repository` labels to `Central Repository`.

### P2 — Improve operational realism
7. **Upgrade Review Center into a real workflow module**
   - Build actual workflow sections:
     - pending reviews
     - flagged items
     - approvals queue
     - drafts
     - recent actions
   - This must support future approvals for community profiles, service listings, and featured placements.

8. **Upgrade Central Repository into a usable document hub**
   - Add structured seeded data.
   - Support search, filters, tags, ownership labels, last updated, preview/open actions.
   - Support categories such as:
     - Manifestos
     - PMA/FBO Documents
     - Membership Documents
     - Service Documents
     - Legal Records
     - Internal Notes
     - Technical References
     - Brand Assets

9. **Harden public-site-to-dashboard flow**
   - Verify CTA routing from the public website into contact, membership, and portal flows.
   - Fix any broken or confusing transitions.
   - Ensure SPA routing works correctly for all public and internal app routes on Vercel.

### P3 — Responsive and UX cleanup
10. **Fix mobile clipping and duplicated header behavior**
    - Correct clipped right-panel content.
    - Reduce oversized heading/type behavior on narrow screens.
    - Remove duplicate or awkward branding rows.
    - Make the dashboard feel intentionally mobile-ready.

11. **Improve premium public-site flow**
    - Tighten spacing, hierarchy, and section rhythm.
    - Improve trust cues, CTA clarity, and global service positioning.
    - Prepare for stronger community/service showcase content.

## Next feature priority after stabilization
After the deployment and structural fixes above are complete, implement a **Community layer**.

### Community phase requirements
Build:
- a public Community Hub
- featured members
- featured practitioners
- featured services
- community stories/testimonials
- upcoming events
- partner/collaboration highlights
- profile pages for showcased people
- searchable/filterable service directory
- internal Community Management module
- Review Center approval flow for community/service submissions

## Expected execution behavior for Jules
Jules should:
1. inspect the current repository and running app first
2. verify what already works
3. execute the TODOs in the priority order above
4. keep changes deployment-safe
5. prefer coherent shipped improvements over cosmetic churn
6. avoid rebuilding from scratch unless absolutely necessary

## Acceptance standard
The work is complete when:
- deployment is stable and reproducible
- Leonard is clearly the owner-first command user
- all four portals are implemented meaningfully
- Review Center and Central Repository behave like real modules
- public website and internal dashboard feel like one coherent premium product
- mobile experience is clean and intentional
- the app is production-ready, not just visually improved

## Final instruction to Jules
Inspect this README, inspect the repo, inspect the current deployment status, then execute the TODO list in order and ship the repository toward a complete production-quality state.
