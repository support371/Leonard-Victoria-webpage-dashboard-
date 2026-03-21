import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Loader2, Users, Bell, ToggleLeft, ToggleRight } from 'lucide-react';
import { useLeonardSettings, useUpdateLeonardSettings } from '../../../hooks/useLeonard';

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Icon size={16} className="text-navy-600" />
        <h2 className="text-sm font-semibold text-navy-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="ml-4 flex-shrink-0 mt-0.5"
        aria-pressed={value}
      >
        {value ? (
          <ToggleRight size={24} className="text-navy-700" />
        ) : (
          <ToggleLeft size={24} className="text-gray-300" />
        )}
      </button>
    </div>
  );
}

export default function Settings() {
  const { data, isLoading, error } = useLeonardSettings();
  const { mutate: save, isPending, error: saveError, isSuccess } = useUpdateLeonardSettings();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (data && !form) {
      setForm({
        workspace_name:       data.workspace?.name       || '',
        workspace_description: data.workspace?.description || '',
        notifications: {
          incident_alerts:    data.settings?.notifications?.incident_alerts    ?? true,
          client_updates:     data.settings?.notifications?.client_updates     ?? true,
          portfolio_alerts:   data.settings?.notifications?.portfolio_alerts   ?? false,
          weekly_summary:     data.settings?.notifications?.weekly_summary     ?? true,
        },
        features: {
          security_module:    data.settings?.features?.security_module    ?? true,
          portfolio_tracking: data.settings?.features?.portfolio_tracking ?? true,
          real_estate_module: data.settings?.features?.real_estate_module ?? true,
          client_crm:         data.settings?.features?.client_crm         ?? true,
          reports:            data.settings?.features?.reports            ?? true,
        },
      });
    }
  }, [data, form]);

  const handleNotifToggle = (key) => (val) => {
    setForm((f) => ({ ...f, notifications: { ...f.notifications, [key]: val } }));
  };

  const handleFeatureToggle = (key) => (val) => {
    setForm((f) => ({ ...f, features: { ...f.features, [key]: val } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    save({
      notifications: form.notifications,
      features:      form.features,
    });
  };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-navy-500" /></div>;
  if (error)     return <div className="p-8 text-red-600 text-sm">{error.message}</div>;
  if (!form)     return null;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
          <SettingsIcon size={20} /> Settings
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Leonard workspace configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workspace Info */}
        <SectionCard title="Workspace" icon={Users}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Workspace Name</label>
              <input
                value={form.workspace_name}
                onChange={(e) => setForm((f) => ({ ...f, workspace_name: e.target.value }))}
                disabled
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Workspace name is managed by the platform administrator.</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Members</p>
              {data?.members?.length > 0 ? (
                <div className="space-y-2">
                  {data.members.map((m) => (
                    <div key={m.user_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm text-gray-800">{m.email}</p>
                        <p className="text-xs text-gray-400">{m.full_name || 'No name'}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 font-medium capitalize">
                        {m.workspace_role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No members found.</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon={Bell}>
          <Toggle
            label="Security Incident Alerts"
            description="Get notified when new security incidents are logged"
            value={form.notifications.incident_alerts}
            onChange={handleNotifToggle('incident_alerts')}
          />
          <Toggle
            label="Client Updates"
            description="Alerts when client profiles are updated"
            value={form.notifications.client_updates}
            onChange={handleNotifToggle('client_updates')}
          />
          <Toggle
            label="Portfolio Alerts"
            description="Notify on significant portfolio value changes"
            value={form.notifications.portfolio_alerts}
            onChange={handleNotifToggle('portfolio_alerts')}
          />
          <Toggle
            label="Weekly Summary"
            description="Receive a weekly digest of activity"
            value={form.notifications.weekly_summary}
            onChange={handleNotifToggle('weekly_summary')}
          />
        </SectionCard>

        {/* Feature Toggles */}
        <SectionCard title="Module Access" icon={SettingsIcon}>
          <Toggle
            label="Client CRM"
            description="Enable the client management module"
            value={form.features.client_crm}
            onChange={handleFeatureToggle('client_crm')}
          />
          <Toggle
            label="Portfolio Tracking"
            description="Digital assets, crypto, and real estate holdings"
            value={form.features.portfolio_tracking}
            onChange={handleFeatureToggle('portfolio_tracking')}
          />
          <Toggle
            label="Real Estate Module"
            description="Property management and revenue tracking"
            value={form.features.real_estate_module}
            onChange={handleFeatureToggle('real_estate_module')}
          />
          <Toggle
            label="Security Operations"
            description="Asset monitoring and incident management"
            value={form.features.security_module}
            onChange={handleFeatureToggle('security_module')}
          />
          <Toggle
            label="Reports &amp; Analytics"
            description="Aggregated reporting across all modules"
            value={form.features.reports}
            onChange={handleFeatureToggle('reports')}
          />
        </SectionCard>

        {/* Save */}
        <div className="flex items-center justify-between">
          {isSuccess && <p className="text-sm text-green-600">Settings saved.</p>}
          {saveError && <p className="text-sm text-red-600">{saveError.message}</p>}
          {!isSuccess && !saveError && <span />}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
