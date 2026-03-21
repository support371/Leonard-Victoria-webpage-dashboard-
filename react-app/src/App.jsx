import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PortalSidebar from './components/layout/PortalSidebar';

// Guards
import ProtectedRoute from './guards/ProtectedRoute';

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
import PortalDashboard from './pages/portal/Dashboard';
import Members from './pages/portal/Members';
import Documents from './pages/portal/Documents';
import Admin from './pages/portal/Admin';

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

// Portal layout wrapper
function PortalLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <PortalSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
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

          {/* Auth routes (no layout wrapper) */}
          <Route path="/login" element={<Login />} />

          {/* Portal routes — protected */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <PortalLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PortalDashboard />} />
            <Route
              path="members"
              element={
                <ProtectedRoute requiredRoles={['admin', 'operations']}>
                  <Members />
                </ProtectedRoute>
              }
            />
            <Route path="documents" element={<Documents />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 fallback */}
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
