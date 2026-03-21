import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, CalendarDays, Users,
  Settings, Menu, X, ChevronRight, LogOut, Sprout,
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
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-emerald-700 text-white'
            : 'text-emerald-100 hover:bg-emerald-700/60 hover:text-white'
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
      <Link to="/portal/bernard/dashboard" className="hover:text-emerald-700">Bernard</Link>
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
    <div className="flex flex-col h-full bg-emerald-950 text-white w-64">
      <div className="px-5 py-5 border-b border-emerald-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-700 rounded-lg flex items-center justify-center">
            <Sprout size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Bernard</p>
            <p className="text-xs text-emerald-400 mt-0.5">Programs Portal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>
      <div className="px-4 py-4 border-t border-emerald-900">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold">
            {session?.user?.email?.[0]?.toUpperCase()}
          </div>
          <p className="text-xs text-emerald-300 truncate flex-1">{session?.user?.email}</p>
        </div>
        <button onClick={handleSignOut} className="w-full flex items-center gap-2 text-xs text-emerald-400 hover:text-white transition-colors">
          <LogOut size={12} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="hidden lg:flex flex-col flex-shrink-0"><Sidebar /></div>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col"><Sidebar /></div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 flex-shrink-0">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} className="text-gray-500" />
          </button>
          <Breadcrumb path={location.pathname} />
          <div className="ml-auto">
            <Link to="/portal" className="text-xs text-gray-400 hover:text-gray-600">← All Portals</Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  );
}
