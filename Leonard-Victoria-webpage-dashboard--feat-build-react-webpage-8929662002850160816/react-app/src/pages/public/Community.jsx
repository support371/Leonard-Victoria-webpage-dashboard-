import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Globe } from 'lucide-react';
import { EVENTS } from '../../data/seed';

const typeColors = {
  Community: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Education: 'text-blue-700 bg-blue-50 border-blue-200',
  Membership: 'text-amber-700 bg-amber-50 border-amber-200',
  Internal: 'text-purple-700 bg-purple-50 border-purple-200',
};

const Community = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-14">
      <section className="bg-slate-950 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Community & Events</p>
          <h1 className="text-5xl font-black text-white mb-6">A Global Community of Aligned Leaders</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Built on shared values, intentional connection, and the understanding that growth is exponential when pursued together.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Users, label: '1,200+ Members', desc: 'Global, purpose-driven community' },
              { icon: Calendar, label: 'Monthly Events', desc: 'Healing circles, workshops, webinars' },
              { icon: Globe, label: '15+ Countries', desc: 'Worldwide practitioner network' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center hover:border-amber-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-slate-900 font-bold text-lg mb-1">{item.label}</p>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {EVENTS.map(event => (
              <div key={event.id} className="bg-white border border-gray-200 hover:border-amber-300 hover:shadow-sm rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                <div className="flex items-start gap-5">
                  <div className="text-center min-w-[2.5rem]">
                    <p className="text-amber-600 text-[10px] font-bold uppercase">{event.date.split(' ')[0]}</p>
                    <p className="text-slate-900 text-xl font-black">{event.date.split(' ')[1]?.replace(',', '')}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-slate-900 font-bold text-sm">{event.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${typeColors[event.type]}`}>{event.type}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{event.time} · {event.attendees} registered</p>
                  </div>
                </div>
                <button onClick={() => navigate('/contact')} className="flex-shrink-0 px-5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-semibold text-sm rounded-lg transition-all">
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Join the Community</h2>
          <p className="text-slate-400 mb-8">Membership unlocks access to all events, the community forum, and the full resource library.</p>
          <button onClick={() => navigate('/membership')} className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-amber-500/20">
            Explore Membership
          </button>
        </div>
      </section>
    </div>
  );
};

export default Community;
