import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, TrendingUp, Building2, ShieldAlert,
  FileBarChart, Settings, LogOut, ChevronDown, ChevronRight,
  Bitcoin, Landmark, Briefcase, Menu, X, Shield, Home,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import clsx from 'clsx';

const NAV = [
  { to: '/portal/leonard/dashboard', label: 'Overview', icon: Home },
  { to: '/portal/leonard/clients',   label: 'Clients',  icon: Users },
  {
    label: 'Portfolio', icon: TrendingUp,
    children: [
      { to: '/portal/leonard/portfolio',                   label: 'Overview',       icon: Briefcase },
      { to: '/portal/leonard/portfolio/digital-assets',    label: 'Digital Assets', icon: Landmark },
      { to: '/portal/leonard/portfolio/crypto',            label: 'Crypto',         icon: Bitcoin },
      { to: '/portal/leonard/portfolio/real-estate',       label: 'Real Estate',    icon: Building2 },
    ],
  },
  { to: '/portal/leonard/real-estate', label: 'Real Estate', icon: Building2 },
  {
    label: 'Security', icon: ShieldAlert,
    children: [
      { to: '/portal/leonard/security',           label: 'Overview',  icon: ShieldAlert },
      { to: '/portal/leonard/security/incidents', label: 'Incidents', icon: ShieldAlert },
      { to: '/portal/leonard/security/assets',    label: 'Assets',    icon: ShieldAlert },
    ],
  },
  { to: '/portal/leonard/reports',  label: 'Reports',  icon: FileBarChart },
  { to: '/portal/leonard/settings', label: 'Settings', icon: Settings },
];

function NavItem({ item, depth = 0 }) {
  const location = useLocation();
  const [open, setOpen] = useState(() =>
    item.children?.some((c) => location.pathname.startsWith(c.to))
  );

  if (item.children) {
    const isActive = item.children.some((c) => location.pathname.startsWith(c.to));
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={clsx(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
            isActive ? 'text-white bg-navy-700' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
          )}
        >
          <span className="flex items-center gap-2.5">
            <item.icon size={16} />
            {item.label}
          </span>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {open && (
          <div className="mt-0.5 ml-3 border-l border-navy-700 pl-3 space-y-0.5">
            {item.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    isActive ? 'text-white bg-navy-700' : 'text-navy-400 hover:text-white hover:bg-navy-800'
                  )
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.to === '/portal/leonard/dashboard'}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
          isActive ? 'text-white bg-navy-700' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
        )
      }
    >
      <item.icon size={16} />
      {item.label}
    </NavLink>
  );
}

function Sidebar({ onClose }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="w-60 min-h-screen bg-navy-950 text-white flex flex-col flex-shrink-0">
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
          {onClose && (
            <button onClick={onClose} className="text-navy-400 hover:text-white lg:hidden transition-colors">
              <X size={18} />
            </button>
          )}
        </div>
        <p className="text-[10px] uppercase tracking-widest text-navy-500 font-semibold mb-0.5">Portal</p>
        <h1 className="text-sm font-bold text-white">Leonard Portal</h1>
        <span className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-navy-800 text-blue-400 uppercase tracking-wide">
          Enterprise
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-2 border-t border-navy-800 space-y-0.5">
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
}

export default function LeonardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Simple breadcrumb from path
  const crumbs = location.pathname
    .replace('/portal/leonard', '')
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative z-50 h-full">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex-shrink-0 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
            <span className="text-navy-700 font-semibold whitespace-nowrap">Leonard</span>
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5 truncate">
                <span className="text-gray-300">/</span>
                <span className={i === crumbs.length - 1 ? 'text-gray-800 font-medium' : ''}>{crumb}</span>
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[200px]">
              {user?.email}
            </span>
            <div className="h-8 w-8 rounded-full bg-navy-800 flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.[0]?.toUpperCase() || 'L'}
            </div>
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
