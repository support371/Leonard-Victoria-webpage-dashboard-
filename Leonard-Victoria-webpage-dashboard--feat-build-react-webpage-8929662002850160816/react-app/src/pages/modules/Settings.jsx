import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { Card, SectionHeader, Btn } from '../../components/ui';

const SettingsSection = ({ title, icon: Icon, children }) => (
  <Card className="p-6">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
        <Icon className="w-4 h-4 text-amber-600" />
      </div>
      <h2 className="font-bold text-slate-900">{title}</h2>
    </div>
    {children}
  </Card>
);

const Toggle = ({ label, desc, defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${on ? 'bg-amber-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
};

const InputField = ({ label, defaultValue, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
    />
  </div>
);

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader title="Settings" subtitle="Platform preferences, notifications, and access configuration." />

      <SettingsSection title="Profile Settings" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <InputField label="Full Name" defaultValue="Leonard M. Diana" />
          <InputField label="Title" defaultValue="Owner & Executive Director" />
          <InputField label="Email" defaultValue="leonard@iwcommandcenter.com" type="email" />
          <InputField label="Phone" defaultValue="+1 (555) 000-0001" />
        </div>
        <Btn variant="gold">Save Profile</Btn>
      </SettingsSection>

      <SettingsSection title="Notifications" icon={Bell}>
        <Toggle label="Review Queue Alerts" desc="Notify when items are added to the decision queue" defaultOn={true} />
        <Toggle label="Compliance Due Date Reminders" desc="7-day advance warning for upcoming compliance deadlines" defaultOn={true} />
        <Toggle label="New Member Notifications" desc="Alert when new members join any tier" defaultOn={false} />
        <Toggle label="Repository Updates" desc="Notify when documents are added or updated" defaultOn={true} />
        <Toggle label="System Status Alerts" desc="Critical infrastructure and module alerts" defaultOn={true} />
      </SettingsSection>

      <SettingsSection title="Access Control" icon={Shield}>
        <div className="space-y-3 mb-6">
          {[
            { role: 'Leonard M. Diana', level: 'Owner — Full Access', color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { role: 'Victoria Eleanor', level: 'Operations — Portal + Modules', color: 'text-teal-600 bg-teal-50 border-teal-200' },
            { role: 'Agent Bernard', level: 'Legal — Portal + Legal Records', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
            { role: 'Developer', level: 'Technical — Dev Portal + All Modules', color: 'text-slate-600 bg-slate-50 border-slate-200' },
          ].map(item => (
            <div key={item.role} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-900">{item.role}</p>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${item.color}`}>{item.level}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">Access levels are managed through the portal role architecture. Contact Dev Team to modify permissions.</p>
      </SettingsSection>

      <SettingsSection title="Platform Settings" icon={Globe}>
        <Toggle label="Public Website Live" desc="Controls whether the public-facing website is accessible" defaultOn={true} />
        <Toggle label="Dashboard Access Open" desc="Allow all role users to access the dashboard" defaultOn={true} />
        <Toggle label="Maintenance Mode" desc="Temporarily restrict public access for maintenance" defaultOn={false} />
        <Toggle label="Debug Mode" desc="Show technical diagnostics for Dev Portal users" defaultOn={false} />
      </SettingsSection>
    </div>
  );
};

export default Settings;
