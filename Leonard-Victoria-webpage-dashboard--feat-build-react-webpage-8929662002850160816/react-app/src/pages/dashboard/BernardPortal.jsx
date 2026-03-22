import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, FileText, AlertTriangle, CheckCircle, Clock,
  ArrowRight, Calendar, Flag
} from 'lucide-react';
import { StatCard, Card, Badge, ModuleSection, statusVariant } from '../../components/ui';
import { COMPLIANCE_ITEMS, REVIEW_QUEUE, REPOSITORY_ITEMS } from '../../data/seed';

const ComplianceRow = ({ item }) => {
  const severityBorder = item.severity === 'high' ? 'border-l-red-500' : item.severity === 'medium' ? 'border-l-amber-500' : 'border-l-emerald-500';
  const Icon = item.status === 'Compliant' ? CheckCircle : item.status === 'Action Required' ? AlertTriangle : Clock;
  const iconColor = item.status === 'Compliant' ? 'text-emerald-500' : item.status === 'Action Required' ? 'text-red-500' : 'text-amber-500';

  return (
    <div className={`flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 border-l-4 ${severityBorder} hover:bg-white transition-colors`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{item.area}</p>
        <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.lastReviewed}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {item.nextDue}</span>
          <span className="text-xs text-slate-500">Owner: <b>{item.owner}</b></span>
        </div>
      </div>
      <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
    </div>
  );
};

const BernardPortal = () => {
  const navigate = useNavigate();
  const legalFiles = REPOSITORY_ITEMS.filter(r => ['Legal Records', 'PMA/FBO Documents', 'Membership Documents'].includes(r.category));
  const legalReviews = REVIEW_QUEUE.filter(r => r.type === 'Legal');

  const compliantCount = COMPLIANCE_ITEMS.filter(i => i.status === 'Compliant').length;
  const inReviewCount = COMPLIANCE_ITEMS.filter(i => i.status === 'In Review').length;
  const actionCount = COMPLIANCE_ITEMS.filter(i => i.status === 'Action Required').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 rounded-2xl p-8 border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Governance Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Agent Bernard — Legal Counsel</h1>
          <p className="text-slate-400 max-w-xl">Compliance management, document governance, legal records, and approval workflow — your complete legal view.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-all">
              Review Queue <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/dashboard/repository')} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg border border-white/10 transition-all">
              Legal Records
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Compliant Areas" value={`${compliantCount}/${COMPLIANCE_ITEMS.length}`} sub="Full compliance portfolio" icon={CheckCircle} accent="emerald" />
        <StatCard label="In Review" value={inReviewCount} sub="Awaiting resolution" icon={Clock} accent="amber" />
        <StatCard label="Action Required" value={actionCount} sub="Immediate attention needed" icon={AlertTriangle} accent="red" />
        <StatCard label="Legal Documents" value={legalFiles.length} sub="In central repository" icon={FileText} accent="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ModuleSection title="Compliance Portfolio">
            <div className="space-y-3">
              {COMPLIANCE_ITEMS.map(item => <ComplianceRow key={item.id} item={item} />)}
            </div>
          </ModuleSection>

          <ModuleSection title="Agreement Tracking">
            <Card className="divide-y divide-slate-100">
              {[
                { doc: 'PMA Operating Agreement', party: 'All Leadership', signed: 'Feb 28, 2024', expires: 'Feb 28, 2025', status: 'Active' },
                { doc: 'FBO Formation Charter', party: 'Leonard M. Diana', signed: 'Jan 15, 2024', expires: 'Perpetual', status: 'Active' },
                { doc: 'Service Provider Agreement — Coach A', party: 'Victoria Eleanor', signed: 'Mar 1, 2024', expires: 'Sep 1, 2024', status: 'Active' },
                { doc: 'GDPR Data Processing Addendum', party: 'Dev Team', signed: 'Jan 30, 2024', expires: 'Jan 30, 2025', status: 'Active' },
                { doc: 'Membership Terms v3', party: 'Platform-wide', signed: 'Mar 5, 2024', expires: 'Sep 5, 2024', status: 'In Review' },
              ].map(item => (
                <div key={item.doc} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{item.doc}</p>
                      <div className="flex items-center gap-4 mt-0.5">
                        <span className="text-xs text-slate-400">Party: {item.party}</span>
                        <span className="text-xs text-slate-400">Signed: {item.signed}</span>
                        <span className="text-xs text-slate-400">Expires: {item.expires}</span>
                      </div>
                    </div>
                    <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
                  </div>
                </div>
              ))}
            </Card>
          </ModuleSection>
        </div>

        <div className="space-y-6">
          <ModuleSection title="Review Queue — Legal">
            <Card className="divide-y divide-slate-100">
              {legalReviews.map(item => (
                <div key={item.id} className="px-4 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-2 mb-1">
                    {item.flagged && <Flag className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />}
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
                    <span className="text-xs text-slate-400">Due: {item.due}</span>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2">
                <button onClick={() => navigate('/dashboard/reviews')} className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  Full Review Center <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Card>
          </ModuleSection>

          <ModuleSection title="Legal Records Hub">
            <Card className="divide-y divide-slate-100">
              {legalFiles.slice(0, 5).map(item => (
                <div key={item.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                    <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2">
                <button onClick={() => navigate('/dashboard/repository')} className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  Central Repository <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Card>
          </ModuleSection>

          <ModuleSection title="PMA / FBO References">
            <Card className="p-5 space-y-3">
              {[
                { ref: 'PMA Member Rights Summary', type: 'Reference' },
                { ref: 'FBO Operational Guidelines', type: 'Reference' },
                { ref: 'State Filing Checklist', type: 'Checklist' },
                { ref: 'Privacy Law Compliance Matrix', type: 'Matrix' },
              ].map(item => (
                <div key={item.ref} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-medium text-slate-700">{item.ref}</p>
                  <Badge variant="indigo" size="xs">{item.type}</Badge>
                </div>
              ))}
            </Card>
          </ModuleSection>
        </div>
      </div>
    </div>
  );
};

export default BernardPortal;
