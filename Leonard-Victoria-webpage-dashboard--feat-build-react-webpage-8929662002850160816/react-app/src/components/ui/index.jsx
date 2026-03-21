import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    ghost: 'bg-white/10 text-white border-white/20',
  };
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export const StatusDot = ({ status }) => {
  const colors = {
    live: 'bg-emerald-500',
    active: 'bg-emerald-500',
    Compliant: 'bg-emerald-500',
    Approved: 'bg-emerald-500',
    Final: 'bg-emerald-500',
    scaffolded: 'bg-amber-500',
    'In Review': 'bg-amber-500',
    'Pending Review': 'bg-amber-500',
    'Pending Approval': 'bg-amber-500',
    Draft: 'bg-slate-400',
    'Action Required': 'bg-red-500',
    error: 'bg-red-500',
    default: 'bg-slate-400',
  };
  const color = colors[status] || colors.default;
  return <span className={`inline-block w-2 h-2 rounded-full ${color} flex-shrink-0`} />;
};

export const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''} ${className}`}>
    {children}
  </div>
);

export const StatCard = ({ label, value, sub, icon: Icon, accent = 'blue', trend }) => {
  const accents = {
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    teal: 'text-teal-600 bg-teal-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    red: 'text-red-600 bg-red-50',
  };
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accents[accent]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
      {trend && <p className={`text-xs font-medium mt-1 ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>{trend.label}</p>}
    </Card>
  );
};

export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export const ModuleSection = ({ title, children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</h2>
    {children}
  </div>
);

export const Btn = ({ children, variant = 'primary', size = 'md', className = '', onClick, type = 'button' }) => {
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    gold: 'bg-amber-500 text-white hover:bg-amber-600',
    outline: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm font-medium',
    lg: 'px-8 py-3 text-base font-semibold',
    xl: 'px-10 py-4 text-lg font-bold',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export const EmptyState = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && <Icon className="w-10 h-10 text-slate-300 mb-4" />}
    <p className="text-slate-600 font-medium">{title}</p>
    {desc && <p className="text-sm text-slate-400 mt-1">{desc}</p>}
  </div>
);

export const PriorityBadge = ({ priority }) => {
  const map = { high: 'red', medium: 'yellow', low: 'default' };
  return <Badge variant={map[priority] || 'default'}>{priority}</Badge>;
};

export const statusVariant = (status) => {
  const map = {
    Compliant: 'green', Approved: 'green', Final: 'green', Active: 'teal', live: 'teal',
    'In Review': 'yellow', 'Pending Review': 'yellow', 'Pending Approval': 'yellow', Draft: 'default', scaffolded: 'yellow',
    'Action Required': 'red', error: 'red',
  };
  return map[status] || 'default';
};
