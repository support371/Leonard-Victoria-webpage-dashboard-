import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, Shield, Users, Star, Globe, Zap, Heart } from 'lucide-react';
import { SERVICES } from '../../data/seed';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(217,168,75,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(15,23,42,0.8),transparent)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-slate-800/40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-slate-800/60 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center z-10 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm font-medium mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Faith-Based Private Membership Platform — Global
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-8 leading-[1.05]">
          Command Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 mt-1">
            Infinite Wealth
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          A premium, spiritually aligned command platform for healing practitioners, purpose-driven leaders, and faith-based investors building lasting legacy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/membership')}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-base transition-all duration-200 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            Join Membership <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/services')}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-base transition-all border border-white/10 flex items-center justify-center gap-2"
          >
            Explore Services <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          {[['1,200+', 'Members Worldwide'], ['6', 'Service Pillars'], ['A+', 'Compliance Rating']].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <p className="text-2xl font-black text-amber-400">{val}</p>
              <p className="text-xs text-slate-500 mt-1">{lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => (
  <section className="py-20 border-t border-slate-800/50">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-10">Trusted by practitioners and leaders across</p>
      <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600 text-sm font-medium">
        {['United States', 'United Kingdom', 'Canada', 'Caribbean', 'West Africa', 'Europe'].map(r => (
          <span key={r} className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-amber-600" />{r}</span>
        ))}
      </div>
    </div>
  </section>
);

const ServicesPreview = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">What We Offer</p>
          <h2 className="text-4xl font-black text-white mb-4">Six Pillars of Service</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Every service pillar is designed to align your energy, strategy, and legacy with intentional purpose.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(service => (
            <div key={service.id} className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-7 transition-all duration-200 cursor-pointer" onClick={() => navigate('/services')}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg mb-5 font-bold">
                {service.icon}
              </div>
              <h3 className="text-white font-bold mb-2 group-hover:text-amber-300 transition-colors">{service.category}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{service.overview}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => navigate('/services')} className="px-8 py-3.5 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 font-semibold rounded-xl transition-all text-sm">
            View Full Service Architecture →
          </button>
        </div>
      </div>
    </section>
  );
};

const WhySection = () => (
  <section className="py-24 border-t border-slate-800/50 bg-slate-900/30">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">Why We're Different</p>
          <h2 className="text-4xl font-black text-white mb-6 leading-tight">The Intersection of Faith, Strategy, and Legacy</h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            We are not a wellness brand. We are an executive intelligence platform for faith-based leaders who understand that true wealth is spiritual, relational, and strategic — in that order.
          </p>
          <div className="space-y-5">
            {[
              { icon: Shield, title: 'PMA-Protected Structure', desc: 'Operate within a legally sound private membership framework.' },
              { icon: Heart, title: 'Spiritually Grounded', desc: 'Every system and service is aligned with faith-based principle.' },
              { icon: Zap, title: 'Execution-Focused', desc: 'Tools, coaching, and community built for decisive action.' },
              { icon: Star, title: 'Premium by Design', desc: 'Globally credible, executive-grade at every touchpoint.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center mb-8 mx-auto">
              <span className="text-white font-black text-xl">IW</span>
            </div>
            <blockquote className="text-slate-200 text-lg font-medium text-center leading-relaxed italic mb-6">
              "Our mission is to create a sovereign ecosystem where faith, healing, and wealth converge — not as a coincidence, but as a design."
            </blockquote>
            <div className="text-center">
              <p className="text-amber-400 font-bold">Leonard M. Diana</p>
              <p className="text-slate-500 text-sm">Owner & Executive Director</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CtaSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 border-t border-slate-800/50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">Ready to Begin?</p>
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Your Next Level Starts Here</h2>
        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
          Join a global community of purpose-driven practitioners and leaders operating from a place of alignment.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => navigate('/membership')} className="w-full sm:w-auto px-10 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all">
            Join Membership
          </button>
          <button onClick={() => navigate('/contact')} className="w-full sm:w-auto px-10 py-4 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all">
            Book a Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <>
    <HeroSection />
    <TrustSection />
    <ServicesPreview />
    <WhySection />
    <CtaSection />
  </>
);

export default Home;
