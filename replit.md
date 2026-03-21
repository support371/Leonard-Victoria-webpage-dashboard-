# NexusDash — Project Overview

## What It Is
A React-based management and compliance intelligence dashboard for the Astra Project (Project ID: XJ-994). Built for two roles: Management (Leonard & Victoria) and Legal Counsel (Agent Bernard).

## Tech Stack
- **Framework:** React 18 + Vite 7
- **Styling:** Tailwind CSS 3 with tailwindcss-animate
- **Icons:** lucide-react
- **Runtime:** Node.js 20

## Project Structure
```
Leonard-Victoria-webpage-dashboard--feat-build-react-webpage-8929662002850160816/
└── react-app/
    ├── src/
    │   ├── App.jsx          # All components and app logic
    │   └── index.css        # Tailwind base styles
    ├── index.html
    ├── vite.config.js       # Vite config (host 0.0.0.0, port 5000)
    └── package.json
```

## Features
- **Dashboard Overview:** Metric cards (Project Health, Compliance Score, Active Users), Recent Activity feed, Compliance Snapshot widget
- **Central Repository:** Filterable file table with category/status badges; Legal View limits to legal docs only
- **Live Site Preview:** Simulated browser rendering the Astra marketing site with hero section, team cards, and footer
- **Legal Status:** Compliance area tracker with status badges (Compliant / In Review / Action Required), summary counts, severity-coded left borders, and due dates
- **Role-Based Access:** Toggle between Management and Legal views — affects welcome message, file visibility, header identity, and sidebar indicator

## Workflow
- **Command:** `cd Leonard-Victoria-webpage-dashboard--feat-build-react-webpage-8929662002850160816/react-app && npm install && npm run dev`
- **Port:** 5000 (webview)
