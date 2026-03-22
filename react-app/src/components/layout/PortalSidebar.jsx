import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Shield, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/portal', icon: LayoutDashboard, end: true },
  { label: 'Members', href: '/portal/members', icon: Users, roles: ['admin', 'operations'] },
  { label: 'Documents', href: '/portal/documents', icon: FileText, roles: ['admin', 'legal', 'operations'] },
  { label: 'Admin', href: '/portal/admin', icon: Shield, roles: ['admin'] },
];

export default function PortalSidebar() {
  const { role, signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    if (role === 'admin') return true;
    return item.roles.includes(role);
  });

  return (
    <div className="w-60 bg-navy-900 text-white flex flex-col h-full">
      <div className="p-5 border-b border-navy-800">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center">
            <span className="text-navy-900 font-bold text-xs">LV</span>
          </div>
          <span className="font-semibold text-sm">Member Portal</span>
        </div>
        <p className="text-navy-400 text-xs truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {visibleItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-2">
        <div className="bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/20 rounded-lg p-2.5">
          <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">Powered by</p>
          <p className="text-[10px] text-amber-200 leading-tight">Leonard M. Diana</p>
        </div>
      </div>

      <div className="p-3 border-t border-navy-800 space-y-1">
        <NavLink
          to="/"
          className="flex items-center px-3 py-2 text-sm text-navy-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Public site
        </NavLink>
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm text-navy-400 hover:text-red-400 rounded-lg hover:bg-navy-800 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
