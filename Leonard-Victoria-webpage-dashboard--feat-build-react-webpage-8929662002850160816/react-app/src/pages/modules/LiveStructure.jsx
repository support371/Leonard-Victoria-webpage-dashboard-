import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, Globe, Layout } from 'lucide-react';
import { Card, SectionHeader, Badge } from '../../components/ui';

const TREE = [
  {
    label: 'src/', type: 'folder', open: true, children: [
      {
        label: 'pages/', type: 'folder', children: [
          {
            label: 'public/', type: 'folder', children: [
              { label: 'Home.jsx', type: 'file', route: '/', status: 'live' },
              { label: 'About.jsx', type: 'file', route: '/about', status: 'live' },
              { label: 'Services.jsx', type: 'file', route: '/services', status: 'live' },
              { label: 'Membership.jsx', type: 'file', route: '/membership', status: 'live' },
              { label: 'Community.jsx', type: 'file', route: '/community', status: 'live' },
              { label: 'Resources.jsx', type: 'file', route: '/resources', status: 'live' },
              { label: 'Contact.jsx', type: 'file', route: '/contact', status: 'live' },
            ]
          },
          {
            label: 'dashboard/', type: 'folder', children: [
              { label: 'LeonardPortal.jsx', type: 'file', route: '/dashboard/leonard', status: 'live' },
              { label: 'VictoriaPortal.jsx', type: 'file', route: '/dashboard/victoria', status: 'live' },
              { label: 'BernardPortal.jsx', type: 'file', route: '/dashboard/bernard', status: 'live' },
              { label: 'DeveloperPortal.jsx', type: 'file', route: '/dashboard/developer', status: 'live' },
            ]
          },
          {
            label: 'modules/', type: 'folder', children: [
              { label: 'ReviewCenter.jsx', type: 'file', route: '/dashboard/reviews', status: 'live' },
              { label: 'CentralRepository.jsx', type: 'file', route: '/dashboard/repository', status: 'live' },
              { label: 'LivePreview.jsx', type: 'file', route: '/dashboard/preview', status: 'live' },
              { label: 'LiveStructure.jsx', type: 'file', route: '/dashboard/structure', status: 'live' },
              { label: 'LiveStatus.jsx', type: 'file', route: '/dashboard/status', status: 'live' },
              { label: 'ActivityLogs.jsx', type: 'file', route: '/dashboard/activity', status: 'live' },
              { label: 'Settings.jsx', type: 'file', route: '/dashboard/settings', status: 'live' },
            ]
          },
        ]
      },
      {
        label: 'components/', type: 'folder', children: [
          { label: 'ui/index.jsx', type: 'file', status: 'live' },
          { label: 'layout/PublicLayout.jsx', type: 'file', status: 'live' },
          { label: 'layout/DashboardShell.jsx', type: 'file', status: 'live' },
        ]
      },
      {
        label: 'data/', type: 'folder', children: [
          { label: 'seed.js', type: 'file', status: 'live' },
        ]
      },
      { label: 'App.jsx', type: 'file', status: 'live' },
      { label: 'main.jsx', type: 'file', status: 'live' },
      { label: 'index.css', type: 'file', status: 'live' },
    ]
  }
];

const TreeNode = ({ node, depth = 0 }) => {
  const [open, setOpen] = useState(node.open !== false);

  const statusColor = node.status === 'live' ? 'text-emerald-500' : node.status === 'scaffolded' ? 'text-amber-500' : '';

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors text-sm font-mono group`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={() => node.type === 'folder' && setOpen(!open)}
      >
        {node.type === 'folder' ? (
          open ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        ) : <span className="w-3.5 flex-shrink-0" />}
        {node.type === 'folder' ? (
          <Folder className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        ) : (
          <File className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
        )}
        <span className={`${node.type === 'folder' ? 'text-slate-700 font-semibold' : 'text-slate-600'}`}>{node.label}</span>
        {node.route && <span className="text-[10px] text-slate-400 ml-2 font-mono">{node.route}</span>}
        {node.status && <span className={`text-[10px] font-semibold ml-auto ${statusColor}`}>{node.status}</span>}
      </div>
      {node.type === 'folder' && open && node.children && (
        <div>
          {node.children.map((child, i) => <TreeNode key={i} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
};

const ROUTES = [
  { path: '/', component: 'Home', layout: 'PublicLayout', type: 'Public' },
  { path: '/about', component: 'About', layout: 'PublicLayout', type: 'Public' },
  { path: '/services', component: 'Services', layout: 'PublicLayout', type: 'Public' },
  { path: '/membership', component: 'Membership', layout: 'PublicLayout', type: 'Public' },
  { path: '/community', component: 'Community', layout: 'PublicLayout', type: 'Public' },
  { path: '/resources', component: 'Resources', layout: 'PublicLayout', type: 'Public' },
  { path: '/contact', component: 'Contact', layout: 'PublicLayout', type: 'Public' },
  { path: '/dashboard', component: '→ /dashboard/leonard', layout: 'DashboardShell', type: 'Redirect' },
  { path: '/dashboard/leonard', component: 'LeonardPortal', layout: 'DashboardShell', type: 'Portal' },
  { path: '/dashboard/victoria', component: 'VictoriaPortal', layout: 'DashboardShell', type: 'Portal' },
  { path: '/dashboard/bernard', component: 'BernardPortal', layout: 'DashboardShell', type: 'Portal' },
  { path: '/dashboard/developer', component: 'DeveloperPortal', layout: 'DashboardShell', type: 'Portal' },
  { path: '/dashboard/reviews', component: 'ReviewCenter', layout: 'DashboardShell', type: 'Module' },
  { path: '/dashboard/repository', component: 'CentralRepository', layout: 'DashboardShell', type: 'Module' },
  { path: '/dashboard/preview', component: 'LivePreview', layout: 'DashboardShell', type: 'Module' },
  { path: '/dashboard/structure', component: 'LiveStructure', layout: 'DashboardShell', type: 'Module' },
  { path: '/dashboard/status', component: 'LiveStatus', layout: 'DashboardShell', type: 'Module' },
  { path: '/dashboard/activity', component: 'ActivityLogs', layout: 'DashboardShell', type: 'Module' },
  { path: '/dashboard/settings', component: 'Settings', layout: 'DashboardShell', type: 'Module' },
  { path: '*', component: 'NotFound', layout: 'None', type: 'Fallback' },
];

const LiveStructure = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <SectionHeader title="Live Structure" subtitle="App architecture, file system, routes, and component hierarchy." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">File System</h2>
          <Card className="p-4 font-mono text-sm">
            {TREE.map((node, i) => <TreeNode key={i} node={node} />)}
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Route Map</h2>
            <Card className="overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500">Route</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500">Component</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {ROUTES.map(route => (
                    <tr key={route.path} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-700">{route.path}</td>
                      <td className="px-4 py-2.5 text-blue-600">{route.component}</td>
                      <td className="px-4 py-2.5">
                        <Badge size="xs" variant={
                          route.type === 'Public' ? 'blue' :
                          route.type === 'Portal' ? 'amber' :
                          route.type === 'Module' ? 'teal' :
                          route.type === 'Redirect' ? 'purple' : 'default'
                        }>{route.type}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Layout Hierarchy</h2>
            <Card className="p-5 space-y-3">
              {[
                { layout: 'PublicLayout', contains: 'PublicNav + children + PublicFooter', routes: '7 public routes' },
                { layout: 'DashboardShell', contains: 'Sidebar + DashboardHeader + children', routes: '11 dashboard routes' },
              ].map(item => (
                <div key={item.layout} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Layout className="w-4 h-4 text-amber-500" />
                    <p className="text-sm font-bold text-slate-900 font-mono">{item.layout}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{item.contains}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.routes}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStructure;
