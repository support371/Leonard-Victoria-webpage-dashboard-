import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { SERVICES } from '../../data/seed';

const ServiceCard = ({ service }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-all duration-200">
      <div className="p-8">
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl font-bold">
            {service.icon}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-slate-500 hover:text-amber-400 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{service.category}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{service.overview}</p>
      </div>

      {expanded && (
        <div className="px-8 pb-8 border-t border-slate-800/60 pt-6 space-y-5">
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Included Offerings</p>
            <ul className="space-y-2">
              {service.offerings.map(o => (
                <li key={o} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Ideal For</p>
            <p className="text-sm text-slate-400">{service.audience}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Expected Outcomes</p>
            <p className="text-sm text-slate-400">{service.outcomes}</p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-lg transition-all"
          >
            {service.cta} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

const Services = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-6 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">Service Architecture</p>
          <h1 className="text-5xl font-black text-white mb-6">Six Pillars of Purpose</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every service we offer is intentional, structured, and aligned with the core belief that genuine wealth flows from spiritual clarity and strategic action.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SERVICES.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Not Sure Where to Start?</h2>
          <p className="text-slate-400 mb-8">Schedule a complimentary consultation to identify the right service pathway for your specific goals and situation.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/contact')} className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-all">Book Consultation</button>
            <button onClick={() => navigate('/membership')} className="px-8 py-3.5 border border-slate-700 hover:border-amber-500 text-slate-300 font-semibold rounded-xl transition-all">View Membership</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
