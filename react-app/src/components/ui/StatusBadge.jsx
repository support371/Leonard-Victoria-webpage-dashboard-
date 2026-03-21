/**
 * StatusBadge — Maps status strings to color-coded pill badges.
 *
 * Props:
 *   status  {string}       — Status text (e.g. "active", "pending", "error")
 *   size    {'sm'|'md'}    — Badge size; defaults to 'md'
 *
 * Color mapping:
 *   green  → active, live, passed, approved, complete, completed
 *   amber  → pending, draft, in progress, in-progress, review, queued
 *   red    → inactive, error, failed, rejected, overdue, cancelled, canceled
 *   blue   → review, reviewing, submitted, processing
 *   slate  → unknown / unmapped statuses
 */

const STATUS_COLOR_MAP = {
  // Green — active / success states
  active:    'green',
  live:      'green',
  passed:    'green',
  approved:  'green',
  complete:  'green',
  completed: 'green',
  success:   'green',

  // Amber — pending / in-motion states
  pending:       'amber',
  draft:         'amber',
  queued:        'amber',
  'in progress': 'amber',
  'in-progress': 'amber',
  inprogress:    'amber',
  scheduled:     'amber',

  // Red — error / stopped states
  inactive:  'red',
  error:     'red',
  failed:    'red',
  rejected:  'red',
  overdue:   'red',
  cancelled: 'red',
  canceled:  'red',

  // Blue — review / processing states
  review:     'blue',
  reviewing:  'blue',
  submitted:  'blue',
  processing: 'blue',
};

const COLOR_CLASSES = {
  green: {
    wrapper: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot:     'bg-emerald-500',
  },
  amber: {
    wrapper: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot:     'bg-amber-500',
  },
  red: {
    wrapper: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    dot:     'bg-red-500',
  },
  blue: {
    wrapper: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    dot:     'bg-blue-500',
  },
  slate: {
    wrapper: 'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
    dot:     'bg-slate-400',
  },
};

const SIZE_CLASSES = {
  sm: { badge: 'px-1.5 py-0.5 text-[10px] gap-1', dot: 'w-1.5 h-1.5' },
  md: { badge: 'px-2.5 py-1 text-xs gap-1.5',     dot: 'w-2 h-2' },
};

export default function StatusBadge({ status = '', size = 'md' }) {
  const normalized = status.toString().toLowerCase().trim();
  const colorKey = STATUS_COLOR_MAP[normalized] ?? 'slate';
  const colors = COLOR_CLASSES[colorKey];
  const sizes = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  // Capitalize first letter of each word for display
  const displayLabel = status
    .toString()
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${colors.wrapper} ${sizes.badge}`}
    >
      <span className={`rounded-full flex-shrink-0 ${colors.dot} ${sizes.dot}`} />
      {displayLabel}
    </span>
  );
}
