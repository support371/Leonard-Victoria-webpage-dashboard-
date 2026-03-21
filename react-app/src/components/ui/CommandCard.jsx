/**
 * CommandCard — Premium stat card for the IW Command Center.
 *
 * Props:
 *   label   {string}  — Metric label (e.g. "Total AUM")
 *   value   {string}  — Primary display value (e.g. "$4.2M")
 *   change  {string}  — Optional change string (e.g. "+12.4%" or "-3.1%")
 *   icon    {React.ElementType} — Lucide icon component
 *   accent  {'blue'|'green'|'amber'|'red'|'purple'} — Accent color for border & icon bg
 */

const ACCENT_MAP = {
  blue:   { border: 'border-blue-500',   iconBg: 'bg-blue-500/10',   iconText: 'text-blue-400',   changePosText: 'text-blue-400' },
  green:  { border: 'border-emerald-500', iconBg: 'bg-emerald-500/10', iconText: 'text-emerald-400', changePosText: 'text-emerald-400' },
  amber:  { border: 'border-amber-500',  iconBg: 'bg-amber-500/10',  iconText: 'text-amber-400',  changePosText: 'text-amber-400' },
  red:    { border: 'border-red-500',    iconBg: 'bg-red-500/10',    iconText: 'text-red-400',    changePosText: 'text-red-400' },
  purple: { border: 'border-purple-500', iconBg: 'bg-purple-500/10', iconText: 'text-purple-400', changePosText: 'text-purple-400' },
};

export default function CommandCard({ label, value, change, icon: Icon, accent = 'blue' }) {
  const styles = ACCENT_MAP[accent] ?? ACCENT_MAP.blue;

  const isPositive = change && change.startsWith('+');
  const isNegative = change && change.startsWith('-');
  const changeClass = isPositive
    ? 'text-emerald-400'
    : isNegative
    ? 'text-red-400'
    : 'text-slate-400';

  return (
    <div
      className={`relative bg-navy-900 border border-navy-700 border-l-4 ${styles.border} rounded-xl p-5 flex flex-col gap-4 hover:border-opacity-80 transition-all duration-200`}
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest leading-none">
          {label}
        </p>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={17} className={styles.iconText} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-bold text-white tracking-tight leading-none">
          {value}
        </p>
        {change && (
          <span className={`text-xs font-semibold ${changeClass} leading-none mb-0.5`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
