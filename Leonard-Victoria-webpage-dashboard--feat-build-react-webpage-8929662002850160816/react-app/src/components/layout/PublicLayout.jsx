import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Membership', to: '/membership' },
  { label: 'Community', to: '/community' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
];

export const PublicNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">IW</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="text-white font-bold text-sm tracking-wide">Infinite Wealth</p>
            <p className="text-amber-400 text-[10px] font-semibold tracking-widest uppercase">Command Center</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === link.to
                  ? 'text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden sm:flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Command Center <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-6 py-4 space-y-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-3 text-sm font-medium rounded-lg ${
                location.pathname === link.to ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full mt-3 px-4 py-3 bg-amber-500 text-white text-sm font-semibold rounded-lg"
          >
            Enter Command Center
          </button>
        </div>
      )}
    </header>
  );
};

export const PublicFooter = () => (
  <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">IW</span>
            </div>
            <div>
              <p className="text-white font-bold">Infinite Wealth Command Center</p>
              <p className="text-amber-500 text-xs tracking-widest uppercase">Global · Faith-Based · Premium</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            A premium, faith-aligned private membership platform serving practitioners, collaborators, and purpose-driven leaders worldwide.
          </p>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Platform</p>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map(l => (
              <li key={l.to}><Link to={l.to} className="hover:text-amber-400 transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Connect</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Book a Consultation</Link></li>
            <li><Link to="/membership" className="hover:text-amber-400 transition-colors">Join Membership</Link></li>
            <li><Link to="/community" className="hover:text-amber-400 transition-colors">Events & Community</Link></li>
            <li><Link to="/resources" className="hover:text-amber-400 transition-colors">Resource Library</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs">© 2024 Infinite Wealth Command Center. All rights reserved. Private Membership Association.</p>
        <div className="flex items-center space-x-6 text-xs">
          <Link to="/contact" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-amber-400 transition-colors">Member Terms</Link>
          <Link to="/contact" className="hover:text-amber-400 transition-colors">PMA Disclosure</Link>
        </div>
      </div>
    </div>
  </footer>
);

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-950 text-white">
    <PublicNav />
    <main>{children}</main>
    <PublicFooter />
  </div>
);

export default PublicLayout;
