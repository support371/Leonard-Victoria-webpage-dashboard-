/**
 * SectionHeader — Clean divider-style section header for dashboard pages.
 *
 * Props:
 *   title    {string}                          — Section title
 *   subtitle {string}                          — Optional supporting text below title
 *   action   {{ label: string, onClick: fn }}  — Optional action button on the right
 */
export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <div className="min-w-0">
        <h2 className="text-base font-bold text-gray-900 leading-tight truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-gray-500 leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="flex-shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 border border-blue-200 hover:border-blue-300"
        >
          {action.label}
        </button>
      )}

      {/* Divider line fills remaining space when no action */}
      {!action && (
        <div className="flex-1 h-px bg-gray-200" />
      )}
    </div>
  );
}
