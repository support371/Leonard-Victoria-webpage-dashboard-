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
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-2.5 px-6 text-center">
        <p className="text-white text-xs sm:text-sm font-bold tracking-wide">
          From Infinite Abundance of Health & Wealth to Endless Happiness in Living Life @300%
        </p>
      </div>
      <header className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/98 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-slate-950'}`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-[10px]">IW</span>
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-sm leading-none">Infinite Wealth</p>
            <p className="text-amber-500 text-[9px] font-semibold tracking-widest uppercase leading-none mt-0.5">Command Center</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-amber-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden sm:flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-md transition-colors"
          >
            Command Center
          </button>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-slate-300 hover:text-white">
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
                location.pathname === link.to ? 'text-amber-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full mt-3 px-4 py-3 bg-amber-500 text-white text-sm font-bold rounded-lg"
          >
            Command Center
          </button>
        </div>
      )}
    </header>
    </>
  );
};

export const PublicFooter = () => (
  <footer className="bg-slate-950 text-slate-400">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">IW</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Infinite Wealth</p>
              <p className="text-amber-500 text-[9px] font-semibold uppercase tracking-widest mt-0.5">Command Center</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            A globally positioned private membership organization providing holistic wealth, wellness, and personal sovereignty services.
          </p>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-4">Services</p>
          <ul className="space-y-2 text-sm">
            {['Energy Healing', 'Wellness Education', 'Personal Development', 'Strategic Wealth'].map(s => (
              <li key={s}><Link to="/services" className="hover:text-amber-400 transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-4">Organization</p>
          <ul className="space-y-2 text-sm">
            {[['About Us', '/about'], ['Membership', '/membership'], ['Community', '/community'], ['Resources', '/resources']].map(([l, p]) => (
              <li key={p}><Link to={p} className="hover:text-amber-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white text-sm font-semibold mb-4">Contact</p>
          <ul className="space-y-2 text-sm">
            {[['Consultation Request', '/contact'], ['Partnership Inquiry', '/contact'], ['General Contact', '/contact']].map(([l, p]) => (
              <li key={l}><Link to={p} className="hover:text-amber-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700 mt-12 pt-10">
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-400 font-black text-sm">★</span>
            </div>
            <p className="text-amber-400 font-bold text-sm">POWERED & SPONSORED BY</p>
          </div>
          <p className="text-white font-black text-lg mb-1">Leonard M. Diana</p>
          <p className="text-amber-200 text-sm leading-relaxed">Founder & Owner — Infinite Abundance of Health, Wealth & Happiness in Living Life @300%</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© 2024 Infinite Wealth Command Center. All rights reserved. Private Membership Association.</p>
          <div className="flex items-center gap-5 text-xs">
            <Link to="/contact" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-amber-400 transition-colors">PMA Agreement</Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-white">
    <PublicNav />
    <main>{children}</main>
    <PublicFooter />
  </div>
);

export default PublicLayout;
