import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  CalendarDays,
  ChevronLeft,
  LogOut,
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
      {/* Workspace header */}
      <div className="px-6 py-5 border-b border-navy-700">
        <p className="text-xs uppercase tracking-widest text-navy-400 mb-1">Workspace</p>
        <h2 className="text-lg font-semibold truncate">{workspaceName || workspaceSlug}</h2>
        {workspaceRole && (
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-navy-700 text-navy-300 capitalize">
            {workspaceRole}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
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
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-4 py-4 border-t border-navy-700 space-y-1">
        <button
          onClick={() => navigate('/portal')}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-navy-300 hover:bg-navy-800 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
          All Portals
        </button>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-navy-300 hover:bg-navy-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
