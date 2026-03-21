import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  CalendarDays,
  ChevronLeft,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: 'documents', label: 'Documents',  icon: FileText },
  { to: 'members',   label: 'Members',    icon: Users,         roles: ['admin', 'operations', 'owner', 'editor'] },
  { to: 'events',    label: 'Events',     icon: CalendarDays },
];

export default function WorkspaceSidebar({ workspaceSlug, workspaceName, workspaceRole }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(workspaceRole)
  );

  return (
    <aside className="w-64 min-h-screen bg-navy-900 text-white flex flex-col">
      {/* IW Command Center brand header */}
      <div className="px-5 pt-5 pb-4 border-b border-navy-700">
        <Link to="/portal" className="flex items-center gap-2.5 group mb-3">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
            <Shield size={14} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-blue-400 tracking-wide group-hover:text-blue-300 transition-colors">
            IW Command
          </span>
        </Link>
        <p className="text-[10px] uppercase tracking-widest text-navy-400 mb-1 font-semibold">Workspace</p>
        <h2 className="text-base font-bold text-white truncate">{workspaceName || workspaceSlug}</h2>
        {workspaceRole && (
          <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-navy-700 text-navy-300 capitalize font-semibold tracking-wide">
            {workspaceRole}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 border-t border-navy-700 space-y-0.5">
        <button
          onClick={() => navigate('/portal')}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-navy-400 hover:bg-navy-800 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
          All Portals
        </button>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-navy-400 hover:bg-navy-800 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
