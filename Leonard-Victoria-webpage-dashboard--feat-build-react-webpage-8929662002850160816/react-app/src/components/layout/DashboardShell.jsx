import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, ClipboardList, Globe, Layers, Activity,
  Settings, Shield, Users, Menu, X, ChevronRight, LogOut, Bell, Search,
  Cpu, BookOpen, BarChart3
} from 'lucide-react';
import { ROLE_CONFIG, ROLES } from '../../data/seed';

const PORTAL_NAV = [
  { id: 'leonard', label: 'Owner Command', icon: LayoutDashboard, to: '/dashboard/leonard', roleLabel: 'Leonard Portal' },
  { id: 'victoria', label: 'Operations', icon: BarChart3, to: '/dashboard/victoria', roleLabel: 'Victoria Portal' },
  { id: 'bernard', label: 'Governance', icon: Shield, to: '/dashboard/bernard', roleLabel: 'Bernard Portal' },
  { id: 'developer', label: 'Developer', icon: Cpu, to: '/dashboard/developer', roleLabel: 'Dev Portal' },
];

const MODULE_NAV = [
  { label: 'Review Center', icon: ClipboardList, to: '/dashboard/reviews' },
  { label: 'Central Repository', icon: FolderOpen, to: '/dashboard/repository' },
  { label: 'Live Preview', icon: Globe, to: '/dashboard/preview' },
  { label: 'Live Structure', icon: Layers, to: '/dashboard/structure' },
  { label: 'Live Status', icon: Activity, to: '/dashboard/status' },
  { label: 'Activity Logs', icon: BookOpen, to: '/dashboard/activity' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
];

const NavItem = ({ to, icon: Icon, label, active, collapsed }) => (
  <Link
    to={to}
    title={collapsed ? label : undefined}
    className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
      active
        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
    {!collapsed && <span className="ml-2.5 truncate">{label}</span>}
  </Link>
);

const Sidebar = ({ collapsed, setCollapsed, currentRole, setCurrentRole }) => {
  const location = useLocation();

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0 transition-all duration-200 z-30 flex-shrink-0`}>
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center px-2' : 'px-5 justify-between'} border-b border-slate-800`}>
        {!collapsed && (
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-[10px]">IW</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-xs truncate">IW Command Center</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
            <span className="text-white font-black text-[10px]">IW</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors ${collapsed ? 'hidden' : ''}`}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <div>
          {!collapsed && <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-1 mb-2">Portals</p>}
          <div className="space-y-1">
            {PORTAL_NAV.map(item => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.roleLabel}
                active={location.pathname === item.to || location.pathname.startsWith(item.to + '/')}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>

        <div>
          {!collapsed && <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-1 mb-2">Modules</p>}
          <div className="space-y-1">
            {MODULE_NAV.map(item => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-slate-800 space-y-2">
        {!collapsed && (
          <>
            <div className="bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/20 rounded-lg p-2.5 mb-2">
              <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-0.5">Powered by</p>
              <p className="text-[10px] text-amber-200 leading-tight">Leonard M. Diana</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-1 mb-2">Active Role</p>
              <select
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-amber-500"
              >
                {Object.entries(ROLE_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </>
        )}
        <Link
          to="/"
          className={`flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors text-sm`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="ml-2.5">Exit to Website</span>}
        </Link>
      </div>
    </aside>
  );
};

const DashboardHeader = ({ currentRole, collapsed, setCollapsed }) => {
  const roleData = ROLE_CONFIG[currentRole];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules, files, records..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400 w-72"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex items-center space-x-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-900">{roleData.label}</p>
            <p className="text-xs text-slate-400">{roleData.title}</p>
          </div>
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleData.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
            {roleData.initials}
          </div>
        </div>
      </div>
    </header>
  );
};

const DashboardShell = ({ children, currentRole, setCurrentRole }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} currentRole={currentRole} setCurrentRole={setCurrentRole} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader currentRole={currentRole} collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
