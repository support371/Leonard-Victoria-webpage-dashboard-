import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { SERVICES } from '../../data/seed';

const ServiceCard = ({ service }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-sm overflow-hidden transition-all duration-200">
      <div className="p-7">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-xl font-bold">
            {service.icon}
          </div>
          <button onClick={() => setExpanded(!expanded)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        <h3 className="text-slate-900 text-lg font-bold mb-2">{service.category}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{service.overview}</p>
      </div>

      {expanded && (
        <div className="px-7 pb-7 border-t border-gray-100 pt-5 space-y-5 bg-gray-50">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Included Offerings</p>
            <ul className="space-y-2">
              {service.offerings.map(o => (
                <li key={o} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Ideal For</p>
            <p className="text-sm text-slate-500">{service.audience}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Expected Outcomes</p>
            <p className="text-sm text-slate-500">{service.outcomes}</p>
          </div>
          <button onClick={() => navigate('/contact')} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-lg transition-all">
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
    <div className="pt-14">
      <section className="bg-slate-950 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Service Architecture</p>
          <h1 className="text-5xl font-black text-white mb-6">Six Pillars of Purpose</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Every service pillar is intentional, structured, and aligned with the belief that genuine wealth flows from spiritual clarity and strategic action.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {SERVICES.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Not Sure Where to Start?</h2>
          <p className="text-slate-400 mb-8">Schedule a complimentary consultation to identify the right service pathway for your specific goals.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/contact')} className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-lg transition-all">Book Consultation</button>
            <button onClick={() => navigate('/membership')} className="px-8 py-3.5 border border-slate-600 hover:border-slate-500 text-slate-300 font-semibold rounded-lg transition-all">View Membership</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
