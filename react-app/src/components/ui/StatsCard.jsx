import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatsCard({ title, value, subtitle, trend, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    navy: 'bg-navy-50 text-navy-700 border-navy-100',
  };

  const trendIcon =
    trend > 0 ? <TrendingUp className="w-3 h-3" /> :
    trend < 0 ? <TrendingDown className="w-3 h-3" /> :
    <Minus className="w-3 h-3" />;

  const trendColor = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-gray-400';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {Icon && (
          <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="flex items-center space-x-1">
        {trend !== undefined && (
          <span className={`flex items-center space-x-0.5 text-xs font-medium ${trendColor}`}>
            {trendIcon}
            <span>{Math.abs(trend)}%</span>
          </span>
        )}
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}
