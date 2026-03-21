import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useParams } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WorkspaceSidebar from './components/layout/WorkspaceSidebar';

// Guards
import ProtectedRoute from './guards/ProtectedRoute';
import WorkspaceRoute from './guards/WorkspaceRoute';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Manifesto from './pages/public/Manifesto';
import Membership from './pages/public/Membership';
import Programs from './pages/public/Programs';
import Governance from './pages/public/Governance';
import Contact from './pages/public/Contact';
import Donate from './pages/public/Donate';
import Events from './pages/public/Events';
import Resources from './pages/public/Resources';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';
import Disclosures from './pages/public/Disclosures';

// Auth pages
import Login from './pages/auth/Login';

// Portal pages
import WorkspaceList from './pages/portal/WorkspaceList';
import WorkspaceDashboard from './pages/portal/WorkspaceDashboard';
import WorkspaceDocuments from './pages/portal/WorkspaceDocuments';
import DeveloperPortal from './pages/portal/DeveloperPortal';

// Public layout wrapper
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Workspace-scoped layout. Reads :workspaceSlug from params,
 * fetches the workspace list to resolve name + role for the sidebar.
 */
function WorkspaceLayout() {
  const { workspaceSlug } = useParams();

  // Pull workspace list from the React Query cache (already fetched by WorkspaceRoute guard)
  const workspace = queryClient
    .getQueryData(['workspaces', 'mine'])
    ?.find((w) => w.slug === workspaceSlug);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <WorkspaceSidebar
        workspaceSlug={workspaceSlug}
        workspaceName={workspace?.name}
        workspaceRole={workspace?.workspace_role}
      />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Public routes ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/events" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclosures" element={<Disclosures />} />
          </Route>

          {/* ── Auth ── */}
          <Route path="/login" element={<Login />} />

          {/* ── Portal entry — workspace picker ── */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <WorkspaceList />
              </ProtectedRoute>
            }
          />

          {/* ── Developer / Admin portal ── */}
          <Route
            path="/portal/developer"
            element={
              <ProtectedRoute requiredRoles={['developer', 'super_admin']}>
                <DeveloperPortal />
              </ProtectedRoute>
            }
          />

          {/* ── Per-workspace portal (:workspaceSlug = leonard | victoria | bernard | …) ── */}
          <Route
            path="/portal/:workspaceSlug"
            element={
              <ProtectedRoute>
                <WorkspaceRoute>
                  <WorkspaceLayout />
                </WorkspaceRoute>
              </ProtectedRoute>
            }
          >
            {/* Default child — redirect to dashboard */}
            <Route index element={<WorkspaceDashboard />} />
            <Route path="dashboard" element={<WorkspaceDashboard />} />
            <Route path="documents" element={<WorkspaceDocuments />} />
          </Route>

          {/* ── 404 ── */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <main className="flex-1 flex items-center justify-center text-center py-24">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
                    <p className="text-gray-500">Page not found.</p>
                  </div>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
