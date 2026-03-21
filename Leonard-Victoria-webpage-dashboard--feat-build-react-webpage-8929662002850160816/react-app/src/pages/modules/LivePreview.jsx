import React, { useState } from 'react';
import { Lock, ExternalLink, RefreshCw, Monitor, Tablet, Smartphone, Globe, Clock } from 'lucide-react';
import { Card, SectionHeader, Badge } from '../../components/ui';

const PREVIEW_PAGES = [
  { label: 'Home', path: '/', status: 'live', updated: 'Mar 14, 2024' },
  { label: 'About', path: '/about', status: 'live', updated: 'Mar 13, 2024' },
  { label: 'Services', path: '/services', status: 'live', updated: 'Mar 13, 2024' },
  { label: 'Membership', path: '/membership', status: 'live', updated: 'Mar 12, 2024' },
  { label: 'Community', path: '/community', status: 'live', updated: 'Mar 11, 2024' },
  { label: 'Resources', path: '/resources', status: 'live', updated: 'Mar 11, 2024' },
  { label: 'Contact', path: '/contact', status: 'live', updated: 'Mar 10, 2024' },
];

const LivePreview = () => {
  const [viewport, setViewport] = useState('desktop');
  const [activePage, setActivePage] = useState('/');
  const [refreshKey, setRefreshKey] = useState(0);

  const viewportSizes = {
    desktop: { width: '100%', label: 'Desktop', icon: Monitor },
    tablet: { width: '768px', label: 'Tablet', icon: Tablet },
    mobile: { width: '375px', label: 'Mobile', icon: Smartphone },
  };

  const previewUrl = typeof window !== 'undefined' ? `${window.location.origin}${activePage}` : `http://localhost:5000${activePage}`;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader
        title="Live Preview"
        subtitle="Preview the public website at any viewport. Pages are live from the development server."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Pages</p>
            <div className="space-y-1">
              {PREVIEW_PAGES.map(page => (
                <button
                  key={page.path}
                  onClick={() => setActivePage(page.path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activePage === page.path
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-700 font-semibold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{page.label}</span>
                  </div>
                  <Badge variant={page.status === 'live' ? 'teal' : 'yellow'} size="xs">{page.status}</Badge>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Viewport</p>
            <div className="space-y-1">
              {Object.entries(viewportSizes).map(([key, conf]) => {
                const Icon = conf.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setViewport(key)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      viewport === key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{conf.label}</span>
                    {key !== 'desktop' && <span className="text-xs text-slate-400 ml-auto">{viewportSizes[key].width}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Environment</p>
            <Card className="p-4 space-y-2 text-xs">
              {[
                ['Env', 'Development'],
                ['Server', 'Vite HMR'],
                ['Port', '5000'],
                ['Last Deploy', 'Mar 14, 2024'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}</span>
                  <span className="text-slate-700 font-semibold font-mono">{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-200 rounded-2xl p-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ minHeight: '600px' }}>
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-xs text-slate-500 flex items-center gap-2 border border-slate-200">
                  <Lock className="w-3 h-3 text-green-600" />
                  <span className="font-mono truncate">{previewUrl}</span>
                </div>
                <button
                  onClick={() => setRefreshKey(k => k + 1)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <a
                  href={activePage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="flex justify-center p-4 overflow-x-auto">
                <iframe
                  key={`${activePage}-${refreshKey}`}
                  src={activePage}
                  title="Live Preview"
                  style={{
                    width: viewportSizes[viewport].width,
                    height: '520px',
                    border: 'none',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                    minWidth: viewport !== 'desktop' ? viewportSizes[viewport].width : undefined,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
