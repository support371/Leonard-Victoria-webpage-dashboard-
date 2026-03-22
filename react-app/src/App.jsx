import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useParams } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './contexts/AuthContext';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WorkspaceSidebar from './components/layout/WorkspaceSidebar';

// Guards
import ProtectedRoute from './guards/ProtectedRoute';
import WorkspaceRoute from './guards/WorkspaceRoute';
import LeonardPortalGuard from './guards/LeonardPortalGuard';
import VictoriaPortalGuard from './guards/VictoriaPortalGuard';
import BernardPortalGuard from './guards/BernardPortalGuard';

// Victoria portal pages
import VictoriaLayout from './pages/portal/victoria/VictoriaLayout';
import VictoriaDashboard from './pages/portal/victoria/VictoriaDashboard';
import Meetings from './pages/portal/victoria/Meetings';
import Resolutions from './pages/portal/victoria/Resolutions';
import Committees from './pages/portal/victoria/Committees';
import VictoriaDocuments from './pages/portal/victoria/VictoriaDocuments';
import VictoriaSettings from './pages/portal/victoria/VictoriaSettings';

// Bernard portal pages
import BernardLayout from './pages/portal/bernard/BernardLayout';
import BernardDashboard from './pages/portal/bernard/BernardDashboard';
import BernardPrograms from './pages/portal/bernard/Programs';
import BernardEvents from './pages/portal/bernard/BernardEvents';
import BernardMembers from './pages/portal/bernard/BernardMembers';
import BernardSettings from './pages/portal/bernard/BernardSettings';

// Leonard portal pages
import LeonardLayout from './pages/portal/leonard/LeonardLayout';
import LeonardDashboard from './pages/portal/leonard/LeonardDashboard';
import Clients from './pages/portal/leonard/Clients';
import ClientDetail from './pages/portal/leonard/ClientDetail';
import Portfolio from './pages/portal/leonard/Portfolio';
import DigitalAssets from './pages/portal/leonard/DigitalAssets';
import CryptoAssets from './pages/portal/leonard/CryptoAssets';
import RealEstatePortfolio from './pages/portal/leonard/RealEstatePortfolio';
import RealEstate from './pages/portal/leonard/RealEstate';
import RealEstateDetail from './pages/portal/leonard/RealEstateDetail';
import Security from './pages/portal/leonard/Security';
import SecurityIncidents from './pages/portal/leonard/SecurityIncidents';
import SecurityAssets from './pages/portal/leonard/SecurityAssets';
import Reports from './pages/portal/leonard/Reports';
import LeonardSettings from './pages/portal/leonard/Settings';

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
import PortalPreview from './pages/public/PortalPreview';

// Auth pages
import Login from './pages/auth/Login';
import AuthCallback from './pages/auth/AuthCallback';

// Portal pages
import WorkspaceList from './pages/portal/WorkspaceList';
import WorkspaceDashboard from './pages/portal/WorkspaceDashboard';
import WorkspaceDocuments from './pages/portal/WorkspaceDocuments';
import DeveloperPortal from './pages/portal/DeveloperPortal';

// Shared command modules
import CommandOverview from './pages/portal/shared/CommandOverview';
import CentralRepository from './pages/portal/shared/CentralRepository';
import LivePreview from './pages/portal/shared/LivePreview';
import LiveStructure from './pages/portal/shared/LiveStructure';
import LiveStatus from './pages/portal/shared/LiveStatus';
import ReviewCenter from './pages/portal/shared/ReviewCenter';

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
      <AuthProvider>
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
            <Route path="/portals" element={<PortalPreview />} />
          </Route>

          {/* ── Auth ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* ── Portal entry — workspace picker ── */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <WorkspaceList />
              </ProtectedRoute>
            }
          />

          {/* ── Shared command modules (all protected) ── */}
          <Route path="/portal/overview"    element={<ProtectedRoute><CommandOverview /></ProtectedRoute>} />
          <Route path="/portal/repository"  element={<ProtectedRoute><CentralRepository /></ProtectedRoute>} />
          <Route path="/portal/preview"     element={<ProtectedRoute><LivePreview /></ProtectedRoute>} />
          <Route path="/portal/structure"   element={<ProtectedRoute><LiveStructure /></ProtectedRoute>} />
          <Route path="/portal/status"      element={<ProtectedRoute><LiveStatus /></ProtectedRoute>} />
          <Route path="/portal/review"      element={<ProtectedRoute><ReviewCenter /></ProtectedRoute>} />

          {/* ── Developer / Admin portal ── */}
          <Route
            path="/portal/developer"
            element={
              <ProtectedRoute requiredRoles={['developer', 'super_admin']}>
                <DeveloperPortal />
              </ProtectedRoute>
            }
          />

          {/* ── Victoria Governance Portal ── */}
          <Route
            path="/portal/victoria"
            element={
              <ProtectedRoute>
                <VictoriaPortalGuard>
                  <VictoriaLayout />
                </VictoriaPortalGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<VictoriaDashboard />} />
            <Route path="dashboard"    element={<VictoriaDashboard />} />
            <Route path="meetings"     element={<Meetings />} />
            <Route path="resolutions"  element={<Resolutions />} />
            <Route path="committees"   element={<Committees />} />
            <Route path="documents"    element={<VictoriaDocuments />} />
            <Route path="settings"     element={<VictoriaSettings />} />
          </Route>

          {/* ── Bernard Programs Portal ── */}
          <Route
            path="/portal/bernard"
            element={
              <ProtectedRoute>
                <BernardPortalGuard>
                  <BernardLayout />
                </BernardPortalGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<BernardDashboard />} />
            <Route path="dashboard" element={<BernardDashboard />} />
            <Route path="programs"  element={<BernardPrograms />} />
            <Route path="events"    element={<BernardEvents />} />
            <Route path="members"   element={<BernardMembers />} />
            <Route path="settings"  element={<BernardSettings />} />
          </Route>

          {/* ── Leonard Enterprise Portal ── */}
          <Route
            path="/portal/leonard"
            element={
              <ProtectedRoute>
                <LeonardPortalGuard>
                  <LeonardLayout />
                </LeonardPortalGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<LeonardDashboard />} />
            <Route path="dashboard" element={<LeonardDashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:clientId" element={<ClientDetail />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="portfolio/digital-assets" element={<DigitalAssets />} />
            <Route path="portfolio/crypto" element={<CryptoAssets />} />
            <Route path="portfolio/real-estate" element={<RealEstatePortfolio />} />
            <Route path="real-estate" element={<RealEstate />} />
            <Route path="real-estate/:propertyId" element={<RealEstateDetail />} />
            <Route path="security" element={<Security />} />
            <Route path="security/incidents" element={<SecurityIncidents />} />
            <Route path="security/assets" element={<SecurityAssets />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<LeonardSettings />} />
            <Route path="repository" element={<CentralRepository />} />
            <Route path="preview"    element={<LivePreview />} />
            <Route path="structure"  element={<LiveStructure />} />
            <Route path="status"     element={<LiveStatus />} />
            <Route path="review"     element={<ReviewCenter />} />
          </Route>

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
      </AuthProvider>
    </QueryClientProvider>
  );
}
