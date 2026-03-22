import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Users, Shield, Cpu, ArrowRight, Lock, Key } from 'lucide-react';

const PORTALS = [
  {
    id: 'leonard',
    title: 'Leonard Portal',
    subtitle: 'Owner Command',
    role: 'Owner & Executive Director',
    person: 'Leonard M. Diana',
    description: 'The executive command center for organizational strategy, oversight, and decision-making. Full access to all systems.',
    icon: Crown,
    color: 'from-amber-500 to-yellow-600',
    accent: 'amber',
    stats: ['4 Stat Cards', '6 Strategic Priorities', 'Real-time Health', 'Complete Oversight'],
    route: '/dashboard/leonard',
    capabilities: ['Executive Dashboard', 'Strategic Planning', 'Member Oversight', 'Full Module Access'],
  },
  {
    id: 'victoria',
    title: 'Victoria Portal',
    subtitle: 'Operations Command',
    role: 'Operations Director',
    person: 'Victoria Eleanor',
    description: 'Operations, community engagement, and content delivery management. Coordinate members, events, and resources.',
    icon: Users,
    color: 'from-teal-500 to-emerald-600',
    accent: 'teal',
    stats: ['Member Dashboard', 'Event Tracking', 'Content Hub', 'Support Queue'],
    route: '/dashboard/victoria',
    capabilities: ['Community Management', 'Event Organization', 'Content Publishing', 'Member Support'],
  },
  {
    id: 'bernard',
    title: 'Bernard Portal',
    subtitle: 'Governance Portal',
    role: 'Legal Counsel & Governance',
    person: 'Agent Bernard',
    description: 'Compliance management, document governance, legal records, and approval workflow oversight.',
    icon: Shield,
    color: 'from-indigo-500 to-purple-600',
    accent: 'indigo',
    stats: ['Compliance Portfolio', 'Legal Records', 'Document Hub', 'Review Queue'],
    route: '/dashboard/bernard',
    capabilities: ['Compliance Management', 'Legal Documentation', 'Governance Oversight', 'Approval Workflow'],
  },
  {
    id: 'developer',
    title: 'Developer Portal',
    subtitle: 'Technical Center',
    role: 'Technical & Development',
    person: 'Development Team',
    description: 'System architecture, build status, module registry, and technical stack management.',
    icon: Cpu,
    color: 'from-slate-700 to-slate-900',
    accent: 'slate',
    stats: ['Module Registry', 'Build Status', 'Tech Stack', 'System Health'],
    route: '/dashboard/developer',
    capabilities: ['System Architecture', 'Build Management', 'Module Monitoring', 'Performance Tracking'],
  },
];

const PortalCard = ({ portal }) => {
  const navigate = useNavigate();
  const Icon = portal.icon;

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all duration-200">
      <div className={`bg-gradient-to-r ${portal.color} h-32 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
        <div className="relative h-full flex items-center justify-center">
          <Icon className="w-16 h-16 text-white/80 group-hover:text-white transition-colors" />
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <p className={`text-xs font-bold uppercase tracking-widest text-${portal.accent}-600 mb-1`}>{portal.subtitle}</p>
          <h3 className="text-slate-900 font-black text-2xl mb-1">{portal.title}</h3>
          <p className="text-slate-500 text-sm">{portal.person}</p>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-5">{portal.description}</p>

        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Access Level</p>
          <div className="flex items-center gap-2 text-sm">
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-slate-700 font-medium">Authenticated Portal</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Capabilities</p>
          <ul className="space-y-1.5">
            {portal.capabilities.map(cap => (
              <li key={cap} className="text-xs text-slate-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {cap}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => navigate(portal.route)}
          className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all text-sm flex items-center justify-center gap-2 bg-gradient-to-r ${portal.color} hover:shadow-lg hover:shadow-amber-500/20`}
        >
          Access Portal <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PortalPreview = () => {
  return (
    <div className="pt-14">
      <section className="bg-slate-950 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
            <Key className="w-3.5 h-3.5" />
            Secure Portal Access
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Command Center<br />
            <span className="text-amber-500">Portal Overview</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Four distinct, purpose-built portals for owner, operations, governance, and technical teams. Each with encrypted access, role-based permissions, and comprehensive dashboards.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {PORTALS.map(portal => (
              <PortalCard key={portal.id} portal={portal} />
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-10">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Shared Infrastructure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Core Modules',
                  desc: 'Review Center, Central Repository, Live Preview, Live Structure, Live Status, Activity Logs, Settings',
                },
                {
                  title: 'Encryption & Security',
                  desc: 'All portals operate under secure, authenticated sessions with role-based access control and encryption.',
                },
                {
                  title: 'Unified Data',
                  desc: 'All portals share real-time data access while maintaining role-specific views and permissions.',
                },
              ].map(item => (
                <div key={item.title} className="border border-gray-100 rounded-xl p-5">
                  <p className="text-slate-900 font-bold text-sm mb-2">{item.title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-amber-50 to-transparent border border-amber-200 rounded-2xl p-10">
            <h3 className="text-slate-900 font-black text-xl mb-3">Access Requirements</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-0.5">✓</span>
                <span>Valid membership or ownership status</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-0.5">✓</span>
                <span>Role-based portal assignment (Leonard, Victoria, Bernard, or Developer)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-0.5">✓</span>
                <span>Encrypted authentication and secure session management</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold mt-0.5">✓</span>
                <span>All access logged and monitored for compliance</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortalPreview;
