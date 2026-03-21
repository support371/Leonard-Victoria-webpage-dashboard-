import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import { useBernardSettings, useUpdateBernardSettings } from '../../../hooks/useBernard';

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button type="button" onClick={() => onChange(!value)} className="ml-4 flex-shrink-0 mt-0.5" aria-pressed={value}>
        {value ? <ToggleRight size={24} className="text-emerald-700" /> : <ToggleLeft size={24} className="text-gray-300" />}
      </button>
    </div>
  );
}

export default function BernardSettings() {
  const { data, isLoading, error } = useBernardSettings();
  const { mutate: save, isPending, error: saveError, isSuccess } = useUpdateBernardSettings();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data && !form) {
      setForm({
        notifications: {
          program_updates:  data.settings?.notifications?.program_updates  ?? true,
          event_reminders:  data.settings?.notifications?.event_reminders  ?? true,
          new_enrollments:  data.settings?.notifications?.new_enrollments  ?? true,
          weekly_summary:   data.settings?.notifications?.weekly_summary   ?? true,
        },
        features: {
          programs_module:  data.settings?.features?.programs_module  ?? true,
          events_module:    data.settings?.features?.events_module    ?? true,
          members_module:   data.settings?.features?.members_module   ?? true,
        },
      });
    }
  }, [data, form]);

  const toggle = (section, key) => (val) => setForm((f) => ({ ...f, [section]: { ...f[section], [key]: val } }));

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-emerald-500" /></div>;
  if (error)     return <div className="p-8 text-red-600 text-sm">{error.message}</div>;
  if (!form)     return null;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-emerald-950 flex items-center gap-2"><Settings size={20} /> Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Bernard programs workspace configuration</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); save({ notifications: form.notifications, features: form.features }); }} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5"><Users size={16} className="text-emerald-600" /><h2 className="text-sm font-semibold text-emerald-900">Workspace Members</h2></div>
          {data?.members?.length > 0 ? (
            <div className="space-y-2">
              {data.members.map((m) => (
                <div key={m.user_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-800">{m.email}</p>
                    <p className="text-xs text-gray-400">{m.full_name || 'No name'}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium capitalize">{m.workspace_role}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-gray-400">No members found.</p>}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-900 mb-4">Notifications</h2>
          <Toggle label="Program Updates" description="Alert when program details change" value={form.notifications.program_updates} onChange={toggle('notifications', 'program_updates')} />
          <Toggle label="Event Reminders" description="Reminders before scheduled events" value={form.notifications.event_reminders} onChange={toggle('notifications', 'event_reminders')} />
          <Toggle label="New Enrollments" description="Alert when members enroll in programs" value={form.notifications.new_enrollments} onChange={toggle('notifications', 'new_enrollments')} />
          <Toggle label="Weekly Summary" description="Weekly community activity digest" value={form.notifications.weekly_summary} onChange={toggle('notifications', 'weekly_summary')} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-900 mb-4">Module Access</h2>
          <Toggle label="Programs Module" description="Create and manage community programs" value={form.features.programs_module} onChange={toggle('features', 'programs_module')} />
          <Toggle label="Events Module" description="Schedule and track community events" value={form.features.events_module} onChange={toggle('features', 'events_module')} />
          <Toggle label="Members Module" description="View and search workspace members" value={form.features.members_module} onChange={toggle('features', 'members_module')} />
        </div>

        <div className="flex items-center justify-between">
          {isSuccess && <p className="text-sm text-green-600">Settings saved.</p>}
          {saveError && <p className="text-sm text-red-600">{saveError.message}</p>}
          {!isSuccess && !saveError && <span />}
          <button type="submit" disabled={isPending} className="flex items-center gap-2 px-5 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
