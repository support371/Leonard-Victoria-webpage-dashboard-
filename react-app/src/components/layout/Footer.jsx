import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-navy-900 font-bold text-sm">LV</span>
              </div>
              <span className="font-semibold text-lg">Leonard &amp; Victoria</span>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed">
              A principled membership organization dedicated to stewardship, community, and shared prosperity.
            </p>
          </div>

          {/* Organization */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-navy-400">Organization</h4>
            <ul className="space-y-2">
              {[
                { label: 'About', href: '/about' },
                { label: 'Manifesto', href: '/manifesto' },
                { label: 'Governance', href: '/governance' },
                { label: 'Programs', href: '/programs' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-navy-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-navy-400">Community</h4>
            <ul className="space-y-2">
              {[
                { label: 'Membership', href: '/membership' },
                { label: 'Events', href: '/events' },
                { label: 'Resources', href: '/resources' },
                { label: 'Contact', href: '/contact' },
                { label: 'Donate', href: '/donate' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-navy-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-navy-400">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Disclosures', href: '/disclosures' },
                { label: 'Member Portal', href: '/portal' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-navy-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-navy-800">
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <span className="text-amber-400 font-black text-sm">★</span>
              </div>
              <p className="text-amber-400 font-bold text-sm">POWERED &amp; SPONSORED BY</p>
            </div>
            <p className="text-white font-black text-lg mb-1">Leonard M. Diana</p>
            <p className="text-amber-200 text-sm leading-relaxed">Founder &amp; Owner — Infinite Abundance of Health, Wealth &amp; Happiness in Living Life @300%</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-navy-400">
            <p>&copy; {new Date().getFullYear()} Infinite Wealth Command Center. All rights reserved. Private Membership Association.</p>
            <div className="flex items-center gap-5">
              <Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
              <Link to="/disclosures" className="hover:text-amber-400 transition-colors">PMA Agreement</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
