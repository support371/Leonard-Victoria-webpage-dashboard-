import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Manifesto', href: '/manifesto' },
  { label: 'Programs', href: '/programs' },
  { label: 'Governance', href: '/governance' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-navy-900 border-b border-navy-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-base tracking-tight">
              IW <span className="text-blue-400">Command Center</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-0.5">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-white bg-navy-700'
                      : 'text-navy-300 hover:text-white hover:bg-navy-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/membership"
              className="text-sm font-medium text-navy-300 hover:text-white transition-colors"
            >
              Membership
            </Link>
            <Link
              to="/donate"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors"
            >
              Donate
            </Link>
            {session ? (
              <div className="flex items-center space-x-1">
                <Link
                  to="/portal"
                  className="flex items-center space-x-1.5 text-sm font-medium text-navy-300 hover:text-white px-3 py-2 rounded-md hover:bg-navy-800 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Portal</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-navy-300 hover:text-white px-3 py-2 rounded-md hover:bg-navy-800 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-navy-300 hover:text-white hover:bg-navy-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-navy-700 bg-navy-900 px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-white bg-navy-700'
                    : 'text-navy-300 hover:text-white hover:bg-navy-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-navy-700 space-y-1">
            <Link
              to="/membership"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-navy-300 hover:text-white hover:bg-navy-800 rounded-md transition-colors"
            >
              Membership
            </Link>
            <Link
              to="/donate"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md text-center hover:bg-blue-500 transition-colors"
            >
              Donate
            </Link>
            {session ? (
              <>
                <Link
                  to="/portal"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-navy-300 hover:text-white hover:bg-navy-800 rounded-md transition-colors"
                >
                  Portal
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:text-white hover:bg-red-900/40 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-navy-300 hover:text-white hover:bg-navy-800 rounded-md transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
