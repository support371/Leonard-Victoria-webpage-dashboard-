# Infinite Wealth Command Center

## What It Is
A premium, faith-based private membership command platform — **IW Command Center**. Built for Leonard M. Diana (owner) with role-based portals for Victoria, Bernard, and a Developer.

## Tech Stack
- **Framework:** React 18 + Vite 7
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Runtime:** Node.js 20

## File Structure
```
react-app/src/
├── App.jsx                    # Full router — all routes wired
├── index.css
├── main.jsx
├── data/
│   └── seed.js                # All mock data (roles, files, reviews, events, etc.)
├── components/
│   ├── ui/index.jsx            # Reusable UI: Badge, Card, StatCard, Btn, StatusDot, etc.
│   └── layout/
│       ├── PublicLayout.jsx    # Nav + Footer wrapper for public pages
│       └── DashboardShell.jsx  # Sidebar + Header for dashboard
├── pages/
│   ├── public/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── Membership.jsx
│   │   ├── Community.jsx
│   │   ├── Resources.jsx
│   │   └── Contact.jsx
│   ├── dashboard/
│   │   ├── LeonardPortal.jsx   # Owner Command — primary/default portal
│   │   ├── VictoriaPortal.jsx  # Operations Portal
│   │   ├── BernardPortal.jsx   # Governance & Legal Portal
│   │   └── DeveloperPortal.jsx # Technical / Dev Portal
│   ├── modules/
│   │   ├── ReviewCenter.jsx
│   │   ├── CentralRepository.jsx
│   │   ├── LivePreview.jsx
│   │   ├── LiveStructure.jsx
│   │   ├── LiveStatus.jsx
│   │   ├── ActivityLogs.jsx
│   │   └── Settings.jsx
│   └── NotFound.jsx
```

## Routes
- **Public:** `/`, `/about`, `/services`, `/membership`, `/community`, `/resources`, `/contact`
- **Dashboard:** `/dashboard` → redirects to `/dashboard/leonard`
- **Portals:** `/dashboard/leonard`, `/dashboard/victoria`, `/dashboard/bernard`, `/dashboard/developer`
- **Modules:** `/dashboard/reviews`, `/dashboard/repository`, `/dashboard/preview`, `/dashboard/structure`, `/dashboard/status`, `/dashboard/activity`, `/dashboard/settings`
- **Fallback:** `*` → NotFound

## Design System
- Premium dark navy/slate + amber/gold accent color system
- Reusable UI: `Badge`, `Card`, `StatCard`, `SectionHeader`, `ModuleSection`, `Btn`, `StatusDot`, `EmptyState`
- Owner-first architecture: Leonard portal is default dashboard landing
- Role switcher in sidebar affects header identity

## Workflow
- **Command:** `cd Leonard-Victoria-webpage-dashboard--feat-build-react-webpage-8929662002850160816/react-app && npm install && npm run dev`
- **Port:** 5000 (webview)
