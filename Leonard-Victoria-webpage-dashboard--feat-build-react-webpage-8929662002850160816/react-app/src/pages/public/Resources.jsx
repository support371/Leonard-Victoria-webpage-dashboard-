import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, BookOpen, Video, Download, Lock } from 'lucide-react';

const RESOURCES = [
  { id: 1, title: 'Wealth Alignment Framework — Starter Guide', type: 'Guide', category: 'Wealth', access: 'free', icon: FileText, desc: 'A foundational guide to aligning your financial decisions with your values and spiritual purpose.' },
  { id: 2, title: 'Energy Healing 101 — Introduction eBook', type: 'eBook', category: 'Healing', access: 'free', icon: BookOpen, desc: 'An accessible primer on energy healing principles, practices, and where to begin your journey.' },
  { id: 3, title: 'PMA Membership — What It Means & Why It Matters', type: 'Article', category: 'Legal', access: 'free', icon: FileText, desc: 'Understanding the structure, benefits, and protections of a Private Membership Association.' },
  { id: 4, title: 'Strategic Wealth Masterclass — Replay', type: 'Video', category: 'Wealth', access: 'member', icon: Video, desc: 'Full recording of the Strategic Wealth Alignment masterclass with Leonard M. Diana.' },
  { id: 5, title: 'Faith-Based Financial Planning Workbook', type: 'Workbook', category: 'Wealth', access: 'member', icon: Download, desc: 'A comprehensive workbook for mapping your financial goals through a faith-aligned lens.' },
  { id: 6, title: 'Community Healing Protocol — Practitioner Edition', type: 'Guide', category: 'Healing', access: 'member', icon: FileText, desc: 'Advanced practitioner protocols for group and community healing facilitation.' },
  { id: 7, title: 'Real Estate Intention Setting Workbook', type: 'Workbook', category: 'Real Estate', access: 'member', icon: Download, desc: 'Align your real estate investment decisions with your spiritual and generational wealth goals.' },
  { id: 8, title: 'Sovereign Leadership Series — Module 1', type: 'Video', category: 'Leadership', access: 'member', icon: Video, desc: 'First module of the flagship leadership development series for Elevated and Sovereign members.' },
];

const CATEGORIES = ['All', 'Wealth', 'Healing', 'Legal', 'Real Estate', 'Leadership'];

const Resources = () => {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const filtered = filter === 'All' ? RESOURCES : RESOURCES.filter(r => r.category === filter);

  return (
    <div className="pt-14">
      <section className="bg-slate-950 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Resource Library</p>
          <h1 className="text-5xl font-black text-white mb-6">Knowledge That Moves You Forward</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Curated guides, workbooks, recordings, and articles spanning wealth, healing, leadership, and community.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-slate-600 hover:border-amber-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(res => (
              <div key={res.id} className="bg-white border border-gray-200 hover:border-amber-300 hover:shadow-sm rounded-xl p-6 flex flex-col transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <res.icon className="w-4 h-4 text-amber-600" />
                  </div>
                  {res.access === 'member' ? (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Lock className="w-3 h-3" />
                      <span className="text-[10px] font-semibold uppercase">Member</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase">Free</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">{res.type}</p>
                <h3 className="text-slate-900 font-bold text-sm mb-2 flex-1 leading-tight">{res.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{res.desc}</p>
                <button
                  onClick={() => res.access === 'member' ? navigate('/membership') : null}
                  className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-all ${
                    res.access === 'free'
                      ? 'bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700'
                      : 'bg-gray-50 border border-gray-200 text-slate-500 hover:border-amber-200'
                  }`}
                >
                  {res.access === 'free' ? 'Access Free' : 'Member Access Required'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Unlock the Full Library</h2>
          <p className="text-slate-400 mb-8">Member access unlocks all recordings, workbooks, and exclusive series — starting from the Elevated tier.</p>
          <button onClick={() => navigate('/membership')} className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-lg shadow-lg shadow-amber-500/20 transition-all">
            Join Membership
          </button>
        </div>
      </section>
    </div>
  );
};

export default Resources;
