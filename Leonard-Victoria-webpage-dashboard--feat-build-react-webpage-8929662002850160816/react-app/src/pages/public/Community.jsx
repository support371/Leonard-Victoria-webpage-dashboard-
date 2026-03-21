import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Globe } from 'lucide-react';
import { EVENTS } from '../../data/seed';

const typeColors = {
  Community: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Education: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Membership: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Internal: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

const Community = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-6 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">Community & Events</p>
          <h1 className="text-5xl font-black text-white mb-6">A Global Community of Aligned Leaders</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our community is built on shared values, intentional connection, and the understanding that growth is exponential when pursued together.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Users, label: '1,200+ Members', desc: 'Global, purpose-driven community' },
              { icon: Calendar, label: 'Monthly Events', desc: 'Healing circles, workshops, webinars' },
              { icon: Globe, label: '15+ Countries', desc: 'Worldwide practitioner network' },
            ].map(item => (
              <div key={item.label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-white font-bold text-lg mb-1">{item.label}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-black text-white mb-8">Upcoming Events</h2>
            <div className="space-y-4">
              {EVENTS.map(event => (
                <div key={event.id} className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div className="flex items-start gap-5">
                    <div className="text-center min-w-[3rem]">
                      <p className="text-amber-400 text-xs font-bold uppercase">{event.date.split(' ')[0]}</p>
                      <p className="text-white text-2xl font-black">{event.date.split(' ')[1].replace(',', '')}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold">{event.title}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${typeColors[event.type]}`}>
                          {event.type}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{event.time} · {event.attendees} registered</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/contact')} className="flex-shrink-0 px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-sm rounded-lg transition-all">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Join the Community</h2>
          <p className="text-slate-400 mb-8">Membership unlocks access to all events, the community forum, and the full resource library.</p>
          <button onClick={() => navigate('/membership')} className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25">
            Explore Membership
          </button>
        </div>
      </section>
    </div>
  );
};

export default Community;
