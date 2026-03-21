import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import { MEMBERSHIP_TIERS } from '../../data/seed';

const Membership = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-6 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">Private Membership</p>
          <h1 className="text-5xl font-black text-white mb-6">Choose Your Level of Access</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our membership tiers are designed to meet you where you are and expand with you as you grow. All memberships operate under our PMA structure.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MEMBERSHIP_TIERS.map(tier => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-2 border-amber-500/60 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-900/60 border border-slate-800'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-black text-2xl mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-black text-amber-400">{tier.price}</span>
                    <span className="text-slate-500 text-sm">{tier.period}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{tier.description}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${tier.highlight ? 'bg-amber-500/20' : 'bg-slate-800'}`}>
                        <Check className={`w-3 h-3 ${tier.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/contact')}
                  className={`w-full py-3.5 font-bold rounded-xl transition-all ${
                    tier.highlight
                      ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-slate-800/50 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white text-center mb-10">Membership FAQs</h2>
          <div className="space-y-6">
            {[
              { q: 'What is a PMA (Private Membership Association)?', a: 'A PMA is a legally recognized private association structure that provides members with greater protections, operational freedoms, and community rights under constitutional provisions.' },
              { q: 'Is this a religious organization?', a: 'We are faith-informed, not denominationally religious. Our foundation is spiritual principle, purposeful living, and the belief that wealth, health, and alignment are interconnected — available to all faith traditions.' },
              { q: 'Can I cancel my membership?', a: 'Yes. All membership tiers operate on a monthly basis with no long-term commitment required. Sovereign-tier members should review the application terms.' },
              { q: 'What happens after I join?', a: 'You will receive an onboarding welcome packet, access credentials to the member community, and a welcome session scheduled with our team within 72 hours.' },
            ].map(faq => (
              <div key={faq.q} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <p className="text-white font-semibold mb-2">{faq.q}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
