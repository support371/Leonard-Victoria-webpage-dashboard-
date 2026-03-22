import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, CalendarDays, Users,
  Settings, Menu, X, ChevronRight, LogOut, Sprout, Shield,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const NAV = [
  { to: '/portal/bernard/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/portal/bernard/programs',  icon: BookOpen,        label: 'Programs' },
  { to: '/portal/bernard/events',    icon: CalendarDays,    label: 'Events' },
  { to: '/portal/bernard/members',   icon: Users,           label: 'Members' },
  { to: '/portal/bernard/settings',  icon: Settings,        label: 'Settings' },
];

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to.endsWith('dashboard')}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-navy-700 text-white'
            : 'text-navy-300 hover:bg-navy-800 hover:text-white'
        }`
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  );
}

function Breadcrumb({ path }) {
  const parts = path.replace('/portal/bernard', '').split('/').filter(Boolean);
  if (!parts.length) return <span className="text-sm text-gray-500">Dashboard</span>;
  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <Link to="/portal/bernard/dashboard" className="hover:text-navy-700 font-medium">Bernard</Link>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={14} />
          <span className="capitalize text-gray-700">{p.replace(/-/g, ' ')}</span>
        </span>
      ))}
    </div>
  );
}

export default function BernardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-navy-950 text-white w-64">
      {/* IW Command Center brand header */}
      <div className="px-5 pt-5 pb-4 border-b border-navy-800">
        <div className="flex items-center justify-between mb-3">
          <Link to="/portal" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-xs font-bold text-blue-400 tracking-wide group-hover:text-blue-300 transition-colors leading-tight">
              IW Command Center
            </span>
          </Link>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-navy-500 font-semibold mb-0.5">Portal</p>
        <h1 className="text-sm font-bold text-white">Bernard Portal</h1>
        <span className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-navy-800 text-emerald-400 uppercase tracking-wide">
          Programs
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-2 border-t border-navy-800 space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-navy-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {session?.user?.email?.[0]?.toUpperCase()}
          </div>
          <p className="text-xs text-navy-400 truncate flex-1">{session?.user?.email}</p>
        </div>
        <button
          onClick={() => navigate('/portal')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-navy-400 hover:bg-navy-800 hover:text-white transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" />
          All Portals
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-navy-400 hover:bg-navy-800 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 flex-shrink-0 h-14">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} className="text-gray-500" />
          </button>
          <Breadcrumb path={location.pathname} />
          <div className="ml-auto">
            <Link to="/portal" className="text-xs text-gray-400 hover:text-gray-600">← All Portals</Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
