import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Shield, Zap, Heart } from 'lucide-react';
import { SERVICES } from '../../data/seed';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-slate-950 pt-14 min-h-[75vh] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(217,168,75,0.12),transparent)] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 py-28 text-center relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-10">
          <Globe className="w-3.5 h-3.5" />
          Globally Positioned · Private Membership
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6">
          Infinite Wealth
          <br />
          <span className="text-amber-500">Command Center</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          A sovereign platform uniting holistic wellness, strategic wealth, and personal development under one globally accessible private membership organization.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/membership')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-lg text-base transition-all shadow-lg shadow-amber-500/20"
          >
            Explore Membership <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="w-full sm:w-auto px-8 py-3.5 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg text-base transition-all"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

const MissionSection = () => (
  <section className="bg-white py-24 border-b border-gray-100">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">Our Mission</h2>
      <p className="text-slate-600 text-lg leading-relaxed">
        To provide an internationally accessible private membership platform that empowers individuals and families through holistic health services, faith-based organizational sovereignty, personal development pathways, and strategic wealth alignment — all within a high-trust, community-driven ecosystem.
      </p>
    </div>
  </section>
);

const ServiceArchitectureSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-50 py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Service Architecture</h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Comprehensive service provision designed for members, practitioners, collaborators, and aligned partners worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(service => (
            <div
              key={service.id}
              onClick={() => navigate('/services')}
              className="bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md p-7 cursor-pointer transition-all duration-200 group"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-xl font-bold mb-5">
                {service.icon}
              </div>
              <h3 className="text-slate-900 font-bold text-base mb-2 group-hover:text-amber-700 transition-colors">{service.category}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{service.overview}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/services')}
            className="px-8 py-3.5 border border-slate-300 hover:border-amber-400 text-slate-700 hover:text-amber-700 font-semibold rounded-lg transition-all text-sm"
          >
            View Full Service Architecture →
          </button>
        </div>
      </div>
    </section>
  );
};

const WhySection = () => (
  <section className="bg-white py-24 border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-4">Why We're Different</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight">
            Faith, Strategy, and Legacy — Unified
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            We are not a wellness brand. We are an executive intelligence platform for faith-based leaders who understand that true wealth is spiritual, relational, and strategic — in that order.
          </p>
          <div className="space-y-5">
            {[
              { icon: Shield, title: 'PMA-Protected Structure', desc: 'Operate within a legally sound private membership framework with member protections.' },
              { icon: Heart, title: 'Spiritually Grounded', desc: 'Every system and service is aligned with faith-based principle and intentional living.' },
              { icon: Zap, title: 'Execution-Focused', desc: 'Tools, coaching, and community built for decisive action and measurable outcomes.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">{item.title}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-950 rounded-2xl p-10 border border-slate-800">
          <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center mb-8 mx-auto">
            <span className="text-white font-black text-xl">IW</span>
          </div>
          <blockquote className="text-slate-200 text-lg font-medium text-center leading-relaxed italic mb-6">
            "Our mission is to create a sovereign ecosystem where faith, healing, and wealth converge — not as a coincidence, but as a design."
          </blockquote>
          <div className="text-center">
            <p className="text-amber-400 font-bold text-sm">Leonard M. Diana</p>
            <p className="text-slate-500 text-xs mt-1">Owner & Executive Director</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CtaSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-slate-950 py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Begin Your Journey?</h2>
        <p className="text-slate-400 text-base mb-10 max-w-xl mx-auto">
          Join a global community of purpose-driven individuals committed to holistic wealth, wellness, and sovereignty.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/contact')}
            className="w-full sm:w-auto px-9 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            Request Consultation
          </button>
          <button
            onClick={() => navigate('/membership')}
            className="w-full sm:w-auto px-9 py-3.5 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-all"
          >
            Explore Membership
          </button>
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <>
    <HeroSection />
    <MissionSection />
    <ServiceArchitectureSection />
    <WhySection />
    <CtaSection />
  </>
);

export default Home;
