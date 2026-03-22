import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import { useVictoriaSettings, useUpdateVictoriaSettings } from '../../../hooks/useVictoria';

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button type="button" onClick={() => onChange(!value)} className="ml-4 flex-shrink-0 mt-0.5" aria-pressed={value}>
        {value ? <ToggleRight size={24} className="text-purple-700" /> : <ToggleLeft size={24} className="text-gray-300" />}
      </button>
    </div>
  );
}

export default function VictoriaSettings() {
  const { data, isLoading, error } = useVictoriaSettings();
  const { mutate: save, isPending, error: saveError, isSuccess } = useUpdateVictoriaSettings();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data && !form) {
      setForm({
        notifications: {
          meeting_reminders:   data.settings?.notifications?.meeting_reminders   ?? true,
          resolution_updates:  data.settings?.notifications?.resolution_updates  ?? true,
          committee_alerts:    data.settings?.notifications?.committee_alerts    ?? false,
          weekly_digest:       data.settings?.notifications?.weekly_digest       ?? true,
        },
        features: {
          meetings_module:    data.settings?.features?.meetings_module    ?? true,
          resolutions_module: data.settings?.features?.resolutions_module ?? true,
          committees_module:  data.settings?.features?.committees_module  ?? true,
          documents_access:   data.settings?.features?.documents_access   ?? true,
        },
      });
    }
  }, [data, form]);

  const toggle = (section, key) => (val) => setForm((f) => ({ ...f, [section]: { ...f[section], [key]: val } }));

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-purple-500" /></div>;
  if (error)     return <div className="p-8 text-red-600 text-sm">{error.message}</div>;
  if (!form)     return null;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-purple-950 flex items-center gap-2"><Settings size={20} /> Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Victoria governance workspace configuration</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); save({ notifications: form.notifications, features: form.features }); }} className="space-y-6">
        {/* Workspace */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5"><Users size={16} className="text-purple-600" /><h2 className="text-sm font-semibold text-purple-900">Workspace Members</h2></div>
          {data?.members?.length > 0 ? (
            <div className="space-y-2">
              {data.members.map((m) => (
                <div key={m.user_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-800">{m.email}</p>
                    <p className="text-xs text-gray-400">{m.full_name || 'No name'}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium capitalize">{m.workspace_role}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-gray-400">No members found.</p>}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-purple-900 mb-4">Notifications</h2>
          <Toggle label="Meeting Reminders" description="Receive reminders before scheduled meetings" value={form.notifications.meeting_reminders} onChange={toggle('notifications', 'meeting_reminders')} />
          <Toggle label="Resolution Updates" description="Alert when resolution status changes" value={form.notifications.resolution_updates} onChange={toggle('notifications', 'resolution_updates')} />
          <Toggle label="Committee Alerts" description="Notify on committee changes" value={form.notifications.committee_alerts} onChange={toggle('notifications', 'committee_alerts')} />
          <Toggle label="Weekly Digest" description="Weekly governance summary" value={form.notifications.weekly_digest} onChange={toggle('notifications', 'weekly_digest')} />
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-purple-900 mb-4">Module Access</h2>
          <Toggle label="Meetings Module" description="Schedule and track governance meetings" value={form.features.meetings_module} onChange={toggle('features', 'meetings_module')} />
          <Toggle label="Resolutions Module" description="Create and manage formal resolutions" value={form.features.resolutions_module} onChange={toggle('features', 'resolutions_module')} />
          <Toggle label="Committees Module" description="Committee management and tracking" value={form.features.committees_module} onChange={toggle('features', 'committees_module')} />
          <Toggle label="Documents Access" description="View governance and legal documents" value={form.features.documents_access} onChange={toggle('features', 'documents_access')} />
        </div>

        <div className="flex items-center justify-between">
          {isSuccess && <p className="text-sm text-green-600">Settings saved.</p>}
          {saveError && <p className="text-sm text-red-600">{saveError.message}</p>}
          {!isSuccess && !saveError && <span />}
          <button type="submit" disabled={isPending} className="flex items-center gap-2 px-5 py-2 bg-purple-800 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
