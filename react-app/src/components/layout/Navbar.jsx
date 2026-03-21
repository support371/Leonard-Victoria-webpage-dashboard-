import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-navy-800 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm">LV</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg tracking-tight">
              Leonard <span className="text-navy-700">&amp;</span> Victoria
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-navy-800 bg-navy-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
              className="text-sm font-medium text-navy-800 hover:text-navy-600"
            >
              Membership
            </Link>
            <Link
              to="/donate"
              className="text-sm font-medium bg-navy-800 text-white px-4 py-2 rounded-md hover:bg-navy-700 transition-colors"
            >
              Donate
            </Link>
            {session ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/portal"
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <User className="w-4 h-4" />
                  <span>Portal</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-gray-600"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm font-medium rounded-md ${
                  isActive ? 'text-navy-800 bg-navy-50' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-gray-100 space-y-1">
            <Link
              to="/membership"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Membership
            </Link>
            <Link
              to="/donate"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium bg-navy-800 text-white rounded-md text-center"
            >
              Donate
            </Link>
            {session ? (
              <>
                <Link
                  to="/portal"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Portal
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
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
